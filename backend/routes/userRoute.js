const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/userController');

router.post('/', utilisateurController.signupUser );
router.post('/login', utilisateurController.loginUser );

module.exports = router;
