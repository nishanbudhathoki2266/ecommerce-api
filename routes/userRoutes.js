const express = require('express');
const multer = require('multer');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

// if not given the dest option, the file would be just saved on memory
const upload = multer({ dest: 'public/img/users' });

const router = express.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Using middleware before other protected routes 
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updateMyPassword);
router.get('/me', userController.getMe);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);


authController.restrictTo('admin')

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);


module.exports = router;