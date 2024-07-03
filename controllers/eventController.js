// User specific site/ Event specific navigation controller
const model = require('../models/event');
const rsvpModel = require('../models/rsvp');
const eventHelpers = require('../helpers/event.helpers')
const { DateTime } = require("luxon");

// GET /events: sends all the events to the user
exports.index = (req, res, next) => {
    model.find()
        .then(events => {
            events = eventHelpers.sortEvents(events);
            let categories = eventHelpers.findDistinctEventCategories(events);
            res.render('./event/index', { events, categories });
        })
        .catch(err => next(err));

};

// GET /events/new: send html form for creating a new event
exports.new = (req, res) => {
    res.render('./event/new');
};

// POST /events: create a new event
exports.create = (req, res, next) => {
    let event = new model(req.body);
    console.log("In Create ", req.body);
    event.host = req.session.user;
    console.log("After setting filePath ", req.filePath);
    event.save()
        .then(result => {
            req.flash('success', 'Event created successfully');
            res.redirect('/events')
        })
        .catch(err => {
            console.error("Caught error while creating event", err);
            if (err.name === 'ValidationError') {
                err.status = 400;

            }
            next(err)
        });

};

// GET /events/:id: send details of the event identified by id
exports.show = (req, res, next) => {
    let id = req.params.id;
    // an objectId is a 24-bit Hex String
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }
    model.findById(id).populate('host', 'firstName lastName').lean()
        .then(event => {
            if (event) {
                event.startDate = DateTime.fromJSDate(new Date(event.startDate)).toLocaleString(DateTime.DATETIME_MED);
                event.endDate = DateTime.fromJSDate(new Date(event.endDate)).toLocaleString(DateTime.DATETIME_MED);
                rsvpModel.find({ eventId: id, status: 'YES' })
                    .then(rsvps => {
                        res.render('./event/show', { event, rsvpCount: rsvps.length });
                    })
                    .catch(err => next(err));
            } else {
                let err = new Error('Cannot find an event with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err))

};

// GET /events/:id/edit: send html form for editing the event identified by id
exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id).populate('host', 'firstName lastName').lean()
        .then(event => {
            // Parse the start and end date and convert it to the required format
            const parsedStartDate = DateTime.fromJSDate(new Date(event.startDate));
            const parsedEndDate = DateTime.fromJSDate(new Date(event.endDate));
            if (parsedEndDate.isValid && parsedStartDate.isValid) {
                event.startDate = parsedStartDate.toFormat("yyyy-MM-dd'T'HH:mm");
                event.endDate = parsedEndDate.toFormat("yyyy-MM-dd'T'HH:mm");
                console.log("Edit, req.body", event);
                res.render('./event/edit', { event });
            }
        })
        .catch(err => next(err))
};

// PUT /events/:id: update the event identified by id
exports.update = (req, res, next) => {
    let event = req.body;
    console.log("In Update ", event);
    let id = req.params.id;
    event.image = req.filePath || event.image;
    model.findByIdAndUpdate(id, event, { useFindAndModify: false, runValidators: true })
        .then(event => {
            req.flash('success', 'Event updated successfully');
            res.redirect('/events/' + id);
        })
        .catch(err => {
            if (err.name === 'ValidationError')
                err.status = 400;
            next(err)
        });
};

// DELETE /events/:id: delete the event identified by id
exports.delete = (req, res, next) => {
    let id = req.params.id;
    model.findByIdAndDelete(id, { useFindAndModify: false })
        .then(event => {
            rsvpModel.deleteMany({ eventId: id }) // Delete all RSVPs associated with the event
                .then(() => {
                    req.flash('success', 'Event and all its associated RSVPs have been deleted successfully');
                    res.redirect('/events');
                })
        })
        .catch(err => next(err));
};

// POST /events/:id/rsvp: creates/updates rsvp for an event identified by id
exports.updateRsvp = (req, res, next) => {
    // To avoid caching in the browser, we set these HTTP headers in order to display accurate error messages
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    let eventId = req.params.id;
    let userId = req.session.user;
    let status = req.body.status;
    console.log(req.body.status);
    rsvpModel.findOneAndUpdate(
        { eventId, userId }, // Find RSVP by eventId and userId
        { eventId, userId, status },
        { upsert: true, new: true } // Option to insert new if not found and return updated document
    )
        .then(rsvp => {
            req.flash('success', 'RSVP updated for the event successfully');
            res.redirect('/users/profile/');
        })
        .catch(err => next(err));
};