let express = require('express');
let app = express ();
let pool = require('./database');
let path = require('path');
const pathView = path.join(__dirname,'../public');
let bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
app.use(cookieParser());
app.use(cors());

app.use(express.static(pathFile))
app.set('view engine','hbs');


let port = process.env.PORT || 3000;

app.get('/alldoctors', async function (req,res) {
    
    let client = await pool.connect();

    let { rows } = await client.query("Select * from doctor");


    res.json(rows);
    client.release();
})

app.get('/allspecial', async function (req,res) {
    let client = await pool.connect();
    let { rows } = await client.query("SELECT specialization_id, specialization_name, specialization_staff, related_disease, image, doctor_id FROM specialization");

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }

    client.release();
});

app.get('/allresult', async function (req,res) {
    let client = await pool.connect();
    let { rows } = await client.query("Select doctor.doctor_id, doctor.first_name, doctor.last_name, specialization.specialization_id, specialization.specialization_name, hospitalinfo.hospital_id, hospitalinfo.location, hospitalinfo.hospitalname from doctor inner join hospitalinfo on doctor.hospital_id = hospitalinfo.hospital_id inner join specialization on doctor.specialization_id = specialization.specialization_id");

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }
    client.release();
});

app.get('/hospital', async function (req,res) {
    let client = await pool.connect();
    let { rows } = await client.query("Select * from hospitalinfo;");

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }
    client.release();
});

app.get('/doctor/:id', async function (req,res) {
    let client = await pool.connect();
    let id = Number(req.params.id);

    let { rows } = await client.query("Select * from doctor inner join confirmbooking on doctor.doctor_id = confirmbooking.doctor_id where doctor.doctor_id = $1",[id])

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }

    client.release();

})

app.get('/onlydoctor/:id', async function (req,res) {
    let client = await pool.connect();
    let id = Number(req.params.id);

    let { rows } = await client.query("Select * from doctor where doctor_id = $1",[id])

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }

    client.release();

})


app.get('/hospital/:id', async function (req,res) {
    let client = await pool.connect();
    let id = Number(req.params.id);

    let { rows } = await client.query("Select * from hospitalinfo where hospital_id = $1",[id])

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }

    client.release();

})

app.get('/special/:id', async function (req,res) {
    let client = await pool.connect();
    let id = Number(req.params.id);

    // let { rows } = await pool.query("SELECT * FROM specialization inner join doctor on specialization.specialization_id = doctor.specialization_id where specialization.specialization_id = $1",[id])
    let { rows } = await client.query("Select * from specialization where specialization_id = $1",[id]);
    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }

    client.release();
})

app.get('/patient/:id', async function (req,res) {
    let client = await pool.connect();
    let id = Number(req.params.id);

    let { rows } = await client.query("SELECT * FROM confirmbooking inner join doctor on confirmbooking.doctor_id = doctor.doctor_id inner join patient on confirmbooking.patient_id = patient.patient_id where patient.patient_id = $1",[id])

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }

    client.release();
})

app.get('/mainpage', function (req,res) {
    res.sendFile(pathView + '/mainpage.html');
})


app.listen(port, function (req,res) {
    console.log('Fine');
})

