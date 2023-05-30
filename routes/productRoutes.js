const express = require('express');

const authController = require('./../controllers/authController');
const productController = require('./../controllers/productController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin'));

router.route('/').get(productController.getAllProducts).post(productController.uploadProductImages, productController.resizeProductImages, productController.createProduct);
router.route('/:id').get(productController.getProduct).patch(productController.uploadProductImages, productController.resizeProductImages, productController.updateProduct).delete(productController.deleteProduct);

module.exports = router;
