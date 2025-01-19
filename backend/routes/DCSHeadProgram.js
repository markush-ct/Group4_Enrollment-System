import express from 'express';
import mysql from 'mysql';
import dbConfig from './db/dbConfig.js';


dotenv.config();
const router = express.Router();

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    }
});

router.get('/', (req, res) => {
    const sql = `SELECT * FROM employee WHERE Email = ? AND EmpJobRole = 'DCS Head'`;

    db.query(sql, req.session.email, (err, result) => {
        if (err) {
            return res.json('Error getting DCS Head.');
        } else if(result.length > 0) {
            return res.json({program: result[0].ProgramID});
        }
    });
});

export default router;