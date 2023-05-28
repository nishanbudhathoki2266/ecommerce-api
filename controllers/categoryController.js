
const Category = require('./../models/categoryModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllCategories = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Category.find(), req.query).filter().limitFields().pagniate().sort();
    const categories = await features.query;

    // response
    res.status(200).json({
        status: 'success',
        results: categories.length,
        data: {
            categories
        }
    })
})

exports.getCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) return next(new AppError("No category found with that ID!, 404"));

    res.status(200).json({
        status: 'success',
        data: {
            category
        }
    })
})

exports.createCategory = catchAsync(async (req, res, next) => {

    if (!req.body.createdBy) req.body.createdBy = req.user.id;
    const newCategory = await Category.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            category: newCategory,
        }
    })
})

exports.updatecategory = catchAsync(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!category) return next(new AppError("No category found with that ID!, 404"));

    res.status(200).json({
        status: 'success',
        data: {
            category
        }
    })
})

exports.deleteCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) return next(new AppError("No category found with that ID!, 404"));

    res.status(204).json({
        status: 'success',
        data: null
    })
})

