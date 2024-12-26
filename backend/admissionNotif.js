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

router.get('/', (req, res) => {
    const freshmen = `
    SELECT 
        s.StudentID,
        COUNT(af.StudentID) AS admissionCount
    FROM 
        student s
    LEFT JOIN 
        admissionform af
    ON 
        s.StudentID = af.StudentID
    WHERE
        s.RegStatus = 'Accepted' 
        AND s.StudentType = 'Freshman' 
        AND af.AdmissionStatus = 'Submitted'
    GROUP BY 
        s.StudentID`;

    const transferee = `
    SELECT 
        s.StudentID,
        COUNT(af.StudentID) AS admissionCount
    FROM 
        student s
    LEFT JOIN 
        admissionform af
    ON 
        s.StudentID = af.StudentID
    WHERE
        s.RegStatus = 'Accepted' 
        AND s.StudentType = 'Transferee' 
        AND af.AdmissionStatus = 'Submitted'
    GROUP BY 
        s.StudentID`;

    db.query(freshmen, (err, freshmenRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err.message });
        }

        db.query(transferee, (err, transfereeRes) => {
            if (err) {
                return res.json({ message: "Error in server: " + err.message });
            }

            return res.json({
                freshmenCount: freshmenRes.length,
                transfereeCount: transfereeRes.length
            });
        });
    });
    
});

export default router;