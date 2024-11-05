import express from 'express'
import mysql from 'mysql'
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cvsuenrollmentsystem'
})

app.post('/LoginPage', (req, res) => {
    const sql = 'SELECT * FROM account WHERE Email = ? AND Password = ?';
    const { email, password } = req.body;

    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ message: 'Login Failed', error: err });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = results[0];
        
        // Send the user's role along with the response
        res.json({
            message: 'Login successful',
            role: user.Role,
            user: { email: user.Email, name: user.Name }
        });
    });
});


app.listen(8080, () => {
    console.log('listening');
})