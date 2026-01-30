const PharmacieNom = require('../models/pharmacieNom');  // Assurez-vous que le nom du modèle est correct

// Récupérer toutes les pharmacies
exports.getAllPharmacies = async (req, res) => {
    try {
        console.log('Tentative de récupération de toutes les pharmacies...');
        const pharmacies = await PharmacieNom.findAll({
            attributes: ['matricule', 'pharmanom']  // Sélectionner uniquement les champs nécessaires
        });

        if (!pharmacies || pharmacies.length === 0) {
            console.log('Aucune pharmacie trouvée.');
            return res.status(404).json({ message: 'Aucune pharmacie trouvée' });
        }

        console.log(`${pharmacies.length} pharmacies récupérées avec succès.`);
        res.status(200).json(pharmacies);
    } catch (error) {
        console.error('Erreur lors de la récupération des pharmacies:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des pharmacies', error });
    }
};

// Récupérer une pharmacie par son ID
exports.getPharmacieById = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Tentative de récupération de la pharmacie avec l'ID: ${id}`);
        const pharmacie = await PharmacieNom.findByPk(id, {
            attributes: ['matricule', 'pharmanom']  // Sélectionner uniquement les champs nécessaires
        });

        if (!pharmacie) {
            console.log(`Pharmacie avec l'ID ${id} non trouvée.`);
            return res.status(404).json({ message: 'Pharmacie non trouvée' });
        }

        console.log(`Pharmacie avec l'ID ${id} récupérée avec succès.`);
        res.status(200).json(pharmacie);
    } catch (error) {
        console.error(`Erreur lors de la récupération de la pharmacie avec l'ID ${id}:`, error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la pharmacie', error });
    }
};

// Récupérer une pharmacie par son matricule
exports.getPharmacieByMatricule = async (req, res) => {
    const { matricule } = req.params;
    try {
        console.log(`Tentative de récupération de la pharmacie avec le matricule: ${matricule}`);
        const pharmacie = await PharmacieNom.findOne({
            where: { matricule: matricule },
            attributes: ['matricule', 'pharmanom']  // Sélectionner uniquement les champs nécessaires
        });

        if (!pharmacie) {
            console.log(`Pharmacie avec le matricule ${matricule} non trouvée.`);
            return res.status(404).json({ message: 'Pharmacie non trouvée' });
        }

        console.log(`Pharmacie avec le matricule ${matricule} récupérée avec succès.`);
        res.status(200).json(pharmacie);
    } catch (error) {
        console.error(`Erreur lors de la récupération de la pharmacie avec le matricule ${matricule}:`, error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la pharmacie', error });
    }
};

// Créer une nouvelle pharmacie
exports.createPharmacie = async (req, res) => {
    const { matricule, pharmanom } = req.body;

    // Vérification des données
    if (!pharmanom) {
        console.log('Le nom de la pharmacie est obligatoire.');
        return res.status(400).json({ message: 'Nom de la pharmacie est obligatoire' });
    }

    try {
        console.log(`Tentative de création d'une nouvelle pharmacie avec le matricule: ${matricule} et le nom: ${pharmanom}`);
        const newPharmacie = await PharmacieNom.create({
            matricule,
            pharmanom  // Le nom de la pharmacie
        });

        console.log('Pharmacie créée avec succès.');
        res.status(201).json({ message: 'Pharmacie ajoutée avec succès', data: newPharmacie });
    } catch (error) {
        console.error('Erreur lors de la création de la pharmacie:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de la pharmacie', error });
    }
};

// Mettre à jour une pharmacie
exports.updatePharmacie = async (req, res) => {
    const { id } = req.params;
    const { matricule, pharmanom } = req.body;

    try {
        console.log(`Tentative de mise à jour de la pharmacie avec l'ID: ${id}`);
        const pharmacie = await PharmacieNom.findByPk(id);
        if (!pharmacie) {
            console.log(`Pharmacie avec l'ID ${id} non trouvée.`);
            return res.status(404).json({ message: 'Pharmacie non trouvée' });
        }

        // Mise à jour des champs
        if (matricule) pharmacie.matricule = matricule;
        if (pharmanom) pharmacie.pharmanom = pharmanom;

        await pharmacie.save();
        console.log(`Pharmacie avec l'ID ${id} mise à jour avec succès.`);
        res.status(200).json({ message: 'Pharmacie mise à jour avec succès', data: pharmacie });
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de la pharmacie avec l'ID ${id}:`, error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la pharmacie', error });
    }
};

// Supprimer une pharmacie par matricule
exports.deletePharmacie = async (req, res) => {
    const { matricule } = req.params;

    try {
        console.log(`Tentative de suppression de la pharmacie avec le matricule : ${matricule}`);
        // Utilisation du bon nom du modèle
        const pharmacie = await PharmacieNom.findOne({ where: { matricule } });

        if (!pharmacie) {
            console.log(`Pharmacie avec le matricule ${matricule} non trouvée.`);
            return res.status(404).json({ message: 'Pharmacie non trouvée' });
        }

        await pharmacie.destroy();
        console.log(`Pharmacie avec le matricule ${matricule} supprimée avec succès.`);
        res.status(200).json({ message: 'Pharmacie supprimée avec succès' });
    } catch (error) {
        console.error(`Erreur lors de la suppression de la pharmacie avec le matricule ${matricule} :`, error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la pharmacie', error });
    }
};

