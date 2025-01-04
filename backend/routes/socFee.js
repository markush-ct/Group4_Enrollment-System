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

router.get('/getStudentSocFeeStatus', (req, res) => {
    const sql = `SELECT r.StudentID, s.CvSUStudentID, s.Email, s.Year, s.Section, r.SocFeePayment
    FROM student s
    JOIN requirements r ON s.StudentID = r.StudentID
    WHERE s.Email = ?`;

    db.query(sql, req.session.email, (err, results) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        }
        res.json({ records: results[0] });
    });
});

router.post('/searchSocFee', (req, res) => {
    const { searchQuery } = req.body;
    const sql = `
        SELECT s.StudentID, s.CvSUStudentID, s.Firstname, s.Lastname, s.Year, s.Section, r.SocFeePayment
        FROM student s
        JOIN requirements r ON s.StudentID = r.StudentID
        WHERE CONCAT(s.CvSUStudentID, s.Firstname, s.Lastname, s.Year, s.Section, r.SocFeePayment) LIKE ?`;

    db.query(sql, [`%${searchQuery}%`], (err, results) => {
        if (err) {
            return res.json({ message: "Error fetching data: " + err });
        }
        res.status(200).json({ records: results });
    });
});



//Get all pending society fees
router.get('/getSocFee', (req, res) => {
    const sql1 = `SELECT * FROM societyofficer WHERE Email = ?`;

    const sql2 = `SELECT s.StudentID, s.CvSUStudentID, s.Firstname, s.Lastname, s.Year, s.Section, s.StudentType, r.SocFeePayment
    FROM student s
    JOIN requirements r ON s.StudentID = r.StudentID
    WHERE s.ProgramID = ? AND r.SocFeePayment = 'Pending'`;

    db.query(sql1, req.session.email, (err, emailRes) => {
        if(err){
            return res.json({ message: "Error in server: " + err });
        } else if(emailRes.length > 0){
            db.query(sql2, emailRes[0].ProgramID, (err, socfeeRes) => {
                if(err){
                    return res.json({ message: "Error in server: " + err });
                } else{
                    return res.json({ message: "Pending Soc Fee fetched", records: socfeeRes });
                }
            })
        }
    })
});

//Validate society fee and change to PAID
router.post('/verifyPaidSocFee', (req, res) => {
    const {studentID, cvsuStudentID} = req.body;

    const sql1 = `SELECT * FROM societyofficer WHERE Email = ?`;

    const sql2 = `UPDATE requirements 
    SET SocFeePayment = 'Paid',
        SocietyOfficerID = ?
    WHERE StudentID = ?`;

    db.query(sql1, req.session.email, (err, getIDRes) => {
        if(err){
            return res.json({ message: "Error in server: " + err });
        } else if(getIDRes.length > 0){

            db.query(sql2, [getIDRes[0].SocietyOfficerID, studentID], (err, updateRes) => {
                if(err){
                    return res.json({ message: "Error in server: " + err });
                } else if(updateRes.affectedRows > 0){
                    return res.json({message: "Society Fee changed to PAID"});
                }
            })
        }
    })
})

//Validate society fee and change to UNPAID
router.post('/verifyUnpaidSocFee', (req, res) => {
    const {studentID, cvsuStudentID} = req.body;

    const sql1 = `SELECT * FROM societyofficer WHERE Email = ?`;

    const sql2 = `UPDATE requirements 
    SET SocFeePayment = 'Unpaid',
        SocietyOfficerID = ?
    WHERE StudentID = ?`;

    db.query(sql1, req.session.email, (err, getIDRes) => {
        if(err){
            return res.json({ message: "Error in server: " + err });
        } else if(getIDRes.length > 0){

            db.query(sql2, [getIDRes[0].SocietyOfficerID, studentID], (err, updateRes) => {
                if(err){
                    return res.json({ message: "Error in server: " + err });
                } else if(updateRes.affectedRows > 0){
                    return res.json({message: "Society Fee changed to UNPAID"});
                }
            })
        }
    })
})

export default router;