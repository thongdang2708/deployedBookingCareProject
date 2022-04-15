const express = require('express');
const app = express();
const router = express.Router();
let path = require('path');
const pool = require('../model/database');
let pathView = path.join(__dirname,'../public')
let bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
app.use(cookieParser());
require('dotenv').config();


router.get('/register', function (req,res) {
    res.render('register');
})

router.get('/post/register', function (req,res) {
    res.render('register')
})

router.post('/post/register', async function (req,res) {

    let { username, password, password_repeat, firstname, lastname, location, phone, email } = req.body;

    let passwordCheck = password.length < 6 ? '' : password;
    let passwordRepeat = password_repeat < 6 ? '' : password_repeat;
    console.log(passwordCheck);

    let client = await pool.connect();
    let { rows } = await client.query("Select username from patient where username = $1 or email = $2",[username,email]);

    if (rows.length) {
        console.log('This username or email already existed!')
    } else {

        if (passwordCheck.length < 6) {
            console.log('No insertion')
        } else if (passwordCheck !== passwordRepeat) {
            console.log('No insertion again!')
        } else {
            let salt = await bcrypt.genSalt(10);

            let hassedPassword = bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                

                console.log('error');
            } else {
                console.log(username);
                console.log(hash);
                client.query(`INSERT INTO patient (username,hashedpassword,first_name_patient,last_name_patient,location,phone_number,email) values ('${username}','${hash}', '${firstname}','${lastname}','${location}','${phone}','${email}')`, (err,result) => {
                    if (err) {
                        console.log('error');
                    } else {
                        res.render('register', {message : 'Created successfully!'})
                    }
                });

            }



        }); 
        }
    }  
    client.release();

});

router.get('/mainpage', function (req,res) {
    res.sendFile(pathView + '/mainpage.html');
})

router.get('/login', function (req,res) {
    res.render('login');
})

router.get('/loggedin', function (req,res) {
    const refreshToken = req.headers.cookie;
  
    let token = refreshToken.split('=')[1];

    const verifiedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

    let name = verifiedToken.name;

    let id = verifiedToken.id;

    // console.log(id);

    res.render('loggedin', {name : name, id : id})
})

router.post('/login', async function (req,res) {

    let {  username, password } = req.body;
        let client = await pool.connect();
        let { rows } = await client.query("Select * from patient where username = $1",[username]);

        console.log(rows);

        if (!rows.length) {
            return res.status(400).send('invalid!');
        } else {
            
            try {
                if (await bcrypt.compare(password,rows[0].hashedpassword)) {
                    
                    let user =  { name : rows[0].username, id : rows[0].patient_id};
                    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn: "7d"});
                   
                    // await pool.query('Update account set last_login = now() where username = $1',[rows[0].username]);
                    res.cookie('token',token,{...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});
                    return res.redirect('/loggedin');
                } else {
                    return res.status(200).send('Not allowed!');
                }


            }

             catch (err) {
                console.log(err);
            }
           

        }
        client.release();

})

router.get('/searchdoctor', function (req,res) {
    res.sendFile(pathView + '/searchDoctor.html')
});

router.get('/doctor', function (req,res) {
    res.sendFile(pathView + '/doctor.html');
})

router.get('/healthfacilities', function (req,res) {
    res.sendFile(pathView + '/healthfacility.html');
})

router.get('/specialist', function (req,res) {
    res.sendFile(pathView + '/specialist.html');
})

router.get('/specialization', function (req,res) {
    res.sendFile(pathView + '/specialization.html')
})

router.get('/contactforcoop', function (req, res) {
    res.sendFile(pathView + '/contact.html')
})

router.get('/form', function (req,res) {
    res.sendFile(pathView + '/bookingdoctor.html');
})

router.get('/bookingforpatient', function (req,res) {
    res.sendFile(pathView + '/bookingforpatient.html');
})

router.get('/doctorlistforpatient', function (req,res) {
    res.sendFile(pathView + '/doctorlistforpatient.html');
})

router.get('/formforpatient', function (req,res) {
    res.sendFile(pathView + '/formforpatient.html');
})

router.post('/submitformforpatient' , async function (req,res) {
    let { doctorid, patientid, date, starttime, endtime, description } = req.body;
    
    let doctor_id = Number(doctorid);
    let patient_id = Number(patientid);
    let date_el = date.split(' ')[1].split('/')[0].toString();
    let month_el = date.split(' ')[1].split('/')[1].toString();
    let year_el = date.split(' ')[1].split('/')[2].toString();
    let client = await pool.connect();
    client.query("Insert into confirmbooking (doctor_id,patient_id,description,date,month,year,start_time,end_time) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", [doctor_id,patient_id,description,date_el,month_el,year_el,starttime,endtime], (err,result) => {

        if (err) {
            console.log(err);
        } else {
            res.redirect('/loggedin')
        }


    });

    client.release();

})

router.post('/submitform' , async function (req,res) {
    let { doctorid, date, starttime, endtime, firstname, lastname, city, phonenumber, email, description, gender } = req.body;
    
 

    let doctor_id = Number(doctorid);
    // let patient_id = Number(patientid);
    let date_el = date.split(' ')[1].split('/')[0].toString();
    let month_el = date.split(' ')[1].split('/')[1].toString();
    let year_el = date.split(' ')[1].split('/')[2].toString();

    console.log(doctor_id,date_el,month_el,year_el);
    
    let client = await pool.connect();
    client.query("Insert into confirmbooking (doctor_id,description,date,month,year,start_time,end_time) VALUES ($1,$2,$3,$4,$5,$6,$7)", [doctor_id,description,date_el,month_el,year_el,starttime,endtime], (err,result) => {

        if (err) {
            console.log(err);
        } else {
            res.render('bookedsuccess', {
                firstname: firstname,
                lastname : lastname,
                date : date,
                start_time : starttime,
                end_time : endtime,
            })
        }


    });
    client.release();

})

router.get('/doctorbookinglink', function (req,res) {
    res.sendFile(pathView + '/doctorbookinglink.html');
});

router.get('/specializationlink', function (req,res) {
    res.sendFile(pathView + '/specializationlink.html');
})









module.exports = router;