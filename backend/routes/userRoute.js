const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/userController');

router.post('/', utilisateurController.signupUser );
router.post('/login', utilisateurController.loginUser );

router.post('/forgot-password', utilisateurController.forgotPassword);
router.post('/check-reset-token', utilisateurController.checkResetToken);
router.post('/reset-password/:token', utilisateurController.resetPassword);
router.post('/resend-forgot-password-email/:mail',utilisateurController.resendForgotPasswordEmail);

module.exports = router;
