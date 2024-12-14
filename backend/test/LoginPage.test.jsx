const request = require('supertest');
const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cvsuenrollmentsystem'
});


jest.mock('mysql', () => ({
    createConnection: jest.fn().mockReturnValue({
        query: jest.fn()
    })
}));


app.post('/LoginPage', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    const query = 'SELECT * FROM account WHERE Email = ? AND Password = ?';
    db.query(query, [email, password], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            const user = results[0];
            if (user.Status === 'Terminated') {
                return res.status(400).json({
                    message: 'Account is no longer active. Fill out contact form to ask for reactivation',
                    isLoggedIn: false
                });
            }
            return res.status(200).json({
                message: 'Login successful',
                isLoggedIn: true,
                role: user.Role,
                email: user.Email
            });
        } else {
            return res.status(400).json({
                message: 'Invalid credentials',
                isLoggedIn: false
            });
        }
    });
});


describe('POST /LoginPage', () => {
    beforeEach(() => {
        mysql.createConnection().query.mockReset();
    });

    
    it('Should return an error when email or password is missing', async () => {
        const response = await request(app)
            .post('/LoginPage')
            .send({ email: '', password: '' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email and password are required');
    });


    it('Should return an error for invalid email format', async () => {
        const response = await request(app)
            .post('/LoginPage')
            .send({ email: 'invalid-email', password: 'password123' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid email format');
    });


    it('Should return a successful login for valid credentials', async () => {
        mysql.createConnection().query.mockImplementationOnce((sql, params, callback) => {
            if (sql.includes('SELECT * FROM account WHERE Email = ? AND Password = ?')) {
                const email = params[0];
                const password = params[1];
                if (email === 'enrollmentofficer@cvsu.edu.ph' && password === 'admin') {
                    callback(null, [{
                        AccountID: 1,
                        Name: 'Enrollment Officer',
                        Role: 'Enrollment Officer',
                        Status: 'Active',
                        Email: 'enrollmentofficer@cvsu.edu.ph'
                    }]);
                } else {
                    callback(null, []);
                }
            }
        });

        const response = await request(app)
            .post('/LoginPage')
            .send({ email: 'enrollmentofficer@cvsu.edu.ph', password: 'admin' });

        expect(response.body.message).toBe('Login successful');
        expect(response.body.isLoggedIn).toBe(true);
        expect(response.body.role).toBe('Enrollment Officer');
        expect(response.body.email).toBe('enrollmentofficer@cvsu.edu.ph');
    });


    it('Should return an error for invalid credentials', async () => {
        mysql.createConnection().query.mockImplementationOnce((sql, params, callback) => {
            callback(null, []);
        });

        const response = await request(app)
            .post('/LoginPage')
            .send({ email: 'enrollmentofficer@cvsu.edu.ph', password: 'enrollmentofficer' });

        expect(response.body.message).toBe('Invalid credentials');
        expect(response.body.isLoggedIn).toBe(false);
    });


    it('Should return an error for terminated accounts', async () => {
        mysql.createConnection().query.mockImplementationOnce((sql, params, callback) => {
            const email = params[0];
            const password = params[1];
            if (email === 'jenniekim@bp.com' && password === 'rubyjane') {
                callback(null, [{
                    AccountID: 2,
                    Name: 'Jane Doe',
                    Role: 'Student',
                    Status: 'Terminated',
                    Email: 'jenniekim@bp.com'
                }]);
            } else {
                callback(null, []);
            }
        });

        const response = await request(app)
            .post('/LoginPage')
            .send({ email: 'jenniekim@bp.com', password: 'rubyjane' });

        expect(response.body.message).toBe('Account is no longer active. Fill out contact form to ask for reactivation');
        expect(response.body.isLoggedIn).toBe(false);
    });


    it('Should return an error if there is a database error', async () => {
        mysql.createConnection().query.mockImplementationOnce((sql, params, callback) => {
            callback(new Error('Database error'), []); 
        });

        const response = await request(app)
            .post('/LoginPage')
            .send({ email: 'donnavirtudez@gmail.com', password: 'mamamoblue' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Database error');
    });
});

module.exports = app;  
