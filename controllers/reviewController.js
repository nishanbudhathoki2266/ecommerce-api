const Review = require('./../models/reviewModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAllReviews = catchAsync(async (req, res, next) => {

    const filter = {};
    if (req.params.productID) filter.product = req.params.productID;
    console.log(filter);

    const features = new APIFeatures(Review.find(filter), req.query).filter().limitFields().pagniate().sort();
    const reviews = await features.query;

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews,
        }
    })
})

exports.getReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) return next(new AppError("No review found with that ID!", 404));

    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    })
})


exports.createReview = catchAsync(async (req, res, next) => {

    if (!req.body.product) req.body.product = req.params.productID;
    if (!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);


    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    })
})


exports.updateReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!review) return next(new AppError("No review found with that ID!", 404));

    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    })
})


exports.deleteReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) return next(new AppError("No review found with that ID!", 404));

    res.status(204).json({
        status: 'success',
        data: null
    })
})