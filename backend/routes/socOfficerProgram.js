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

router.get('/socOfficerProgram', (req, res) => {
    const sql = 'SELECT * FROM societyofficer WHERE Email = ?';

    db.query(sql, req.session.email, (err, result) => {
        if (err) {
            console.error('Error getting society officer:', err.message);
            if (err.fatal) {
                db.end(); // Close the connection
                db.connect(); // Reconnect if necessary
            }
            return res.json('Error getting society officer.');
        } else if(result.length > 0) {
            return res.json({program: result[0].ProgramID});
        } else {
            return res.json('No society officer found.');
        }
    });
});


export default router;