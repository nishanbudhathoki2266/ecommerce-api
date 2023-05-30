const Product = require('./../models/productModel');
const multer = require('multer');
const sharp = require('sharp');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// 720 x 720 product image size
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new AppError('Not an image! Please upload only images!', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

// Setting max count of images to 5
exports.uploadProductImages = upload.array('images', 5);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
    if (!req.files) return next();

    req.body.images = [];
    await Promise.all(req.files.map(async (file, i) => {
        const filename = `product-${req.user.id}-${Date.now()}-${i + 1}.jpeg`

        await sharp(file.buffer).resize(720, 720).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/products/${filename}`);

        req.body.images.push(filename);
    }));

    next();
})

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

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) return next(new AppError("No product found with that ID!, 404"));

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    })
})

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

exports.updateProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!product) return next(new AppError("No product found with that ID!, 404"));

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    })
})

// exports.deleteCategory = catchAsync(async (req, res, next) => {
//     const category = await Category.findByIdAndDelete(req.params.id);

//     if (!category) return next(new AppError("No category found with that ID!, 404"));

//     res.status(204).json({
//         status: 'success',
//         data: null
//     })
// })

