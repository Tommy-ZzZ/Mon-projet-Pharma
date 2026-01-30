const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/', userController.getAllUser);
router.get('/matricule/:matricule', userController.getUserByMatricule);
router.put('/matricule/:matricule', userController.updateUser);
router.delete('/matricule/:matricule', userController.deleteUser);

module.exports = router;
