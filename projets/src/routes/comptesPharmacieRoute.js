/*const express = require('express');
const router = express.Router();
const comptePharmacieController = require('../controllers/comptePharmacieController');

router.get('/', comptePharmacieController.getAll);
router.get('/:matricule', comptePharmacieController.getByMatricule);
router.post('/', comptePharmacieController.create);
router.put('/:matricule', comptePharmacieController.update);
router.delete('/:matricule', comptePharmacieController.delete);
router.post('/login', comptePharmacieController.login);

module.exports = router;
*/

const express = require('express');
const router = express.Router();
const comptePharmacieController = require('../controllers/comptePharmacieController');

// Route pour la connexion du pharmacien
router.post('/login', comptePharmacieController.login);

// Autres routes pour les comptes de pharmacie
router.get('/', comptePharmacieController.getAll);
router.post('/', comptePharmacieController.create);
router.put('/:matricule', comptePharmacieController.update);
router.delete('/:matricule', comptePharmacieController.delete);

module.exports = router;
