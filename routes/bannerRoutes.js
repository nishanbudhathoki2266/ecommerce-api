const express = require('express');

const authController = require('./../controllers/authController');
const bannerController = require('./../controllers/bannerController');

const router = express.Router();

router.route('/active-banners').get(bannerController.getBannersForHomePage);

router.use(authController.protect, authController.restrictTo('admin'));

router.route('/').get(bannerController.getAllBanners).post(bannerController.uploadBannerPhoto, bannerController.resizeBannerPhoto, bannerController.createBanner);
router.route('/:id').get(bannerController.getBanner).patch(bannerController.uploadBannerPhoto, bannerController.resizeBannerPhoto, bannerController.updateBanner).delete(bannerController.deleteBanner);

module.exports = router;
