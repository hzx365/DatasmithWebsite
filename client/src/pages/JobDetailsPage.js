import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Link, Divider } from '@mui/material';
import LazyTable from '../components/LazyTable';
import config from "../config.json";

const JobDetailsPage = () => {
    const { job_uid } = useParams();
    const [jobDetails, setJobDetails] = useState(null);
    console.log(job_uid);

    // Function to fetch data from the server
    const fetchData = (endpoint, setter) => {
        fetch(endpoint)
            .then(res => res.json())
            .then(setter)
            .catch(err => console.error(`Failed to fetch data from ${endpoint}:`, err));
    };

    // Fetch job details when job_uid changes
    useEffect(() => {
        fetch(`/job/${job_uid}`)
            .then(res => res.json())
            .then(data => setJobDetails([data])) // Wrap the single job object inside an array
            .catch(err => console.error(`Failed to fetch job details:`, err));
    }, [job_uid]);

    const jobDetailsColumns = [
        { field: 'job_title', headerName: 'Job Title', width: 200 },
        { field: 'employer_name', headerName: 'Employer', width: 200 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'city', headerName: 'City', width: 130 },
        { field: 'country', headerName: 'Country', width: 130 },
        { field: 'category', headerName: 'Category', width: 130 },
    ];

    const courseColumns = [
        { field: 'course_title', headerName: 'Course Title', width: 200 },
        { field: 'instructor_name', headerName: 'Instructor', width: 200 },
        { field: 'language', headerName: 'Language', width: 130 },
        { field: 'avg_rating', headerName: 'Average Rating', width: 130, type: 'number' },
    ];

    const reviewColumns = [
        { field: 'pros', headerName: 'Pros', width: 200 },
        { field: 'cons', headerName: 'Cons', width: 200 },
        {
            field: 'review_date',
            headerName: 'Date',
            width: 130,
            renderCell: (row) => new Date(row.review_date).toLocaleDateString(),
        },
    ];

    return (
        <Container>
            <h2>Job Details</h2>
            <LazyTable route={`http://${config.server_host}:${config.server_port}/job/${job_uid}`} columns={jobDetailsColumns}/>
            <Divider style={{marginTop: 20, marginBottom: 20}}/>
            <h2>Related Courses</h2>
            <LazyTable route={`http://${config.server_host}:${config.server_port}/job/${job_uid}/courses`} columns={courseColumns}
                       defaultPageSize={5} rowsPerPageOptions={[5, 10, 25]}/>
            <Divider style={{marginTop: 20, marginBottom: 20}}/>
            <h2>Job Reviews</h2>
            <LazyTable route={`http://${config.server_host}:${config.server_port}/job/${job_uid}/reviews`}
                       columns={reviewColumns}
                       defaultPageSize={5} rowsPerPageOptions={[5, 10, 25]}/>
        </Container>
    );


};

export default JobDetailsPage;