const Product = require('./../models/productModel');
const multer = require('multer');
const sharp = require('sharp');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// 720 x 720 product image size

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Product.find(), req.query).filter().limitFields().pagniate().sort();
    const products = await features.query;

    // response
    res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
            products
        }
    })
})

// exports.getCategory = catchAsync(async (req, res, next) => {
//     const category = await Category.findById(req.params.id);

//     if (!category) return next(new AppError("No category found with that ID!, 404"));

//     res.status(200).json({
//         status: 'success',
//         data: {
//             category
//         }
//     })
// })

exports.createProduct = catchAsync(async (req, res, next) => {

    if (!req.body.createdBy) req.body.createdBy = req.user.id;
    const newProduct = await Product.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            product: newProduct,
        }
    })
})

// exports.updatecategory = catchAsync(async (req, res, next) => {
//     const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

//     if (!category) return next(new AppError("No category found with that ID!, 404"));

//     res.status(200).json({
//         status: 'success',
//         data: {
//             category
//         }
//     })
// })

// exports.deleteCategory = catchAsync(async (req, res, next) => {
//     const category = await Category.findByIdAndDelete(req.params.id);

//     if (!category) return next(new AppError("No category found with that ID!, 404"));

//     res.status(204).json({
//         status: 'success',
//         data: null
//     })
// })

