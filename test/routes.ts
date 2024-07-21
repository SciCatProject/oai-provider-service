import * as chai from 'chai';
import { expect } from 'chai';
import request from 'supertest';
import * as jsdom from 'jsdom';
import {createSandbox, SinonSandbox} from 'sinon';
import { MongoConnector } from '../src/providers/scicat-provider/dao/mongo-dao';
import * as fixtures from './fixtures';
import { Application } from "express";
import { ProviderDCMapper } from '../src/providers/core/core-oai-provider';


// Custom assertion method
chai.Assertion.addMethod('eqlCaseInsensitive', function (expected) {
  const actual = this._obj;

  function normalizeCase(obj) {
    if (typeof obj === 'string') {
      return obj.toLowerCase();
    }
    if (Array.isArray(obj)) {
      return obj.map(normalizeCase);
    }
    if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key.toLowerCase()] = normalizeCase(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  }

  const actualNormalized = normalizeCase(actual);
  const expectedNormalized = normalizeCase(expected);

  this.assert(
    chai.util.eql(actualNormalized, expectedNormalized),
    'expected #{this} to deeply equal #{exp} ignoring case',
    'expected #{this} to not deeply equal #{exp} ignoring case',
    expected,
    actual
  );
});

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
    await dbInstance.db.collection(dbInstance.collectionName).drop();
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
  it(`Publish data`, async () => {
    const postData = await request(Server).post('/scicat/oai/Publication')
                                          .send(fixtures['doi'].data)
                                          .expect('Content-Type', 'application/json; charset=utf-8')
                                          .set('Accept', 'application/json');
    console.log(postData.text)
    expect(JSON.parse(postData.text)).to.be.eql({"acknowledged":true,"insertedId":"ID"})
  })
  //
  // TESTING ListRecords
  //
  collection_ids.forEach(collection_id => {    
    formats.forEach(format => {
        const test = {method: 'ListRecords', mock: 'recordsQuery'} ;
        it(`${collection_id} ${format} ${test.method}`, done => {
          let spy = sandbox.spy(MongoConnector.prototype, test.mock)
          sandbox.stub(ProviderDCMapper.prototype, 'collection_id').value(collection_id)
          var identifier = ""
          request(Server)
            .get(`/${format}/oai?verb=${test.method}${test.mock? "&metadataPrefix=oai_dc": ""}${identifier}`)
            .expect('Content-Type', 'text/xml; charset=utf-8')
            .then(r => {
              const document = new jsdom.JSDOM(r.text,{ contentType: 'text/xml' }).window.document;
              const header    = document.querySelector("ListRecords").querySelector("record").querySelector("header");
              const datestamp = header.querySelector("datestamp") ;
              header.removeChild(datestamp);
              const responseDate = document.querySelector("responseDate");
              const oaipmh = document.querySelector("OAI-PMH");
              oaipmh.removeChild(responseDate);
              expect(oaipmh.outerHTML)
                .to.eql(fixtures[format][test.method]);
              expect(spy.args[0][1])
                .to.be.eql({status: 'registered'})
              done();
            }).catch(done);
        });
    });
  });
  //
  // TESTING ListIdentifiers
  //
  collection_ids.forEach(collection_id => {    
    formats.forEach(format => {
        const test = { method: 'ListIdentifiers', mock: 'identifiersQuery'};
        it(`${collection_id} ${format} ${test.method}`, done => {
          let spy = sandbox.spy(MongoConnector.prototype, test.mock)
          sandbox.stub(ProviderDCMapper.prototype, 'collection_id').value(collection_id)
          request(Server)
            .get(`/${format}/oai?verb=${test.method}&metadataPrefix=oai_dc`)
            .expect('Content-Type', 'text/xml; charset=utf-8')
            .then(r => {
              const document = new jsdom.JSDOM(r.text,{ contentType: 'text/xml' }).window.document;
              const header    = document.querySelector("ListIdentifiers").querySelector("record").querySelector("header");
              const datestamp = header.querySelector("datestamp") ;
              header.removeChild(datestamp);
              const responseDate = document.querySelector("responseDate");
              const oaipmh= document.querySelector("OAI-PMH");
              oaipmh.removeChild(responseDate);
              expect(oaipmh.outerHTML)
                .to.eql(fixtures[format][test.method]);
              expect(spy.args[0][1])
                .to.be.eql({status: 'registered'})
              done();
            }).catch(done);
        });
    });
  });
  //
  // TESTING Identify
  //
  collection_ids.forEach(collection_id => {    
    formats.forEach(format => {
        const test = {method: 'Identify'};
        it(`${collection_id} ${format} ${test.method}`, done => {
          sandbox.stub(ProviderDCMapper.prototype, 'collection_id').value(collection_id)
          request(Server)
            .get(`/${format}/oai?verb=${test.method}`)
            .expect('Content-Type', 'text/xml; charset=utf-8')
            .then(r => {
              const document = new jsdom.JSDOM(r.text,{ contentType: 'text/xml' }).window.document;
              const helper = document.querySelector("OAI-PMH");
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
  //
  // TESTING GetRecord
  //
  collection_ids.forEach(collection_id => {    
    formats.forEach(format => {
      const test = {method: 'GetRecord', mock: 'getRecord', identifier: true} ;
        it(`${collection_id} ${format} ${test.method}`, done => {
          let spy = sandbox.spy(MongoConnector.prototype, test.mock)
          sandbox.stub(ProviderDCMapper.prototype, 'collection_id').value(collection_id)
          var identifier = ""
          if (test.identifier)
            identifier = `&identifier=${fixtures['doi']['data'][collection_id]}`
          request(Server)
            .get(`/${format}/oai?verb=${test.method}${test.mock? "&metadataPrefix=oai_dc": ""}${identifier}`)
            .expect('Content-Type', 'text/xml; charset=utf-8')
            .then(r => {
              const document = new jsdom.JSDOM(r.text,{ contentType: 'text/xml' }).window.document;
              const header    = document.querySelector("record").querySelector("header");
              const datestamp = header.querySelector("datestamp") ;
              header.removeChild(datestamp);
              const responseDate = document.querySelector("responseDate");
              const oaipmh = document.querySelector("OAI-PMH");
              oaipmh.removeChild(responseDate);
              expect(oaipmh.outerHTML)
                .to.eql(fixtures[format][test.method]);
              expect(spy.args[0][1])
                .to.be.eql({status: 'registered'})
              done();
            }).catch(done);
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
