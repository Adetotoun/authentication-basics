const express = require('express');
const {signup, login, forgotPassword, resetPassword, verifyOtp, resendOtp} = require('../controller/auth.controller');
const router = express.Router();


router.post('/new-user', signup);
router.post('/login', login)
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);
router.put('/verify-otp', verifyOtp);
router.put('/resend-otp',resendOtp);




module.exports = router;