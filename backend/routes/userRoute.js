const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/userController');
// const googleAuthController = require('../controllers/googleAuthController'); // Removed or commented out
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', utilisateurController.signupUser );
router.post('/login', utilisateurController.loginUser );

// Protected route for getting user info
router.get('/me', protect, utilisateurController.getUserInfo);

router.post('/upload-avatar', protect, upload, utilisateurController.updateAvatar);

router.post('/forgot-password', utilisateurController.forgotPassword);
router.post('/check-reset-token', utilisateurController.checkResetToken);
router.post('/reset-password/:token', utilisateurController.resetPassword);
router.post('/resend-forgot-password-email/:mail',utilisateurController.resendForgotPasswordEmail);

// router.post('/google-login', googleAuthController.googleLogin); // Removed

router.get('/clients', utilisateurController.getClients);
router.get('/clients/blocked', utilisateurController.getBlockedClients);
router.get('/clients/archived', utilisateurController.getArchivedClients);
router.get('/clients/all', utilisateurController.getAllClients);
router.put('/clients/:id/block', utilisateurController.blockClient);
router.put('/clients/:id/unblock', utilisateurController.unblockClient);
router.put('/clients/:id/archive', utilisateurController.archiveClient);
router.put('/clients/:id/unarchive', utilisateurController.unarchiveClient);

router.put('/clients/:id', utilisateurController.updateClient);
router.put('/updatepassword/:id', utilisateurController.updatePassword);

module.exports = router;