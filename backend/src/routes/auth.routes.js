const express           = require('express');
const { signup, signin, profile } = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/signup',  signup);
router.post('/signin',  signin);
router.get('/profile',  authenticateToken, profile);

module.exports = router;
