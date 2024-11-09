import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AirlineRoute from './AirlineRoute';

const AirlineAdmin = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  useEffect(() => {
    // Check if session data exists; if not, redirect to login page
    const sessionToken = sessionStorage.getItem('userSession');
    if (!sessionToken) {
      console.log("No session token, redirecting to login.");
      navigate('/air-login');
    }
  }, [navigate]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Uniform function to handle navigation for all menu items
  const handleMenuClick = (path) => {
    if (path === '/logout') {
      // Clear session and redirect to login page
      sessionStorage.removeItem('userSession');
      navigate('/air-login');
    } else {
      // Navigate to the selected menu path
      navigate(path);
    }
    toggleDrawer(); // Close drawer after each selection
  };

  const menuItems = [
    { label: 'Dashboard', path: '/airline' },
    { label: 'Manage Flights', path: '/manage-flights' },
    { label: 'Manage Airlines', path: '/manage-airlines' },
    { label: 'User Management', path: '/user-management' },
    { label: 'Flight Bookings', path: '/flight-bookings' },
    { label: 'Logout', path: '/logout' }, // Keep logout in the same format
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
              onClick={() => handleMenuClick(item.path)}
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
