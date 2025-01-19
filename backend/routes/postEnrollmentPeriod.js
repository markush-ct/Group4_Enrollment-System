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

router.post('/', (req, res) => {
    const sql1 = `SELECT * FROM societyofficer WHERE Email = ?`;
    const sql2 = `UPDATE enrollmentperiod 
    SET SocietyOfficerID = ?, 
        Start = ?,
        End = ?,
        Status = ?
    WHERE ProgramID = ?`;

    db.query(sql1, [req.session.email], (err, socOffResult) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(socOffResult.length > 0){
            const values = [
                socOffResult[0].SocietyOfficerID,
                req.body.start,
                req.body.end,
                "Pending",
                socOffResult[0].ProgramID,
            ];

            db.query(sql2, values, (err, postingRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(postingRes.affectedRows > 0){ 
                    return res.json({message: "Enrollment period posted successfully."});                    
                } else{
                    return res.json({message: "Error inserting in requirements table."});
                }
            });
        } else{
            return res.json({message: "Society officer not found."});
        }
    });
});

export default router;