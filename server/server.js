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
app.get('/author/:type', routes.author); // @yuanmin, lulu, 

//home page: 
app.get('/top_courses', routes.top_courses);// @yarong
app.get('/top_jobs', routes.top_jobs);// @yarong

//glassdoor jobs page:
app.get('/search_jobs', routes.search_jobs); //@yuanmin

//course page: 
app.get('/search_courses', routes.search_courses); //@lulu

// job details:
app.get('/job/:job_id', routes.job); //@yuanmin
app.get('/job/:job_id/courses', routes.job_courses); //@yuanmin

//course details:
app.get('/course/:course_id', routes.course);//@lulu
app.get('/course/:course_id/jobs', routes.course_jobs) //@lulu

// app.get('/jobs', routes.albums);



app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
