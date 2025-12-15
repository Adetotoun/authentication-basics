const express = require('express');
const app = express();
const morgan = require('morgan');
const dbConnect = require('./src/config/db');

const userRoutes = require('./src/routes/auth.routes');

require("dotenv").config();
const port = process.env.PORT || 3300;



app.use(express.json());
app.use(morgan("dev"));
app.use('/api/users', userRoutes);


dbConnect();

app.listen(port,() =>{
    console.log(`Server is listening on localhost: ${port}`);
})