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

app.get('/programs', (req, res) => {
    //GET PROGRAMS (IT & CS)
    const sql = 'SELECT * FROM program';
    db.query(sql, (err, result) => {
        if (err) {
            console.log('Error getting programs: ' + err)
            return res.json({ message: 'Error' + err })
        } else {
            const programs = result.map(row => ({
                programID: row.ProgramID,
                programName: row.ProgramName,
            }));

            return res.json(programs);

        }
    })
})

//SIGN UP FOR REG/IRREG, SOC OFFICER, AND EMPLOYEE
app.post('/CreateAcc', (req, res) => {
    const applicantType = req.body.applicantCategory;
    const values1 = [
        applicantType,
        req.body.firstname,
        req.body.middlename,
        req.body.lastname,
        req.body.studentID,
        req.body.email,
        req.body.contactnum,
        req.body.program
    ]

    const values2 = [
        applicantType,
        req.body.firstname,
        req.body.middlename,
        req.body.lastname,
        req.body.studentID,
        req.body.email,
        req.body.contactnum,
        req.body.program,
        req.body.position
    ]

    const values3 = [
        applicantType,
        req.body.firstname,
        req.body.middlename,
        req.body.lastname,
        req.body.employeeID,
        req.body.email,
        req.body.contactnum,
        req.body.position,
        req.body.program
    ]
    //TODO: QUERY FOR CREATEACC PAGE
})

//SIGN UP FOR FRESHMEN, TRANSFERES, AND SHIFTEES
app.post('/SignUp', (req, res) => {
    //CHECK IF EMAIL EXISTS TO AVOID ENTRY DUPLICATION
    const emailQuery = "SELECT * FROM student WHERE Email = ?";

    db.query(emailQuery, req.body.email, (err, result) => {
        if (err) return res.json("Error: " + err);

        const getEmailResult = result[0];
        if (result.length >= 1) {
            return res.json({ message: "Email exists" });
        } else {
            //CHECK IF CvSU STUDENT ID EXISTS TO AVOID ENTRY DUPLICATION
            const studentIDQuery = "SELECT * FROM student WHERE CvSUStudentID = ?";

            db.query(studentIDQuery, req.body.studentID, (err, result) => {
                const getIDResult = result[0];

                if (result.length >= 1) {
                    return res.json({ message: "StudentID exists" });
                } else {
                    //STORE DIFFERENT DATA ON DIFFERENT COLUMNS DEPENDING ON STUDENT TYPE
                    const applicantType = req.body.applicantCategory;
                    const values1 = [
                        applicantType,
                        req.body.firstname,
                        req.body.middlename,
                        req.body.lastname,
                        req.body.lastschoolattended,
                        req.body.email,
                        req.body.contactnum,
                        req.body.preferredProgram
                    ]

                    const values2 = [
                        applicantType,
                        req.body.firstname,
                        req.body.middlename,
                        req.body.lastname,
                        req.body.studentID,
                        req.body.prevProgram,
                        req.body.year,
                        req.body.email,
                        req.body.preferredProgram
                    ]

                    if (applicantType === "Freshman" || applicantType === "Transferee") {
                        const query1 = "INSERT INTO student (`StudentType`, `Firstname`, `Middlename`, `Lastname`, `LastSchoolAttended`, `Email`, `PhoneNo`, `ProgramID`) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";

                        db.query(query1, values1, (err, result) => {
                            if (err) {
                                return res.json({ message: "Error in server" + err })
                            } else {
                                return res.json({ message: "Sign up successful. Wait for your temporary account to be sent through your email." })
                            }
                        })
                    } else if (applicantType === "Shiftee") {
                        const query2 = "INSERT INTO student (`StudentType`, `Firstname`, `Middlename`, `Lastname`, `CvSUStudentID`, `PrevProgram`, `Year`, `Email`, `ProgramID`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";

                        db.query(query2, values2, (err, result) => {
                            if (err) {
                                return res.json({ message: "Error in server" + err })
                            } else {
                                return res.json({ message: "Sign up successful. Wait for your temporary account to be sent through your email." })
                            }
                        })
                    }

                }
            })
        }
    })
})

//LOGIN
app.get('/', (req, res) => {
    if (req.session.name) {
        return res.json({ valid: true, name: req.session.name, role: req.session.role })
    } else {
        return res.json({ valid: false })
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
        } else {
            return res.json({ message: "Invalid credentials", isLoggedIn: false })
        }
    });
});

app.listen(8080, () => {
    console.log('Server is running');
})