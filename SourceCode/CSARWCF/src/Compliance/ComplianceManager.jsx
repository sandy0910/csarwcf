// src/ComplianceManager.jsx
import React from 'react';
import { Box, Typography, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import ComplianceRoute from './ComplianceRoute';

const ComplianceManager = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const menuItems = [
    { text: 'Dashboard', path: '/compliance/dashboard' },
    { text: 'Compliance Reports', path: '/compliance/compliance-reports' },
    { text: 'Regulations', path: '/compliance/regulations' },
    { text: 'Airlines', path:'/compliance/airlines'},
    { text: 'Carbon Estimation', path:'/compliance/estimation'},
    { text: 'Logout', path: '/logout' }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    toggleDrawer();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: '#4CAF50' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Compliance Manager
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
            backgroundColor: '#81C784',
            color: '#FFFFFF',
            width: 240,
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text} onClick={() => handleMenuClick(item.path)}>
              <ListItemText primary={item.text} sx={{ color: '#FFFFFF' }} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#F1F8E9', p: 3, marginTop: '64px' }}>
        <ComplianceRoute /> {/* Render ComplianceRoute to handle sub-routes */}
      </Box>
    </Box>
  );
};

export default ComplianceManager;
