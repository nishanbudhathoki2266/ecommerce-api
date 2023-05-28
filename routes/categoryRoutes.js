const express = require('express');

const authController = require('./../controllers/authController');
const categoryController = require('./../controllers/categoryController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin', 'seller'));

router.route('/').get(categoryController.getAllCategories).post(categoryController.createCategory);
router.route('/:id').get(categoryController.getCategory).patch(categoryController.updatecategory).delete(categoryController.deleteCategory);

module.exports = router;
