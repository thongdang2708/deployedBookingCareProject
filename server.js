let express = require('express');
// const pool = require('../testHeroku/database');
let app = express();

let path = require('path');

let pathView = path.join(__dirname,'../public');

app.get('/fruits', async function (req,res) {

    res.status(200).json({first_name_patient : 'Thong Dang'})
    
    // let {rows} = await pool.query("Select * from patient");

    // res.status(200).json(rows);
})

app.get('/page', function (req,res) {
    res.sendFile(pathView + '/testHTML.html');
    // res.json(["Sol7"]);
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server is running!");
})