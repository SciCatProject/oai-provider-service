import { expect } from 'chai';
import { MongoConnector } from '../src/providers/scicat-provider/dao/mongo-dao';


describe(`Mongo dao`, () => {

  it('Project fields', () => {
    const params = {
      skip: '20',
      limit: '20',
      sortField: 'registeredTime',
      sortDirection: 'desc',
      excludeFields: 'thumbnail|doi',
      includeFields: 'publisher|title'
    }
    const project = MongoConnector.prototype['projectFields'](params)
    expect(project).to.eql(
      {thumbnail: 0, doi: 0, publisher: 1, title: 1})
  })
})

describe('Waiting for db connection', function() {
    it('should wait awhile before continuing', function(done) {
        this.timeout(61000); // Optional: set timeout for this test to 61 seconds
        setTimeout(function() {
            // Your test logic here
            done();
        }, 10000); // Wait for 10 seconds
    });
});
