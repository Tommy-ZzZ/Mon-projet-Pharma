const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

router.post('/create', AdminController.createAdmin);
router.post('/authenticate', AdminController.authenticateAdmin);
router.get('/matricule/:matricule', AdminController.getAdminByMatricule);
router.get('/', AdminController.getAllAdmins);

module.exports = router;
