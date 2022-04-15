let express = require('express');
const Port = process.env.PORT || 3000;
let app = express();
let cors = require('cors');
let path = require('path');

let pool = require('./database');



let pathView = path.join(__dirname,'./public');
app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.get('/patient', async function (req,res) {
    
    // let { rows } = await pool.query('Select first_name_patient from patient');

    // res.status(200).json(rows);

    let client = await pool.connect();
    let result = await client.query('SELECT * FROM patient;');
    let results = { 'results': (result) ? result.rows : null};
    res.json( results )
    // client.release();
})


app.get('/page', function (req,res) {
    res.sendFile(pathView + '/testHTML.html');
    // res.json(["Sol7"]);
})


app.listen(Port, function () {
    console.log("Server is running!");
})