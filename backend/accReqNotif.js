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
    const studentCountQuery = `SELECT COUNT(*) as studentCount FROM student WHERE RegStatus = 'Pending' AND StudentType NOT IN ('Regular', 'Irregular')`;
    const empCountQuery = `SELECT COUNT(*) as empCount FROM employee WHERE RegStatus = 'Pending'`;
    const societyCountQuery = `SELECT COUNT(*) as societyCount FROM societyofficer WHERE RegStatus = 'Pending'`;

    db.query(studentCountQuery, (err, studentRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err.message });
        }

        db.query(empCountQuery, (err, empRes) => {
            if (err) {
                return res.json({ message: "Error in server: " + err.message });
            }

            db.query(societyCountQuery, (err, societyRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err.message });
                }

                return res.json({
                    studentCount: studentRes[0].studentCount,
                    empCount: empRes[0].empCount,
                    societyCount: societyRes[0].societyCount
                });
            });
        });
        
    })
});

export default router;