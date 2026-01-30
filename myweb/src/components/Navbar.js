import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, Popover, List, ListItem, Box, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Navbar = ({ onToggleSidebar, onLogout, title }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const navigate = useNavigate();

  // Récupérer les notifications depuis l'API (similaire à AdminNavbar)
  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch('http://192.168.209.25:4000/api/notification');
      const data = await response.json();
      setNotifications(data);
      setUnreadNotifications(data.filter(notification => !notification.lue).length);
    };

    fetchNotifications();
  }, []); // Relancer la récupération des notifications à chaque changement

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleProfileMenuClose();
    onLogout();
    navigate('/login');
  };

  const handleNotificationsClick = (event) => setNotificationAnchor(event.currentTarget);
  const handleNotificationsClose = () => setNotificationAnchor(null);

  // Gérer la lecture de la notification et mise à jour du compteur
  const handleNotificationClick = async (notificationId) => {
    console.log(`Notification ${notificationId} cliquée et marquée comme lue.`);

    // Mise à jour côté serveur pour marquer la notification comme lue
    const response = await fetch(`http://192.168.209.25:4000/api/notification/${notificationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lue: true }), // Marquer comme lue
    });

    if (response.ok) {
      // Mise à jour locale des notifications pour refléter l'état "lu"
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.idN === notificationId ? { ...notification, lue: true } : notification
        )
      );
      setUnreadNotifications((prevUnreadNotifications) => prevUnreadNotifications - 1);
    }
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#000', width: '100%' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" onClick={onToggleSidebar}>
            <MenuIcon fontSize="small" />
          </IconButton>

          <IconButton color="inherit" onClick={handleNotificationsClick}>
            <Badge badgeContent={unreadNotifications} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>

        <Typography variant="h6" noWrap>
          {title}
        </Typography>

        <Box>
          <IconButton color="inherit" onClick={handleProfileMenuOpen}>
            <AccountCircle />
          </IconButton>

          {/* Menu Notifications */}
          <Popover
            open={Boolean(notificationAnchor)}
            anchorEl={notificationAnchor}
            onClose={handleNotificationsClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Box sx={{ width: 300, padding: 2 }}>
              <List>
                {notifications.filter(notification => !notification.lue).map((notification) => (
                  <React.Fragment key={notification.idN}>
                    <ListItem
                      onClick={() => handleNotificationClick(notification.idN)}
                      sx={{
                        backgroundColor: notification.lue ? '#f0f0f0' : '#e0e0e0',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        padding: '10px',
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2">{notification.message}</Typography>
                        <Typography variant="caption" sx={{ color: 'gray', marginTop: '5px' }}>
                          {`${new Date(notification.datenvoie).toLocaleDateString()} à ${notification.heure}`}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Popover>

          {/* Menu Profil */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfileMenuClose}>Changer le nom</MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>Changer le mot de passe</MenuItem>
            <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
