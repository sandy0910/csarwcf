import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';

const Dashboard = () => {
  const [data, setData] = useState({
    users: 0,
    travel: 0,
    artists: 0,
    managers: 0,
    agencies: 0,
  });

  useEffect(() => {
    // Fetch the data from the server
    fetch('http://localhost:8080/api/stats/document-counts')
      .then(response => response.json())
      .then(data => setData({
        users: data.users || 0,
        travel: data.travel || 0,
        managers: data.managers || 0,
        agencies: data.agencies || 0,
      }))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{data.users}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6">Total Travel</Typography>
            <Typography variant="h4">{data.travel}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6">Total Managers</Typography>
            <Typography variant="h4">{data.managers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6">Total Agencies</Typography>
            <Typography variant="h4">{data.agencies}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
