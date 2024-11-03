// src/AirlineAdmin.jsx
import React from 'react';
import { Box, Typography, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const AirlineAdmin = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    'Dashboard',
    'Manage Flights',
    'Manage Airlines',
    'User Management',
    'Flight Bookings',
    'Logout',
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: '#F44336' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Airline Admin
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#EF5350', // Drawer background color
            color: '#FFFFFF',
            width: 240,
          },
        }}
      >
        <List>
          {menuItems.map((text) => (
            <ListItem button key={text}>
              <ListItemText primary={text} sx={{ color: '#FFFFFF' }} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: '#FFEBEE', p: 3, marginTop: '64px' }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to the Airline Administration Dashboard
        </Typography>
        <Typography variant="body1" gutterBottom>
          Manage flights, airlines, and bookings efficiently.
        </Typography>
        {/* Add more components or features here */}
      </Box>
    </Box>
  );
};

export default AirlineAdmin;
