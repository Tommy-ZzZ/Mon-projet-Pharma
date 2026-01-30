const express = require('express');
const router = express.Router();
const compteclientController = require('../controllers/compteclientController'); 

router.post('/login', compteclientController.loginCompteclient); 
router.post('/', compteclientController.createCompteclient);
router.get('/login', compteclientController.getAllCompteClients);
router.get('/', compteclientController.getAllCompteClients);
router.put('/:id', compteclientController.updateCompteclient);
router.delete('/:id', compteclientController.deleteCompteclient);  

module.exports = router;
