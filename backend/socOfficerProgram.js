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
    const sql = 'SELECT * FROM societyofficer WHERE Email = ?';

    db.query(sql, req.session.email, (err, result) => {
        if (err) {
            console.error('Error getting society officer:', err.message);
            return res.json('Error getting society officer.');
        } else if(result.length > 0) {
            console.log('result:', result[0].ProgramID);
            return res.json({program: result[0].ProgramID});
        }
    });
});

export default router;