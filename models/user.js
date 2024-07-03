const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'cannot be empty']},
    lastName: {type: String, required: [true, 'cannot be empty']},
    email: {type: String, required: [true, 'cannot be empty'], unique: true},
    password: {
        type: String,
        required: [true, 'Password cannot be empty'],
        validate: {
            validator: function(password) {
                // Custom validation function
                // Minimum length of 8 characters
                // Must contain at least one special symbol, one capital letter, and one number
                const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
                return regex.test(password);
            },
            message: props => `${props.value} is not a valid password. It must be at least 8 characters long and contain at least one special symbol, one capital letter, and one number.`,
        },
    },
});

// replace plain text password with has password before saving the document in the database
// pre middleware

userSchema.pre('save', function (next){
    let user = this;
    if(!user.isModified('password'))
        return next();
    bcrypt.hash(user.password, 10)
    .then(hash=>{
        user.password = hash;
        next();
    })
    .catch(err=>next(err))
} );

// implement a method to compare the login password and the hash stored in the database
userSchema.methods.comparePassword = function(loginPassword) {
    return bcrypt.compare(loginPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);