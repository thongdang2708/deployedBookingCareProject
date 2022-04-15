const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const route = require('../route/route');

// const pathFile = path.join(__dirname,'../public');

// app.use(express.static(pathFile))
// app.set('view engine','hbs');

route(app);


app.listen(port, function () {
    console.log('Server is listened!')
})