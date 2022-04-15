let express = express ();
let pool = require('./database');
let app = express();


let port = process.env.PORT || 3000;

app.get('/alldoctors', function (req,res) {
    
    let client = await pool.connect();

    let { rows } = await client.query("Select * from doctor");


    res.json(rows);
    client.release();
})

app.listen(port, function (req,res) {
    console.log('Fine');
})

