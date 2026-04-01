const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/signin/new_token', authController.refreshToken);

// require a valid access token
router.get('/info', authMiddleware, authController.getInfo);
router.get('/logout', authMiddleware, authController.logout);

module.exports = router;