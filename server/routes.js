const mysql = require('mysql')
const config = require('./config.json');
const { request } = require('./server');

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
const author = async function (req, res) {
  // Replace the values of name and pennKey with your own
  const name = 'Yuanmin Zhang, Lu Lu, Yarong Wang';
  const pennKey = 'yuz249, lhlu, wangyar';

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === 'pennkey') {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
    res.send(`Created by ${pennKey}`);
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
  }
}

// Route 2: GET /random
const random = async function (req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey
  const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(`
    SELECT *
    FROM Songs
    WHERE explicit <= ${explicit}
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      // If there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      // Be cognizant of the fact we return an empty object {}. For future routes, depending on the
      // return type you may need to return an empty array [] instead.
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json({
        song_id: data[0].song_id,
        title: data[0].title
      });
    }
  });
}

/********************************
 * BASIC SONG/ALBUM INFO ROUTES *
 ********************************/

// Route 3: GET /course/:course_id
const course = async function (req, res) {
  // TODO (TASK 4): implement a route that given a course_id, returns all information about the course

  // save the given course-id to variable requestID
  const requestID = req.params.course_id;
  connection.query(`
  SELECT * 
  FROM Course_Info
  WHERE Course_Info.id = ?`, [requestID], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 4: GET /job/:job_id 
const job = async function (req, res) {
  // TODO (TASK 5): implement a route that given a job_id, returns all information about the job
  const requestID = req.params.job_id;
  connection.query(`
  SELECT * 
  FROM Jobs
  WHERE uid = ?`, [requestID], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}
// Route 5: GET /job/:job_id/courses 
const job_courses = async function (req, res) {
  // TODO (TASK 5): implement a route that given a job_id, returns the relavent courses
  const requestID = req.params.job_id;
  connection.query(`
  SELECT * 
  FROM Jobs_Courses
  WHERE job_uid = ?`, [requestID], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}
// Route 6: GET /course/:course_id/jobs
const course_jobs = async function (req, res) {
  // TODO (TASK 7): implement a route that given an course_id, returns relavent jobs
  const requestID = req.params.course_id;
  connection.query(`
  SELECT *
  FROM Courses_Jobs
  WHERE course_id = ?
  `, [requestID], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data); // replace this with your implementation
    }
  })
}

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /top_jobs
const top_jobs = async function (req, res) {
  const page = req.query.page;
  // Use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageNum = page ?? parseInt(page);
  const pageSizeNum = req.query.page_size ? parseInt(req.query.page_size) : 10;
  if (!page) {
    // Query the database and return top 50 jobs by benefit_rating (descending)
    connection.query(`
    SELECT Jobs.uid as job_uid, Jobs.job_title as job_title, Jobs.category as category, Jobs.benefit_rating as benefit_rating,
       Jobs.city as job_city, Jobs.country as country, Jobs.description as description, Jobs.employer_name as employer_name,
       Jobs.reviews as reviews, Jobs.discover_date as discover_date
    FROM Jobs
    ORDER BY Jobs.benefit_rating DESC
    LIMIT 50;`, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    })
  }
  else {
    // Reimplement with pagination
    const offSet = (pageNum - 1) * pageSizeNum;
    connection.query(`
    SELECT Top_Jobs.uid as job_uid, Top_Jobs.job_title as job_title, Top_Jobs.category as category, Top_Jobs.benefit_rating as benefit_rating,
    Top_Jobs.city as job_city, Top_Jobs.country as country, Top_Jobs.description as description, Top_Jobs.employer_name as employer_name,
    Top_Jobs.reviews as reviews, Top_Jobs.discover_date as discover_date
    FROM (SELECT *
          FROM Jobs
          ORDER BY Jobs.benefit_rating DESC
          LIMIT 50) AS Top_Jobs
    LIMIT ? OFFSET ?;`, [pageSizeNum, offSet], (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    })
  }
}

// Route 8: GET /top_courses
const top_courses = async function (req, res) {
  // Return the top courses by avg_rating (descending)
  const page = req.query.page;
  // set the pageSize based on the query or default to 10
  const pageNum = page ?? parseInt(page);
  const pageSizeNum = req.query.page_size ? parseInt(req.query.page_size) : 10;

  if (!page) {
    connection.query(`
    SELECT Course_Info.id as course_id, Course_Info.title as title, Course_Info.category as category, Course_Info.language as language,
       Course_Info.avg_rating as avg_rating, Course_Info.instructor_name as instructor_name, Course_Info.num_comments as num_comments,
       Course_Info.num_reviews as num_reviews, Course_Info.num_lectures as num_lectures, Course_Info.content_length_min as content_length_min,
       Course_Info.num_subscribers as num_subscribers, Course_Info.price as price, Course_Info.published_time as published_time
    FROM Course_Info
    ORDER BY Course_Info.avg_rating DESC
    LIMIT 50;`, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    })
  }
  else {
    const offSet = (pageNum - 1) * pageSizeNum;
    connection.query(`
    SELECT Top_Course_Info.id as course_id, Top_Course_Info.title as title, Top_Course_Info.category as category, Top_Course_Info.language as language,
    Top_Course_Info.avg_rating as avg_rating, Top_Course_Info.instructor_name as instructor_name, Top_Course_Info.num_comments as num_comments,
    Top_Course_Info.num_reviews as num_reviews, Top_Course_Info.num_lectures as num_lectures, Top_Course_Info.content_length_min as content_length_min,
    Top_Course_Info.num_subscribers as num_subscribers, Top_Course_Info.price as price, Top_Course_Info.published_time as published_time
    FROM (SELECT * 
          FROM Course_Info
          ORDER BY Course_Info.avg_rating DESC
          LIMIT 50) AS Top_Course_Info 
    LIMIT ? OFFSET ?;`, [pageSizeNum, offSet], (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    })
  }
}

// Route 9: GET /search_jobs?city=...&country=...&category
const search_jobs = async function (req, res) {
  // TODO (TASK 12): return all jobs that match the given search query with parameters defaulted to those specified in API spec ordered by posted date (desc)
  // Some default parameters have been provided for you, but you will need to fill in the rest

  const city = req.query.city;
  const country = req.query.country;
  const category = req.query.category;


  // If title is undefined, no filter should be applied (return all songs matching the other conditions).

  connection.query(`
    SELECT *
    FROM Jobs
    WHERE Jobs.city = ? AND Jobs.country = ?AND Jobs.category = ?
    ORDER BY Jobs.discover_date DESC;`,
    [city, country, category],
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data); // replace this with your implementation
      }
    });
}

// Route 10: GET /search_courses?language=...&rating=...&category
const search_courses = async function (req, res) {
  // TODO (TASK 12): return all courses that match the given search query with parameters defaulted to those specified in API spec ordered by number of subscribers (desc)
  // Some default parameters have been provided for you, but you will need to fill in the rest

  const language = req.query.language;
  const rating = req.query.rating;
  const category = req.query.category;


  // If title is undefined, no filter should be applied (return all courses matching the other conditions).

  connection.query(`
    SELECT *
    FROM Course_Info
    WHERE Course_Info.language = ? AND Course_Info.avg_rating = ? AND Course_Info.category = ?
    ORDER BY Course_Info.num_subscribers DESC;`,
    [language, parseFloat(rating), category],
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data); // replace this with your implementation
      }
    });
}



module.exports = {
  author,

  top_jobs,//@yarong
  top_courses,//@yarong

  job, //@yuanmin
  job_courses, //@yuanmin
  search_jobs, //@yuanmin

  course,//@lulu
  course_jobs, //@lulu
  search_courses, //@lulu

}
