import { expect } from 'chai';
import request from 'supertest';
import * as jsdom from 'jsdom';
import {createSandbox, SinonSandbox} from 'sinon';
import { MongoConnector } from '../src/providers/scicat-provider/dao/mongo-dao';
import * as fixtures from './fixtures';
import { Application } from "express";
import { ProviderDCMapper } from '../src/providers/core/core-oai-provider';


describe(`Test returned xmls`, () => {
  let sandbox: SinonSandbox;
  let Server: Application;
  const env = Object.assign({}, process.env);

  before('mock db', () => {
    sandbox = createSandbox();
    Server = require("../src").default;
  });

  afterEach('restore', async () => {
    sandbox.restore();
  })

  after('restore', async () => {
    sandbox.restore();
    const dbInstance = MongoConnector.getInstance()
    await dbInstance.db.collection(dbInstance.collectionName).remove();
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
    {method: 'GetRecord', mock: 'getRecord', identifier: true},
  ]    

  it(`Publish data`, async () => {
    const postData = await request(Server).post('/scicat/oai/Publication').send(fixtures['doi'].data)
    expect(postData.body.result).to.be.eql({n: 1, ok: 1})
  })
  
  collection_ids.forEach(collection_id => {    
    formats.forEach(format => {
      tests.forEach(test => {
        it(`${collection_id} ${format} ${test.method}`, done => {
          let spy
          if (test.mock)
            spy = sandbox.spy(MongoConnector.prototype, test.mock)
          sandbox.stub(ProviderDCMapper.prototype, 'collection_id').value(collection_id)
          var identifier = ""
          if (test.identifier)
            identifier = `&identifier=${fixtures['doi']['data'][collection_id]}`
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
              if (spy) 
                expect(spy.args[0][1]).to.be.eql({status: 'registered'})
              done();
            }).catch(done);
          });
      });
    });
  });

  it('test healthcheck', async () => {
    const response1 = await request(Server).get('/');
    const response2 = await request(Server).get('/');
    expect(Date.parse(response1.body.started)).to.be.not.NaN;
    expect(response1.body.started).to.be.eql(response2.body.started);
    expect(response2.body.uptime).to.be.greaterThan(response1.body.uptime);
  });

  it('test get publication', async () => {
    const getPublication = await request(Server).get('/scicat/Publication')
    expect(getPublication.body[0]).to.be.eql(fixtures['doi'].data)
  })

  it('test get publication with excludeFields', async () => {
    const getPublication = await request(Server).get('/scicat/Publication/(excludeFields%3Dthumbnail%7Cdoi)')
    expect(getPublication.body[0]).to.not.have.property('thumbnail')
    expect(getPublication.body[0]).to.not.have.property('doi')
  })

  it('test get publication with includeFields', async () => {
    const getPublication = await request(Server).get('/scicat/Publication/(includeFields%3Dthumbnail%7Cdoi)')
    expect(getPublication.body[0]).to.have.property('thumbnail')
    expect(getPublication.body[0]).to.have.property('doi')
    expect(Object.keys(getPublication.body[0])).to.be.eql(['_id', 'doi', 'thumbnail'])
  })

});
