import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Clients from './components/Clients';
import PharmacyOrders from './components/PharmacyOrders';
import Admin from './components/Admin';
import Registration from './components/Registration';
import OrderHistory from './components/OrderHistory';
import './App.css';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('Accueil');
  const [notifications, setNotifications] = useState([]); // Notifications
  const navigate = useNavigate();

  // Fonction de connexion pour admin ou pharmacien
  const handleLogin = (role) => {
    setAuthenticated(true);
    setCurrentTitle('Accueil');
    if (role === 'admin') {
      setIsAdmin(true);
      navigate('/home');
    } else {
      setIsAdmin(false);
      navigate('/home');
    }
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    setAuthenticated(false);
    setIsAdmin(false);
    navigate('/login'); // Redirection vers la page de connexion
  };

  // Ajout de notification quand une nouvelle pharmacie est ajoutée
  const onNewPharmacyAdded = (pharmacyName) => {
    setNotifications((prevNotifications) => [
      { id: `pharmacy-${Date.now()}`, type: 'pharmacie', message: `${pharmacyName} vient de s'inscrire.`, read: false },
      ...prevNotifications,
    ]);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleTitleChange = (title) => {
    setCurrentTitle(title);
  };

  // Mise à jour du titre de la page via useEffect
  useEffect(() => {
    document.title = currentTitle;
  }, [currentTitle]);

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {isAuthenticated && (
        <>
          {/* Affichage de la navbar en fonction du rôle */}
          {isAdmin ? (
            <AdminNavbar
              onToggleSidebar={toggleSidebar}
              onLogout={handleLogout}
              title={currentTitle}
              notifications={notifications} // Passer les notifications
              onNewPharmacyAdded={onNewPharmacyAdded} // Passer la fonction d'ajout de pharmacie
            />
          ) : (
            <Navbar onToggleSidebar={toggleSidebar} onLogout={handleLogout} title={currentTitle} />
          )}

          {/* Sidebar accessible aux admins et pharmaciens */}
          <Sidebar
            onClose={closeSidebar}
            isOpen={isSidebarOpen}
            onTitleChange={handleTitleChange}
            isAdmin={isAdmin} // Sidebar spécifique aux admins et pharmaciens
          />
        </>
      )}

      <div className="content-container">
        <Routes>
          {/* Routes pour la connexion */}
          <Route path="/login" element={<Login onLogin={() => handleLogin('pharmacien')} />} />
          <Route path="/admin-login" element={<AdminLogin onLogin={() => handleLogin('admin')} />} />

          {/* Route pour l'inscription d'une nouvelle pharmacie */}
          <Route path="/registration" element={<Registration onNewPharmacyAdded={onNewPharmacyAdded} />} />

          {/* Route Home pour pharmaciens et admins */}
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />

          {/* Routes accessibles uniquement aux pharmaciens (non-admin) */}
          <Route path="/orders" element={isAuthenticated && !isAdmin ? <Orders /> : <Navigate to="/login" />} />
          <Route path="/order-history" element={isAuthenticated && !isAdmin ? <OrderHistory /> : <Navigate to="/login" />} />

          {/* Routes administratives accessibles uniquement aux admins */}
          <Route path="/dashboard" element={isAuthenticated && isAdmin ? <Dashboard /> : <Navigate to="/home" />} />
          <Route path="/clients" element={isAuthenticated && isAdmin ? <Clients /> : <Navigate to="/home" />} />
          <Route path="/pharmacyOrders" element={isAuthenticated && isAdmin ? <PharmacyOrders /> : <Navigate to="/home" />} />
          <Route path="/admin" element={isAuthenticated && isAdmin ? <Admin /> : <Navigate to="/home" />} />

          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to={isAuthenticated ? (isAdmin ? "/home" : "/home") : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
