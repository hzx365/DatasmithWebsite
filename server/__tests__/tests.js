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

// test route 3: use course id, get course info
test('GET /course/21037', async () => {
  var res = await supertest(app).get('/course/21037');
  console.log(res.text);
  expect(res.statusCode).toEqual(200);
  expect(res.text).toMatch(/Win Them Over with Web Video Part 2/);
});


//test route 10: use language, rating, category to get all courses and their info
test('GET /search_courses?language=English&rating=5&category=Health%20%26%20Fitness', async () => {
  var res = await supertest(app).get('/search_courses?language=English&rating=5&category=Health%20%26%20Fitness');
  expect(res.statusCode).toEqual(200);
  expect(res.text).toMatch(/30 Minute Beach Body Academy/);
});