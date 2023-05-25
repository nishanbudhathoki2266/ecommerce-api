const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

const filterObj = (obj, ...allowedFeilds) => {
    const newObj = {};

    Object.keys(obj).forEach(el => {
        if (allowedFeilds.includes(el)) {
            newObj[el] = obj[el];
        }
    })

    return newObj;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(User.find(), req.query).filter().sort().limitFields().pagniate();
    const users = await features.query;

    // Send response 
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
})

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) return next(new AppError("No user found with that ID!", 404));

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

exports.createUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    res.status(200).json({
        stauts: 'success',
        data: {
            user: newUser
        }
    })
})

exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!user) return next(new AppError("Can't find user with that ID!", 404));

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return next(new AppError("Can't find user with that ID!", 404));

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) return next(new AppError("Looks like you aren't logged in!", 404))

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

exports.updateMe = catchAsync(async (req, res, next) => {
    // create error if user tries to change the passwords here
    if (req.body.password || req.body.passwordConfirm) return next(new AppError("This route isn't for password update. Please use /updateMyPassword", 400));

    // update the user documents
    const filteredBody = filterObj(req.body, 'name', 'email');

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    // setting the active flag of an user to false
    const userToBeDeleted = await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null
    })
})
