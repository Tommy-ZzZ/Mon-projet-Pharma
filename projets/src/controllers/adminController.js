const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const ComptePharmacie = require('../models/comptePharmacie');  // Assurez-vous que ce modèle existe
const { Op } = require('sequelize');

class AdminController {

    // Méthode pour générer un matricule aléatoire de 5 caractères numériques
    static generateMatricule() {
        const matricule = Math.floor(10000 + Math.random() * 90000); // Génère un matricule numérique de 5 chiffres
        return matricule.toString(); // Retourne le matricule en chaîne de caractères
    }

    // Méthode pour authentifier l'administrateur ou le pharmacien
    static async authenticateAdmin(req, res) {
        try {
            const { emailOrPhone, password } = req.body;

            console.log('Tentative de connexion avec:', { emailOrPhone, password });

            if (!emailOrPhone || !password) {
                console.log('Email/Téléphone et mot de passe sont requis');
                return res.status(400).json({ message: 'Email/Téléphone et mot de passe sont requis' });
            }

            // Recherche de l'administrateur dans la table Admin
            console.log('Recherche dans la table Admin...');
            let admin = await Admin.findOne({
                where: {
                    [Op.or]: [
                        { email: emailOrPhone },
                        { telephone: emailOrPhone }
                    ]
                }
            });

            if (admin) {
                console.log('Administrateur trouvé dans la table Admin:', admin.email);
                
                // Vérification du mot de passe de l'administrateur
                const isPasswordValid = await bcrypt.compare(password, admin.password);
                if (!isPasswordValid) {
                    console.error('Mot de passe incorrect pour l\'administrateur:', emailOrPhone);
                    return res.status(401).json({ message: 'Mot de passe incorrect' });
                }

                // Réponse en cas de succès pour l'administrateur
                console.log('Connexion réussie pour l\'administrateur:', admin.email);
                return res.status(200).json({
                    message: 'Connexion réussie en tant qu\'administrateur',
                    admin: {
                        id: admin.id,
                        email: admin.email,
                        telephone: admin.telephone,
                        matricule: admin.matricule
                    }
                });
            }

            // Si l'administrateur n'est pas trouvé, recherche dans la table ComptePharmacie
            console.log('Administrateur non trouvé dans la table Admin. Recherche dans la table ComptePharmacie...');
            let comptePharmacie = await ComptePharmacie.findOne({
                where: {
                    [Op.or]: [
                        { email: emailOrPhone },
                        { telephone: emailOrPhone }
                    ]
                }
            });

            if (comptePharmacie) {
                console.log('Pharmacien trouvé dans la table ComptePharmacie:', comptePharmacie.email);
                
                // Vérification du mot de passe pour le pharmacien
                const isPasswordValid = await bcrypt.compare(password, comptePharmacie.password);
                if (!isPasswordValid) {
                    console.error('Mot de passe incorrect pour le pharmacien:', emailOrPhone);
                    return res.status(401).json({ message: 'Mot de passe incorrect' });
                }

                // Réponse en cas de succès pour le pharmacien
                console.log('Connexion réussie pour le pharmacien:', comptePharmacie.email);
                return res.status(200).json({
                    message: 'Connexion réussie en tant que pharmacien',
                    pharmacien: {
                        id: comptePharmacie.id,
                        email: comptePharmacie.email,
                        telephone: comptePharmacie.telephone,
                        matricule: comptePharmacie.matricule,
                        nomPharmacie: comptePharmacie.nomPharmacie
                    }
                });
            }

            // Si l'utilisateur n'est pas trouvé dans aucune des deux tables
            console.error('Utilisateur non trouvé dans les tables Admin et ComptePharmacie:', emailOrPhone);
            return res.status(404).json({ message: 'Utilisateur non trouvé dans les tables Admin et ComptePharmacie' });

        } catch (error) {
            console.error('Erreur lors de l\'authentification:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    // Méthode pour récupérer un administrateur par matricule
    static async getAdminByMatricule(req, res) {
        try {
            const { matricule } = req.params;

            console.log('Recherche de l\'administrateur par matricule:', matricule);

            if (!matricule) {
                console.log('Le matricule est requis');
                return res.status(400).json({ message: 'Le matricule est requis' });
            }

            // Recherche de l'administrateur par matricule
            const admin = await Admin.findOne({
                where: { matricule: matricule }
            });

            if (!admin) {
                console.error('Administrateur non trouvé pour ce matricule:', matricule);
                return res.status(404).json({ message: 'Administrateur non trouvé pour ce matricule' });
            }

            console.log('Administrateur trouvé:', admin.email);

            // Réponse avec les données de l'administrateur
            return res.status(200).json({
                message: 'Administrateur trouvé',
                admin: {
                    id: admin.id,
                    email: admin.email,
                    telephone: admin.telephone,
                    matricule: admin.matricule
                }
            });

        } catch (error) {
            console.error('Erreur lors de la récupération de l\'administrateur par matricule:', error);
            return res.status(500).json({ message: 'Erreur serveur', error: error.message });
        }
    }

    // Méthode pour récupérer tous les administrateurs
    static async getAllAdmins(req, res) {
        try {
            console.log('Récupération de tous les administrateurs...');
            const admins = await Admin.findAll();

            if (!admins || admins.length === 0) {
                console.log('Aucun administrateur trouvé');
                return res.status(404).json({ message: 'Aucun administrateur trouvé' });
            }

            console.log('Liste des administrateurs récupérée avec succès.');

            // Réponse avec les données des administrateurs
            return res.status(200).json({
                message: 'Liste des administrateurs',
                admins: admins.map(admin => ({
                    id: admin.id,
                    email: admin.email,
                    telephone: admin.telephone,
                    matricule: admin.matricule
                }))
            });

        } catch (error) {
            console.error('Erreur lors de la récupération des administrateurs:', error.message);
            return res.status(500).json({ message: 'Erreur serveur', error: error.message });
        }
    }

    // Méthode POST pour créer un administrateur avec un matricule généré aléatoirement
    static async createAdmin(req, res) {
        try {
            const { email, password, telephone } = req.body;

            if (!email || !password || !telephone) {
                console.log('Email, mot de passe et téléphone sont requis');
                return res.status(400).json({ message: 'Email, mot de passe et téléphone sont requis' });
            }

            // Vérification si l'administrateur existe déjà avec l'email
            const existingAdmin = await Admin.findOne({ where: { email } });
            if (existingAdmin) {
                console.log('Un administrateur existe déjà avec cet email');
                return res.status(409).json({ message: 'Un administrateur existe déjà avec cet email' });
            }

            // Générer un matricule aléatoire
            const matricule = AdminController.generateMatricule();

            // Hash du mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Créer un nouvel administrateur
            const newAdmin = await Admin.create({
                email,
                password: hashedPassword,
                telephone,
                matricule
            });

            console.log('Administrateur créé avec succès:', newAdmin.email);

            // Réponse avec les informations de l'administrateur créé
            return res.status(201).json({
                message: 'Administrateur créé avec succès',
                admin: {
                    id: newAdmin.id,
                    email: newAdmin.email,
                    telephone: newAdmin.telephone,
                    matricule: newAdmin.matricule
                }
            });

        } catch (error) {
            console.error('Erreur lors de la création de l\'administrateur:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = AdminController;
