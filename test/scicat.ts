// import 'mocha';
import { expect } from 'chai';
import { parseParams } from '../src/providers/controllers/scicat';


describe(`Scicat ts`, () => {

  it('Parse params', () => {
    const paramsLimit = '(skip%3D20%2Climit%3D20%2CsortField%3DregisteredTime%2CsortDirection%3Ddesc%2CexcludeFields%3Dthumbnail%7Cdoi%2CincludeFields%3Dpublisher%7Ctitle)'
    expect(parseParams(paramsLimit)).to.be.eql({
      skip: '20',
      limit: '20',
      sortField: 'registeredTime',
      sortDirection: 'desc',
      excludeFields: 'thumbnail|doi',
      includeFields: 'publisher|title'
    })
  })
})
