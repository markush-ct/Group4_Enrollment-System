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