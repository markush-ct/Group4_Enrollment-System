import express from 'express';
import mysql from 'mysql';
import dbConfig from '../db/dbConfig.js';


dotenv.config();
const router = express.Router();

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
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