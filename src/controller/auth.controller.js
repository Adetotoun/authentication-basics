const User = require('../models/auth.models');
const bcrypt = require('bcryptjs');

const signup = async (req,res) => {
    const {userName,email,password} = req.body;
    try{
    if(!userName || !email || !password){
       return  res.status(400).json({message: 'All fields required'});
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(409).json({message: 'User already exist'});
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        userName,
        email,
        password: hashedPassword,
        otp,
        otpExpiry
    })

    await newUser.save();
    return res.status(201).json({message: 'User created Successfully'});
    }catch(error){
        console.error('Error encounted during signup', error);
        return res.status(500).json({message: 'Server Error'});
    }
}


const login = async (req,res) => {
    const {email,password} = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({message: 'All fields required'});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        if(!user.isVerified){
            return res.status(401).json({message: 'User not verified, please verify your account'});
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if(!comparePassword){
            return res.status(401).json({message: 'invalid Credentials'});
        }
        return res.status(200).json({message: 'Login successful!'});
    } catch (error) {
        console.error('Error during login', error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const forgotPassword = async (req,res) => {
    const {email} = req.body;
    try {
        if(!email){
            return res.status(400).json({message: 'Email required'});
        }
        const user = await User.findOne({email});
        if(!user){
           return res.status(404).json({message: 'User not found'});
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        return res.status(200).json({message: 'OTP sent successfully', otp});
    } catch (error) {
      console.error('OTP Error', error);
      return res.status(500).json({message: 'Internal Server Error'});
    }
}

const resetPassword = async (req,res) => {
    const {otp, newPassword} = req.body;
    try {
        if(!otp || !newPassword){
            return res.status(400).json({messsage: 'All fields required'});
        }
        const user = await User.findOne({otp});
        if(!user){
            return res.status(404).json({message: 'Invalid OTP'});
        }
        if(user.otpExpiry < new Date()){
        return res.status(404).json({messaage: 'OTP Expired'});
        }
        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.password = hashedPassword;
        user.otp = null;
        await user.save();
        return res.status(200).json({message: 'Password reset successfully'})
    } catch (error) {
        console.error('Password reset failed', error);
        return res.status(500).json({message: 'Internal Server Error'})
    }
}

const verifyOtp = async (req,res) => {
    const {otp} = req.body;
    try{
    if(!otp){
        return res.status(400).json({message: 'OTP is required'});
    }
    const user = await User.findOne({otp});
    if(!user){
        return res.status(404).json({message: 'Invalid OTP'});
    }
    if(user.otpExpiry < new Date()){
        return res.status(404).json({messaage: 'OTP Expired'});
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    return res.status(200).json({message: 'User verified successfully'});
    }catch(error){
        console.error('Error verifying account', error);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

const resendOtp = async (req,res) => {
    const {email} = req.body;
    try {
        if(!email){
            return res.status(400).json({message: 'Email required'});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: 'Invalid user'});
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        return res.status(200).json({message: 'OTP resent successfully'});
    } catch (error) {
        console.error("Error resending otp", error);
        return res.status(500).json({message: 'Internal server error'});
    }
}



module.exports = {signup, login, forgotPassword, resetPassword,verifyOtp,resendOtp};