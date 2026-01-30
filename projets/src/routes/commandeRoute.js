const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');

router.post('/', commandeController.createCommande);
router.get('/', commandeController.getAllCommandes);
router.put('/:id', commandeController.updateCommande);
router.delete('/matricule/:matricule', commandeController.deleteCommande);
router.get('/matricule/:matricule', commandeController.getCommandeByMatricule);

module.exports = router;
