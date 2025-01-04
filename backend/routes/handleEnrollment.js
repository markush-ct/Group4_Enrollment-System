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
    }
});

router.get('/CSEnrollmentPeriod', (req, res) => {
    const sql1 = `SELECT * FROM enrollmentperiod WHERE ProgramID = 1 AND Status != 'Finished'`;

    db.query(sql1, (err, CSResult) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(CSResult.length > 0){
            return res.json({
                message: "Data fetched",
                csEnrollmentRes: CSResult[0]
            })
        } else{
            return res.json({
                message: "No data fetched",
            })
        }
    })
});

router.get('/ITEnrollmentPeriod', (req, res) => {
    const sql1 = `SELECT * FROM enrollmentperiod WHERE ProgramID = 2 AND Status != 'Finished'`;

    db.query(sql1, (err, ITResult) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(ITResult.length > 0){
            return res.json({
                message: "Data fetched",
                itEnrollmentRes: ITResult[0]
            })
        } else{
            return res.json({
                message: "No data fetched",
            })
        }
    })
});

router.get('/dcsViewEnrollment', (req, res) => {
    const sql1 = `SELECT * FROM employee WHERE Email = ?`;
    const sql2 = `SELECT * FROM enrollmentperiod WHERE ProgramID = ?`;

    db.query(sql1, req.session.email, (err, socOffResult) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(socOffResult.length > 0){
            db.query(sql2, socOffResult[0].ProgramID, (err,enrollmentRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(enrollmentRes.length > 0){
                    return res.json({message: "Enrollment fetched successfully", enrollmentPeriod: enrollmentRes[0]});
                }   
            })
        }
    });
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
                    return res.json({enrollmentPeriod: enrollmentRes[0]});
                }   
            })
        }
    });
});

router.get('/getEnrollment', (req, res) =>{
    const sql1 = `SELECT * FROM student WHERE Email = ?`;
    const sql2 = `SELECT * FROM enrollmentperiod WHERE ProgramID = ?`;
    
    db.query(sql1, req.session.email, (err, emailRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(emailRes.length > 0){
            db.query(sql2, emailRes[0].ProgramID, (err, enrollmentRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(enrollmentRes.length > 0){
                    return res.json({message: "Enrollment fetched successfully", enrollmentPeriod: enrollmentRes[0]});
                }
            })
        }
    })
})

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