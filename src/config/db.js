const mongoose = require('mongoose');
require('dotenv').config();


/*const dbConnect = async () => {
    await mongoose.connect('mongodb://localhost:27017/authLesson');
    console.log('Connected to database');
}*/

const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/authLesson';

const dbConnect = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Database connected successfully');
    }catch (error) {
        console.error('MongoDB Connection failed', error)
        process.exit(1);
    }
    
}

module.exports = dbConnect;