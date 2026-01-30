import React, { useState, useEffect, useCallback } from 'react';
import { Typography, List, Button, Box, Container } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PharmacyOrders = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const API_URL = 'http://192.168.209.25:4000/api/pharmacienom';

  // Récupérer les pharmacies depuis l'API
  const fetchPharmacies = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (response.ok) {
        setPharmacies(data);
      } else {
        console.error('Erreur lors de la récupération des pharmacies');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des pharmacies', error);
    }
  }, []);

  // Supprimer une pharmacie côté serveur (en utilisant le matricule)
  const handleDeletePharmacy = async (matricule) => {
    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer la pharmacie avec le matricule ${matricule} ?`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/matricule/${matricule}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Supprimer la pharmacie localement
        setPharmacies(pharmacies.filter(pharmacy => pharmacy.matricule !== matricule));
        alert(`Pharmacie avec le matricule ${matricule} supprimée avec succès.`);
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de la suppression de la pharmacie:', errorData);
        alert(`Erreur lors de la suppression de la pharmacie: ${errorData.message || 'Problème inconnu'}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la pharmacie', error);
      alert('Erreur lors de la suppression de la pharmacie, veuillez réessayer plus tard.');
    }
  };

  // Utilisation de useEffect pour charger les pharmacies lors du premier rendu
  useEffect(() => {
    fetchPharmacies();
  }, [fetchPharmacies]);

  return (
    <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
      <Typography variant="h4" gutterBottom align="center">
        Gestion des Pharmacies
      </Typography>

      <Typography variant="h5" gutterBottom align="center">
        Liste des Pharmacies
      </Typography>

      <List className="pharmacy-list">
        {(pharmacies ?? []).map((pharmacy, index) => (
          <Box
            key={index}
            className="pharmacy-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px',
              backgroundColor: '#f9f9f9',
              marginBottom: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
            }}
          >
            {/* Informations de la pharmacie */}
            <div className="pharmacy-info" style={{ flex: 1 }}>
              {/* Nom et matricule affichés sur des lignes distinctes */}
              <Typography
                variant="body1"
                style={{
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '5px',
                }}
              >
                Nom du pharmacie : {pharmacy.pharmanom || 'Non spécifié'}
              </Typography>
              <Typography
                variant="body2"
                style={{
                  fontWeight: 'normal',
                  color: '#666',
                }}
              >
                Matricule : {pharmacy.matricule || 'Non spécifié'}
              </Typography>
            </div>

            {/* Bouton de suppression réduit */}
            <Button
              onClick={() => handleDeletePharmacy(pharmacy.matricule)}
              className="delete-button"
              variant="contained"
              color="secondary"
              style={{
                minWidth: '32px', // Taille réduite
                height: '32px',   // Taille réduite
                padding: '5px',
                marginLeft: '10px', // Espacement par rapport aux informations
              }}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          </Box>
        ))}
      </List>
    </Container>
  );
};

export default PharmacyOrders;
