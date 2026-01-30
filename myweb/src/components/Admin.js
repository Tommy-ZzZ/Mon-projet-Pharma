import React, { useState, useEffect } from 'react';
import '../App.css';
import { FaPlus } from 'react-icons/fa'; // Utilisation de l'icône + avec react-icons

const Admin = () => {
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [matricule, setMatricule] = useState('');
  const [admins, setAdmins] = useState([]); // Liste des administrateurs
  const [showForm, setShowForm] = useState(false); // Contrôler l'affichage du formulaire

  // Générer un matricule automatiquement
  const generateMatricule = () => {
    const newMatricule = Math.floor(Math.random() * 90000) + 10000; // Nombre entre 10000 et 99999
    setMatricule(newMatricule);
  };

  useEffect(() => {
    generateMatricule(); // Générer un matricule au chargement du composant
  }, []);

  // Fonction pour ajouter un nouvel admin à la liste
  const handleSubmit = async (e) => {
    e.preventDefault();

    const adminData = {
      email,
      telephone,
      password,
      matricule,
    };

    try {
      // Envoi des données vers l'API avec fetch
      const response = await fetch('http://192.168.209.25:4000/api/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'admin');
      }

      const data = await response.json();
      console.log('Admin créé avec succès:', data);

      // Ajouter le nouvel admin à la liste
      setAdmins([...admins, adminData]);

      // Réinitialisation du formulaire après envoi (facultatif)
      setEmail('');
      setTelephone('');
      setPassword('');
      generateMatricule(); // Nouveau matricule pour le prochain formulaire

      setShowForm(false); // Masquer le formulaire après soumission
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="admin-container">
      <h1>Panneau d'administration</h1>

      {/* Bouton d'ajout d'un nouvel admin */}
      <button className="add-admin-btn" onClick={() => setShowForm(!showForm)}>
        <FaPlus /> Ajouter un nouvel admin
      </button>

      {/* Formulaire pour ajouter un admin, qui s'affiche ou se cache */}
      {showForm && (
        <div className="form-container">
          <h2>Formulaire de création d'un nouvel administrateur</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Entrez l'email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telephone">Téléphone</label>
              <input
                type="tel"
                id="telephone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                required
                placeholder="Entrez le numéro de téléphone"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Entrez le mot de passe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="matricule">Matricule (automatique)</label>
              <input
                type="text"
                id="matricule"
                value={matricule}
                readOnly
                placeholder="Matricule généré automatiquement"
              />
            </div>

            <button type="submit" className="submit-btn">Ajouter Admin</button>
          </form>
        </div>
      )}

      {/* Tableau des administrateurs */}
      <div className="admins-table">
        <h3>Liste des administrateurs</h3>
        <table>
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Email</th>
              <th>Téléphone</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => (
              <tr key={index}>
                <td>{admin.matricule}</td>
                <td>{admin.email}</td>
                <td>{admin.telephone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
