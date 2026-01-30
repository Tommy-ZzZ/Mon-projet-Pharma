const CompteClient = require('../models/compteClient');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// Fonction pour valider si un matricule est numérique
function isNumeric(value) {
    return /^\d+$/.test(value);
}

// POST 
exports.createCompteclient = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const { email, motdepasse, telephone, matricule } = req.body;

        if (!email || !motdepasse || !telephone || !matricule) {
            return res.status(400).json({ error: 'Tous les champs doivent être remplis' });
        }

        // Validation de la longueur et du type du matricule
        if (matricule.length !== 6 || !isNumeric(matricule)) {
            return res.status(400).json({ error: 'Le matricule doit contenir exactement 6 chiffres' });
        }

        const existingClient = await CompteClient.findOne({ where: { email } });
        if (existingClient) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(motdepasse, 10);

        const newCompteclient = await CompteClient.create({ email, motdepasse: hashedPassword, telephone, matricule });
        res.status(201).json(newCompteclient);
    } catch (error) {
        console.error('Erreur lors de la création du compte client:', error.message);
        res.status(500).json({ error: 'Erreur lors de la création du compte client' });
    }
};

// POST 
exports.loginCompteclient = async (req, res) => {
    const { identifier, motdepasse } = req.body;

    try {
        // Recherche dans CompteClient par email ou téléphone
        const client = await CompteClient.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { telephone: identifier }
                ]
            }
        });

        if (!client) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const isPasswordValid = await bcrypt.compare(motdepasse, client.motdepasse);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Stocker le matricule dans AsyncStorage (à implémenter côté React Native)
        return res.status(200).json({ 
            success: true, 
            message: 'Connexion réussie', 
            matricule: client.matricule // Matricule renvoyé pour stockage côté client
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

// GET 
exports.getAllCompteClients = async (req, res) => {
    try {
        const comptesclients = await CompteClient.findAll({
            attributes: ['id', 'email', 'telephone', 'matricule'] // Inclure le matricule dans la réponse
        });
        res.status(200).json(comptesclients);
    } catch (error) {
        console.error('Erreur lors de la récupération des comptes clients:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// PUT 
exports.updateCompteclient = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, motdepasse, telephone, matricule } = req.body;

        const compteclient = await CompteClient.findByPk(id);

        if (!compteclient) {
            return res.status(404).json({ error: 'Compte client non trouvé' });
        }

        compteclient.email = email !== undefined ? email : compteclient.email;
        compteclient.telephone = telephone !== undefined ? telephone : compteclient.telephone;

        // Validation de la longueur et du type du matricule
        if (matricule !== undefined) {
            if (matricule.length !== 6 || !isNumeric(matricule)) {
                return res.status(400).json({ error: 'Le matricule doit contenir exactement 6 chiffres' });
            }
            compteclient.matricule = matricule;
        }

        if (motdepasse) {
            compteclient.motdepasse = await bcrypt.hash(motdepasse, 10);
        }

        await compteclient.save();

        res.status(200).json(compteclient);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du compte client:', error.message);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du compte client' });
    }
};

// DELETE 
exports.deleteCompteclient = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('Tentative de suppression du compte client avec l\'ID:', id);

        const result = await CompteClient.destroy({
            where: { id }
        });

        if (result === 0) {
            console.log(`Compte client avec l'ID ${id} non trouvé.`);
            return res.status(404).json({ error: 'Compte client non trouvé' });
        }

        console.log(`Compte client avec l'ID ${id} supprimé avec succès.`);
        res.status(200).json({ message: 'Compte client supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du compte client:', error.message);
        res.status(500).json({ error: 'Erreur lors de la suppression du compte client' });
    }
};

// GET 
exports.getCompteclientById = async (req, res) => {
    try {
        const { id } = req.params;
        const compteclient = await CompteClient.findByPk(id, {
            attributes: ['id', 'email', 'telephone', 'matricule'] // Inclure le matricule dans la réponse
        });

        if (!compteclient) {
            return res.status(404).json({ error: 'Compte client non trouvé' });
        }

        res.status(200).json(compteclient);
    } catch (error) {
        console.error('Erreur lors de la récupération du compte client:', error.message);
        res.status(500).json({ error: error.message });
    }
};
