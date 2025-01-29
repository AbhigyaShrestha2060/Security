import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const navItems = [
    { text: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { text: 'Add Gadget', path: '/admin/add-gadget', icon: <AddIcon /> },
    { text: 'Activity', path: '/admin/activity-logs', icon: <TimelineIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant='h6'
          component='div'
          sx={{ flexGrow: 1 }}>
          Admin Panel
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                  color: theme.palette.primary.contrastText,
                },
              },
            }}>
            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.error.light,
              '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.error.contrastText,
              },
            },
          }}>
          <ListItemIcon sx={{ color: theme.palette.error.main }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary='Logout' />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position='static'
        elevation={3}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant='h6'
            component='div'
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            onClick={() => handleNavigation('/dashboard')}>
            Admin Panel
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  color='inherit'
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}>
                  {item.text}
                </Button>
              ))}
              <Button
                color='inherit'
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.error.dark,
                  },
                }}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Drawer
          variant='temporary'
          anchor='left'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': { width: 250 },
          }}>
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default AdminNavbar;
