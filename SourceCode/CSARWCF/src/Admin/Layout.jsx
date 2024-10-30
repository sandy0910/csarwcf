// src/Layout.jsx
import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [open, setOpen] = useState(true);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
        <>
          <AppBar position="fixed" className="AppBar">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleSidebar}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="logoedit.jpg" alt="Logo" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                <Typography variant="h6" noWrap>
                  ExTra Quest
                </Typography>
              </div>
            </Toolbar>
          </AppBar>
          <Sidebar open={open} toggleSidebar={toggleSidebar} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              transition: 'margin 0.3s',
              marginLeft: open ? '240px' : '0',
            }}
          >
            <Toolbar />
            <Outlet />
          </Box>
        </>
    </Box>
  );
};

export default Layout;
