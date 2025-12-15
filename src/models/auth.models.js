const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otpExpiry: {
        type: Date
    }
},{
    timestamps: true,
    versionKey: false
});

const User = mongoose.model('User', userSchema);

module.exports = User;