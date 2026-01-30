const DossierPatient = require('../models/dossierPatient'); 

// POST 
exports.createdossierPatient = async (req, res) => {
    try {
        console.log('Request body:', req.body);
         
        const { nom, prenom, email, adress, telephone, medicament, historiquecommande } = req.body;

        if (!nom || !prenom || !email || !adress || !telephone || !medicament || !historiquecommande) {
            return res.status(400).json({ error: 'Tous les champs doivent être remplis' });
        }

        const existingClient = await DossierPatient.findOne({ where: { email } });
        if (existingClient) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        const newDossierPatient = await DossierPatient.create({ nom, prenom, email, adress, telephone, medicament, historiquecommande });
        res.status(201).json(newDossierPatient);
    } catch (error) {
        console.error('Erreur lors de la création du dossier patient:', error.message);
        res.status(500).json({ error: 'Erreur lors de la création du dossier patient' });
    }
};

// GET 
exports.getAlldossierPatient = async (req, res) => {
    try {
        const dossierPatients = await DossierPatient.findAll(); 
        res.status(200).json(dossierPatients);
    } catch (error) {
        console.error('Erreur lors de la récupération des dossiers patients:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// PUT 
exports.updateDossierPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom, email, adress, telephone, medicament, historiquecommande } = req.body;

        const dossierPatient = await DossierPatient.findByPk(id); 

        if (!dossierPatient) {
            return res.status(404).json({ error: 'Dossier patient non trouvé' });
        }

        dossierPatient.nom = nom !== undefined ? nom : dossierPatient.nom;
        dossierPatient.prenom = prenom !== undefined ? prenom : dossierPatient.prenom;
        dossierPatient.email = email !== undefined ? email : dossierPatient.email;
        dossierPatient.adress = adress !== undefined ? adress : dossierPatient.adress;
        dossierPatient.telephone = telephone !== undefined ? telephone : dossierPatient.telephone;
        dossierPatient.medicament = medicament !== undefined ? medicament : dossierPatient.medicament;
        dossierPatient.historiquecommande = historiquecommande !== undefined ? historiquecommande : dossierPatient.historiquecommande;

        await dossierPatient.save();

        res.status(200).json(dossierPatient);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du dossier patient:', error.message);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du dossier patient' });
    }
};

// DELETE 
exports.deleteDossierPatient = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('Tentative de suppression du dossier patient avec l\'ID:', id);

        const result = await DossierPatient.destroy({
            where: { id }
        });

        if (result === 0) {
            console.log(`Dossier patient avec l'ID ${id} non trouvé.`);
            return res.status(404).json({ error: 'Dossier patient non trouvé' });
        }

        console.log(`Dossier patient avec l'ID ${id} supprimé avec succès.`);
        res.status(200).json({ message: 'Dossier patient supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du dossier patient:', error.message);
        res.status(500).json({ error: 'Erreur lors de la suppression du dossier patient' });
    }
};

// GET 
exports.getDossierPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const dossierPatient = await DossierPatient.findByPk(id);  

        if (!dossierPatient) {
            return res.status(404).json({ error: 'Dossier patient non trouvé' });  
        }

        res.status(200).json(dossierPatient);  
    } catch (error) {
        console.error('Erreur lors de la récupération du dossier patient:', error.message);
        res.status(500).json({ error: error.message });
    }
};
