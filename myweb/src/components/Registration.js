import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Registration = ({ onNewPharmacyAdded }) => {
  const [name, setName] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matricule, setMatricule] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();

  // Fonction pour générer un matricule aléatoire
  const generateMatricule = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  useEffect(() => {
    const initialMatricule = generateMatricule();
    setMatricule(initialMatricule);
    console.log('Matricule généré:', initialMatricule); // Log matricule
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Démarrage de l\'inscription'); // Log du début de l'inscription

    // Réinitialisation des états
    setSuccess(false);
    setError(false);
    setLoading(true);

    // Vérification de la correspondance des mots de passe
    if (password !== confirmPassword) {
      toast.error('Le mot de passe ne correspond pas.', {
        position: 'top-right',
        autoClose: 5000,
      });
      console.log('Erreur : les mots de passe ne correspondent pas'); // Log de l'erreur
      setLoading(false);
      setError(true);
      return;
    }

    // Vérification que tous les champs sont remplis
    if (!name || !pharmacyName || !email || !phone || !password || !confirmPassword) {
      toast.error('Veuillez remplir correctement tous les champs.', {
        position: 'top-right',
        autoClose: 5000,
      });
      console.log('Erreur : Champs incomplets'); // Log des champs incomplets
      setLoading(false);
      setError(true);
      return;
    }

    // Vérification du numéro de téléphone
    if (phone.length !== 10) {
      setPhoneError('Le numéro de téléphone doit comporter exactement 10 chiffres.');
      console.log('Erreur : numéro de téléphone invalide', phone); // Log du téléphone invalide
      setLoading(false);
      setError(true);
      return;
    } else {
      setPhoneError('');
    }

    // Données à envoyer dans la table pharmacie et comptepharmacie
    const pharmacieData = {
      nom: name,
      nomPharmacie: pharmacyName,
      email,
      telephone: phone,
      matricule,
      password,
    };

    try {
      console.log('Envoi des données à l\'API pharmacie:', pharmacieData); // Log des données avant l'envoi

      // Insérer les données dans la table pharmacie
      const pharmacieResponse = await fetch('http://192.168.209.25:4000/api/pharmacie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pharmacieData),
      });

      if (!pharmacieResponse.ok) {
        const errorData = await pharmacieResponse.json();
        toast.error(`Erreur lors de l'ajout à la pharmacie: ${errorData.error || 'Erreur inconnue'}`, {
          position: 'top-right',
          autoClose: 5000,
        });
        console.log('Erreur lors de l\'ajout à la pharmacie:', errorData); // Log de l'erreur
        setLoading(false);
        setError(true);
        return;
      }

      console.log('Données ajoutées avec succès dans la pharmacie'); // Log du succès

      // Insérer les mêmes données (avec matricule) dans la table comptepharmacie
      const compteData = { ...pharmacieData };

      const compteResponse = await fetch('http://192.168.209.25:4000/api/comptepharmacie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compteData),
      });

      if (!compteResponse.ok) {
        const errorData = await compteResponse.json();
        toast.error(`Erreur lors de l'ajout au compte pharmacie: ${errorData.error || 'Erreur inconnue'}`, {
          position: 'top-right',
          autoClose: 5000,
        });
        console.log('Erreur lors de l\'ajout au compte pharmacie:', errorData); // Log de l'erreur
        setLoading(false);
        setError(true);
        return;
      }

      console.log('Données ajoutées avec succès dans le compte pharmacie'); // Log du succès

      // Ajout des données dans l'API pharmacienom
      const pharmacienomData = {
        matricule: matricule,
        pharmanom: pharmacyName,
      };

      const pharmacienomResponse = await fetch('http://192.168.209.25:4000/api/pharmacienom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pharmacienomData),
      });

      if (!pharmacienomResponse.ok) {
        const errorData = await pharmacienomResponse.json();
        toast.error(`Erreur lors de l'ajout à l'API pharmacienom: ${errorData.error || 'Erreur inconnue'}`, {
          position: 'top-right',
          autoClose: 5000,
        });
        console.log('Erreur lors de l\'ajout à pharmacienom:', errorData); // Log de l'erreur
        setLoading(false);
        setError(true);
        return;
      }

      console.log('Données ajoutées avec succès dans pharmacienom'); // Log du succès

      // Appeler la fonction de notification pour l'admin
      if (onNewPharmacyAdded) {
        console.log('Notifying parent with pharmacy name:', pharmacyName); // Log de notification
        onNewPharmacyAdded(pharmacyName); // Appel de la fonction pour notifier l'ajout de pharmacie
      }

      // Affichage du message de succès et animation de succès
      toast.success('Inscription réussie !', {
        position: 'top-right',
        autoClose: 5000,
      });
      setLoading(false);
      setSuccess(true);

      // Rediriger vers la page de login après un délai pour laisser l'animation se jouer
      setTimeout(() => {
        navigate('/login');
      }, 2000);  // Attendre 2 secondes avant la redirection

    } catch (error) {
      toast.error('Une erreur est survenue, veuillez réessayer.', {
        position: 'top-right',
        autoClose: 5000,
      });
      console.log('Erreur générale lors de l\'inscription:', error); // Log d'erreur générale
      setLoading(false);
      setError(true);
    }
  };

  // Fonction de gestion du changement de mot de passe
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Vérification de la validité du mot de passe
    const lengthValid = value.length >= 8;
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (lengthValid && hasNumber && hasSpecialChar) {
      setIsPasswordValid(true);
      if (value.length >= 12) {
        setPasswordStrength('Perfect');
      } else if (value.length >= 10) {
        setPasswordStrength('Excellent');
      } else {
        setPasswordStrength('Good');
      }
    } else {
      setIsPasswordValid(false);
      setPasswordStrength('');
    }
  };

  return (
    <div className="registration-page">
      <ToastContainer />
      <div className="registration-container">
        {(loading || success || error) && (
          <div className="lottie-animation-container">
            {loading && <img src="path/to/your/loading-image.gif" alt="Chargement..." />}
            {success && <img src="path/to/your/success-image.gif" alt="Succès" />}
            {error && <img src="path/to/your/error-image.gif" alt="Erreur" />}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <h2>Créer un compte pharmacien</h2>
          <div>
            <label>Nom :</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              required
            />
          </div>
          <div>
            <label>Nom de votre Pharmacie :</label>
            <input
              type="text"
              value={pharmacyName}
              onChange={(e) => setPharmacyName(e.target.value)}
              placeholder="Nom de la pharmacie"
              required
            />
          </div>
          <div>
            <label>Email :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse e-mail"
              required
            />
          </div>
          <div>
            <label>Téléphone :</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Votre numéro de téléphone"
              required
            />
            {phoneError && <p className="error-message">{phoneError}</p>}
          </div>
          <div>
            <label>Mot de passe :</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Votre mot de passe"
              required
            />
            <div>
              {password && (
                <p className={isPasswordValid ? 'valid' : 'invalid'}>
                  {passwordStrength ? `Password Strength: ${passwordStrength}` : 'Le mot de passe doit comporter au moins 8 caractères, inclure un chiffre et un caractère spécial.'}
                </p>
              )}
            </div>
          </div>
          <div>
            <label>Confirmer le mot de passe :</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmez votre mot de passe"
              required
            />
          </div>
          <div>
            <label>Matricule :</label>
            <input
              type="text"
              value={matricule}
              readOnly
            />
          </div>
          <button type="submit">Créer un compte</button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
