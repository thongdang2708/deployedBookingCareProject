let express = require('express');
let app = express ();
let pool = require('./database');
let path = require('path');
let cors = require('cors');


const pathView = path.join(__dirname,'../testHeroku2/public');
let bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
app.use(cookieParser());
app.use(cors());

// let router = require('./test');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
console.log(pathView);
app.use(express.static(pathView))
app.set('view engine','hbs');


let port = process.env.PORT || 3000;

app.get('/api/alldoctors', async function (req,res) {
    
    let client = await pool.connect();

    let { rows } = await client.query("Select * from doctor");


    res.json(rows);
    client.release();
})

app.get('/api/allspecial', async function (req,res) {
    let client = await pool.connect();
    let { rows } = await client.query("SELECT specialization_id, specialization_name, specialization_staff, related_disease, image, doctor_id FROM specialization");

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }

    client.release();
});

app.get('/api/allresult', async function (req,res) {
    let client = await pool.connect();
    let { rows } = await client.query("Select doctor.doctor_id, doctor.first_name, doctor.last_name, specialization.specialization_id, specialization.specialization_name, hospitalinfo.hospital_id, hospitalinfo.location, hospitalinfo.hospitalname from doctor inner join hospitalinfo on doctor.hospital_id = hospitalinfo.hospital_id inner join specialization on doctor.specialization_id = specialization.specialization_id");

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }
    client.release();
});

app.get('/api/hospital', async function (req,res) {
    let client = await pool.connect();
    let { rows } = await client.query("Select * from hospitalinfo;");

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }
    client.release();
});

app.get('/api/doctor/:id', async function (req,res) {
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

app.get('/api/onlydoctor/:id', async function (req,res) {
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


app.get('/api/hospital/:id', async function (req,res) {
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

app.get('/api/special/:id', async function (req,res) {
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

app.get('/api/patient/:id', async function (req,res) {
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

app.get('/api/onlypatient/:id', async function (req,res) {
    let client = await pool.connect();
    let id = Number(req.params.id);

    let { rows } = await client.query("Select * from patient where patient_id = $1",[id])

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }

    client.release();
})



app.get('/mainpage', function (req,res) {
   res.render('mainpage');
})

app.get('/register', function (req,res) {
    res.render('register');
})

app.get('/post/register', function (req,res) {
    res.render('register')
})

app.get('/api/feedback/:id', async function (req,res) {

    let id = Number(req.params.id);

    let client = await pool.connect();

    let { rows } = await client.query("Select * from feedback inner join doctor on feedback.doctor_id = doctor.doctor_id inner join patient on feedback.patient_id = patient.patient_id where doctor.doctor_id = $1",[id])

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }

    client.release();
})

app.get('/api/getuser', async function (req,res) {
    // let { rows } = await pool.query("Select username, email from patient");

    // res.status(200).json(rows);


    let client = await pool.connect();

    let { rows } = await client.query("Select username, email from patient");


    res.json(rows);
    client.release();

})


app.post('/post/register', async function (req,res) {

    let { username, password, password_repeat, firstname, lastname, location, phone, email } = req.body;

    let passwordCheck = password.length < 6 ? '' : password;
    let passwordRepeat = password_repeat < 6 ? '' : password_repeat;
    console.log(passwordCheck);

    let client = await pool.connect();
    let { rows } = await client.query("Select username from patient where username = $1 or email = $2",[username,email]);

    if (rows.length) {
        console.log('This username or email already existed!');
        res.redirect('/register')
    } else {

        if (passwordCheck.length < 6) {
            console.log('No insertion')
            res.redirect('/register');
        } else if (passwordCheck !== passwordRepeat) {
            console.log('No insertion again!')
            res.redirect('/register');
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

app.get('/login', function (req,res) {
    res.render('login');
})

app.get('/loggedin', function (req,res) {
    const refreshToken = req.headers.cookie;
  
    let token = refreshToken.split('=')[1];

    const verifiedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

    let name = verifiedToken.name;

    let id = verifiedToken.id;

    // console.log(id);

    res.render('loggedin', {name : name, id : id})
})

app.post('/login', async function (req,res) {

    let {  username, password } = req.body;
        let client = await pool.connect();
        let { rows } = await client.query("Select * from patient where username = $1",[username]);

        console.log(rows);

        if (!rows.length) {
            // return res.status(400).send('invalid!');
            return res.redirect('/rejectform');
        } else {
            
            try {
                if (await bcrypt.compare(password,rows[0].hashedpassword)) {
                    
                    let user =  { name : rows[0].username, id : rows[0].patient_id};
                    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn: "7d"});
                   
                    // await pool.query('Update account set last_login = now() where username = $1',[rows[0].username]);
                    res.cookie('token',token);
                    return res.redirect('/loggedin');
                } else {
                    // return res.status(200).send('Not allowed!');
                    return res.redirect('/rejectform');
                }


            }

             catch (err) {
                console.log(err);
            }
           

        }
        client.release();

})
// {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true}
app.get('/searchdoctor', function (req,res) {
    // res.sendFile(pathView + '/searchDoctor.html')
    res.render('searchDoctor')
});

app.get('/doctor', function (req,res) {
    // res.sendFile(pathView + '/doctor.html');
    res.render('doctor')
})

app.get('/healthfacilities', function (req,res) {
    // res.sendFile(pathView + '/healthfacility.html');

    res.render('healthfacility');
})

app.get('/specialist', function (req,res) {
    // res.sendFile(pathView + '/specialist.html');
    res.render('specialist');
})

app.get('/specialization', function (req,res) {
    // res.sendFile(pathView + '/specialization.html')
    res.render('specialization')
})

app.get('/contactforcoop', function (req, res) {
    // res.sendFile(pathView + '/contact.html')
    res.render('contact')
})

app.get('/form', function (req,res) {
    // res.sendFile(pathView + '/bookingdoctor.html');
    res.render('bookingdoctor');
    
})

app.get('/bookingforpatient', function (req,res) {
    // res.sendFile(pathView + '/bookingforpatient.html');
    res.render('bookingforpatient');
})

app.get('/doctorlistforpatient', function (req,res) {
    // res.sendFile(pathView + '/doctorlistforpatient.html');
    res.render('doctorlistforpatient');
})

app.get('/formforpatient', function (req,res) {
    // res.sendFile(pathView + '/formforpatient.html');
    res.render('formforpatient');
})

app.post('/submitformforpatient' , async function (req,res) {
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

    // client.release();

})


app.post('/submitform' , async function (req,res) {
    let { doctorid, date, starttime, endtime, firstname, lastname, city, phonenumber, email, description, gender } = req.body;
    
    console.log(req.body);

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

app.get('/doctorbookinglink', function (req,res) {
    // res.sendFile(pathView + '/doctorbookinglink.html');
    res.render('doctorbookinglink');
});

app.get('/specializationlink', function (req,res) {
    res.sendFile(pathView + '/specializationlink.html');
    res.render('specializationlink');
})

app.get('/rejectform', function (req,res) {
    res.render('rejectform');
})



app.listen(port, function (req,res) {
    console.log('Fine');
})

