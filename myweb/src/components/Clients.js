import React, { useState, useEffect } from 'react';
import '../App.css';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [pharmacies, setPharmacies] = useState([]); // Etat pour les pharmacies
  const [utilisateurs, setUtilisateurs] = useState([]); // Etat pour les utilisateurs
  const [errorMessage, setErrorMessage] = useState(null);

  // Récupérer les clients depuis l'API comptepharmacie
  const fetchClients = async () => {
    try {
      console.log('Début de la récupération des clients depuis l\'API...');
      const response = await fetch('http://192.168.209.25:4000/api/comptepharmacie');
      console.log('Réponse API pour les clients reçue :', response);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Données des clients reçues:', data);
      setClients(data);  // Mettre à jour l'état des clients
    } catch (error) {
      console.error('Erreur lors de la récupération des données des clients:', error);
      setErrorMessage('Impossible de récupérer les données des clients. Veuillez réessayer.');
    }
  };

  // Récupérer les pharmacies depuis l'API pharmacie
  const fetchPharmacies = async () => {
    try {
      console.log('Début de la récupération des pharmacies depuis l\'API...');
      const response = await fetch('http://192.168.209.25:4000/api/pharmacie');
      console.log('Réponse API pour les pharmacies reçue :', response);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Données des pharmacies reçues:', data);

      if (data.success && Array.isArray(data.pharmacies)) {
        setPharmacies(data.pharmacies);  // Mettre à jour l'état des pharmacies
      } else {
        console.error('Données des pharmacies mal formatées :', data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données des pharmacies:', error);
      setErrorMessage('Impossible de récupérer les données des pharmacies. Veuillez réessayer.');
    }
  };

  // Récupérer les utilisateurs depuis l'API utilisateur
  const fetchUtilisateurs = async () => {
    try {
      console.log('Début de la récupération des utilisateurs depuis l\'API...');
      const response = await fetch('http://192.168.209.25:4000/api/utilisateur');
      console.log('Réponse API pour les utilisateurs reçue :', response);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Données des utilisateurs reçues:', data);
      
      // Simuler le statut en ligne pour l'utilisateur Katakuri (matricule 483389)
      const updatedUtilisateurs = data.map(utilisateur => ({
        ...utilisateur,
        isOnline: utilisateur.matricule === "483389" // Mettre en ligne Katakuri
      }));
      
      setUtilisateurs(updatedUtilisateurs);  // Mettre à jour l'état des utilisateurs
    } catch (error) {
      console.error('Erreur lors de la récupération des données des utilisateurs:', error);
      setErrorMessage('Impossible de récupérer les données des utilisateurs. Veuillez réessayer.');
    }
  };

  // Utiliser useEffect pour charger les données des clients, pharmacies et utilisateurs
  useEffect(() => {
    console.log('Appel de fetchClients, fetchPharmacies et fetchUtilisateurs au montage...');
    fetchClients();
    fetchPharmacies();
    fetchUtilisateurs();
  }, []);

  // Fonction pour déterminer la classe de statut (vert ou rouge)
  const getStatusClass = (isOnline) => {
    return isOnline ? 'online' : 'offline';  // "online" pour vert, "offline" pour rouge
  };

  return (
    <div className="clients">
      {/* Afficher le message d'erreur s'il y en a un */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Date de naissance</th>
            <th>Matricule</th>
            <th>Nom Pharmacie</th>
            <th>Téléphone Pharmacie</th>
            <th>Statut</th> {/* Déplacer "Statut" à la fin */}
          </tr>
        </thead>
        <tbody>
          {/* Afficher les clients avec leurs pharmacies correspondantes */}
          {clients.map(client => {
            const pharmacy = pharmacies.find(pharmacy => pharmacy.matricule === client.matricule);
            return (
              <tr key={client.matricule}>
                <td>{client.nomPharmacie || 'N/A'}</td>
                <td>{client.adresse || 'N/A'}</td>
                <td>{client.telephone || 'N/A'}</td>
                <td>{client.email || 'N/A'}</td>
                <td>{client.dateNaissance || 'N/A'}</td>
                <td>{client.matricule || 'N/A'}</td>
                <td>{pharmacy?.nomPharmacie || 'N/A'}</td>
                <td>{pharmacy?.telephone || 'N/A'}</td>
                <td className={getStatusClass(client.isOnline)}>{client.isOnline ? 'En ligne' : 'Hors ligne'}</td>
              </tr>
            );
          })}
          
          {/* Afficher les utilisateurs (matricules différents) */}
          {utilisateurs.map(utilisateur => (
            <tr key={utilisateur.matricule}>
              <td>{utilisateur.nom || 'N/A'}</td>
              <td>{utilisateur.adresse || 'N/A'}</td>
              <td>{utilisateur.telephone || 'N/A'}</td>
              <td>{utilisateur.email || 'N/A'}</td>
              <td>{utilisateur.datenaissance || 'N/A'}</td>
              <td>{utilisateur.matricule || 'N/A'}</td>
              <td>N/A</td> {/* Pas de pharmacie pour les utilisateurs */}
              <td>N/A</td> {/* Pas de pharmacie pour les utilisateurs */}
              <td className={getStatusClass(utilisateur.isOnline)}>{utilisateur.isOnline ? 'En ligne' : 'Hors ligne'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Clients;
