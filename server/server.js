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
app.get('/author/:type', routes.author);
// app.get('/random', routes.random);

//home page: 
app.get('/top_courses', routes.top_courses);
app.get('/top_jobs', routes.top_jobs);
// app.get('/job_related_courses/:album_id', routes.album_songs);

//glassdoor jobs page:
app.get('/search_jobs', routes.search_jobs);

//course page: 
app.get('/search_courses', routes.search_courses);

// job details:
app.get('/job/:job_id', routes.job);

//course details:
app.get('/course/:course_id', routes.course);

// app.get('/jobs', routes.albums);





app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
