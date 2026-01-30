const express = require('express');
const router = express.Router();
const pharmacieNomController = require('../controllers/pharmacieNomController'); // Correction du nom de la constante

// Définition des routes
router.get('/', pharmacieNomController.getAllPharmacies);
router.get('/:id', pharmacieNomController.getPharmacieById);
router.get('/matricule/:matricule', pharmacieNomController.getPharmacieByMatricule); 
router.post('/', pharmacieNomController.createPharmacie);
router.put('/:id', pharmacieNomController.updatePharmacie);
router.delete('/matricule/:matricule', pharmacieNomController.deletePharmacie);


module.exports = router;
