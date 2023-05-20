const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Removing password from the output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    // Only take things that are required to create a user, not letting roles to be specified the user itself 
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    createAndSendToken(newUser, 201, res);
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) return next(new AppError("Please provide email and password", 400));

    // Again selecting password as it was not unselected in the schema 
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) return next(new AppError("Incorrect email or password!", 401));


    // If everything all good send token
    createAndSendToken(user, 200, res);
})

exports.protect = catchAsync(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next(new AppError("You are not logged in! Please login to get access!", 401));

    // token verification 
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // getting user based on token
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) return next(new AppError("The user belonging to this token no longer exists!", 401));

    // Check if user has changed the password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("User recently changed the password! Please log in again!", 401));
    }

    // Grant access to the user
    req.user = currentUser;
    next();
})


exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You don't have permission to perform this action!", 403))
        }
        next();
    }
}