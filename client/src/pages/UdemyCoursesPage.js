import { useEffect, useState } from 'react';
import { Button, Container, Grid, TextField, MenuItem, Select, InputLabel, FormControl, Link, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import config from '../config.json';
const { server_host, server_port } = config;


export default function GlassdoorJobsPage() {
    const [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [language, setLanguage] = useState('English');
    const [rating, setRating] = useState(5);
    const [category, setCategory] = useState('IT & Software');
    const [page, setPage] = useState(1);
    const [price, setPrice] = useState(99);
    const [categories, setCategories] = useState([]);
    const [languages, setLanguages] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, [page]);

    const fetchJobs = () => {

        fetch(`http://${server_host}:${server_port}/search_courses?language=${encodeURIComponent(language)}&rating=${rating}&category=${encodeURIComponent(category)}&price=${price}&page=${page}&page_size=${pageSize}`)
            .then(res => res.json())
            .then(resJson => {
                setData(resJson);
            })
            .catch(error => console.error('Error fetching jobs:', error));
        
        fetch(`http://${server_host}:${server_port}/search_jobs/categories`)
            .then(res => res.json())
            .then(resJson => {
                setCategories(resJson);
        });

        fetch(`http://${server_host}:${server_port}/search_courses/languages`)
            .then(res => res.json())
            .then(resJson => {
                setLanguages(resJson);
        });
    };

    const handleSearch = () => {
        setPage(1);
        fetchJobs();
    };


    const columns = [
        { field: 'id', headerName: 'Course ID', width: 100 },
        {
            field: 'title',
            headerName: 'Title',
            width: 450,
            renderCell: (params) => (
                <Link href={`/course/${params.id}`}>{params.value}</Link>
            )
        },
        { field: 'num_lectures', headerName: 'Lecture Count', width: 150 },
        { field: 'instructor_name', headerName: 'Instructor Name', width: 200 },
        // { field: 'published_time', headerName: 'Published Date', width: 200 },
        { field: 'avg_rating', headerName: 'Rating', width: 100 },
        { field: 'num_reviews', headerName: 'Review Count', width: 150 },


    ];

    return (
        <Container>
            <h2>Search Courses</h2>
            <Grid container spacing={20}>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel>Language</InputLabel>
                        <Select
                            value={language}
                            label="Language"
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            {languages.map((language) => (
                                <MenuItem key={language} value={language}>{language}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            label="Category"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>{category}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </Grid>

                {/* <Grid item xs={4}>
                <p>Rating</p>
                <Slider
                    value={rating}
                    min={0}
                    max={5}
                    step={0.01}
                    onChange={(e, newValue) => setRating(newValue)}
                    valueLabelDisplay='auto'
                    // valueLabelFormat={value => <div>{formatDuration(value)}</div>}
                />
                </Grid>  */}
            </Grid>
            
            <Grid container spacing={15}>
                <Grid item xs={3.5}>
                <p>Rating</p>
                <Slider
                    value={rating}
                    min={0}
                    max={5}
                    step={0.5}
                    onChange={(e, newValue) => setRating(newValue)}
                    valueLabelDisplay='auto'
                />
                </Grid> 

                <Grid item xs={5}>
                <p>Price</p>
                <Slider
                    value={price}
                    min={0}
                    max={199}
                    step={1}
                    onChange={(e, newValue) => setPrice(newValue)}
                    valueLabelDisplay='auto'
                />
                </Grid> 

            </Grid>


            <Button
                onClick={handleSearch}
                variant="contained"
                color="primary"
                style={{ marginTop: 20 }}
            >
                Search
            </Button>
            <h2>Course Results</h2>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 25]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                paginationMode="server"
                onPageChange={(newPage) => setPage(newPage + 1)}
                rowCount={100} // You may need to dynamically adjust this if your API supports total count.
                autoHeight
            />
        </Container>
    );


  
}
