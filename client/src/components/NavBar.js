import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';

// Helper component to avoid repeated code for navigation links
function NavText({ href, text, isMain }) {
    return (
        <Typography
            variant={isMain ? 'h5' : 'h6'}  // Corrected to 'h6' as 'h7' is not a valid variant
            Wrap
            style={{
                marginRight: '30px',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
            }}
        >
            <NavLink
                to={href}
                style={{
                    color: 'inherit',
                    textDecoration: 'none',
                }}
            >
                {text}
            </NavLink>
        </Typography>
    )
}

// NavBar component using Material UI (MUI) components
export default function NavBar() {
    return (
        <AppBar position='static'>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <NavText href='/' text='JobEra' isMain />
                    <NavText href='/search_jobs' text='SEARCH JOBS' />
                    <NavText href='/search_courses' text='SEARCH COURSES' />
                    <NavText href='/job/:job_id' text='JOB DETAILS' />
                    <NavText href='/course/:course_id' text='COURSE DETAILS' />
                </Toolbar>
            </Container>
        </AppBar>
    );
}
