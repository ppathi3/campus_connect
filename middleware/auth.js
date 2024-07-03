const event = require('../models/event');
const Event = require('../models/event');

// check if user is a guest (not logged in)
exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are already logged in');
        return res.redirect('/users/profile');
    }
}

// check if user us authenticated (logged in)
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'You must be logged in first');
        return res.redirect('/users/login');
    }
}

// check if user is host of the event
exports.isHost = (req, res, next) => {
    let id = req.params.id;
    // an objectId is a 24-bit Hex String
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }
    Event.findById(id)
        .then(event => {
            console.log("In isHost", req.body);
            if (event) {
                if (event.host == req.session.user) {
                    return next();
                } else {
                    let err = new Error('Unauthorized to access this page');
                    err.status = 401;
                    return next(err);
                }
            } else {
                let err = new Error('Cannot find event with id ' + id);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
}

// check if user is not host of the event
exports.isNotHost = (req, res, next) => {
    let id = req.params.id;
    // an objectId is a 24-bit Hex String
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }
    Event.findById(id)
        .then(event => {
            if (event) {
                if (event.host != req.session.user) {
                    return next();
                } else {
                    let err = new Error('Unauthorized to access this page');
                    err.status = 401;
                    return next(err);
                }
            } else {
                let err = new Error('Cannot find event with id ' + id);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
}