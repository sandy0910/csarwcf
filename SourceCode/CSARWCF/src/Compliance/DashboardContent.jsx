// src/DashboardContent.jsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const DashboardContent = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Compliance Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to the Compliance Manager dashboard! Here you can view and manage all compliance-related activities.
        </Typography>
        <Typography variant="body1">
          Use the sidebar to navigate through different sections, such as Compliance Reports, Regulations, Audits, and User Management.
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          This dashboard provides a quick overview of compliance metrics and allows you to manage your compliance efforts effectively.
        </Typography>
      </Paper>
    </Box>
  );
};

export default DashboardContent;
