const Pharmacie = require('../models/pharmacie');
const multer = require('multer');

// Configurer multer pour gérer les fichiers téléchargés
const upload = multer({
    storage: multer.memoryStorage(), // Stockage en mémoire pour traiter le fichier comme un buffer
    limits: { fileSize: 10 * 1024 * 1024 }, // Limiter la taille des fichiers (10MB par exemple)
});

// POST - Créer une pharmacie
exports.createPharmacie = async (req, res) => {
    try {
        console.log('Corps de la requête :', req.body);
        
        const { matricule, nom, nomPharmacie, email, password, telephone } = req.body;
        const photo = req.file ? req.file.buffer : null; // Récupérer la photo en binaire si elle existe

        // Vérification des champs
        console.log('Vérification des champs :');
        console.log('Matricule:', matricule);
        console.log('Nom:', nom);
        console.log('Nom de la pharmacie:', nomPharmacie);
        console.log('Email:', email);
        console.log('Mot de passe:', password ? '*****' : 'Non fourni'); // Masquer le mot de passe
        console.log('Téléphone:', telephone);

        // Vérifier uniquement les champs qui doivent être remplis
        if (!matricule || !nom || !nomPharmacie || !email || !password || !telephone) {
            console.error('Erreur de validation : Tous les champs doivent être remplis.');
            return res.status(400).json({ success: false, error: 'Tous les champs doivent être remplis.' });
        }

        // Vérifier que le matricule est unique
        const existingPharmacie = await Pharmacie.findOne({ where: { matricule } });
        if (existingPharmacie) {
            console.error('Erreur : Le matricule est déjà utilisé.');
            return res.status(400).json({ success: false, error: 'Le matricule est déjà utilisé.' });
        }

        // Créer la pharmacie avec les données fournies
        const newPharmacie = await Pharmacie.create({ 
            matricule,  // Le matricule est maintenant fourni par l'utilisateur
            nom, 
            nomPharmacie, 
            email, 
            password, 
            telephone,
            photo // Ajouter la photo (en binaire) si elle existe
        });

        console.log('Pharmacie ajoutée avec succès :', newPharmacie);
        res.status(201).json({ success: true, pharmacie: newPharmacie });
    } catch (error) {
        console.error('Erreur lors de la création de la pharmacie :', error.message);
        if (error.name === 'SequelizeValidationError') {
            console.error('Erreur de validation :', error.errors);
            return res.status(400).json({ success: false, error: 'Erreur de validation des données' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

// Récupérer toutes les pharmacies
exports.getAllPharmacie = async (req, res) => {
    try {
        const pharmacies = await Pharmacie.findAll(); 
        res.status(200).json({ success: true, pharmacies });
    } catch (error) {
        console.error('Erreur lors de la récupération des pharmacies :', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET par ID
exports.getPharmacieById = async (req, res) => {
    try {
        const { id } = req.params;
        const pharmacie = await Pharmacie.findByPk(id);  

        if (!pharmacie) {
            console.error(`Erreur : Pharmacie avec l'ID ${id} non trouvée.`);
            return res.status(404).json({ success: false, error: 'Pharmacie non trouvée' });  
        }

        res.status(200).json({ success: true, pharmacie });  
    } catch (error) {
        console.error('Erreur lors de la récupération de la pharmacie par ID :', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET par matricule
exports.getPharmacieByMatricule = async (req, res) => {
    const { matricule } = req.params; // Récupérer le matricule depuis les paramètres de la requête
    try {
        const pharmacie = await Pharmacie.findOne({ where: { matricule } });
        if (!pharmacie) {
            console.error(`Erreur : Pharmacie avec le matricule ${matricule} non trouvée.`);
            return res.status(404).json({ success: false, error: 'Pharmacie non trouvée' });
        }
        res.status(200).json({ success: true, pharmacie });
    } catch (error) {
        console.error('Erreur lors de la récupération de la pharmacie par matricule :', error.message);
        res.status(500).json({ success: false, error: 'Erreur lors de la récupération des pharmacies' });
    }
};

// GET toutes les pharmacies par matricule (optionnel)
exports.getAllPharmaciesByMatricule = async (req, res) => {
    const { matricule } = req.query; // Récupérer matricule depuis les paramètres de requête si nécessaire
    try {
        const conditions = matricule ? { where: { matricule } } : {}; // Si un matricule est fourni, ajouter la condition
        const pharmacies = await Pharmacie.findAll(conditions);
        res.status(200).json({ success: true, pharmacies });
    } catch (error) {
        console.error('Erreur lors de la récupération des pharmacies :', error.message);
        res.status(500).json({ success: false, error: 'Erreur lors de la récupération des pharmacies' });
    }
};

// PUT - Mettre à jour une pharmacie
exports.updatePharmacie = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, nomPharmacie, email, password, telephone } = req.body;
        const photo = req.file ? req.file.buffer : null; // Récupérer la photo en binaire si elle existe

        console.log('Mise à jour de la pharmacie avec l\'ID:', id);
        console.log('Champs à mettre à jour :', { nom, nomPharmacie, email, password: password ? '*****' : 'Non fourni', telephone });

        const pharmacie = await Pharmacie.findByPk(id);

        if (!pharmacie) {
            console.error(`Erreur : Pharmacie avec l'ID ${id} non trouvée.`);
            return res.status(404).json({ success: false, error: 'Pharmacie non trouvée' });
        }

        // Mise à jour sans modifier le matricule (l'utilisateur ne doit pas pouvoir changer le matricule)
        await pharmacie.update({
            nom,
            nomPharmacie,
            email,
            password,
            telephone,
            photo // Mettre à jour la photo si elle existe
        });

        console.log('Pharmacie mise à jour avec succès :', pharmacie);
        return res.status(200).json({ success: true, pharmacie });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la pharmacie :', error.message);
        res.status(500).json({ success: false, error: 'Erreur serveur lors de la mise à jour de la pharmacie' });
    }
};

// DELETE - Supprimer une pharmacie
exports.deletePharmacie = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('Tentative de suppression de la pharmacie avec l\'ID :', id);

        const result = await Pharmacie.destroy({
            where: { id }
        });

        if (result === 0) {
            console.error(`Erreur : Pharmacie avec l'ID ${id} non trouvée.`);
            return res.status(404).json({ success: false, error: 'Pharmacie non trouvée' });
        }

        console.log(`Pharmacie avec l'ID ${id} supprimée avec succès.`);
        res.status(200).json({ success: true, message: 'Pharmacie supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la pharmacie :', error.message);
        res.status(500).json({ success: false, error: 'Erreur serveur lors de la suppression de la pharmacie' });
    }
};
