const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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
    await sharp(req.file.buffer).resize(988, 344).toFormat('jpeg').toFile(`public/img/banners/${req.file.filename}`);
}

exports.getAllBanners = catchAsync(async (req, res, next) => {

})

exports.getBannersForHomePage = catchAsync(async (req, res, next) => {

})

exports.getBanner = catchAsync(async (req, res, next) => {

})

exports.createBanner = catchAsync(async (req, res, next) => {

})

exports.updateBanner = catchAsync(async (req, res, next) => {

})

exports.deleteBanner = catchAsync(async (req, res, next) => {

})

