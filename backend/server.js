import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cvsuenrollmentsystem'
})

app.get('/', (req, res) => {
    if(req.session.name){
        return res.json({valid: true, name: req.session.name, role: req.session.role})
    } else{
        return res.json({valid: false})
    }
})

app.post('/LoginPage', (req, res) => {
    const sql = 'SELECT * FROM account WHERE Email = ? AND Password = ?';
    const { email, password } = req.body;

    db.query(sql, [email, password], (err, result) => {
        if (err) return res.json({ message: "Error in server" });

        const user = result[0];
        if (result.length > 0) {
            req.session.name = user.Name;
            req.session.role = user.Role;

            return res.json({
                message: 'Login successful',
                role: req.session.role,
                user: user.Email,
                status: user.Status,
                isLoggedIn: true,
                name: req.session.name
            });
        } else{
            return res.json({ message: "Invalid credentials", isLoggedIn: false })
        }
    });
});

app.listen(8080, () => {
    console.log('Server is running');
})