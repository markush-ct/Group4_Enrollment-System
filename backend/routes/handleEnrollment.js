import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';
import dbConfig from '../db/dbConfig.js';

dotenv.config();
const router = express.Router();

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    }
});

router.get('/getEnrolledStdCount', (req, res) => {
    const sql1 = `
    SELECT COUNT(*) AS enrolledStudents
    FROM enrollment
    WHERE EnrollmentStatus = 'Enrolled'`;

    db.query(sql1, (err, countRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if (countRes.length > 0){
            const enrolledStudents = countRes[0].enrolledStudents;
            return res.json({message: "Rows fetched", enrolledCount: enrolledStudents});
        } else if(countRes.length === 0){
            return res.json({message: "No rows fetched", enrolledCount: 0});
        } else {
            return res.json({message: "Unable to fetch rows"});
        }
    })
})

router.get('/getEnrolledStdInfo', (req, res) => {
    const sql1 = `SELECT * FROM student WHERE Email = ?`;
    db.query(sql1, req.session.email, (err, stdRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else{
            return res.json({
                message: "Success",
                studentData: stdRes[0]
            });
        }
    })
})

router.get('/CSEnrollmentPeriod', (req, res) => {
    const sql1 = `SELECT * FROM enrollmentperiod WHERE ProgramID = 1 AND Status != 'Finished'`;

    db.query(sql1, (err, CSResult) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(CSResult.length > 0){
            return res.json({
                message: "Data fetched",
                csEnrollmentRes: CSResult[0]
            })
        } else{
            return res.json({
                message: "No data fetched",
            })
        }
    })
});

router.get('/ITEnrollmentPeriod', (req, res) => {
    const sql1 = `SELECT * FROM enrollmentperiod WHERE ProgramID = 2 AND Status != 'Finished'`;

    db.query(sql1, (err, ITResult) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(ITResult.length > 0){
            return res.json({
                message: "Data fetched",
                itEnrollmentRes: ITResult[0]
            })
        } else{
            return res.json({
                message: "No data fetched",
            })
        }
    })
});

router.get('/dcsViewEnrollment', (req, res) => {
    const sql1 = `SELECT * FROM employee WHERE Email = ?`;
    const sql2 = `SELECT * FROM enrollmentperiod WHERE ProgramID = ?`;

    db.query(sql1, req.session.email, (err, socOffResult) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(socOffResult.length > 0){
            db.query(sql2, socOffResult[0].ProgramID, (err,enrollmentRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(enrollmentRes.length > 0){
                    return res.json({message: "Enrollment fetched successfully", enrollmentPeriod: enrollmentRes[0]});
                }   
            })
        }
    });
});

router.get('/viewEnrollmentPeriod', (req, res) => {
    const sql1 = `SELECT * FROM societyofficer WHERE Email = ?`;
    const sql2 = `SELECT * FROM enrollmentperiod WHERE ProgramID = ?`;

    db.query(sql1, req.session.email, (err, socOffResult) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(socOffResult.length > 0){
            db.query(sql2, socOffResult[0].ProgramID, (err,enrollmentRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(enrollmentRes.length > 0){
                    return res.json({enrollmentPeriod: enrollmentRes[0]});
                }   
            })
        }
    });
});

router.get('/getEnrollment', (req, res) =>{
    const sql1 = `SELECT * FROM student WHERE Email = ?`;
    const sql2 = `SELECT * FROM enrollmentperiod WHERE ProgramID = ?`;
    
    db.query(sql1, req.session.email, (err, emailRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(emailRes.length > 0){
            db.query(sql2, emailRes[0].ProgramID, (err, enrollmentRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(enrollmentRes.length > 0){
                    return res.json({message: "Enrollment fetched successfully", enrollmentPeriod: enrollmentRes[0]});
                }
            })
        }
    })
})

router.post('/startEnrollment', (req, res) => {
    const sql1 = `SELECT * FROM societyofficer WHERE Email = ?`;
    const sql2 = `UPDATE enrollmentperiod
    SET Status = 'Ongoing'
    WHERE ProgramID = ?`;

    const insertQuery = `
        INSERT INTO requirements (StudentID)
        SELECT StudentID
        FROM student
        WHERE StudentType IN ('Regular', 'Irregular') 
        AND RegStatus = 'Accepted'
        AND StudentID NOT IN (SELECT StudentID FROM requirements);
    `;

    const updateQuery = `
        UPDATE requirements
        SET SocFeePayment = 'Pending',
            SocietyOfficerID = null,
            COG = null
        WHERE StudentID IN (SELECT StudentID FROM student WHERE StudentType IN ('Regular', 'Irregular'))
    `;

    const deleteAdvising = `DELETE FROM advising`;
    const deletePreEnrollment = `DELETE FROM preenrollment`;
    const deleteEnrollment = `DELETE FROM enrollment`;
    const deleteSched = `DELETE FROM classschedule`;

    db.query(sql1, req.session.email, (err, emailRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(emailRes.length > 0){
            db.query(sql2, emailRes[0].ProgramID, (err, updateRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(updateRes.affectedRows > 0){
                    db.query(insertQuery, (err, insertRes) => {
                        if(err){
                            return res.json({message: "Error in server: " + err});
                        } else if(insertRes.affectedRows > 0){
                            
                            db.query(updateQuery, (err, updateRes) => {
                                if(err){
                                    return res.json({message: "Error in server: " + err});
                                } else if(updateRes.affectedRows > 0){
                                    db.query(deleteAdvising, (err, deleteRes) => {
                                        if(err){
                                            return res.json({message: "Error in server: " + err});
                                        } else{
                                            db.query(deletePreEnrollment, (err, deletePreEnrollmentRes) => {
                                                if(err){
                                                    return res.json({message: "Error in server: " + err});
                                                } else{
                                                    db.query(deleteEnrollment, (err, deleteEnrollmentRes) => {
                                                        if(err){
                                                            return res.json({message: "Error in server: " + err});
                                                        } else{
                                                            db.query(deleteSched, (err, deleteSchedRes) => {
                                                                if(err){
                                                                    return res.json({message: "Error in server: " + err});
                                                                } else {
                                                                    return res.json({message: "Enrollment is now ongoing"});
                                                                }
                                                            })
                                                        }
                                                    });
                                                }
                                            });

                                        }
                                    });

                                }
                            });
                        } else{
                            db.query(updateQuery, (err, updateRes) => {
                                if(err){
                                    return res.json({message: "Error in server: " + err});
                                } else if(updateRes.affectedRows > 0){
                                    db.query(deleteAdvising, (err, deleteRes) => {
                                        if(err){
                                            return res.json({message: "Error in server: " + err});
                                        } else{
                                            db.query(deletePreEnrollment, (err, deletePreEnrollmentRes) => {
                                                if(err){
                                                    return res.json({message: "Error in server: " + err});
                                                } else{
                                                    db.query(deleteEnrollment, (err, deleteEnrollmentRes) => {
                                                        if(err){
                                                            return res.json({message: "Error in server: " + err});
                                                        } else{
                                                            db.query(deleteSched, (err, deleteSchedRes) => {
                                                                if(err){
                                                                    return res.json({message: "Error in server: " + err});
                                                                } else {
                                                                    return res.json({message: "Enrollment is now ongoing"});
                                                                }
                                                            })
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });     
                } else{
                    return res.json({message: "Failed to start enrollment"});
                }
            })
        }
    })
})

router.post('/finishEnrollment', (req, res) => {
    const sql1 = `SELECT * FROM societyofficer WHERE Email = ?`;
    const sql2 = `UPDATE enrollmentperiod
    SET SocietyOfficerID = null,
        Start = null,
        End = null,
        Status = 'Finished'
    WHERE ProgramID = ?`;

    // New SQL query to select all student IDs with the specified conditions
    const sql3 = `SELECT StudentID FROM student WHERE (StudentType = 'Regular' OR StudentType = 'Irregular') 
                  AND StdStatus = 'Active' AND RegStatus = 'Accepted' AND ProgramID = ?`;

    // New SQL query to check if a student is in the enrollment table
    const sql4 = `SELECT * FROM enrollment WHERE StudentID = ?`;

    // New SQL query to insert the student into the enrollment table if not already enrolled
    const sql5 = `INSERT INTO enrollment (StudentID, EnrollmentStatus) VALUES (?, 'Not Enrolled')`;

    db.query(sql1, req.session.email, (err, emailRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(emailRes.length > 0){
            db.query(sql2, emailRes[0].ProgramID, (err, updateRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(updateRes.affectedRows > 0){
                    // After finishing the enrollment period, check student enrollment status
                    db.query(sql3, emailRes[0].ProgramID, (err, studentsRes) => {
                        if(err){
                            return res.json({message: "Error in fetching students: " + err});
                        } else {
                            studentsRes.forEach(student => {
                                db.query(sql4, [student.StudentID], (err, enrollmentRes) => {
                                    if(err){
                                        return res.json({message: "Error in checking enrollment: " + err});
                                    } else if(enrollmentRes.length === 0) {
                                        // If the student is not in the enrollment table, insert them
                                        db.query(sql5, [student.StudentID], (err, insertRes) => {
                                            if(err){
                                                return res.json({message: "Error in enrolling student: " + err});
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    });
                    return res.json({message: "Enrollment ended"});
                }
            })
        }
    })
});




export default router;