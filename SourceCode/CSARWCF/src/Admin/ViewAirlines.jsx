// src/ViewAirlines.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ViewAirlines() {
  const [airlines, setAirlines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch airlines from API
    const fetchAirlines = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/admin-airlines'); // Replace with actual endpoint
        setAirlines(response.data);
      } catch (error) {
        console.error('Error fetching airlines:', error);
      }
    };

    fetchAirlines();
  }, []);

  const handleCardClick = (airlineId) => {
    // Navigate to airline detail page
    navigate(`/airline/${airlineId}`);
  };

  return (
    <Grid container spacing={3} padding={3}>
      {airlines.map((airline) => (
        <Grid item xs={12} sm={6} md={4} key={airline.id}>
          <Card>
            <CardActionArea onClick={() => handleCardClick(airline.id)}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {airline.name}
                </Typography>
                <Typography color="textSecondary">
                  {airline.country}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Fleet Size: {airline.fleet}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ViewAirlines;
