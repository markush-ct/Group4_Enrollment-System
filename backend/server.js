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

app.listen(8080, () => {
    console.log('listening');
})

app.post('/LoginPage', (req, res) => {
    const sql = 'SELECT * FROM account WHERE Email = ? AND Password = ?';
    const { email, password } = req.body;

    db.query(sql, [email, password], (err, result) => {
        if (err) return res.json({ message: "Error in server" });
        if (result === 0) return res.json({ message: "Invalid credentials" });

        const user = result[0];
        res.json({
            message: 'Login successful',
            role: user.Role,
            user: { email: user.Email, name: user.Name },
            status: user.Status
        })

    });
});