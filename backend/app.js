require('dotenv').config()
const express = require('express');
const { DBConnection, sequelize } = require('./config/DBConnection');
const cors=require('cors');
const { User } = require('./model/UserModel');
const { Admin } = require('./model/AdminModel');
const { router } = require('./routes/router');
const cookieParser = require("cookie-parser");


const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,  
    credentials: true,                 
}));
app.use(express.json());
app.use(cookieParser());
app.use('/', router);

//sync model with database
User.sync({force:false});
Admin.sync({force:false});

//start server
app.listen(5000, async () => {
    console.log("server is started at port 5000");
    await DBConnection()
})