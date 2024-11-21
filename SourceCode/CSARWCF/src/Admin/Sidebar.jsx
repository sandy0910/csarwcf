// src/Sidebar.jsx
import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Drawer, Box, Typography, IconButton, Divider, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'; // Icon for flights
import FlightLandIcon from '@mui/icons-material/FlightLand'; // Icon for flight landing
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive'; // Icon for airlines
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import './css/Sidebar.css'; // Ensure your styles are in this file

const Sidebar = ({ open, toggleSidebar }) => {
  const [openFlightsSubMenu, setOpenFlightsSubMenu] = React.useState(false);
  const [openAirlinesSubMenu, setOpenAirlinesSubMenu] = React.useState(false);

  const handleFlightsSubMenuToggle = () => {
    setOpenFlightsSubMenu(!openFlightsSubMenu);
  };

  const handleAirlinesSubMenuToggle = () => {
    setOpenAirlinesSubMenu(!openAirlinesSubMenu);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <FlightTakeoffIcon />, path: '/admin/dashboard' },
    {
      text: 'Flights', icon: <FlightLandIcon />, subItems: [
        { text: 'View Flights', path: '/admin/flights' },
        { text: 'Add Flight', path: '/admin/flights/add' },
        { text: 'Manage Bookings', path: '/admin/flights/manage-bookings' }
      ],
      subMenuToggle: handleFlightsSubMenuToggle,
      openSubMenu: openFlightsSubMenu,
    },
    {
      text: 'Airlines', icon: <AirplanemodeActiveIcon />, subItems: [
        { text: 'View Airlines', path: '/admin/airlines' },
        { text: 'Add Airline', path: '/admin/airlines/add' }
      ],
      subMenuToggle: handleAirlinesSubMenuToggle,
      openSubMenu: openAirlinesSubMenu,
    },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Carbon Deviations', icon: <AirplanemodeActiveIcon />, path: '/admin/carbon-deviants'}
  ];

  const handleLogout = () => {
    console.log('Logging out...');
    // Example: localStorage.clear();
    // Example: window.location.href = '/login';
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      className="adminDrawer"
      classes={{ paper: 'adminDrawerPaper' }} // Use your custom class here
    >
      <Box className="sidebarContent">
        <Box className="toggleButtonContainer">
          <div className='headerBox'>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={toggleSidebar}
              edge="start"
              className="toggleButton"
            >
              <MenuIcon />
              <Box className='adm'>
                <Typography variant="h6" noWrap>
                  FB Admin
                </Typography>
              </Box>
            </IconButton>
          </div>
        </Box>
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem button onClick={item.subItems ? item.subMenuToggle : null} className="listItem">
                <ListItemIcon className="listItemIcon">{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} className="listItemText" />
                {item.subItems ? (item.openSubMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />) : null}
              </ListItem>
              {item.subItems && (
                <Collapse in={item.openSubMenu} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem button component={Link} to={subItem.path} key={subItem.text} className="listItem">
                        <ListItemText primary={subItem.text} className="listItemText" style={{ paddingLeft: '32px' }} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
          <Divider />
          {/* Logout Button */}
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
