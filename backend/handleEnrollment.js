import express from 'express';
import mysql from 'mysql';

const router = express.Router();

// Create a database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cvsuenrollmentsystem'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

router.get('/viewEnrollmentPeriod', (req, res) => {
    const sql1 = `SELECT * FROM societyofficer WHERE Email = ?`;
    const sql2 = `SELECT * FROM enrollmentperiod WHERE ProgramID = ?`;

    db.query(sql1, req.session.email, (err, socOffResult) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(socOffResult.length > 0){
            db.query(sql2, socOffResult[0].ProgramID, (err,enrollmentRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(enrollmentRes.length > 0){
                    console.log(enrollmentRes[0]);
                    return res.json({enrollmentPeriod: enrollmentRes[0]});
                }   
            })
        }
    });
});

router.post('/startEnrollment', (req, res) => {
    const sql1 = `SELECT * FROM societyofficer WHERE Email = ?`;
    const sql2 = `UPDATE enrollmentperiod
    SET Status = 'Ongoing'
    WHERE ProgramID = ?`;

    db.query(sql1, req.session.email, (err, emailRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(emailRes.length > 0){
            db.query(sql2, emailRes[0].ProgramID, (err, updateRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(updateRes.affectedRows > 0){
                    return res.json({message: "Enrollment is now ongoing"});
                }
            })
        }
    })
})

router.post('/finishEnrollment', (req, res) => {
    const sql1 = `SELECT * FROM societyofficer WHERE Email = ?`;
    const sql2 = `UPDATE enrollmentperiod
    SET SocietyOfficerID = null,
        Start = null,
        End = null,
        Status = 'Finished'
    WHERE ProgramID = ?`;

    db.query(sql1, req.session.email, (err, emailRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(emailRes.length > 0){
            db.query(sql2, emailRes[0].ProgramID, (err, updateRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(updateRes.affectedRows > 0){
                    return res.json({message: "Enrollment ended"});
                }
            })
        }
    })
})

export default router;