import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';
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