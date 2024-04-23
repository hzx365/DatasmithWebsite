import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, MenuItem, Select, InputLabel, FormControl, Link } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import config from '../config.json';
const { server_host, server_port } = config;

export default function GlassdoorJobsPage() {
    const [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);

    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        fetch(`http://${server_host}:${server_port}/search_jobs/categories`)
            .then(res => res.json())
            .then(resJson => {
                setCategories(resJson);
            });
        fetch(`http://${server_host}:${server_port}/search_jobs/cities`)
            .then(res => res.json())
            .then(resJson => {
                setCities(resJson);
            });
        fetch(`http://${server_host}:${server_port}/search_jobs/countries`)
            .then(res => res.json())
            .then(resJson => {
                setCountries(resJson);
            });
    }, []);

    const fetchJobs = () => {
        fetch(`http://${server_host}:${server_port}/search_jobs?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&category=${encodeURIComponent(category)}&page=${page}&page_size=${pageSize}`)
            .then(res => res.json())
            .then(resJson => {
                resJson.map(d => d.id = d.uid);
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
        {
            field: 'job_title',
            headerName: 'Title',
            width: 200,
            renderCell: (params) => (
                <Link href={`/job/${params.id}`}>{params.value}</Link>
            ),
        },
        { field: 'employer_name', headerName: 'Company', width: 200 },
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
                    <FormControl fullWidth>
                        <InputLabel>City</InputLabel>
                        <Select
                            value={city}
                            label="City"
                            onChange={(e) => setCity(e.target.value)}
                        >
                            {cities.map((city) => (
                                <MenuItem key={city} value={city}>{city}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel>Country</InputLabel>
                        <Select
                            value={country}
                            label="Country"
                            onChange={(e) => setCountry(e.target.value)}
                        >
                            {countries.map((country) => (
                                <MenuItem key={country} value={country}>{country}</MenuItem>
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
                paginationMode="server"
                onPageChange={(newPage) => setPage(newPage + 1)}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowCount={100} // You may need to dynamically adjust this if your API supports total count.
                autoHeight
            />
        </Container>
    );
}
