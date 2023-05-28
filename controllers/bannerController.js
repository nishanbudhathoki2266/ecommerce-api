const multer = require('multer');
const sharp = require('sharp');

const Banner = require('./../models/bannerModel');
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

exports.uploadBannerPhoto = upload.single('photo');

exports.resizeBannerPhoto = async (req, _, next) => {
    if (!req.file) return next();

    // As the file is currently a buffer, we don't have any filename in request
    req.file.filename = `Banner-${req.user.id}-${Date.now()}.jpeg`;

    // 988 x 344 Banner Size
    await sharp(req.file.buffer).toFormat('jpeg').toFile(`public/img/banners/${req.file.filename}`);

    // Never forget to pass the request to next middelware - Remeber you just got lost for 1 hour due to this last Monday :D 
    next();
}

exports.getAllBanners = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Banner.find(), req.query).filter().limitFields().pagniate().sort();
    const banners = await features.query;

    // response
    res.status(200).json({
        status: 'success',
        results: banners.length,
        data: {
            banners
        }
    })
})

exports.getBannersForHomePage = catchAsync(async (req, res, next) => {

})

exports.getBanner = catchAsync(async (req, res, next) => {
    const banner = await Banner.findById(req.params.id);

    if (!banner) return next(new AppError("No banner found with that ID!, 404"));

    res.status(200).json({
        status: 'success',
        data: {
            banner
        }
    })
})

exports.createBanner = catchAsync(async (req, res, next) => {
    if (!req.body.createdBy) req.body.createdBy = req.user.id;
    const newBanner = await Banner.create({ ...req.body, photo: req.file.filename });

    res.status(201).json({
        status: 'success',
        data: {
            banner: newBanner,
        }
    })
})

exports.updateBanner = catchAsync(async (req, res, next) => {

})

exports.deleteBanner = catchAsync(async (req, res, next) => {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) return next(new AppError("No banner found with that ID!, 404"));

    res.status(204).json({
        status: 'success',
        data: null
    })
})

