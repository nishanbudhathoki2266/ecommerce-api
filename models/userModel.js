const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
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

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.pre('save', async function (next) {
    // we only want the password to be bcrypted if the password was changed or entered 
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    // deleting a field cause it is not meant to be persisted in the database
    this.passwordConfirm = undefined;

    next();
})

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
})

// Instance method to check the entered password and the database password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

// Instance method to find if the user has changed the password after the JWT token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        console.log(changedTimeStamp, JWTTimeStamp);
        return JWTTimeStamp < changedTimeStamp;

    }
    return false;
}



const User = mongoose.model('User', userSchema);

module.exports = User;
