import { useEffect, useState } from 'react';
import { Container, Divider } from '@mui/material';
import LazyTable from '../components/LazyTable';
import config from '../config.json';
const { server_host, server_port } = config;

export default function HomePage() {
    // For demonstration, we are assuming that LazyTable takes a route and columns as props.
    // We also assume that LazyTable handles pagination and other interactions on its own,
    // as suggested by its name suggesting it loads data "lazily" (i.e., as needed).

    const jobColumns = [
        { field: 'job_title', headerName: 'Job Title', width: 200 },
        { field: 'employer_name', headerName: 'Employer', width: 200 },
        { field: 'category', headerName: 'Category', width: 130 },
        { field: 'city', headerName: 'City', width: 130 },
        { field: 'country', headerName: 'Country', width: 130 },
        { field: 'benefit_rating', headerName: 'Benefit Rating', width: 130, type: 'number' },
        { field: 'description', headerName: 'Description', width: 300 }
    ];

    const courseColumns = [
        { field: 'title', headerName: 'Course Title', width: 200 },
        { field: 'instructor_name', headerName: 'Instructor', width: 200 },
        { field: 'category', headerName: 'Category', width: 130 },
        { field: 'language', headerName: 'Language', width: 130 },
        { field: 'avg_rating', headerName: 'Average Rating', width: 130, type: 'number' },
        { field: 'price', headerName: 'Price', type: 'number', width: 90 },
        { field: 'num_subscribers', headerName: 'Subscribers', type: 'number', width: 130 }
    ];

    return (
        <Container>
            <h2>Top Jobs</h2>
            <LazyTable route={`http://${config.server_host}:${config.server_port}/top_jobs`} columns={jobColumns} defaultPageSize={5} rowsPerPageOptions={[5, 10, 25]} />
            <Divider style={{ marginTop: 20, marginBottom: 20 }} />
            <h2>Top Courses</h2>
            <LazyTable route={`http://${config.server_host}:${config.server_port}/top_courses`} columns={courseColumns} defaultPageSize={5} rowsPerPageOptions={[5, 10, 25]} />
        </Container>
    );
}
