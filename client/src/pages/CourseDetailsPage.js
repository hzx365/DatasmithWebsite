import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Divider, Grid, Link } from '@mui/material';
import LazyTable from '../components/LazyTable';
import config from "../config.json";

const { server_host, server_port } = config;

const CourseDetailsPage = () => {
    const { course_id } = useParams();
    const [courseDetails, setCourseDetails] = useState({});
    const [numJobs, setNumJobs] = useState(null);

    // Fetch course details when course_id changes
    useEffect(() => {
        fetch(`http://${server_host}:${server_port}/course/${course_id}`)
            .then(res => res.json())
            .then(data => setCourseDetails(data)) // Wrap the single course object inside an array
            .catch(err => console.error(`Failed to fetch course details:`, err));
        fetch(`http://${server_host}:${server_port}/course/${course_id}/numJobs`)
            .then(res => res.json())
            .then(data => setNumJobs(data.num_jobs)) // Wrap the single course object inside an array
            .catch(err => console.error(`Failed to fetch course details:`, err));
    }, [course_id]);


    const jobColumns = [
        {
            field: 'job_title',
            headerName: 'Job Title',
            width: 200,
            renderCell: (row) => (
                <Link href={`/job/${row.job_uid}`}>{row.job_title}</Link>
            ),
        },
        { field: 'employer_name', headerName: 'Employer', width: 200 },
        { field: 'city', headerName: 'City', width: 130 },
        { field: 'benefit_rating', headerName: 'Benefit Rating', width: 130, type: 'number' },
    ];

    const commentColumns = [
        { field: 'comments', headerName: 'Comments', width: 200 },
        { field: 'rates', headerName: 'Rates', width: 130, type: 'number' },
    ];
    const containerStyle = {
        marginTop: '20px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9'
    };
    const gridItemStyle = {
        marginBottom: '10px'
    };

    return (
        <Container style={containerStyle}>
            <h1 >{courseDetails.title}</h1>
            <Grid container spacing={2}>
                <Grid item xs={4} style={gridItemStyle}>
                    <strong>Instructor:</strong> {courseDetails.instructor_name}
                </Grid>
                <Grid item xs={4} style={gridItemStyle}>
                    <strong>Language:</strong> {courseDetails.language}
                </Grid>
                <Grid item xs={4} style={gridItemStyle}>
                    <strong>Number of Relevant Jobs:</strong> {numJobs}
                </Grid>
            </Grid>
            <h2>Category</h2>
            <p>{courseDetails.category}</p>
            <Divider style={{ marginTop: 20, marginBottom: 20 }} />
            <h2>Related Jobs</h2>
            <LazyTable route={`http://${config.server_host}:${config.server_port}/course/${course_id}/jobs`} columns={jobColumns}
                defaultPageSize={5} rowsPerPageOptions={[5, 10, 25]} />
            <Divider style={{ marginTop: 20, marginBottom: 20 }} />
            <h2>Course Comments</h2>
            <LazyTable route={`http://${config.server_host}:${config.server_port}/course/${course_id}/comments`}
                columns={commentColumns}
                defaultPageSize={5} rowsPerPageOptions={[5, 10, 25]} />
        </Container>
    );


};

export default CourseDetailsPage;