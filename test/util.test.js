/* eslint-disable no-undef */
const axios = require('axios');
const sinon = require('sinon');
const { expect } = require('chai');
const winston = require('winston');
const { request } = require('../src/util/request');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      silent: true,
    }),
  ],
});

function RejectedError(message, status, statusText) {
  this.message = message;
  this.response = { status, statusText };
}
RejectedError.prototype = new Error();

describe('Request util test', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => sandbox.restore());

  it('2XX/3XX Successfull response', (done) => {
    const resolved = Promise.resolve({ data: 'success' });
    sandbox.stub(axios, 'get').returns(resolved);
    request('/api/v2/requests.json', logger)
      .then((result) => {
        expect(result).to.equals('success');
      })
      .then(done, done);
  });

  it('4XX error response', (done) => {
    const rejected = Promise.reject(
      new RejectedError('401 error', 401, 'Unauthorised'),
    );
    rejected.catch(() => null);
    sandbox.stub(axios, 'get').returns(rejected);
    request('/api/v2/requests.json', logger)
      .catch((result) => {
        expect(result).haveOwnProperty('response');
        expect(result.response).haveOwnProperty('status');
        expect(result.response.status).to.equals(401);
      })
      .then(done, done);
  });

  it('5XX error response', (done) => {
    const rejected = Promise.reject(
      new RejectedError('500 error', 500, 'Server Error'),
    );
    rejected.catch(() => null);
    sandbox.stub(axios, 'get').returns(rejected);
    request('/api/v2/requests.json', logger)
      .catch((result) => {
        expect(result).haveOwnProperty('response');
        expect(result.response).haveOwnProperty('status');
        expect(result.response.status).to.equals(500);
      })
      .then(done, done);
  });

  it('unknown error', (done) => {
    const rejected = Promise.reject(new Error('some error'));
    rejected.catch(() => null);
    sandbox.stub(axios, 'get').returns(rejected);
    request('/api/v2/requests.json', logger)
      .catch((result) => {
        expect(result).to.be.instanceOf(Error);
        expect(result.message).be.equals('some error');
      })
      .then(done, done);
  });
});
