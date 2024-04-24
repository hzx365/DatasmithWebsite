import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Divider, Grid, Link } from '@mui/material';
import LazyTable from '../components/LazyTable';
import config from "../config.json";

const { server_host, server_port } = config;

const JobDetailsPage = () => {
    const { job_uid } = useParams();
    const [jobDetails, setJobDetails] = useState({});
    const [numCourses, setNumCourses] = useState(null);

    // Fetch job details when job_uid changes
    useEffect(() => {
        fetch(`http://${server_host}:${server_port}/job/${job_uid}`)
            .then(res => res.json())
            .then(data => setJobDetails(data[0])) // Wrap the single job object inside an array
            .catch(err => console.error(`Failed to fetch job details:`, err));
        fetch(`http://${server_host}:${server_port}/job/${job_uid}/numCourses`)
            .then(res => res.json())
            .then(data => setNumCourses(data.num_courses)) // Wrap the single job object inside an array
            .catch(err => console.error(`Failed to fetch job details:`, err));
    }, [job_uid]);


    const courseColumns = [
        {
            field: 'course_title',
            headerName: 'Course Title',
            width: 200,
            renderCell: (row) => (
                <Link href={`/course/${row.course_id}`}>{row.course_title}</Link>
            ),
        },
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
    const containerStyle = {
        marginTop: '20px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9'
    };
    const gridItemStyle = {
        marginBottom: '10px',
    };

    return (
        <Container style={containerStyle}>
            <h1 >{jobDetails.job_title}</h1>
            <Grid container spacing={2}>
                <Grid item xs={4} style={gridItemStyle}>
                    <strong>Employer:</strong> {jobDetails.employer_name}
                </Grid>
                <Grid item xs={4} style={gridItemStyle}>
                    <strong>Category:</strong> {jobDetails.category}
                </Grid>
                <Grid item xs={4} style={gridItemStyle}>
                    <strong>Location:</strong> {jobDetails.city}, {jobDetails.country}
                </Grid>
                <Grid item xs={4} style={gridItemStyle}>
                    <strong>Number of Relevant Courses:</strong> {numCourses}
                </Grid>
            </Grid>
            <h2>Description</h2>
            <p>{jobDetails.description}</p>
            <Divider style={{ marginTop: 20, marginBottom: 20 }} />
            <h2>Related Courses</h2>
            <LazyTable route={`http://${config.server_host}:${config.server_port}/job/${job_uid}/courses`} columns={courseColumns}
                defaultPageSize={5} rowsPerPageOptions={[5, 10, 25]} />
            <Divider style={{ marginTop: 20, marginBottom: 20 }} />
            <h2>Job Reviews</h2>
            <LazyTable route={`http://${config.server_host}:${config.server_port}/job/${job_uid}/reviews`}
                columns={reviewColumns}
                defaultPageSize={5} rowsPerPageOptions={[5, 10, 25]} />
        </Container>
    );


};

export default JobDetailsPage;