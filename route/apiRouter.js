const express = require('express');
const router = express.Router();
const pool = require('../model/database');
let bcrypt = require('bcryptjs');
router.get('/alldoctors', async function (req,res) {
    let client = await pool.connect();
    let { rows } = await client.query("Select * from doctor");

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }

    client.release();
});

router.get('/allspecial', async function (req,res) {
    let client = await pool.connect();
    let { rows } = await client.query("SELECT specialization_id, specialization_name, specialization_staff, related_disease, image, doctor_id FROM specialization");

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }

    client.release();
});

router.get('/allresult', async function (req,res) {
    let client = await pool.connect();
    let { rows } = await client.query("Select doctor.doctor_id, doctor.first_name, doctor.last_name, specialization.specialization_id, specialization.specialization_name, hospitalinfo.hospital_id, hospitalinfo.location, hospitalinfo.hospitalname from doctor inner join hospitalinfo on doctor.hospital_id = hospitalinfo.hospital_id inner join specialization on doctor.specialization_id = specialization.specialization_id");

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }
    client.release();
});




router.get('/hospital', async function (req,res) {
    let client = await pool.connect();
    let { rows } = await client.query("Select * from hospitalinfo;");

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }
    client.release();
});

router.get('/doctor/:id', async function (req,res) {
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

router.get('/onlydoctor/:id', async function (req,res) {
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



router.get('/hospital/:id', async function (req,res) {
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

router.get('/special/:id', async function (req,res) {
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

router.get('/patient/:id', async function (req,res) {
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

router.get('/allpatient', async function (req,res) {
    let client = await pool.connect();
    let { rows } = await client.query("Select patient_id,password from patient");

    let emptyArray = [];
    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        // rows.forEach(eachrow => {

            // let salt = bcrypt.genSalt(10);

            // let hassedPassword = bcrypt.hash(eachrow.password, salt, (err,hash) => {
            //     if (err) {
            //         console.log(err)
            //     } else {
            //         emptyArray.push({
            //             patient_id : eachrow.patient_id,
            //             hashpassword : hash
            //         })
            //     }
            // });
            // res.status(200).json(eachrow);

        // })

        res.status(200).json(rows);

       
    }
    client.release();
    
})

router.get('/feedback/:id', async function (req,res) {
    let client = await pool.connect();
    let id = Number(req.params.id);

    let { rows } = await client.query("Select * from feedback inner join patient on feedback.patient_id = patient.patient_id where feedback.doctor_id = $1",[id])

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }
    client.release();
})

router.get('/hospitalfromdoctor/:id', async function (req,res) {
    let client = await pool.connect();
    let id = Number(req.params.id);

    let { rows } = await client.query("Select * from doctor inner join hospitalinfo on doctor.hospital_id = hospitalinfo.hospital_id where doctor.doctor_id = $1",[id])

    if (!rows) {
        res.status(404).json({error : "error"})
    } else {
        res.status(200).json(rows);
    }
    client.release();
})

router.get('/getuser', async function (req,res) {
    let client = await pool.connect();
    let { rows } = await client.query("Select username, email from patient");

    res.status(200).json(rows);
    client.release();
})




        
            //     if (err) {
            
        
            //     console.log('error');
            //     } else {
        
            //     pool.query("Update patient set hashedpassword = $1 where patient_id = $2",[hash,eachrow.patient_id], (err,result) => {
            //     if (err) {
            //         console.log('error');
            //     } else {
            //         res.send('Success!');
            //     }
            // });
  







    // res.status(200).json(rows);

 
    //     let salt = bcrypt.genSalt(10);

    //     let hassedPassword = bcrypt.hash(eachrow.password, salt, async (err, hash) => {
    //     if (err) {
    

    //     console.log('error');
    //     } else {

    //     pool.query("Update patient set hashedpassword = $1 where patient_id = $2",[hash,eachrow.patient_id], (err,result) => {
    //     if (err) {
    //         console.log('error');
    //     } else {
    //         res.send('Success!');
    //     }
    // });

 



// let salt = await bcrypt.genSalt(10);

// let hassedPassword = bcrypt.hash(password, salt, async (err, hash) => {
// if (err) {
    

//     console.log('error');
// } else {
//     console.log(username);
//     console.log(hash);
//     pool.query(`INSERT INTO account (username,password,first_name,last_name,location,phone_number,email) values ('${username}','${hash}', '${firstname}','${lastname}','${location}','${phone}','${email}')`, (err,result) => {
//         if (err) {
//             console.log('error');
//         } else {
//             res.render('register', {message : 'Created successfully!'})
//         }
//     });

// }



module.exports = router