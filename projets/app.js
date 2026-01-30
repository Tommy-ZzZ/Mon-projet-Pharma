const express = require('express');
const cors = require('cors'); // Pour gérer CORS
const sequelize = require('./src/config/db');
const dotenv = require('dotenv');

// Modèles
const User = require('./src/models/user');
const Pharmacie = require('./src/models/pharmacie');
const Medicament = require('./src/models/medicament');
const CompteClient = require('./src/models/compteClient');
const DossierPatient = require('./src/models/dossierPatient');
const Notification = require('./src/models/notification');
const Admin = require('./src/models/admin');
const ComptePharmacie = require('./src/models/comptePharmacie');
const PharmacieNom = require('./src/models/pharmacieNom');

// Routes
const userRoutes = require('./src/routes/userRoute');
const pharmacieRoute = require('./src/routes/pharmacieRoute');
const medicamentRoutes = require('./src/routes/medicamentRoute');
const compteClientRoutes = require('./src/routes/compteclientRoute');
const dossierPatientRoutes = require('./src/routes/dossierPatient');
const commandeRoutes = require('./src/routes/commandeRoute');
const notificationRoutes = require('./src/routes/notificationRoute');
const adminRoutes = require('./src/routes/adminRoutes');
const comptePharmacieRoutes = require('./src/routes/comptesPharmacieRoute');
const pharmacieNomRoutes = require('./src/routes/pharmacieNomRoutes');  

const app = express();

//CORS
const corsOptions = {
    origin: [
        'http://192.168.209.25:3000',
        'http://192.168.209.25:5000',
        'http://192.168.209.25:3000',
        'http://192.168.209.25:5000',
        'http://localhost:3000',
        'http://localhost:5000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); 
app.use(express.json()); 

//routes
app.use('/api/utilisateur', userRoutes);
app.use('/api/pharmacie', pharmacieRoute);
app.use('/api/medicament', medicamentRoutes);
app.use('/api/compteClient', compteClientRoutes);
app.use('/api/dossierPatient', dossierPatientRoutes);
app.use('/api/commande', commandeRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comptepharmacie', comptePharmacieRoutes);
app.use('/api/pharmacienom', pharmacieNomRoutes);  

// SGBD
sequelize.authenticate()
    .then(() => {
        console.log('Connexion à la base de données PostgreSQL réussie.');
    })
    .catch(err => {
        console.error('Impossible de se connecter à la base de données :', err);
    });

// Synchronisation des modèles avec la base de données
sequelize.sync()
    .then(() => {
        console.log('Les tables ont été synchronisées avec succès.');
    })
    .catch(err => {
        console.error('Erreur lors de la synchronisation des tables :', err);
    });

// Middleware pour la gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Quelque chose s\'est mal passé !' });
});

// Route non trouvée
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Le serveur fonctionne sur le port ${PORT}`);
});

module.exports = sequelize;
