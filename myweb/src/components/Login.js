import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // État pour l'animation de chargement
  const navigate = useNavigate();

  // Fonction pour appeler l'API de connexion et valider le pharmacien
  const loginPharmacien = async (username, password) => {
    try {
      console.log('Tentative de connexion avec les identifiants :', username, password);

      // Validation côté frontend avant envoi des données
      if (!username || !password) {
        console.error('Erreur : Tous les champs sont requis');
        throw new Error('Tous les champs sont requis');
      }

      // Préparer la requête
      const requestPayload = { emailOrPhone: username, password };
      console.log('Données envoyées au backend :', JSON.stringify(requestPayload));

      // Effectuer la requête POST à l'API backend
      const response = await fetch('http://192.168.209.25:4000/api/comptepharmacie/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      // Log de la réponse brute du backend
      console.log('Réponse brute du backend:', response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur du backend :', errorData);
        throw new Error(errorData.message || 'Identifiants incorrects');
      }

      // Récupérer la réponse et vérifier si un utilisateur est retourné
      const data = await response.json();
      console.log('Réponse après traitement :', data);

      // Vérifier si l'utilisateur existe dans la réponse
      if (data && data.token) {
        console.log('Connexion réussie, utilisateur trouvé :', data.user);

        // Stocker le token JWT dans le localStorage
        localStorage.setItem('authToken', data.token);  // Stocker le token JWT

        // Stocker l'ID utilisateur et d'autres informations utiles dans le localStorage
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.email);
        localStorage.setItem('userPhone', data.user.telephone);
        localStorage.setItem('userMatricule', data.user.matricule);
        localStorage.setItem('userPharmacyName', data.user.nomPharmacie);

        // Gérer la navigation et l'état de la connexion réussie
        return true; // Connexion réussie
      } else {
        console.error('Aucune donnée retournée pour l\'utilisateur.');
        throw new Error('Utilisateur non trouvé');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error.message);
      throw new Error(error.message || 'Une erreur s\'est produite lors de la connexion');
    }
  };

  // Fonction pour gérer la connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoginSuccess(false);

    console.log('Tentative de connexion à l\'application');
    try {
      // Appeler la fonction de connexion
      const loginSuccess = await loginPharmacien(credentials.username, credentials.password);
      if (loginSuccess) {
        console.log('Connexion réussie en tant que pharmacien');
        onLogin(credentials.username); // Passer les informations de connexion
        setLoginSuccess(true); // Connexion réussie
        navigate('/home');
      }
    } catch (error) {
      console.error('Erreur lors de la tentative de connexion:', error.message);
      setError(error.message || 'Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  // Fonction pour gérer les changements dans les champs de saisie
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({ ...prevState, [name]: value }));
  };

  // Fonction pour gérer l'inscription
  const handleRegister = () => {
    console.log('Redirection vers la page d\'inscription');
    navigate('/registration');
  };

  // Fonction pour rediriger vers la page AdminLogin avec un spinner
  const handleAdminRedirect = async () => {
    setIsLoading(true); // Afficher le spinner de chargement
    console.log('Redirection vers la page AdminLogin');
    setTimeout(() => {
      navigate('/admin-login'); // Rediriger vers la page de connexion admin
      setIsLoading(false); // Cacher le spinner après la redirection
    }, 1000); // Attendre 1 seconde pour l'animation de chargement
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className={`login-form ${loginSuccess ? 'success' : ''}`}>
          <img src="/pharma.png" alt="Logo du site" className="logo" />
          <form onSubmit={handleLogin}>
            <div>
              <label>Nom d'utilisateur ou Téléphone :</label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Entrer le nom d'utilisateur ou le téléphone"
              />
            </div>
            <div>
              <label>Mot de passe :</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Entrer le mot de passe"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            {loginSuccess && <p className="success-message">Connexion réussie !</p>}
            <button type="submit">Se connecter</button>
            <p className="register-link" onClick={handleRegister}>
              Pas de compte ? Créez un compte pharmacien.
            </p>
            <p className="admin-link" onClick={handleAdminRedirect}>
              {isLoading ? (
                <div className="loading-spinner"></div> // Affiche le spinner pendant le chargement
              ) : (
                'Vous êtes admin ? Cliquer ici !'
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
