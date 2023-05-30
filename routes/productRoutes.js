const express = require('express');

const authController = require('./../controllers/authController');
const productController = require('./../controllers/productController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:productID/reviews', reviewRouter);

router.route('/').get(productController.getAllProducts).post(authController.protect, authController.restrictTo('admin', 'seller'), productController.uploadProductImages, productController.resizeProductImages, productController.createProduct);
router.route('/:id').get(productController.getProduct).patch(authController.protect, authController.restrictTo('admin', 'seller'), productController.uploadProductImages, productController.resizeProductImages, productController.updateProduct).delete(authController.protect, authController.restrictTo('admin', 'seller'), productController.deleteProduct);

module.exports = router;
