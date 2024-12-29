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

router.get('/', (req, res) => {

    const sql = `
    SELECT * FROM 
        admissionform af
    JOIN 
        student s 
    ON 
        af.StudentID = s.StudentID
    JOIN 
        slotconfirmation sc 
    ON 
        af.AdmissionID = sc.AdmissionID
    WHERE af.AdmissionStatus = 'Approved' AND sc.IsSlotConfirmed = 1`;



    db.query(sql, (err, admissionRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err.message });
        }

        return res.json({
            admissionRes: admissionRes
        });
    });
});

export default router;