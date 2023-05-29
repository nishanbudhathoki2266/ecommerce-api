const express = require('express');

const authController = require('./../controllers/authController');
const categoryController = require('./../controllers/categoryController');

const router = express.Router();

router.route('/').get(categoryController.getAllCategories).post(authController.protect, authController.restrictTo('admin', 'seller'), categoryController.createCategory);
router.route('/:id').get(categoryController.getCategory).patch(authController.protect, authController.restrictTo('admin', 'seller'), categoryController.updatecategory).delete(authController.protect, authController.restrictTo('admin', 'seller'), categoryController.deleteCategory);

module.exports = router;
