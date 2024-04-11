const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/author/:type', routes.author); // (1) @yuanmin, lulu,

// home page:
app.get('/top_jobs', routes.top_jobs);// (2) @yarong
app.get('/top_courses', routes.top_courses);// (3) @yarong

// glassdoor jobs page:
app.get('/search_jobs', routes.search_jobs); // (4) @yuanmin

// course page:
app.get('/search_courses', routes.search_courses); // (5) @lulu

// job details:
app.get('/job/:job_uid', routes.job); // (6) @yuanmin
app.get('/job/:job_uid/courses', routes.job_courses); // (7) @yuanmin
app.get('/job/:job_uid/reviews', routes.job_reviews); // (8) @yuanmin

// course details:
app.get('/course/:course_id', routes.course);// (9) @lulu
app.get('/course/:course_id/jobs', routes.course_jobs) // (10) @lulu
app.get('/course/:course_id/comments', routes.course_comments) // (11) @yuanmin


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
