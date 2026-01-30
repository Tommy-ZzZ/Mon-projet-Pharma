const User = require('../models/user');
const CompteClient = require('../models/compteClient');
const bcrypt = require('bcrypt');

// POST pour créer un utilisateur
exports.createUser = async (req, res) => {
    try {
        console.log('Corps de la requête:', req.body);

        const { nom, prenom, adresse, telephone, email, datenaissance, motdepasse, matricule } = req.body;

        // Vérification des champs requis
        if (!nom || !prenom || !adresse || !telephone || !email || !datenaissance || !motdepasse || !matricule) {
            return res.status(400).json({ error: 'Tous les champs doivent être remplis' });
        }

        // Vérification de l'unicité du matricule
        const existingUser = await User.findOne({ where: { matricule } });
        if (existingUser) {
            return res.status(400).json({ error: 'Le matricule est déjà utilisé' });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(motdepasse, 10);

        // Création de l'utilisateur
        const newUser = await User.create({
            nom,
            prenom,
            adresse,
            telephone,
            email,
            datenaissance: new Date(datenaissance), // S'assurer que la date est au bon format
            motdepasse: hashedPassword,
            matricule // Ajout du champ matricule fourni par l'utilisateur
        });

        console.log(`Nouvel utilisateur ajouté: ${newUser.nom} ${newUser.prenom}`);

        // Création d'un compte client
        const newCompteClient = await CompteClient.create({
            email,
            motdepasse: hashedPassword,
            telephone,
            matricule // Passer le matricule ici
        });

        res.status(201).json({ user: newUser, matricule: newUser.matricule });
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error.message);
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
};

// GET tous les utilisateurs
exports.getAllUser = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
};

// GET un utilisateur par ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur par ID:', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
};

// GET un utilisateur par matricule
exports.getUserByMatricule = async (req, res) => {
    try {
        const { matricule } = req.params;
        const user = await User.findOne({ where: { matricule } });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur par matricule:', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
};

// PUT mise à jour d'un utilisateur par matricule
exports.updateUser = async (req, res) => {
    try {
        const { matricule } = req.params; // Récupérer le matricule à partir des paramètres
        const { nom, prenom, adresse, telephone, email, datenaissance, motdepasse } = req.body;

        const user = await User.findOne({ where: { matricule } }); // Recherche par matricule

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Mise à jour des informations de l'utilisateur
        user.nom = nom !== undefined ? nom : user.nom;
        user.prenom = prenom !== undefined ? prenom : user.prenom;
        user.adresse = adresse !== undefined ? adresse : user.adresse;
        user.telephone = telephone !== undefined ? telephone : user.telephone;
        user.email = email !== undefined ? email : user.email;
        user.datenaissance = datenaissance !== undefined ? new Date(datenaissance) : user.datenaissance; // Formater la date

        if (motdepasse) {
            user.motdepasse = await bcrypt.hash(motdepasse, 10);
        }

        await user.save();
        console.log(`Utilisateur mis à jour: ${user.nom} ${user.prenom}`);

        res.status(200).json(user);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error.message);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
};

// DELETE suppression d'un utilisateur
exports.deleteUser = async (req, res) => {
    try {
        const { matricule } = req.params;

        console.log('Tentative de suppression de l\'utilisateur avec le matricule:', matricule);

        const result = await User.destroy({
            where: { matricule }
        });

        if (result === 0) {
            console.log(`Utilisateur avec le matricule ${matricule} non trouvé.`);
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        console.log(`Utilisateur avec le matricule ${matricule} supprimé avec succès.`);
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error.message);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
};
