const express = require('express');
const router = express.Router();
const dossierPatientController = require('../controllers/dossierPatientController'); 

// Routes
router.post('/', dossierPatientController.createdossierPatient);
router.get('/', dossierPatientController.getAlldossierPatient);
router.put('/:id', dossierPatientController.updateDossierPatient); 
router.delete('/:id', dossierPatientController.deleteDossierPatient); 

module.exports = router; 
