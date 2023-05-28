const express = require('express');

const authController = require('./../controllers/authController');
const brandController = require('./../controllers/brandController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin', 'seller'));

router.route('/').get(brandController.getAllBrands).post(brandController.uploadBrandPhoto, brandController.resizeBrandPhoto, brandController.createBrand);
router.route('/:id').get(brandController.getBrand).patch(brandController.uploadBrandPhoto, brandController.resizeBrandPhoto, brandController.updateBrand).delete(brandController.delteBrand);

module.exports = router;
