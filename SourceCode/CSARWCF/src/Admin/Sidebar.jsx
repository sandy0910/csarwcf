import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Drawer, Box, Typography, IconButton, Divider, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import './css/Sidebar.css';

const Sidebar = ({ open, toggleSidebar }) => {
  const [openSubMenu, setOpenSubMenu] = React.useState(false);

  const handleSubMenuToggle = () => {
    setOpenSubMenu(!openSubMenu);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/admin' },
    {
      text: 'Travel Agencies', icon: <BusinessIcon />, subItems: [
        { text: 'View Agencies', path: '/admin/travel-agencies' },
        { text: 'View Managers', path: '/admin/travel-agencies/view-managers' },
        { text: 'Add Agency', path: '/admin/travel-agencies/add-agency' }
      ]
    },
    { text: 'User', icon: <PeopleIcon />, path: '/admin/user' },
  ];

  const handleLogout = () => {
    // Perform logout actions here (e.g., clearing local storage, redirecting to login page)
    console.log('Logging out...');
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      className="drawer"
      classes={{ paper: 'drawerPaper' }}
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
                  Admin Panel
                </Typography>
              </Box>
            </IconButton>
          </div>
        </Box>
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem button component={Link} to={item.path || '#'} onClick={item.subItems ? handleSubMenuToggle : null} className="listItem">
                <ListItemIcon className="listItemIcon">{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} className="listItemText" />
                {item.subItems ? (openSubMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />) : null}
              </ListItem>
              {item.subItems && (
                <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
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
