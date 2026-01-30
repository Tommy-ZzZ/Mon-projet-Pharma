const express = require('express');
const router = express.Router();
const pharmacieController = require('../controllers/pharmacieController'); 

// Routes existantes
router.post('/', pharmacieController.createPharmacie);
router.get('/', pharmacieController.getAllPharmacie);
router.put('/:id', pharmacieController.updatePharmacie);
router.delete('/:id', pharmacieController.deletePharmacie);  
router.get('/:id', pharmacieController.getPharmacieById);

router.get('/matricule/:matricule', pharmacieController.getPharmacieByMatricule);
router.get('/matricule', pharmacieController.getAllPharmaciesByMatricule);

module.exports = router;
