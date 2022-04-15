const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
let cors = require('cors')

// const cookieParser = require('cookie-parser');
// require('dotenv').config;
const pathFile = path.join(__dirname,'../public');
// const linkRouter = require('./linkRoute')
// app.use(express.static(pathFile))
// 

const linkRouter = require('../route/apiRouter')
const websiteRouter = require('./websiteRouter');
let route = function (app) {
        app.use(cors());
        app.use(express.urlencoded({ extended:true}));
        app.use(express.json());
        app.use('/api',linkRouter);
        app.use(express.static(pathFile))
        app.set('view engine','hbs');
        app.use('/',websiteRouter);

}

module.exports = route;