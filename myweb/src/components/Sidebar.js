import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Drawer, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt'; 
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Assurez-vous que les styles sont bien importés

const Sidebar = ({ onClose, isOpen, onTitleChange, isAdmin }) => {
  const navigate = useNavigate();

  // Définir les éléments du menu en fonction du rôle de l'utilisateur
  const menuItems = [
    { text: 'Accueil', icon: <HomeIcon />, link: '/home' }, // Toujours visible pour tous les utilisateurs
  ];

  // Si l'utilisateur est un administrateur, ajouter les éléments d'administration
  if (isAdmin) {
    menuItems.push(
      { text: 'Tableau de bord', icon: <DashboardIcon />, link: '/dashboard' },
      { text: 'Utilisateurs', icon: <PeopleIcon />, link: '/clients' },
      { text: 'Pharmacie commande', icon: <ReceiptIcon />, link: '/pharmacyOrders' },
      { text: 'Admin', icon: <PeopleIcon />, link: '/admin' }
    );
  } else {
    // Si l'utilisateur est un pharmacien, ajouter les éléments pour le pharmacien
    menuItems.push(
      { text: 'État des commandes', icon: <ShoppingCartIcon />, link: '/orders' },
      { text: 'Historique des commandes', icon: <ManageHistoryIcon />, link: '/order-history' }
    );
  }

  // Fonction pour gérer la navigation et changer le titre
  const handleNavigation = (link, title) => {
    navigate(link);
    onTitleChange(title);
    onClose();
  };

  return (
    <Drawer
      variant="temporary"
      open={isOpen}
      anchor="left"
      onClose={onClose}
      sx={{ width: 240, height: '100vh', overflow: 'hidden' }} // Empêcher le défilement
    >
      <div className="sidebar-header">
        <img src="/pharma.png" alt="Logo" className="sidebar-logo" />
        <IconButton onClick={onClose} style={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </div>
      <List className="sidebar-list">
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handleNavigation(item.link, item.text)}
            className="sidebar-list-item"
          >
            <ListItemIcon className="sidebar-list-icon">{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} className="sidebar-list-text" />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
