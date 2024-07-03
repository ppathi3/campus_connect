const express = require('express');
const controller = require('../controllers/eventController');
const { fileUpload } = require('../middleware/fileUpload');
const {isLoggedIn, isHost, isNotHost} = require('../middleware/auth');
const {validateEvent, validateEditEvent, validateRsvp, validateResult} = require('../middleware/validator');

const router = express.Router();

// GET /events: sends all the events to the user
router.get('/', controller.index)

// GET /events/new: send html form for creating a new event
router.get('/new', isLoggedIn, controller.new)

// POST /events: create a new event
router.post('/', isLoggedIn, fileUpload, validateEvent, validateResult, controller.create)

// GET /events/:id: send details of the event identified by id
router.get('/:id', controller.show)

// POST /events/:id/rsvp: creates/updates rsvp for an event identified by id
router.post('/:id/rsvp', isLoggedIn, isNotHost, validateRsvp, validateResult, controller.updateRsvp)

// GET /events/:id/edit: send html form for editing the event identified by id
router.get('/:id/edit', isLoggedIn, isHost, controller.edit)

// PUT /events/:id: update the event identified by id
router.put('/:id', fileUpload, isLoggedIn, isHost, validateEditEvent, validateResult, controller.update)

// DELETE /events/:id: delete the event identified by id
router.delete('/:id', isLoggedIn, isHost, controller.delete)


module.exports = router;