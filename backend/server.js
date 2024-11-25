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

// FETCH ACCOUNT REQUESTS
app.get('/getAccountReq', (req, res) => {
    const sql = `
        SELECT CONCAT(Firstname, ' ', Lastname) AS Name, Email, StudentType AS AccountType FROM student WHERE RegStatus = 'Pending'
        UNION
        SELECT CONCAT(Firstname, ' ', Lastname) AS Name, Email, EmpJobRole AS AccountType FROM employee WHERE RegStatus = 'Pending'
        UNION
        SELECT CONCAT(Firstname, ' ', Lastname) AS Name, Email, 'Society Officer' AS AccountType
        FROM societyofficer WHERE RegStatus = 'Pending'`;

    db.query(sql, (err, result) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else {
            return res.json({
                accReq: result
            })
        }
    })
})

//FETCH TOTAL NUMBER OF PENDING ACCOUNT REQUESTS
app.get('/pendingAccounts', (req, res) => {
    const studentQuery = `SELECT COUNT(*) AS studentCount from student WHERE RegStatus = 'Pending'`;
    const socOfficerQuery = `SELECT COUNT(*) AS socOfficerCount from societyofficer WHERE RegStatus = 'Pending'`;
    const employeeQuery = `SELECT COUNT(*) AS employeeCount from employee WHERE RegStatus = 'Pending'`;

    db.query(studentQuery, (err, studentResult) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else {
            db.query(socOfficerQuery, (err, socOfficerResult) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else {
                    db.query(employeeQuery, (err, employeeResult) => {
                        if(err){
                            return res.json({message: "Error in server: " + err});
                        } else {
                            return res.json({
                                studentCount: studentResult[0].studentCount,
                                socOfficerCount: socOfficerResult[0].socOfficerCount,
                                employeeCount: employeeResult[0].employeeCount
                            })
                        }
                    })
                }
            })
        }
    })
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

//COUNT NUMBER OF REGULAR STUDENTS IN CS FOR ADMIN DASHBOARD
app.get('/getCS', (req, res) => {
    const sql = `SELECT COUNT(*) AS CScount from student WHERE (StudentType = 'Regular' OR StudentType = 'Irregular') AND RegStatus = 'Accepted' AND ProgramID = 1`;
    db.query(sql, (err, result) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else{
            return res.json({ CScount: result[0].CScount });
        }
    })
});

//COUNT NUMBER OF REGULAR STUDENTS IN IT FOR ADMIN DASHBOARD
app.get('/getIT', (req, res) => {
    const sql = `SELECT COUNT(*) AS ITcount from student WHERE (StudentType = 'Regular' OR StudentType = 'Irregular') AND RegStatus = 'Accepted' AND ProgramID = 2`;
    db.query(sql, (err, result) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else{
            return res.json({ ITcount: result[0].ITcount });
        }
    })
});


//SIGN UP FOR REG/IRREG, SOC OFFICER, AND EMPLOYEE
app.post('/CreateAcc', (req, res) => {
    //AVOID EMAIL DUPLICATION IN ACCOUNT TABLE
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
                        //AVOID EMAIL DUPLICATION IN STUDENT TABLE
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
                //AVOID EMAIL DUPLICATION IN SOCIETYOFFICER TABLE
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
                //AVOID ID DUPLICATION IN EMPLOYEE TABLE
                const employeeIDQuery = `SELECT * FROM employee WHERE EmployeeID = ?`;
                db.query(employeeIDQuery, req.body.employeeID, (err, result) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    } else if (result.length >= 1) {
                        return res.json({ message: "Employee ID exists" });
                    } else {
                        //AVOID EMAIL DUPLICATION IN EMPLOYEE TABLE
                        const employeeEmailQuery = `SELECT * FROM employee WHERE Email = ?`;
                        db.query(employeeEmailQuery, req.body.email, (err, result) => {
                            if (err) {
                                return res.json({ message: "Error in server: " + err });
                            } else if (result.length >= 1) {
                                return res.json({ message: "Email exists" });
                            } else {
                                //NO PROGRAM ID STORED FOR ADVISER, ENROLLMENT OFFICER AND SCHOOL HEAD
                                if (req.body.position === "Adviser" || req.body.position === "Enrollment Officer" || req.body.position === "School Head") {
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
                                } else if (req.body.position === "DCS Head") {
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

//LOGOUT
app.post("/logoutFunction", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.json({ valid: false, message: "Logout failed." });
            }
            res.clearCookie("connect.sid"); // Ensure session cookie is removed
            return res.json({ valid: false, message: "Logout successful." });
        });
    } else {
        return res.json({ valid: false, message: "No active session." });
    }
});


//LOGIN
app.get('/', (req, res) => {
    if (req.session && req.session.accountID) {
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
            if (user.Status === "Terminated"){
                return res.json({message : "Account is no longer active. Fill out contact form to ask for reactivation", isLoggedIn: false});
            } else if (user.Status === "Active"){
                req.session.accountID = user.AccountID;
            req.session.name = user.Name;
            req.session.role = user.Role;            

            return res.json({
                message: 'Login successful',
                role: req.session.role,
                email: user.Email,
                accountID: req.session.accountID,
                status: user.Status,
                isLoggedIn: true,
                name: req.session.name
            });
            }
            
        } else {
            return res.json({ message: "Invalid credentials", isLoggedIn: false })
        }
    });
});

app.listen(8080, () => {
    console.log('Server is running');
})