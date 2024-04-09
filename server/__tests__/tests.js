const { expect } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../server');
const results = require("./results.json")

test('GET /job/0000016e5602c4538e8d2cffd82cc1e2', async () => {
  var res = await supertest(app).get('/job/0000016e5602c4538e8d2cffd82cc1e2');
  expect(res.statusCode).toEqual(200);
  expect(res.text).toMatch(/Braga/);
});

test('GET /search_jobs?city=Braga&country=PT&category=IT%20%26%20Software', async () => {
  var res = await supertest(app).get('/search_jobs?city=Braga&country=PT&category=IT%20%26%20Software');
  expect(res.statusCode).toEqual(200);
  expect(res.text).toMatch(/Braga/);
});
