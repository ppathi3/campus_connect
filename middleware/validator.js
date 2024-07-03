const { validationResult } = require('express-validator');
const validator = require('validator');
const { body } = require('express-validator');


exports.validateLogin = [
    body('email')
        .notEmpty().withMessage('Email must not be empty').bail()
        .isEmail().withMessage('Email must be a valid email address').bail()
        .trim().escape().normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password must not be empty').bail()
        .isLength({ min: 8, max: 64 }).withMessage('Password must be between 8 and 64 characters').bail()
        .trim().escape(),
];

exports.validateSignup = [
    body('firstName')
        .notEmpty().withMessage('First name must not be empty').bail()
        .trim().escape(),

    body('lastName')
        .notEmpty().withMessage('Last name must not be empty').bail()
        .trim().escape(),

    body('email')
        .notEmpty().withMessage('Email must not be empty').bail()
        .isEmail().withMessage('Email must be a valid email address').bail()
        .trim().escape().normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password must not be empty').bail()
        .isLength({ min: 8, max: 64 }).withMessage('Password must be between 8 and 64 characters').bail()
        .trim().escape(),
];

// Custom validator function to check entry fee only if eventType is 'paid'
const validateEntryFee = (value, { req }) => {
    if (req.body.eventType === 'Paid') {
        // If eventType is 'paid', require entryFee to be a number
        if (!value) {
            throw new Error('Entry fee must be provided for paid events');
        }
        else if (isNaN(parseFloat(value))) {
            throw new Error('Entry fee must be a number');
        } else if (parseFloat(value) <= 0) {
            throw new Error('Entry fee must be a positive number');
        }

    }
    return true;
};

exports.validateEvent = [
    body('title', 'Title must not be empty').notEmpty().trim().escape(),
    body('description')
        .notEmpty().withMessage('Description must not be empty')
        .bail()
        .isLength({ min: 25 }).withMessage('Description must be at least 25 characters long')
        .trim().escape(),
    body('startDate')
        .notEmpty().withMessage('Start Date must not be empty')
        .bail() // Stop running validations if any of the previous ones have failed
        .custom(value => {
            if (!validator.isISO8601(value)) {
                throw new Error('Start Date must be a valid ISO 8601 date');
            }
            const today = new Date();
            if (new Date(value) <= today) {
                throw new Error('Start Date must be after today\'s date');
            }
            return true;
        })
        .trim().escape(),
    body('endDate')
        .notEmpty().withMessage('End Date must not be empty')
        .bail()
        .custom(value => {
            if (!validator.isISO8601(value)) {
                throw new Error('End Date must be a valid ISO 8601 date');
            }
            return true;
        })
        .bail()
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startDate)) {
                throw new Error('End Date must be after Start Date');
            }
            return true;
        })
        .trim().escape(),
    body('location', 'Location must not be empty').notEmpty().trim().escape(),
    body('category')
        .notEmpty().withMessage('Category must not be empty')
        .bail()
        .isIn([
            'Social Gatherings', 'Academic Workshops', 'Cultural Activities',
            'Sports/Recreation', 'Career Coaching', 'Other'
        ]).withMessage('Category must be one of the options: Social Gatherings, Academic Workshops, Cultural Activities, Sports/Recreation, Career Coaching, Other')
        .trim().escape(),
    body('eventType')
        .notEmpty().withMessage('Event Type must not be empty')
        .bail()
        .isIn(['Paid', 'Free']).withMessage('Event Type must be either Paid or Free')
        .trim().escape(),
    body('entryFee').custom(validateEntryFee).escape(),
    body('image', 'Image path must not be empty').notEmpty().trim(),
];


// Adding a seperate validator for edit event to avoid image upload as a mandatory thing for editing
exports.validateEditEvent = [
    body('title', 'Title must not be empty').notEmpty().trim().escape(),
    body('description')
        .notEmpty().withMessage('Description must not be empty')
        .bail()
        .isLength({ min: 25 }).withMessage('Description must be at least 25 characters long')
        .trim().escape(),
    body('startDate')
        .notEmpty().withMessage('Start Date must not be empty')
        .bail() // Stop running validations if any of the previous ones have failed
        .custom(value => {
            if (!validator.isISO8601(value)) {
                throw new Error('Start Date must be a valid ISO 8601 date');
            }
            const today = new Date();
            if (new Date(value) <= today) {
                throw new Error('Start Date must be after today\'s date');
            }
            return true;
        })
        .trim().escape(),
    body('endDate')
        .notEmpty().withMessage('End Date must not be empty')
        .bail()
        .custom(value => {
            if (!validator.isISO8601(value)) {
                throw new Error('End Date must be a valid ISO 8601 date');
            }
            return true;
        })
        .bail()
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startDate)) {
                throw new Error('End Date must be after Start Date');
            }
            return true;
        })
        .trim().escape(),
    body('location', 'Location must not be empty').notEmpty().trim().escape(),
    body('category')
        .notEmpty().withMessage('Category must not be empty')
        .bail()
        .isIn([
            'Social Gatherings', 'Academic Workshops', 'Cultural Activities',
            'Sports/Recreation', 'Career Coaching', 'Other'
        ]).withMessage('Category must be one of the options: Social Gatherings, Academic Workshops, Cultural Activities, Sports/Recreation, Career Coaching, Other')
        .trim().escape(),
    body('eventType')
        .notEmpty().withMessage('Event Type must not be empty')
        .bail()
        .isIn(['Paid', 'Free']).withMessage('Event Type must be either Paid or Free')
        .trim().escape(),
    body('entryFee').custom(validateEntryFee).escape(),
];

exports.validateRsvp = [
    body('status')
    .notEmpty().withMessage('Status must not be empty')
    .bail()
    .isIn(['YES', 'NO', 'MAYBE']).withMessage('Status must be one of these three options: YES, NO, MAYBE')
    .trim().escape(),
];


exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}