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
    const sql = `SELECT * FROM program`;
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
    const emailQuery = `SELECT * FROM account WHERE Email = ?`;

    db.query(emailQuery, req.body.email, (err, result) => {
        if (err) return res.json({ message: "Error in server: " + err });

        if (result.length >= 1) {
            return res.json({ message: "Email exists" });
        } else {
            //STORE DIFFERENT DATA ON DIFFERENT COLUMNS DEPENDING ON APPLICANT TYPE
            const applicantType = req.body.applicantCategory;

            if (applicantType === "Regular/Irregular") {
                //CHECK STUDENT ID TO AVOID DUPLICATION
                const studentIDQuery = `SELECT * FROM student WHERE CvSUStudentID = ?`;
                db.query(studentIDQuery, req.body.studentID, (err, result) => {
                    if (err) return res.json({ message: "Error in server: " + err });

                    if (result.length >= 1) {
                        return res.json({ message: "Student ID exists" });
                    } else {
                        //CHECK EMAIL TO AVOID DUPLICATION
                        const cvsuEmailQuery = `SELECT * FROM student WHERE Email = ?`;
                        db.query(cvsuEmailQuery, req.body.email, (err, result) => {
                            if (err) return res.json({ message: "Error in server: " + err });

                            if (result.length >= 1) {
                                return res.json({ message: "Email exists" });
                            } else {
                                const regIrregQuery = `INSERT INTO student (Firstname, Middlename, Lastname, CvSUStudentID, Email, PhoneNo, ProgramID, StudentType)
                                                        VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
                                const regIrregValues = [
                                    req.body.firstname,
                                    req.body.middlename,
                                    req.body.lastname,
                                    req.body.studentID,
                                    req.body.email,
                                    req.body.contactnum,
                                    req.body.program,
                                    req.body.regIrreg
                                ]

                                db.query(regIrregQuery, regIrregValues, (err, result) => {
                                    if (err) {
                                        return res.json({ message: "Error in server: " + err });
                                    } else if (result.affectedRows > 0) {
                                        return res.json({ message: "Sign up successful. Wait for your temporary account to be sent through your email." });
                                    } else {
                                        return res.json({ message: "Sign up failed. No rows affected" });
                                    }
                                })
                            }
                        })
                    }
                })

            } else if (applicantType === "Society Officer") {
                //CHECK EMAIL TO AVOID DUPLICATION
                const socOfficerEmailQuery = `SELECT * FROM societyofficer WHERE Email = ?`;
                db.query(socOfficerEmailQuery, req.body.email, (err, result) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    } else if (result.length >= 1) {
                        return res.json({ message: "Email exists" });
                    } else {
                        const socOfficerQuery = `INSERT INTO societyofficer (Firstname, Middlename, Lastname, Email, PhoneNo, ProgramID, Position)
                                                VALUES(?, ?, ?, ?, ?, ?, ?)`;
                        const socOfficerValues = [
                            req.body.firstname,
                            req.body.middlename,
                            req.body.lastname,
                            req.body.email,
                            req.body.contactnum,
                            req.body.program,
                            req.body.position
                        ]

                        db.query(socOfficerQuery, socOfficerValues, (err, result) => {
                            if (err) {
                                return res.json({ message: "Error in server: " + err });
                            } else if (result.affectedRows > 0) {
                                return res.json({ message: "Sign up successful. Wait for your temporary account to be sent through your email." });
                            } else {
                                return res.json({ message: "Sign up failed. No rows affected" });
                            }
                        })
                    }
                })
            } else if (applicantType === "Employee") {
                //CHECK EMPLOYEE ID TO AVOID DUPLICATION
                const employeeIDQuery = `SELECT * FROM employee WHERE EmployeeID = ?`;
                db.query(employeeIDQuery, req.body.employeeID, (err, result) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    } else if (result.length >= 1) {
                        return res.json({ message: "Employee ID exists" });
                    } else {
                        //CHECK EMPLOYEE EMAIL
                        const employeeEmailQuery = `SELECT * FROM employee WHERE Email = ?`;
                        db.query(employeeEmailQuery, req.body.email, (err, result) => {
                            if (err) {
                                return res.json({ message: "Error in server: " + err });
                            } else if (result.length >= 1) {
                                return res.json({ message: "Email exists" });
                            } else {
                                //NO PROGRAM ID STORED FOR ENROLLMENT OFFICER AND SCHOOL HEAD
                                if (req.body.position === "Enrollment Officer" || req.body.position === "School Head") {
                                    const employeeQuery = `INSERT INTO employee (Firstname, Middlename, Lastname, EmployeeID, Email, PhoneNo, EmpJobRole)
                                                        VALUES(?, ?, ?, ?, ?, ?, ?)`;
                                    const employeeValues = [
                                        req.body.firstname,
                                        req.body.middlename,
                                        req.body.lastname,
                                        req.body.employeeID,
                                        req.body.email,
                                        req.body.contactnum,
                                        req.body.position
                                    ]

                                    db.query(employeeQuery, employeeValues, (err, result) => {
                                        if (err) {
                                            return res.json({ message: "Error in server: " + err });
                                        } else if (result.affectedRows > 0) {
                                            return res.json({ message: "Sign up successful. Wait for your temporary account to be sent through your email." });
                                        } else {
                                            return res.json({ message: "Sign up failed. No rows affected" });
                                        }
                                    })

                                    //WITH PROGRAM ID STORED FOR ADVISER AND DCS HEAD
                                } else if (req.body.position === "Adviser" || req.body.position === "DCS Head") {
                                    const employeeQuery = `INSERT INTO employee (Firstname, Middlename, Lastname, EmployeeID, Email, PhoneNo, EmpJobRole, ProgramID)
                                                        VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
                                    const employeeValues = [
                                        req.body.firstname,
                                        req.body.middlename,
                                        req.body.lastname,
                                        req.body.employeeID,
                                        req.body.email,
                                        req.body.contactnum,
                                        req.body.position,
                                        req.body.program
                                    ]

                                    db.query(employeeQuery, employeeValues, (err, result) => {
                                        if (err) {
                                            return res.json({ message: "Error in server: " + err });
                                        } else if (result.affectedRows > 0) {
                                            return res.json({ message: "Sign up successful. Wait for your temporary account to be sent through your email." });
                                        } else {
                                            return res.json({ message: "Sign up failed. No rows affected" });
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }
        }
    })
})

//SIGN UP FOR FRESHMEN, TRANSFERES, AND SHIFTEES
app.post('/SignUp', (req, res) => {
    //CHECK IF EMAIL EXISTS TO AVOID ENTRY DUPLICATION
    const emailQuery = `SELECT * FROM student WHERE Email = ?`;

    db.query(emailQuery, req.body.email, (err, result) => {
        if (err) return res.json("Error in server: " + err);

        if (result.length >= 1) {
            return res.json({ message: "Email exists" });
        } else {
            const applicantType = req.body.applicantCategory;
            //STORE DIFFERENT DATA ON DIFFERENT COLUMNS DEPENDING ON STUDENT TYPE
            if (applicantType === "Freshman" || applicantType === "Transferee") {
                const query1 = `INSERT INTO student (StudentType, Firstname, Middlename, Lastname, LastSchoolAttended, Email, PhoneNo, ProgramID)
                                VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
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

                db.query(query1, values1, (err, result) => {
                    if (err) {
                        return res.json({ message: "Error in server" + err })
                    } else if (result.affectedRows > 0) {
                        return res.json({ message: "Sign up successful. Wait for your temporary account to be sent through your email." });
                    } else {
                        return res.json({ message: "Sign up failed. No rows affected" });
                    }
                })
            } else if (applicantType === "Shiftee") {
                //CHECK IF CvSU STUDENT ID EXISTS TO AVOID ENTRY DUPLICATION
                const studentIDQuery = `SELECT * FROM student WHERE CvSUStudentID = ?`;

                db.query(studentIDQuery, req.body.studentID, (err, result) => {
                    if (err) return res.json({ message: "Error in server" + err });

                    if (result.length >= 1) {
                        return res.json({ message: "Student ID exists" })
                    } else {
                        const query2 = `INSERT INTO student (StudentType, Firstname, Middlename, Lastname, CvSUStudentID, PrevProgram, Year, Email, ProgramID)
                                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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

                        db.query(query2, values2, (err, result) => {
                            if (err) {
                                return res.json({ message: "Error in server" + err });
                            } else if (result.affectedRows > 0) {
                                return res.json({ message: "Sign up successful. Wait for your temporary account to be sent through your email." });
                            } else {
                                return res.json({ message: "Sign up failed. No rows affected" });
                            }
                        })
                    }
                })
            }
        }
    })
})

//LOGIN
app.get('/', (req, res) => {
    if (req.session.id) {
        return res.json({ valid: true, accountID: req.session.accountID , name: req.session.name, role: req.session.role })
    } else {
        return res.json({ valid: false })
    }
})

app.post('/LoginPage', (req, res) => {
    const sql = `SELECT * FROM account WHERE Email = ? AND Password = ?`;
    const { email, password } = req.body;

    db.query(sql, [email, password], (err, result) => {
        if (err) return res.json({ message: "Error in server" + err });

        const user = result[0];
        if (result.length > 0) {
            req.session.accountID = user.AccountID;
            req.session.name = user.Name;
            req.session.role = user.Role;            

            //TODO: CONDITION FOR WHEN STATUS IS TERMINATED
            return res.json({
                message: 'Login successful',
                role: req.session.role,
                email: user.Email,
                accountID: req.session.id,
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