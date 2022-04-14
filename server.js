let express = require('express');

let app = express();
let cors = require('cors');
let path = require('path');

let pool = require('./database')

let pathView = path.join(__dirname,'./public');
app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.get('/doctor', async function (req,res) {
    
    let { rows } = await pool.query("Select * from patient");

    res.json(rows);

})
// app.get('/page', function (req,res) {
//     res.sendFile(pathView + '/testHTML.html');
//     // res.json(["Sol7"]);
// })

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server is running!");
})