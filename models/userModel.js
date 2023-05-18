const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "You must enter your name!"]
    },
    email: {
        type: String,
        required: [true, 'Please enter your email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!']
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ['customer', 'seller', 'admin'],
        default: 'customer'
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        minlength: 8,
        select: false // Just to make sure that the password field isn't shown while querying
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password!'],
        validate: {
            validator: function (passwordConfirm) {
                return passwordConfirm === this.password;
            },
            message: "Passwords aren't matching!"
        }
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })

const User = mongoose.model('User', userSchema);

module.exports = User;
