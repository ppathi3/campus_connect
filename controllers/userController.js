const model = require('../models/user');
const Event = require('../models/event');
const rsvpModel = require('../models/rsvp');

// GET /login: renders sign up page to the user
exports.login = (req, res) => {
    res.render('./user/login');
};

exports.authenticate = (req, res) => {
        // To avoid caching in the browser, we set these HTTP headers in order to display accurate error messages
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
    let email = req.body.email;
    let password = req.body.password;
    if(email){
        email = email.toLowerCase();
    }
    //get the user that matches the email
    model.findOne({ email: email })
        .then(user => {
            if (user) {
                //user is found in db
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            console.log('user', user);
                            req.session.user = user._id; //store user's id in the session
                            req.session.userName = user.lastName || null; //store username in the session
                            req.flash('success', 'Logged in successfully');
                            res.redirect('/');
                        } else {
                            req.flash('error', 'Wrong password');
                            res.redirect('/users/login');
                        }
                    })
            } else {
                req.flash('error', 'Wrong email address');
                res.redirect('/users/login')
            }
        })
        .catch(err => next(err));
}

// GET /signup: renders sign up page to the user
exports.signup = (req, res) => {
    res.render('./user/signup');
};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([model.findById(id), Event.find({ host: id }), rsvpModel.find({ userId: id }).populate('eventId')])
        .then(result => {
            const [user, events, rsvps] = result;

        // Map RSVPs to include event title
        const rsvpEvents = rsvps.map(rsvp => {
            return {
                id: rsvp.eventId._id,
                title: rsvp.eventId.title, // Access event title from populated event
                status: rsvp.status
            };
        });

            res.render('./user/profile', { user, events, rsvpEvents })
        })
        .catch(err => next(err));
}

// GET /addUser: renders sign up page to the user
exports.add = (req, res, next) => {
    // To avoid caching in the browser, we set these HTTP headers in order to display accurate error messages
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
        //get the user that matches the email
        model.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                req.flash('error', 'Email address already exists');
                return res.redirect('/users/signup');
            }else{
                console.log("req", req.body);
                let user = new model(req.body);
                if(user.email){
                    user.email = user.email.toLowerCase();
                }
                user.save()
                    .then(() =>{
                        req.flash('success', 'Account created successfully, Please login using your credentials');
                        res.redirect('/users/login');
                    })
                    .catch(err => {
                        if (err.name === 'ValidationError') {
                            req.flash('error', err.message);
                            return res.redirect('/users/signup');
                        }
                        next(err);
                    });
            }})
        .catch(err => next(err));

};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err)
            return next(err);
        else
            res.redirect('/');
    })
}