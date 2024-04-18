import { useEffect, useState } from 'react';
import { Button, Container, Grid, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { server_host, server_port } from '../config.json';

export default function GlassdoorJobsPage() {
    const [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchJobs();
    }, [page]);

    const fetchJobs = () => {
        fetch(`http://${server_host}:${server_port}/search_jobs?city=${city}&country=${country}&category=${category}&page=${page}&page_size=${pageSize}`)
            .then(res => res.json())
            .then(resJson => {
                setData(resJson);
            })
            .catch(error => console.error('Error fetching jobs:', error));
    };

    const handleSearch = () => {
        setPage(1);
        fetchJobs();
    };

    const columns = [
        { field: 'job_id', headerName: 'Job ID', width: 100 },
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'company', headerName: 'Company', width: 200 },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'country', headerName: 'Country', width: 150 },
        { field: 'category', headerName: 'Category', width: 150 },
        { field: 'discover_date', headerName: 'Posted Date', width: 150 },
    ];

    return (
        <Container>
            <h2>Search Jobs</h2>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <TextField
                        label="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        fullWidth
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
            <h2>Job Results</h2>
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
