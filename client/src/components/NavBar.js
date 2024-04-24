import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import config from '../config.json';

// Helper component to avoid repeated code for navigation links
function NavText({ href, text, isMain, onClick }) {
    return (
        <Typography
            variant={isMain ? 'h5' : 'h6'}
            style={{
                marginRight: '30px',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                display: 'inline-block', // Ensures alignment and spacing are consistent
            }}
        >
            <NavLink
                to={href}
                style={{
                    color: 'inherit',
                    textDecoration: 'none',
                }}
                onClick={onClick}
            >
                {text}
            </NavLink>
        </Typography>
    );
}

// NavBar component using Material UI (MUI) components
export default function NavBar() {
    const navigate = useNavigate();
    const [jobId, setJobId] = useState(null);
    const [courseId, setCourseId] = useState(null);

    // Function to fetch a random job ID from the server
    const fetchRandomJobId = () => {
        fetch(`http://${config.server_host}:${config.server_port}/random_job`)
            .then(response => response.json())
            .then(data => {
                if (data && data.job_uid) {
                    setJobId(data.job_uid);
                }
            })
            .catch(error => console.error('Error fetching random job ID:', error));
    };

    const fetchRandomCourseId = () => {
        fetch(`http://${config.server_host}:${config.server_port}/random_course`)
            .then(response => response.json())
            .then(data => {
                if (data && data.course_id){
                    setCourseId(data.course_id);
                }
            })
            .catch(error => console.error('Error fetching random course ID:', error));
    }

    // Navigate to the job details page when jobId state updates
    useEffect(() => {
        if (jobId) {
            navigate(`/job/${jobId}`);
        }
    }, [jobId]);

    useEffect(() => {
        if (courseId) {
            navigate(`/course/${courseId}`);
        }
    }, [courseId]);

    return (
        <AppBar position='static'>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <NavText href='/' text='JobEra' isMain />
                    <NavText href='/search_jobs' text='SEARCH JOBS' />
                    <NavText href='/search_courses' text='SEARCH COURSES' />
                    <NavText href='#' text='JOB DETAILS' onClick={fetchRandomJobId} />
                    <NavText href='#' text='COURSE DETAILS' onClick={fetchRandomCourseId} />
                </Toolbar>
            </Container>
        </AppBar>
    );
}
