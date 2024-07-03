const express = require('express');
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middleware/auth');
const { logInLimiter } = require('../middleware/rateLimiters');
const { validateLogin, validateSignup, validateResult } = require('../middleware/validator');

const router = express.Router();

// GET /: renders log in page to the user
router.get('/login', isGuest, controller.login)
// POST /: authenticate user log in request
router.post('/login', logInLimiter, isGuest, validateLogin, validateResult, controller.authenticate)

// GET /: renders sign up page to the user
router.get('/signup', isGuest, controller.signup)

router.post('/add', isGuest, validateSignup, validateResult, controller.add)

router.get('/profile', isLoggedIn, controller.profile)

router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;