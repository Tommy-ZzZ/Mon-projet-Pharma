const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const ComptePharmacie = require('../models/comptePharmacie');

const comptePharmacieController = {
    // Récupérer tous les comptes de pharmacie
    getAll: async (req, res) => {
        try {
            console.log(JSON.stringify({
                action: 'Récupération de tous les comptes de pharmacie',
                timestamp: new Date().toISOString(),
            }));
            const comptes = await ComptePharmacie.findAll();
            console.log(JSON.stringify({
                action: 'Comptes récupérés',
                count: comptes.length,
                timestamp: new Date().toISOString(),
            }));
            return res.status(200).json(comptes);
        } catch (error) {
            console.error(JSON.stringify({
                action: 'Erreur lors de la récupération des comptes',
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            }));
            return res.status(500).json({ message: 'Erreur serveur lors de la récupération des comptes' });
        }
    },

    // Récupérer un compte par matricule
    getByMatricule: async (req, res) => {
        const { matricule } = req.params;

        try {
            console.log(JSON.stringify({
                action: 'Recherche d\'un compte par matricule',
                matricule,
                timestamp: new Date().toISOString(),
            }));
            const compte = await ComptePharmacie.findOne({ where: { matricule } });

            if (!compte) {
                console.error(JSON.stringify({
                    action: 'Compte non trouvé',
                    matricule,
                    timestamp: new Date().toISOString(),
                }));
                return res.status(404).json({ message: 'Compte non trouvé' });
            }

            console.log(JSON.stringify({
                action: 'Compte trouvé',
                matricule,
                timestamp: new Date().toISOString(),
            }));
            return res.status(200).json(compte);
        } catch (error) {
            console.error(JSON.stringify({
                action: 'Erreur lors de la récupération du compte',
                message: error.message,
                matricule,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            }));
            return res.status(500).json({ message: 'Erreur serveur lors de la récupération du compte' });
        }
    },

    // Créer un nouveau compte (inscription)
    create: async (req, res) => {
        const { matricule, password, telephone, email, nomPharmacie } = req.body;

        if (!matricule || !password || !telephone || !email || !nomPharmacie) {
            console.error(JSON.stringify({
                action: 'Champs manquants lors de la création du compte',
                matricule,
                email,
                telephone,
                nomPharmacie,
                timestamp: new Date().toISOString(),
            }));
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        try {
            console.log(JSON.stringify({
                action: 'Création d\'un nouveau compte',
                matricule,
                email,
                timestamp: new Date().toISOString(),
            }));

            const hashedPassword = await bcrypt.hash(password, 10);

            // Création du compte avec le matricule
            const newCompte = await ComptePharmacie.create({
                matricule,
                password: hashedPassword,
                telephone,
                email,
                nomPharmacie
            });

            // Log de l'ajout du nouveau compte
            console.log(JSON.stringify({
                action: 'Nouveau compte créé',
                matricule: newCompte.matricule,
                email: newCompte.email,
                nomPharmacie: newCompte.nomPharmacie,
                timestamp: new Date().toISOString(),
            }));

            return res.status(201).json(newCompte);
        } catch (error) {
            console.error(JSON.stringify({
                action: 'Erreur lors de la création du compte',
                message: error.message,
                email,
                telephone,
                nomPharmacie,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            }));
            return res.status(500).json({ message: 'Erreur lors de la création du compte' });
        }
    },

    // Mettre à jour un compte existant
    update: async (req, res) => {
        const { matricule } = req.params;
        const { password, telephone, email, nomPharmacie } = req.body;

        try {
            console.log(JSON.stringify({
                action: 'Mise à jour du compte',
                matricule,
                timestamp: new Date().toISOString(),
            }));
            const compte = await ComptePharmacie.findOne({ where: { matricule } });

            if (!compte) {
                console.error(JSON.stringify({
                    action: 'Compte non trouvé',
                    matricule,
                    timestamp: new Date().toISOString(),
                }));
                return res.status(404).json({ message: 'Compte non trouvé' });
            }

            if (password) {
                compte.password = await bcrypt.hash(password, 10);
            }

            await compte.update({
                telephone,
                email,
                password: compte.password,
                nomPharmacie
            });

            console.log(JSON.stringify({
                action: 'Compte mis à jour',
                matricule,
                timestamp: new Date().toISOString(),
            }));
            return res.status(200).json(compte);
        } catch (error) {
            console.error(JSON.stringify({
                action: 'Erreur lors de la mise à jour du compte',
                message: error.message,
                matricule,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            }));
            return res.status(500).json({ message: 'Erreur lors de la mise à jour du compte' });
        }
    },

    // Supprimer un compte
    delete: async (req, res) => {
        const { matricule } = req.params;

        try {
            console.log(JSON.stringify({
                action: 'Suppression du compte',
                matricule,
                timestamp: new Date().toISOString(),
            }));
            const compte = await ComptePharmacie.findOne({ where: { matricule } });

            if (!compte) {
                console.error(JSON.stringify({
                    action: 'Compte non trouvé',
                    matricule,
                    timestamp: new Date().toISOString(),
                }));
                return res.status(404).json({ message: 'Compte non trouvé' });
            }

            await compte.destroy();
            console.log(JSON.stringify({
                action: 'Compte supprimé',
                matricule,
                timestamp: new Date().toISOString(),
            }));
            return res.status(204).send(); // Pas de contenu
        } catch (error) {
            console.error(JSON.stringify({
                action: 'Erreur lors de la suppression du compte',
                message: error.message,
                matricule,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            }));
            return res.status(500).json({ message: 'Erreur lors de la suppression du compte' });
        }
    },

    // Connexion de l'utilisateur (pharmacien)
    login: async (req, res) => {
        const { emailOrPhone, password } = req.body;

        console.log(JSON.stringify({
            action: 'Tentative de connexion',
            emailOrPhone,
            timestamp: new Date().toISOString(),
        }));

        // Vérification des données reçues
        if (!emailOrPhone || !password) {
            console.error(JSON.stringify({
                action: 'Erreur : Données manquantes',
                emailOrPhone,
                timestamp: new Date().toISOString(),
            }));
            return res.status(400).json({ message: 'Nom d\'utilisateur (email ou téléphone) et mot de passe sont requis' });
        }

        try {
            // Chercher un compte qui correspond à l'email ou au téléphone
            const compte = await ComptePharmacie.findOne({
                where: {
                    [Op.or]: [
                        { email: emailOrPhone },
                        { telephone: emailOrPhone }
                    ]
                }
            });

            if (!compte) {
                // Si aucun compte n'est trouvé
                console.error(JSON.stringify({
                    action: 'Erreur : Compte non trouvé',
                    emailOrPhone,
                    timestamp: new Date().toISOString(),
                }));
                return res.status(404).json({ message: 'Compte non trouvé' });
            }

            // Comparer le mot de passe envoyé avec celui stocké
            const isMatch = await bcrypt.compare(password, compte.password);
            if (!isMatch) {
                // Si le mot de passe ne correspond pas
                console.error(JSON.stringify({
                    action: 'Erreur : Mot de passe incorrect',
                    emailOrPhone,
                    timestamp: new Date().toISOString(),
                }));
                return res.status(401).json({ message: 'Mot de passe incorrect' });
            }

            // Créer un JWT pour maintenir la session
            const token = jwt.sign(
                { 
                    id: compte.id, 
                    matricule: compte.matricule, 
                    email: compte.email, 
                    telephone: compte.telephone, 
                    nomPharmacie: compte.nomPharmacie 
                }, 
                'shirazu-secret-key',  // Utilisez une clé secrète que vous gardez privée
                { expiresIn: '1h' }   // Expiration du token après 1 heure (modifiable)
            );

            // Log de la connexion réussie
            console.log(JSON.stringify({
                action: 'Connexion réussie',
                emailOrPhone,
                user: {
                    matricule: compte.matricule,
                    email: compte.email,
                    telephone: compte.telephone,
                    nomPharmacie: compte.nomPharmacie,
                },
                timestamp: new Date().toISOString(),
            }));

            return res.status(200).json({
                message: 'Connexion réussie',
                token, // Envoie le token JWT au client
                user: {
                    id: compte.id,
                    email: compte.email,
                    telephone: compte.telephone,
                    matricule: compte.matricule,
                    nomPharmacie: compte.nomPharmacie
                }
            });

        } catch (error) {
            console.error(JSON.stringify({
                action: 'Erreur serveur lors de la connexion',
                message: error.message,
                emailOrPhone,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            }));
            return res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
        }
    }
};

module.exports = comptePharmacieController;
