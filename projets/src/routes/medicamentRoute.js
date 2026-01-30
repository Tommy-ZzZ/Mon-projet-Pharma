const express = require('express');
const router = express.Router();
const medicamentController = require('../controllers/medicamentController'); 


router.post('/', medicamentController.createMedicament);
router.get('/', medicamentController.getAllMedicament);
router.put('/:id', medicamentController.updateMedicament);
router.delete('/:id', medicamentController.deleteMedicament);  


module.exports = router; 
