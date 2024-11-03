// src/ComplianceManager.jsx
import React from 'react';
import { Box, Typography, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Dummy components for each section
const DashboardContent = () => (
  <Box>
    <Typography variant="h4" gutterBottom>Welcome to the Compliance Management Dashboard</Typography>
    <Typography variant="body1" gutterBottom>
      Here you can manage compliance reports, regulations, and audits.
    </Typography>
  </Box>
);

const ComplianceReports = () => <Typography variant="h5">Compliance Reports</Typography>;
const Regulations = () => <Typography variant="h5">Regulations</Typography>;
const Audits = () => <Typography variant="h5">Audits</Typography>;
const UserManagement = () => <Typography variant="h5">User Management</Typography>;

const ComplianceManager = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [currentContent, setCurrentContent] = React.useState(<DashboardContent />);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const menuItems = [
    { text: 'Dashboard', component: <DashboardContent /> },
    { text: 'Compliance Reports', component: <ComplianceReports /> },
    { text: 'Regulations', component: <Regulations /> },
    { text: 'Audits', component: <Audits /> },
    { text: 'User Management', component: <UserManagement /> },
    { text: 'Logout', component: <Typography variant="h5">Logging out...</Typography> },
  ];

  const handleMenuClick = (component) => {
    setCurrentContent(component);
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
          {menuItems.map((item, index) => (
            <ListItem button key={item.text} onClick={() => handleMenuClick(item.component)}>
              <ListItemText primary={item.text} sx={{ color: '#FFFFFF' }} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#F1F8E9', p: 3, marginTop: '64px' }}>
        {currentContent}
      </Box>
    </Box>
  );
};

export default ComplianceManager;
