// src/AirlineAdmin.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import AirlineRoute from './AirlineRoute';

const AirlineAdmin = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  useEffect(() => {
    // Check if session data exists
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      navigate('/air-login'); // Redirect to login page if not authenticated
    }
  }, [navigate]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { label: 'Dashboard', path: '/airline' },
    { label: 'Manage Flights', path: '/manage-flights' },
    { label: 'Manage Airlines', path: '/manage-airlines' },
    { label: 'User Management', path: '/user-management' },
    { label: 'Flight Bookings', path: '/flight-bookings' },
    { label: 'Logout', path: '/logout' },
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
            backgroundColor: '#EF5350',
            color: '#FFFFFF',
            width: 240,
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.label}
              component={Link}
              to={item.path}
              onClick={toggleDrawer}
            >
              <ListItemText primary={item.label} sx={{ color: '#FFFFFF' }} />
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
          Use the menu to navigate to different sections.
        </Typography>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#FFEBEE', p: 3, marginTop: '64px' }}>
        <AirlineRoute />
      </Box>
    </Box>
  );
};

export default AirlineAdmin;
