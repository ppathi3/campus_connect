const express = require('express');
const controller = require('../controllers/generalController')

const router = express.Router();

// GET /: renders landing page to the user
router.get('/', controller.index)


// GET /about: renders about page to the user
router.get('/contact', controller.contact)

// GET /contact: renders ccntact page to the user
router.get('/about', controller.about)

module.exports = router;