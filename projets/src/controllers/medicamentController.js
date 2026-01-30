const Medicament = require('../models/medicament'); 

// POST
exports.createMedicament = async (req, res) => {
    try {
        console.log('Request body:', req.body);
         
        const { nom, posologie, indication, interaction, effetIndesirable, coût } = req.body;

        if (!nom || !posologie || !indication || !interaction || !effetIndesirable || !coût ) {
            return res.status(400).json({ error: 'Tous les champs doivent être remplis' });
        }

        const newMedicament = await Medicament.create({ nom, posologie, indication, interaction, effetIndesirable, coût });
        res.status(201).json(newMedicament);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// GET All Medicaments
exports.getAllMedicament = async (req, res) => {
    try {
        const medicaments = await Medicament.findAll(); 
        res.status(200).json(medicaments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET Medicament by ID
exports.getMedicamentById = async (req, res) => {
    try {
        const { id } = req.params;
        const medicament = await Medicament.findByPk(id);  // Correction : utilisation du modèle Medicament

        if (!medicament) {
            return res.status(404).json({ error: 'Médicament non trouvé' });  
        }

        res.status(200).json(medicament);  
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT
exports.updateMedicament = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, posologie, indication, interaction, effetIndesirable, coût } = req.body;

        const medicament = await Medicament.findByPk(id);

        if (!medicament) {
            return res.status(404).json({ error: 'Médicament non trouvé' });
        }

        // Mise à jour
        medicament.nom = nom !== undefined ? nom : medicament.nom;
        medicament.posologie = posologie !== undefined ? posologie : medicament.posologie;
        medicament.indication = indication !== undefined ? indication : medicament.indication;
        medicament.interaction = interaction !== undefined ? interaction : medicament.interaction;
        medicament.effetIndesirable = effetIndesirable !== undefined ? effetIndesirable : medicament.effetIndesirable;
        medicament.coût = coût !== undefined ? coût : medicament.coût;

        await medicament.save();

        res.status(200).json(medicament);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du médicament :", error.message);
        res.status(400).json({ error: "Erreur lors de la mise à jour du médicament" });
    }
};

// DELETE
exports.deleteMedicament = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('Tentative de suppression du médicament avec l\'ID:', id);

        const result = await Medicament.destroy({
            where: { id }
        });

        if (result === 0) {
            console.log(`Médicament avec l'ID ${id} non trouvé.`);
            return res.status(404).json({ error: 'Médicament non trouvé' });
        }

        console.log(`Médicament avec l'ID ${id} supprimé avec succès.`);
        res.status(200).json({ message: 'Médicament supprimé avec succès' });
    } catch (error) {
        console.error("Erreur lors de la suppression du médicament :", error.message);
        res.status(500).json({ error: "Erreur lors de la suppression du médicament" });
    }
};
