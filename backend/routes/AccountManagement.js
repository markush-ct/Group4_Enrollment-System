import express from 'express';
import mysql from 'mysql';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dbConfig from '../db/dbConfig.js';

dotenv.config();
const router = express.Router();

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    }
});


function generateRandomPassword(length = 8) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gerlyntan07@gmail.com', // Sender email
        pass: 'sgpd rzwu zhna gbua' // Sender App Password
    }
});

router.post('/editOldStudent', (req, res) => {
    const { email, status, studentType } = req.body;

    const sql1 = `UPDATE student
    SET StdStatus = ?,
        StudentType = ?
    WHERE Email = ?`;

    db.query(sql1, [status, studentType, email], (err, studentRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (studentRes.affectedRows > 0) {
            if (["Active", "Inactive", "On Leave"].includes(status)) {
                const updateAcc = `UPDATE account
                SET Status = 'Active'
                WHERE Email = ?`;
                
                db.query(updateAcc, email, (err, activateAccRes) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    } else if (activateAccRes.affectedRows > 0) {
                        return res.json({ message: "Student updated successfully" });
                    } else {
                        return res.json({ message: "Account update failed." });
                    }
                })
            } else {
                const updateAcc = `UPDATE account
                SET Status = 'Terminated'
                WHERE Email = ?`;

                db.query(updateAcc, email, (err, terminateAccRes) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    } else if (terminateAccRes.affectedRows > 0) {
                        return res.json({ message: "Student updated successfully" });
                    } else {
                        return res.json({ message: "Account update failed." });
                    }
                })
            }
        } else {
            return res.json({ message: "No student record updated" });
        }
    })
})

router.post('/editNewStudent', (req, res) => {
    const getEmpID = `SELECT * FROM employee WHERE Email = ?`;

    db.query(getEmpID, req.session.email, (err, empRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (empRes.length > 0) {
            const empID = empRes[0].EmployeeID;

            const values = [
                req.body.studentID,
                req.body.studentType,
                req.body.year,
                req.body.section,
                req.body.semester,
                req.body.email,
            ]

            const sql1 = `UPDATE student
                SET CvSUStudentID = ?,
                    StudentType = ?,
                    Year = ?,
                    Section = ?,
                    Semester = ?
                WHERE Email = ?`;

            db.query(sql1, values, (err, shiftRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (shiftRes.affectedRows > 0) {
                    const getStudentID = `SELECT * FROM student WHERE Email = ?`;
                    
                    db.query(getStudentID, req.body.email, (err, studentIDRes) => {
                        if (err) {
                            return res.json({ message: "Error in server: " + err });
                        } else if(studentIDRes.length > 0){
                            const sql2 = `INSERT INTO enrollment (EmployeeID, StudentID, EnrollmentStatus) VALUES (?, ?, ?)`;

                            db.query(sql2, [empID, studentIDRes[0].StudentID, "Enrolled"], (err, enrollRes) => {
                                if (err) {
                                    return res.json({ message: "Error in server: " + err });
                                } else if (enrollRes.affectedRows > 0) {
                                    return res.json({ message: "Student updated successfully" });
                                } else {
                                    return res.json({ message: "No student record updated" });
                                }
                            });
                        }
                    });                    
                } else {
                    return res.json({ message: "No student record updated" });
                }
            })
        } else{
            return res.json({ message: "No employee record found." });
        }
    });




})

router.post('/editSocOfficerAccount', (req, res) => {
    const updateSoc = `UPDATE societyofficer
    SET Position = ?,
        OfficerStatus = ?
    WHERE Email = ?`;

    const { email, position, status } = req.body;

    db.query(updateSoc, [position, status, email], (err, socRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (socRes.affectedRows > 0) {
            if (status === "Resigned") {
                const updateAcc = `UPDATE account
                SET Status = 'Terminated',
                    Role = 'Society Officer'
                WHERE Email = ?`;

                db.query(updateAcc, email, (err, resignedRes) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    } else if (resignedRes.affectedRows > 0) {
                        return res.json({ message: "Society officer updated successfully" });
                    } else {
                        return res.json({ message: "Account update failed." });
                    }
                })
            } else if (status === "Elected") {
                const updateResigned = `UPDATE account
                SET Status = 'Active',
                    Role = 'Society Officer'
                WHERE Email = ?`;

                db.query(updateResigned, email, (err, activateRes) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    } else if (activateRes.affectedRows > 0) {
                        return res.json({ message: "Society officer updated successfully" });
                    } else {
                        return res.json({ message: "Account update failed." });
                    }
                })
            } else {
                return res.json({ message: "Society officer updated successfully" });
            }
        } else {
            return res.json({ message: "No society officer record updated." });
        }
    })
})

router.post('/editEmpAccount', (req, res) => {
    const updateEmp = `UPDATE employee
    SET EmpJobRole = ?,
        EmpStatus = ?
    WHERE Email = ?`;

    const updateAccRole = `
    UPDATE account
    SET Role = ?
    WHERE Email = ?
    `;

    const { email, job, status } = req.body;

    const values = [
        job,
        status,
        email
    ];

    db.query(updateAccRole, [job, email], (err, accRoleRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (accRoleRes.affectedRows > 0) {
            db.query(updateEmp, values, (err, empRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (empRes.affectedRows > 0) {


                    if (status === "Resigned") {
                        const updateAcc = `UPDATE account
                        SET Status = 'Terminated'
                        WHERE Email = ?`;

                        db.query(updateAcc, email, (err, resignedRes) => {
                            if (err) {
                                return res.json({ message: "Error in server: " + err });
                            } else if (resignedRes.affectedRows > 0) {
                                return res.json({ message: "Employee updated successfully" });
                            } else {
                                return res.json({ message: "Account update failed." });
                            }
                        })
                    } else if (status === "Employed") {
                        const updateResigned = `UPDATE account
                        SET Status = 'Active'
                        WHERE Email = ?`;

                        db.query(updateResigned, email, (err, activateRes) => {
                            if (err) {
                                return res.json({ message: "Error in server: " + err });
                            } else if (activateRes.affectedRows > 0) {
                                return res.json({ message: "Employee updated successfully" });
                            } else {
                                return res.json({ message: "Account update failed." });
                            }
                        })
                    } else {
                        return res.json({ message: "Employee updated successfully" });
                    }
                } else {
                    return res.json({ message: "No employee record updated." });
                }
            })
        }
    })
})


router.post('/activateAccount', async (req, res) => {
    const { email, name, role } = req.body;

    if (!email || !name || !role) {
        return res.json({ message: 'Email and name are required.' });
    }

    const tempPassword = generateRandomPassword(8);

    const emailBody = `
    Hello ${name},

    Your account has been activated. Login with your temporary password and change it as soon as possible.

    Username: ${email}
    Temporary Password: ${tempPassword}

    Best regards,
    CvSU Enrollment Officer
  `;

    const mailOptions = {
        from: 'gerlyntan07@gmail.com',
        to: email,
        subject: 'Account Activation',
        text: emailBody,
    };


    try {
        console.log('Sending email', emailBody);
        await transporter.sendMail(mailOptions);

        const terminateQuery = `UPDATE account
        SET Status = 'Active',
            Password = ?
        WHERE Email = ?`;

        db.query(terminateQuery, [tempPassword, email], (err, terminateRes) => {
            if (err) {
                return res.json({ message: "Error in server: " + err });
            } else if (terminateRes.affectedRows > 0) {
                return res.json({ message: "Account status activated" });
            }
        })

    } catch (error) {
        res.json({
            message: 'Internal server error. Please check your internet connection.',
            error: error.message,
        });
    }
});

router.post('/terminateAccount', async (req, res) => {
    const { email, name, role } = req.body;

    if (!email || !name || !role) {
        return res.json({ message: 'Email and name are required.' });
    }

    const emailBody = `
    Hello ${name},

    Your account has been terminated. 

    Best regards,
    CvSU Enrollment Officer
  `;

    const mailOptions = {
        from: 'gerlyntan07@gmail.com',
        to: email,
        subject: 'Account Termination',
        text: emailBody,
    };


    try {
        console.log('Sending email to:', email);
        await transporter.sendMail(mailOptions);

        const terminateQuery = `UPDATE account
        SET Status = 'Terminated'
        WHERE Email = ?`;

        db.query(terminateQuery, email, (err, terminateRes) => {
            if (err) {
                return res.json({ message: "Error in server: " + err });
            } else if (terminateRes.affectedRows > 0) {
                return res.json({ message: "Account status terminated" });
            }
        })

    } catch (error) {
        console.error('Error in /terminateAccount:', error);
        res.json({
            message: 'Internal server error. Please check your internet connection.',
            error: error.message,
        });
    }
});

router.get('/getAccounts', (req, res) => {
    const sql1 = `
SELECT 
a.AccountID,
  a.Email,
  a.Name,
  a.Role,
  a.Status,
  s.ProgramID AS studentProgramID,
  s.StudentID,
  s.CvSUStudentID,
  s.StudentType,
  s.StdStatus,
  so.ProgramID AS socOfficerProgramID,  
  so.Position,
  so.OfficerStatus,
  e.EmpStatus,
  e.ProgramID AS employeeProgramID
FROM 
  account a
LEFT JOIN 
  student s ON a.Email = s.Email
LEFT JOIN 
  societyofficer so ON a.Email = so.Email
LEFT JOIN 
  employee e ON a.Email = e.Email
`;

    db.query(sql1, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            return res.json({
                message: "Records fetched",
                accountResults: result.map(row => ({
                    account: {
                        accountID: row.AccountID,
                        email: row.Email,
                        name: row.Name,
                        role: row.Role,
                        accStatus: row.Status,
                    },
                    student: {
                        programID: row.studentProgramID,
                        studentID: row.StudentID,
                        cvsuStudentID: row.CvSUStudentID,
                        email: row.Email,
                        studentType: row.StudentType,
                        studentStatus: row.StdStatus,
                    },
                    socOfficer: {
                        programID: row.socOfficerProgramID,
                        position: row.Position,
                        status: row.OfficerStatus,
                        email: row.Email,
                    },
                    employee: {
                        empStatus: row.EmpStatus,
                        programID: row.employeeProgramID,
                    }
                }))
            })
        }
    })
});

export default router;