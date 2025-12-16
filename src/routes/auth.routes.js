const express = require('express');
const {signup, login, forgotPassword, resetPassword, verifyOtp, resendOtp, getAllUsers} = require('../controller/auth.controller');
const isAuth = require('../config/auth');
const router = express.Router();


router.post('/new-user', signup);
router.post('/login', login)
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);
router.put('/verify-otp', verifyOtp);
router.put('/resend-otp',resendOtp);
router.get('/get-all-users', isAuth,getAllUsers);




module.exports = router;