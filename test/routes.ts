/*
 *  Copyright 2018 Willamette University
 *
 *  This file is part of OAI-PHM Service.
 *  
 *  @author Michael Spalti
 *
 *  OAI-PHM Service is based on the Modular OAI-PMH Server, University of Helsinki, 
 *  The National Library of Finland.
 *
 *  OAI-PHM Service is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  OAI-PHM Service is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of 
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with OAI-PHM Service.  If not, see <http://www.gnu.org/licenses/>.
 */

import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import * as jsdom from 'jsdom';
import {createSandbox, SinonSandbox, SinonStub} from 'sinon';
import { MongoConnector } from '../src/providers/scicat-provider/dao/mongo-dao';
import * as fixtures from './fixtures';
import { Application } from "express";
import { ProviderDCMapper } from '../src/providers/core/core-oai-provider';


describe(`Test returned xmls`, () => {
  let sandbox: SinonSandbox;
  let dbMock: SinonStub;
  let Server: Application;
  const env = Object.assign({}, process.env);

  before('mock db', () => {
    sandbox = createSandbox();
    dbMock = sandbox.createStubInstance(MongoConnector);
    sandbox.stub(MongoConnector, "getInstance").returns(dbMock);
    Server = require("../src").default;
  });

  after('restore', () => {
    sandbox.restore();
    delete require.cache[require.resolve("../src")];
    process.env = env;
  })

  const collection_ids = [
    '_id',
    'doi'
  ]
  const formats = [
    'scicat', 
    'openaire', 
    'panosc'
  ]
  const tests = [
    {method: 'ListRecords', mock: 'recordsQuery'},
    {method: 'ListIdentifiers', mock: 'identifiersQuery'},
    {method: 'Identify'},
    {method: 'GetRecord', mock: 'getRecord', return: 'data', identifier: true},
  ]    
  collection_ids.forEach(collection_id => {    
    formats.forEach(format => {
      tests.forEach(test => {
        it(`${collection_id} ${format} ${test.method}`, done => {
          sandbox.stub(ProviderDCMapper.prototype, 'collection_id').value(collection_id)
          if (test.mock)
            dbMock[test.mock].resolves(fixtures[collection_id][test.return || 'dataList']);
          var identifier = ""
          if (test.identifier)
            identifier = `&identifier=${fixtures[collection_id]['data'][collection_id]}`
          request(Server)
            .get(`/${format}/oai?verb=${test.method}${test.mock? "&metadataPrefix=oai_dc": ""}${identifier}`)
            .expect('Content-Type', 'text/xml; charset=utf-8')
            .then(r => {
              const document = new jsdom.JSDOM(r.text).window.document;
              const responseDate = document.querySelector("responseDate");
              const oaipmh = document.querySelector("OAI-PMH");
              oaipmh.removeChild(responseDate);
              expect(oaipmh.outerHTML)
                .to.eql(fixtures[format][test.method]);
                done();
            }).catch(done);
          });
      });
    });
  });

});
