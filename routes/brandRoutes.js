const express = require('express');

const authController = require('./../controllers/authController');
const brandController = require('./../controllers/brandController');

const router = express.Router();

router.get('/:slug/byslug', brandController.getBrandBySlug);
router.route('/').get(brandController.getAllBrands).post(authController.protect, authController.restrictTo('admin', 'seller'), brandController.uploadBrandPhoto, brandController.resizeBrandPhoto, brandController.createBrand);
router.route('/:id').get(brandController.getBrand).patch(authController.protect, authController.restrictTo('admin', 'seller'), brandController.uploadBrandPhoto, brandController.resizeBrandPhoto, brandController.updateBrand).delete(authController.protect, authController.restrictTo('admin', 'seller'), brandController.delteBrand);

module.exports = router;
