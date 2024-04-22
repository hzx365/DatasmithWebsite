import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import GlassdoorJobsPage from './pages/GlassdoorJobsPage';
import UdemyCoursesPage from './pages/UdemyCoursesPage';
import JobDetailsPage from './pages/JobDetailsPage';
import CourseDetailsPage from './pages/CourseDetailsPage'

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search_jobs" element={<GlassdoorJobsPage />} />
          <Route path="/job/:job_uid" element={<JobDetailsPage />} />
          <Route path="/search_courses" element={<UdemyCoursesPage />} />
          <Route path="/course/:course_id" element={<CourseDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}