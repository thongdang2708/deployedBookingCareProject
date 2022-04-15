let express = require('express');
let app = express ();
let pool = require('./database');



let port = process.env.PORT || 3000;

app.get('/alldoctors', async function (req,res) {
    
    let client = await pool.connect();

    let { rows } = await client.query("Select * from doctor");


    res.json(rows);
    client.release();
})

app.listen(port, function (req,res) {
    console.log('Fine');
})

