const Commande = require('../models/commande');
const Pharmacie = require('../models/pharmacie');  // Assurez-vous d'importer le modèle de pharmacie si nécessaire

// Middleware pour vérifier que le matricule de la pharmacie est valide
exports.validatePharmacyMatricule = async (req, res, next) => {
    const { matricule } = req.body;

    console.log('Vérification du matricule de la pharmacie:', matricule);

    // Rechercher la pharmacie dans la base de données avec le matricule
    const pharmacie = await Pharmacie.findOne({ where: { matricule } });

    if (!pharmacie) {
        console.error('Aucune pharmacie trouvée avec le matricule:', matricule);
        return res.status(404).json({ error: 'Pharmacie non trouvée avec ce matricule.' });
    }

    // Si la pharmacie existe, ajouter à la session ou continuer
    console.log('Pharmacie trouvée:', pharmacie);
    
    // Attacher la pharmacie à l'objet req pour le traitement suivant
    req.pharmacie = pharmacie;

    // Passer au middleware suivant
    next();
};

// POST - Créer une commande
exports.createCommande = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const { clientName, address, pharmacyMatricule, prescriptionImage, totalAmount, products, matricule, telephone, pharmacyName } = req.body;

        // Vérification de la présence des champs obligatoires, incluant pharmacyName
        if (!clientName || !address || !pharmacyMatricule || !products || !matricule || !telephone || !pharmacyName) {
            console.error('Erreur: Champs manquants', { clientName, address, pharmacyMatricule, products, matricule, telephone, pharmacyName });
            return res.status(400).json({ error: 'Tous les champs doivent être remplis (clientName, address, pharmacyMatricule, products, matricule, telephone, pharmacyName)' });
        }

        // Logique de gestion de la pharmacie : Vérification du matricule de la pharmacie
        console.log('Vérification du matricule de la pharmacie sélectionnée:', pharmacyMatricule);

        // Vérifier que le matricule de la pharmacie correspond à un compte valide dans la base de données
        const pharmacieExist = await Pharmacie.findOne({ where: { matricule: pharmacyMatricule } });

        if (!pharmacieExist) {
            console.error('Erreur: Pharmacie non trouvée avec le matricule:', pharmacyMatricule);
            return res.status(404).json({ error: 'Pharmacie non trouvée avec ce matricule' });
        }

        // Si la pharmacie existe, on prépare les données de la commande
        const orderData = {
            clientName,         // Nom du client
            address,            // Adresse du client
            pharmacyMatricule,  // Matricule de la pharmacie sélectionnée
            pharmacyName,       // Nom de la pharmacie ajouté
            prescriptionImage,  // Image de prescription (optionnelle)
            products,           // Produits en format JSON (id, nom, quantité)
            matricule,          // Matricule du client
            telephone,          // Téléphone du client
            date: new Date(),   // Date actuelle
            totalAmount: totalAmount || null,  // Si totalAmount est vide, on met null
        };

        // Log des données avant création de la commande
        console.log('Données de la commande avant insertion:', orderData);

        // Créer la commande dans la base de données
        try {
            const newCommande = await Commande.create(orderData);

            console.log('Commande créée avec succès:', newCommande);

            // Ajout du message pour le client et la pharmacie
            console.log(`La commande a bien été reçue par ${pharmacyName} de la part de ${clientName} avec succès !`);

            // Retourner la commande nouvellement créée avec un message de succès
            res.status(201).json({
                message: `La commande a bien été reçue par ${pharmacyName} de la part de ${clientName} avec succès !`,
                commande: newCommande
            });
        } catch (dbError) {
            console.error('Erreur de base de données lors de la création de la commande:', dbError);

            // Gestion des erreurs de base de données (validation, contrainte unique, etc.)
            if (dbError.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: 'Erreur de validation des données : ' + dbError.errors.map(e => e.message).join(', ') });
            } else if (dbError.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'Erreur de contrainte unique : ' + dbError.message });
            }

            // Autres erreurs générales de base de données
            return res.status(500).json({ error: 'Erreur lors de l\'enregistrement dans la base de données: ' + dbError.message });
        }
    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error.message);
        res.status(400).json({ error: error.message });
    }
};


// GET - Récupérer une commande par matricule (celle de la pharmacie)
exports.getCommandeByMatricule = async (req, res) => {
    try {
        const { matricule } = req.params;  // Matricule de la pharmacie qui effectue la demande
        console.log('Recherche de la commande pour la pharmacie avec matricule:', matricule);

        // Chercher une commande en fonction du matricule de la pharmacie
        const commande = await Commande.findOne({ where: { pharmacyMatricule: matricule } });

        if (!commande) {
            console.error('Commande non trouvée pour la pharmacie avec matricule:', matricule);
            return res.status(404).json({ error: 'Commande non trouvée pour cette pharmacie' });
        }

        // Log des données de la commande récupérée (détaillées pour chaque champ)
        console.log('Commande récupérée pour le matricule:', matricule);
        console.log('Données de la commande:', {
            idC: commande.id,
            clientName: commande.clientName,
            address: commande.address,
            date: commande.date,
            matricule: commande.matricule,
            pharmacyMatricule: commande.pharmacyMatricule,
            pharmacyName: commande.pharmacyName,
            prescriptionImage: commande.prescriptionImage,
            products: JSON.parse(commande.products), // assuming products are stored as a JSON string
            telephone: commande.telephone,
            totalAmount: commande.totalAmount
        });

        // Retourner la commande récupérée
        res.status(200).json(commande);
    } catch (error) {
        console.error('Erreur lors de la récupération de la commande par matricule:', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération de la commande: ' + error.message });
    }
};



// GET - Récupérer toutes les commandes
exports.getAllCommandes = async (req, res) => {
    try {
        console.log('Récupération de toutes les commandes');

        const commandes = await Commande.findAll();

        if (commandes.length === 0) {
            console.error('Aucune commande trouvée');
            return res.status(404).json({ error: 'Aucune commande trouvée' });
        }

        console.log('Commandes récupérées:', commandes);
        res.status(200).json(commandes);
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes: ' + error.message });
    }
};

// PUT - Mettre à jour une commande
exports.updateCommande = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Tentative de mise à jour de la commande avec ID:', id);

        const { clientName, address, pharmacyMatricule, prescriptionImage, totalAmount, products, matricule, telephone, pharmacyName } = req.body;

        const commande = await Commande.findByPk(id);

        if (!commande) {
            console.error('Commande non trouvée pour l\'ID:', id);
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        // Mettre à jour les champs de la commande
        commande.clientName = clientName || commande.clientName;
        commande.address = address || commande.address;
        commande.pharmacyMatricule = pharmacyMatricule || commande.pharmacyMatricule;
        commande.pharmacyName = pharmacyName || commande.pharmacyName;  // Mise à jour de pharmacyName
        commande.prescriptionImage = prescriptionImage || commande.prescriptionImage;
        commande.totalAmount = totalAmount || commande.totalAmount;
        commande.products = products || commande.products;
        commande.matricule = matricule || commande.matricule;
        commande.telephone = telephone || commande.telephone;  // Mise à jour du téléphone

        // Sauvegarder la commande mise à jour
        await commande.save();

        console.log('Commande mise à jour avec succès:', commande);
        res.status(200).json(commande);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la commande:', error.message);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la commande: ' + error.message });
    }
};

// DELETE - Supprimer une commande
exports.deleteCommande = async (req, res) => {
    try {
        const { matricule } = req.params;

        // Vérifiez que le matricule est défini
        if (!matricule) {
            console.error('Matricule manquant dans la requête');
            return res.status(400).json({ error: 'Matricule est requis pour supprimer une commande' });
        }

        console.log('Tentative de suppression de la commande avec matricule:', matricule);

        // Recherchez la commande par matricule
        const commande = await Commande.findOne({ where: { matricule } });

        if (!commande) {
            console.error('Commande non trouvée pour le matricule:', matricule);
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        // Supprimez la commande
        await commande.destroy();
        console.log('Commande supprimée avec succès:', matricule);
        res.status(204).send();
    } catch (error) {
        console.error('Erreur lors de la suppression de la commande:', error.message);
        res.status(500).json({ error: 'Erreur lors de la suppression de la commande: ' + error.message });
    }
};
