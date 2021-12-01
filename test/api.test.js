/* eslint-disable no-undef */
const axios = require('axios');
const sinon = require('sinon');
const request = require('supertest');
const app = require('../src/app');

function RejectedError(message, status, statusText) {
  this.message = message;
  this.response = { status, statusText };
}
RejectedError.prototype = new Error();

describe('GET /api/tickets', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => sandbox.restore());

  it('Successfully list all tickets from zendesk API', (done) => {
    const resolved = Promise.resolve({
      data: {
        requests: [
          {
            id: 1,
            created_at: new Date('1'),
            updated_at: new Date('1'),
          },
        ],
      },
    });
    sandbox.stub(axios, 'get').returns(resolved);
    request(app)
      .get('/api/tickets')
      .expect('Content-Type', /application\/json/)
      .expect(200, {
        data: [
          {
            id: 1,
            created_at: '1/1/2001 12:00:00 AM',
            updated_at: '1/1/2001 12:00:00 AM',
          },
        ],
      }, done);
  });

  it('Zendesk API returns 4XX error', (done) => {
    const rejected = Promise.reject(
      new RejectedError('401 error', 401, 'Unauthorised'),
    );
    rejected.catch(() => null);
    sandbox.stub(axios, 'get').returns(rejected);
    request(app)
      .get('/api/tickets')
      .expect('Content-Type', /text\/html/)
      .expect(401, {}, done);
  });

  it('Zendesk API returns 5XX error', (done) => {
    const rejected = Promise.reject(
      new RejectedError('500 error', 500, 'Server Error'),
    );
    rejected.catch(() => null);
    sandbox.stub(axios, 'get').returns(rejected);
    request(app)
      .get('/api/tickets')
      .expect('Content-Type', /text\/html/)
      .expect(500, {}, done);
  });

  it('unknown error', (done) => {
    const rejected = Promise.reject(new Error('some error'));
    rejected.catch(() => null);
    sandbox.stub(axios, 'get').returns(rejected);
    request(app)
      .get('/api/tickets')
      .expect('Content-Type', /text\/html/)
      .expect(500, {}, done);
  });
});

describe('GET /api/ticket/:id', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => sandbox.restore());

  it('Successfully fetch individual ticket from zendesk API', (done) => {
    const resolved = Promise.resolve({
      data: {
        request: {
          id: 1,
          created_at: new Date('1'),
          updated_at: new Date('1'),
        },
      },
    });
    sandbox.stub(axios, 'get').returns(resolved);
    request(app)
      .get('/api/ticket/1')
      .expect('Content-Type', /application\/json/)
      .expect(200, {
        id: 1,
        created_at: '1/1/2001 12:00:00 AM',
        updated_at: '1/1/2001 12:00:00 AM',
      }, done);
  });

  it('Request id is not valid', (done) => {
    const rejected = Promise.reject(
      new RejectedError('400 error', 400, 'Bad Request'),
    );
    rejected.catch(() => null);
    sandbox.stub(axios, 'get').returns(rejected);
    request(app)
      .get('/api/ticket/a')
      .expect('Content-Type', /text\/html/)
      .expect(400, {}, done);
  });

  it('Zendesk API returns 4XX error', (done) => {
    const rejected = Promise.reject(
      new RejectedError('401 error', 401, 'Unauthorised'),
    );
    rejected.catch(() => null);
    sandbox.stub(axios, 'get').returns(rejected);
    request(app)
      .get('/api/ticket/1')
      .expect('Content-Type', /text\/html/)
      .expect(401, {}, done);
  });

  it('Zendesk API returns 5XX error', (done) => {
    const rejected = Promise.reject(
      new RejectedError('500 error', 500, 'Server Error'),
    );
    rejected.catch(() => null);
    sandbox.stub(axios, 'get').returns(rejected);
    request(app)
      .get('/api/ticket/1')
      .expect('Content-Type', /text\/html/)
      .expect(500, {}, done);
  });

  it('unknown error', (done) => {
    const rejected = Promise.reject(new Error('some error'));
    rejected.catch(() => null);
    sandbox.stub(axios, 'get').returns(rejected);
    request(app)
      .get('/api/ticket/1')
      .expect('Content-Type', /text\/html/)
      .expect(500, {}, done);
  });
});

describe('Middleware test', () => {
  it('404 Not found message', (done) => {
    request(app)
      .get('/what-is-this-even')
      .set('Accept', 'html/text')
      .expect('Content-Type', /text/)
      .expect(404, done);
  });
});
