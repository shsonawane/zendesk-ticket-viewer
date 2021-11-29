const request = require('supertest');

const app = require('../src/app');

describe('app', () => {
  it('404 Not found message', (done) => {
    request(app)
      .get('/what-is-this-even')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});