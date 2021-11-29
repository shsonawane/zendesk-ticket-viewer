const request = require('supertest');

const app = require('../src/app');

describe('GET /api/tickets', () => {
  it('List all tickets from zendesk API', (done) => {
    request(app)
      .get('/api/tickets')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'Getting started!'
      }, done);
  });
});