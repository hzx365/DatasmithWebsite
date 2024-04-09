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
  // TODO (TASK 1): replace the values of name and pennKey with your own
  const name = 'Yuanmin Zhang';
  const pennKey = 'yuz249';

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

// Route 3: GET /song/:song_id
const song = async function (req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Hint: unlike route 2, you can directly SELECT * and just return data[0]
  // Most of the code is already written for you, you just need to fill in the query

  // save the given song-id to variable requestID
  const requestID = req.params.song_id;
  connection.query(`
  SELECT * 
  FROM Songs
  WHERE song_id = ? `, [requestID], (err, data) => {
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
  // TODO (TASK 5): implement a route that given a job_id, returns all information about the job
  const requestID = req.params.job_id;
  connection.query(`
  SELECT * 
  FROM Jobs_Courses
  WHERE job_uid = ?`, [requestID], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}
// Route 6: GET /album_songs/:album_id
const album_songs = async function (req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  const requestID = req.params.album_id;
  connection.query(`
  SELECT Songs.song_id, Songs.title, Songs.number, Songs.duration, Songs.plays FROM Songs
INNER JOIN Albums on Songs.album_id = Albums.album_id
WHERE Albums.album_id = ?
ORDER BY number ASC`, [requestID], (err, data) => {
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

// Route 7: GET /top_songs
const top_songs = async function (req, res) {
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageNum = page ?? parseInt(page);
  const pageSizeNum = req.query.page_size ? parseInt(req.query.page_size) : 10;
  if (!page) {
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    // Hint: you will need to use a JOIN to get the album title as well
    connection.query(`
    SELECT song_id, Songs.title, Albums.album_id, Albums.title AS album, Songs.plays FROM Songs
INNER JOIN Albums on Songs.album_id = Albums.album_id
ORDER by plays DESC;`, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data); // replace this with your implementation
      }
    })
  }
  else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    const offSet = (pageNum - 1) * pageSizeNum;
    connection.query(`
    SELECT song_id, Songs.title, Albums.album_id, Albums.title AS album, Songs.plays FROM Songs
INNER JOIN Albums on Songs.album_id = Albums.album_id
ORDER by plays DESC
LIMIT ? OFFSET ?;`, [pageSizeNum, offSet], (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data); // replace this with your implementation
      }
    })
  }
}

// Route 8: GET /top_albums
const top_albums = async function (req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album

  const page = req.query.page;
  // set the pageSize based on the query or default to 10
  const pageNum = page ?? parseInt(page);
  const pageSizeNum = req.query.page_size ? parseInt(req.query.page_size) : 10;

  if (!page) {
    connection.query(`
    SELECT Albums.album_id, Albums.title AS title, SUM(Songs.plays) AS plays FROM Albums
INNER JOIN Songs ON Albums.album_id = Songs.album_id
GROUP BY Albums.album_id
ORDER BY SUM(Songs.plays) DESC;`, (err, data) => {
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
    SELECT Albums.album_id, Albums.title AS title, SUM(Songs.plays) AS plays FROM Albums
    INNER JOIN Songs ON Albums.album_id = Songs.album_id
    GROUP BY Albums.album_id
    ORDER BY SUM(Songs.plays) DESC   
LIMIT ? OFFSET ?;`, [pageSizeNum, offSet], (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data); // replace this with your implementation
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

module.exports = {
  author,
  random,
  song,
  job,
  job_courses,
  search_jobs,
  album_songs,
  top_songs,
  top_albums,
}
