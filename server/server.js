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
app.get('/search_jobs/countries', routes.search_jobs_countries); // (4.1) @yuanmin
app.get('/search_jobs/cities', routes.search_jobs_cities); // (4.2) @Zhixiang
app.get('/search_jobs/categories', routes.search_jobs_categories); //(4.3) @Zhixiang

// course page:
app.get('/search_courses', routes.search_courses); // (5) @lulu
app.get('/search_courses/categories', routes.search_courses_categories); // (5.1) @lulu
app.get('/search_courses/languages', routes.search_courses_languages); //(5.2) @lulu

// job details:
app.get('/job/:job_uid', routes.job); // (6) @yuanmin
app.get('/job/:job_uid/courses', routes.job_courses); // (6.1) @yuanmin
app.get('/job/:job_uid/numCourses', routes.job_courses_num); // (6.2) @yuanmin
app.get('/job/:job_uid/reviews', routes.job_reviews); // (6.3) @yuanmin

// course details:
app.get('/course/:course_id', routes.course);// (7) @lulu
app.get('/course/:course_id/jobs', routes.course_jobs) // (7.1) @lulu
app.get('/course/:course_id/numJobs', routes.course_jobs_num) //(7.2) @yuanmin
app.get('/course/:course_id/comments', routes.course_comments) // (7.3) @yuanmin

// get random functions in NavBar
app.get('/random_job', routes.get_random_job);// (8) @Zhixiang
app.get('/random_course', routes.get_random_course) // (9) @Zhixiang

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
