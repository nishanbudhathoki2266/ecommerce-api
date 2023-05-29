const express = require('express');

const authController = require('./../controllers/authController');
const productController = require('./../controllers/productController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin'));

router.route('/').get(productController.getAllProducts).post(productController.createProduct);
// router.route('/:id').get(bannerController.getBanner).patch(bannerController.uploadBannerPhoto, bannerController.resizeBannerPhoto, bannerController.updateBanner).delete(bannerController.deleteBanner);

module.exports = router;
