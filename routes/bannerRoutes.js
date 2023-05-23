const express = require('express');


const authController = require('./../controllers/authController');
const bannerController = require('./../controllers/bannerController');


const router = express.Router();

router.route('/').get(bannerController.getAllBanners).post(bannerController.createBanner);
router.route('/:id').get(bannerController.getBanner).patch(bannerController.updateBanner).delete(bannerController.deleteBanner);
router.route('/banners').get(bannerController.getBannersForHomePage);

module.exports = router;