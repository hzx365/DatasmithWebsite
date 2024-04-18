import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Paper, Divider } from '@mui/material';

const JobDetailsPage = () => {
    const { job_uid } = useParams();
    const [jobDetails, setJobDetails] = useState(null);
    const [courses, setCourses] = useState([]);
    const [reviews, setReviews] = useState([]);

    // Function to fetch data from the server
    const fetchData = (endpoint, setter) => {
        fetch(endpoint)
            .then(res => res.json())
            .then(setter)
            .catch(err => console.error(`Failed to fetch data from ${endpoint}:`, err));
    };

    // Fetch all related data when job_uid changes
    useEffect(() => {
        fetchData(`/job/${job_uid}`, data => setJobDetails(data));
        fetchData(`/job/${job_uid}/courses`, setCourses);
        fetchData(`/job/${job_uid}/reviews`, setReviews);
    }, [job_uid]);

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>Job Details</Typography>
            {jobDetails ? (
                <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                    <Typography variant="h5">{jobDetails.job_title}</Typography>
                    <Typography variant="subtitle1">{jobDetails.employer_name}</Typography>
                    <Typography variant="body2">{jobDetails.description}</Typography>
                    <Divider style={{ margin: '20px 0' }} />
                    <Typography variant="overline">Location: {jobDetails.city}, {jobDetails.country}</Typography>
                    <Typography variant="overline">Category: {jobDetails.category}</Typography>
                </Paper>
            ) : (
                <Typography>Loading job details...</Typography>
            )}

            <Typography variant="h5" gutterBottom>Related Courses</Typography>
            <Grid container spacing={2}>
                {courses.map(course => (
                    <Grid item xs={12} sm={6} md={4} key={course.course_id}>
                        <Paper style={{ padding: '10px' }}>
                            <Typography>{course.course_title}</Typography>
                            <Typography variant="body2">Instructor: {course.instructor_name}</Typography>
                            <Typography variant="body2">Language: {course.language}</Typography>
                            <Typography variant="body2">Rating: {course.avg_rating}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
                Reviews
            </Typography>
            {reviews.map((review, index) => (
                <Paper key={index} style={{ padding: '10px', marginBottom: '10px' }}>
                    <Typography variant="body1">Pros: {review.pros}</Typography>
                    <Typography variant="body1">Cons: {review.cons}</Typography>
                    <Typography variant="caption">Date: {new Date(review.review_date).toLocaleDateString()}</Typography>
                </Paper>
            ))}
        </Container>
    );
};

export default JobDetailsPage;
