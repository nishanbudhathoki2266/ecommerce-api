const multer = require('multer');
const sharp = require('sharp');

const Brand = require('./../models/brandModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

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

exports.uploadBrandPhoto = upload.single('photo');

exports.resizeBrandPhoto = catchAsync(async (req, _, next) => {
    if (!req.file) return next();

    // As the file is currently a buffer, we don't have any filename in request
    req.file.filename = `Brand-${req.user.id}-${Date.now()}.jpeg`;

    // 500 x 500 brand size
    await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/brands/${req.file.filename}`);

    // Never forget to pass the request to next middelware - Remeber you just got lost for 1 hour due to this last Monday :D 
    next();
})

exports.getAllBrands = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Brand.find(), req.query).filter().limitFields().pagniate().sort();
    const brands = await features.query;

    // response
    res.status(200).json({
        status: 'success',
        results: brands.length,
        data: {
            brands
        }
    })
})

exports.getBrand = catchAsync(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id);

    if (!brand) return next(new AppError("No brand found with that ID!", 404));

    res.status(200).json({
        status: 'success',
        data: {
            brand
        }
    })
})

exports.createBrand = catchAsync(async (req, res, next) => {
    if (!req.body.createdBy) req.body.createdBy = req.user.id;
    const newBrand = await Brand.create({ ...req.body, photo: req.file.filename });

    res.status(201).json({
        status: 'success',
        data: {
            brand: newBrand,
        }
    })
})

exports.updateBrand = catchAsync(async (req, res, next) => {
    const requestBody = req.file ? { ...req.body, photo: req.file.filename } : req.body;
    const brand = await Brand.findByIdAndUpdate(req.params.id, requestBody, { new: true, runValidators: true });

    if (!brand) return next(new AppError("No brand found with that ID!", 404));

    res.status(200).json({
        status: 'success',
        data: {
            brand
        }
    })
})

exports.delteBrand = catchAsync(async (req, res, next) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) return next(new AppError("No brand found with that ID!", 404));

    res.status(204).json({
        status: 'success',
        data: null
    })
})

