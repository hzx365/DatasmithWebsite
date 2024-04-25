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


/***************************
 * AUTHOR INFORMATION PAGE *
 **************************/

// Route 1: GET /author/:type
const author = async function (req, res) {
  // Replace the values of name and pennKey with your own
  const name = 'Yuanmin Zhang, Lu Lu, Yarong Wang, Zhixiang Huang';
  const pennKey = 'yuz249, lhlu, wangyar, huangzhx';

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

/***************************
 *         HOME PAGE       *
 **************************/

// Route 2: GET /top_jobs
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

// Route 3: GET /top_courses
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

/***************************
 *  Glassdoor Jobs Page    *
 **************************/

// Route 4: GET /search_jobs?city=...&country=...&category
const search_jobs = async function (req, res) {
  // TODO (TASK 12): return all jobs that match the given search query with parameters defaulted to those specified in API spec ordered by posted date (desc)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const page = req.query.page;
  // Use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageNum = page ?? parseInt(page);
  const pageSizeNum = req.query.page_size ? parseInt(req.query.page_size) : 10;

  const city = req.query.city;
  const country = req.query.country;
  const category = req.query.category;

  // If title is undefined, no filter should be applied (return all songs matching the other conditions).
  if (!page) {
    connection.query(`
    SELECT *
    FROM Jobs
    WHERE Jobs.city = ? AND Jobs.country = ? AND Jobs.category = ?
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
  else {
    const offSet = (pageNum - 1) * pageSizeNum;
    connection.query(`
    SELECT *
    FROM Jobs
    WHERE Jobs.city = ? AND Jobs.country = ? AND Jobs.category = ?
    ORDER BY Jobs.discover_date DESC
    LIMIT ? OFFSET ?;`,
      [city, country, category, pageSizeNum, offSet],
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data); // replace this with your implementation
        }
      });
  }
}

// Route 4.1: GET /search_jobs/countries
const search_jobs_countries = async (req, res) => {
  connection.query(`
  SELECT DISTINCT country
  FROM Jobs
  ORDER BY country ASC;`,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data.map(d => d.country));
        }
      });
};

// Route 4.2: GET /search_jobs/cities
const search_jobs_cities = async (req, res) => {
  const country = req.query.country;

  if (!country) {
    // Fetch and return all countries if no country parameter is provided
    connection.query(`
      SELECT DISTINCT country
      FROM Jobs
      ORDER BY country ASC;`,
      (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).json([]);
        } else {
          res.json(data.map(d => d.country));
        }
      });
  } else {
    // Fetch and return cities for the given country
    connection.query(`
      SELECT DISTINCT city
      FROM Jobs
      WHERE country = ?
      ORDER BY city ASC;`,
      [country], // Use the country from the request to filter the SQL query
      (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).json([]);
        } else {
          res.json(data.map(d => d.city));
        }
      });
  }
}

// Route 4.3: GET /search_jobs/categories
const search_jobs_categories = async function (req, res) {
  const { country, city } = req.query;
  let query = `
        SELECT DISTINCT category
        FROM Jobs  -- Assuming categories are stored in the Jobs table and there's a relation or proper columns for it.
        WHERE 1=1`;

  const params = [];

  if (country) {
    query += ` AND country = ?`;
    params.push(country);
  }
  if (city) {
    query += ` AND city = ?`;
    params.push(city);
  }

  query += ` ORDER BY category ASC;`;

  connection.query(query, params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json([]);
    } else {
      res.json(data.map(d => d.category));
    }
  });
};



/***************************
 *   Udemy Courses Page    *
 **************************/

// Route 5: GET /search_courses?language=...&rating=...&category
const search_courses = async function (req, res) {
  // TODO (TASK 12): return all courses that match the given search query with parameters defaulted to those specified in API spec ordered by number of subscribers (desc)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const page = req.query.page;
  // Use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageNum = page ?? parseInt(page);
  const pageSizeNum = req.query.page_size ? parseInt(req.query.page_size) : 10;

  const language = req.query.language;
  const rating = parseFloat(req.query.rating);
  const category = req.query.category;
  const max_price = parseInt(req.query.maxprice);
  const min_price = parseInt(req.query.minprice);
  const max_rating = parseFloat(req.query.maxrating);
  const min_rating = parseFloat(req.query.minrating);

  if (!page) {
    connection.query(`
    SELECT *
    FROM Course_Info
    WHERE Course_Info.language = ? 
    AND Course_Info.avg_rating <= ? AND Course_Info.avg_rating >= ?
    AND Course_Info.category = ? 
    AND Course_Info.price <= ? AND Course_Info.price >= ?
    ORDER BY Course_Info.num_subscribers DESC;`,
      [language, max_rating, min_rating, category, max_price, min_price],
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data); // replace this with your implementation
        }
      });
  }
  else {
    const offSet = (pageNum - 1) * pageSizeNum;
    connection.query(`
    SELECT *
    FROM Course_Info
    WHERE Course_Info.language = ? 
    AND Course_Info.avg_rating <= ? AND Course_Info.avg_rating >= ?
    AND Course_Info.category = ? 
    AND Course_Info.price <= ? AND Course_Info.price >= ?

    ORDER BY Course_Info.num_subscribers DESC
    LIMIT ? OFFSET ?;`,
      [language, max_rating, min_rating, category, max_price, min_price, pageSizeNum, offSet],
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data); // replace this with your implementation
        }
      });
  }

}

// Route 5.1: GET /search_courses/categories
const search_courses_categories = async function (req, res) {
  connection.query(`
  SELECT category
  FROM Category
  ORDER BY category ASC;`,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data.map(d => d.category));
      }
    });
};

// Route 5.2: GET /search_courses/languages
const search_courses_languages = async function (req, res) {
  connection.query(`
  SELECT DISTINCT language
  FROM Course_Info
  ORDER BY language ASC;`,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data.map(d => d.language));
      }
    });
};

/***************************
 *     Job Details Page    *
 **************************/

// Route 6: GET /job/:job_uid
const job = async function (req, res) {
  // implement a route that given a job_uid, returns all information about the job
  const requestID = req.params.job_uid;
  connection.query(`
  SELECT * 
  FROM Jobs
  WHERE uid = ?`, [requestID], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 6.1: GET /job/:job_uid/courses
const job_courses = async function (req, res) {
  // implement a route that given a job_uid, returns the relavent courses
  const page = req.query.page;
  //  use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageNum = page ?? parseInt(page);
  const pageSizeNum = req.query.page_size ? parseInt(req.query.page_size) : 10;

  const requestID = req.params.job_uid;
  if (!page) {
    connection.query(`
    SELECT Jobs_Courses.course_id as course_id, Jobs_Courses.course_title as course_title, Jobs_Courses.language as language,
    Jobs_Courses.avg_rating as avg_rating, Jobs_Courses.instructor_name as instructor_name, Jobs_Courses.num_comments as num_comments,
    Jobs_Courses.num_reviews as num_reviews, Jobs_Courses.num_lectures as num_lectures, Jobs_Courses.content_length_min as content_length_min,
    Jobs_Courses.num_subscribers as num_subscribers, Jobs_Courses.price as price, Jobs_Courses.published_time as published_time
    FROM Jobs_Courses
    WHERE job_uid = ?`, [requestID], (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
  else {
    // with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    const offSet = (pageNum - 1) * pageSizeNum;
    connection.query(`
    SELECT Jobs_Courses.course_id as course_id, Jobs_Courses.course_title as course_title, Jobs_Courses.language as language,
    Jobs_Courses.avg_rating as avg_rating, Jobs_Courses.instructor_name as instructor_name, Jobs_Courses.num_comments as num_comments,
    Jobs_Courses.num_reviews as num_reviews, Jobs_Courses.num_lectures as num_lectures, Jobs_Courses.content_length_min as content_length_min,
    Jobs_Courses.num_subscribers as num_subscribers, Jobs_Courses.price as price, Jobs_Courses.published_time as published_time
    FROM Jobs_Courses
    WHERE job_uid = ?
    LIMIT ? OFFSET ?`, [requestID, pageSizeNum, offSet], (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
}

// Route 6.2: Get/job/:job_uid/numCourses
const job_courses_num = async function (req, res) {
  const requestID = req.params.job_uid;
  connection.query(`
    SELECT num_courses
    FROM Jobs_NumCourses
    WHERE job_uid = ?`, [requestID], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 6.3: GET /job/:job_uid/reviews
const job_reviews = async function (req, res) {
  // return all reviews of a job given job_uid, when you click reviews hyperlink in job details page, you will be redirected to the page of this job's reviews
  const requestID = req.params.job_uid;
  const page = req.query.page;
  //  use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageNum = page ?? parseInt(page);
  const pageSizeNum = req.query.page_size ? parseInt(req.query.page_size) : 10;

  if (!page) {
    connection.query(`
    SELECT Jobs_Reviews.cons as cons, Jobs_Reviews.pros as pros, Jobs_Reviews.review_date as review_date
    FROM Jobs_Reviews
    WHERE Jobs_Reviews.job_uid = ?
    ORDER BY Jobs_Reviews.review_date DESC`,
      [requestID], (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
  }
  else {
    const offSet = (pageNum - 1) * pageSizeNum;
    connection.query(`
    SELECT Jobs_Reviews.cons as cons, Jobs_Reviews.pros as pros, Jobs_Reviews.review_date as review_date
    FROM Jobs_Reviews
    WHERE Jobs_Reviews.job_uid = ?
    ORDER BY Jobs_Reviews.review_date DESC
    LIMIT ? OFFSET ?`,
      [requestID, pageSizeNum, offSet], (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
  }

}


/***************************
 *   Course Details Page   *
 **************************/

// Route 7: GET /course/:course_id
const course = async function (req, res) {
  // implement a route that given a course_id, returns all information about the course
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


// Route 7.1: GET /course/:course_id/jobs
const course_jobs = async function (req, res) {
  // TODO (TASK 7): implement a route that given an course_id, returns relavent jobs
  const page = req.query.page;
  //  use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageNum = page ?? parseInt(page);
  const pageSizeNum = req.query.page_size ? parseInt(req.query.page_size) : 10;

  const requestID = req.params.course_id;


  if (!page) {
    connection.query(`
    SELECT Courses_Jobs.job_uid as job_uid, Courses_Jobs.job_title as job_title, Courses_Jobs.benefit_rating as benefit_rating,
    Courses_Jobs.city as city, Courses_Jobs.country as country, Courses_Jobs.description as description, Courses_Jobs.employer_name as employer_name,
    Courses_Jobs.reviews as reviews, Courses_Jobs.discover_date as discover_date
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
  else {
    const offSet = (pageNum - 1) * pageSizeNum;
    connection.query(`
    SELECT Courses_Jobs.job_uid as job_uid, Courses_Jobs.job_title as job_title, Courses_Jobs.benefit_rating as benefit_rating,
    Courses_Jobs.city as city, Courses_Jobs.country as country, Courses_Jobs.description as description, Courses_Jobs.employer_name as employer_name,
    Courses_Jobs.reviews as reviews, Courses_Jobs.discover_date as discover_date
    FROM Courses_Jobs
    WHERE course_id = ?
    LIMIT ? OFFSET ?`, [requestID, pageSizeNum, offSet], (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data); // replace this with your implementation
      }
    })
  }

}

// Route 7.2: Get/course/:course_id/numJobs
const course_jobs_num = async function (req, res) {
  const requestID = req.params.course_id;
  connection.query(`
    SELECT num_jobs
    FROM Courses_NumJobs
    WHERE course_id = ?`, [requestID], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 7.3: GET /course/:course_id/comments
const course_comments = async function (req, res) {
  // return all comments of a course given course_id, when you click reviews hyperlink in job details page, you will be redirected to the page of this job's reviews
  const requestID = req.params.course_id;
  const page = req.query.page;
  //  use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageNum = page ?? parseInt(page);
  const pageSizeNum = req.query.page_size ? parseInt(req.query.page_size) : 10;
  if (!page) {
    connection.query(`
  SELECT Courses_Comments.comment as comments, Courses_Comments.rate as rates
  FROM Courses_Comments
  WHERE Courses_Comments.course_id = ?
  ORDER BY Courses_Comments.rate DESC`,
      [requestID], (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
  }
  else {
    const offSet = (pageNum - 1) * pageSizeNum;
    connection.query(`
  SELECT Courses_Comments.comment as comments, Courses_Comments.rate as rates
  FROM Courses_Comments
  WHERE Courses_Comments.course_id = ?
  ORDER BY Courses_Comments.rate DESC
  LIMIT ? OFFSET ?`,
      [requestID, pageSizeNum, offSet], (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
  }

}

/***************************
 *   Random id in NavBar   *
 **************************/
// Route 8: GET /job/random_job_uid
const get_random_job = async function (req, res) {
  connection.query(`
    SELECT uid AS job_uid
    FROM Jobs
    ORDER BY RAND()
    LIMIT 1;`,
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error retrieving random job UID", error: err });
      } else {
        // Assuming data is an array of rows and we're selecting one row
        if (data.length > 0) {
          res.json({ job_uid: data[0].job_uid });
        } else {
          res.status(404).json({ message: "No jobs found" });
        }
      }
    });
};

// Route 9: GET /course/random_course_id
const get_random_course = async function (req, res) {
  connection.query(`
    SELECT id AS course_id
    FROM Course_Info
    ORDER BY RAND()
    LIMIT 1;`,
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error retrieving random course ID", error: err });
      } else {
        // Assuming data is an array of rows and we're selecting one row
        if (data.length > 0) {
          res.json({ course_id: data[0].course_id });
        } else {
          res.status(404).json({ message: "No courses found" });
        }
      }
    });
};



module.exports = {
  author,

  top_jobs,//@yarong
  top_courses,//@yarong

  job, //@yuanmin
  job_courses, //@yuanmin
  job_courses_num, //@yuanmin
  search_jobs, //@yuanmin
  search_jobs_categories, //@yuanmin
  search_jobs_cities, //@yuanmin
  search_jobs_countries, //@yuanmin
  job_reviews, //@yuanmin

  course,//@lulu
  course_jobs, //@lulu
  course_jobs_num, //@yuanmin
  search_courses, //@lulu
  search_courses_categories, //@lulu
  search_courses_languages, //@lulu
  course_comments, //@yuanmin

  get_random_job, //@Zhixiang
  get_random_course, // @Zhixiang
}
