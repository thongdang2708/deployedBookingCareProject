let express = require('express');
const port = process.env.PORT || 3000;
let app = express();
let cors = require('cors');
let path = require('path');

let pool = require('./database.js')

let pathView = path.join(__dirname,'./public');
app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.get('/doctor', async function (req,res) {
    
    let { rows } = await pool.query("Select first_name_patient from patient");

    res.json(rows);

})
// app.get('/page', function (req,res) {
//     res.sendFile(pathView + '/testHTML.html');
//     // res.json(["Sol7"]);
// })


app.listen(port, function () {
    console.log("Server is running!");
})