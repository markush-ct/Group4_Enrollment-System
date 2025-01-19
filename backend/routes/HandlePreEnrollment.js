import express from 'express';
import session from 'express-session';
import mysql from 'mysql';
import nodemailer from 'nodemailer';
import dbConfig from '../db/dbConfig.js';


dotenv.config();
const router = express.Router();

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gerlyntan07@gmail.com', // Sender email
        pass: 'sgpd rzwu zhna gbua' // Sender App Password
    }

});

router.post('/submitIrregPreEnrollment', (req, res) => {
    const emp = `SELECT * FROM employee WHERE Email = ?`;
    db.query(emp, req.session.email, (err, empRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            const { values, studentID } = req.body;

            const getStudent = `SELECT * FROM student WHERE StudentID = ?`;
            db.query(getStudent, studentID, (err, stdRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else {
                    const yearSection =
                        (stdRes[0].ProgramID === 1 ? "BSCS" : "BSIT") + " " +
                        (stdRes[0].Year === "First Year" ? 1
                            : stdRes[0].Year === "Second Year" ? 2
                                : stdRes[0].Year === "Third Year" ? 3
                                    : stdRes[0].Year === "Fourth Year" ? 4
                                        : "Mid-Year") +
                        " - " + stdRes[0].Section;


                    const sql = `INSERT INTO preenrollment (CourseChecklistID, EmployeeID, ClassSchedID, StudentID, YearSection) VALUES (?, ?, ?, ?, ?)`;

                    // Insert advised courses into the database
                    const promises = values.map(course =>
                        new Promise((resolve, reject) => {
                            db.query(sql, [course.courseID, empRes[0].EmployeeID, course.schedID, studentID, yearSection], (err) => { // Pass 'course' directly
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        })
                    );

                    Promise.all(promises)
                        .then(() => {
                            const enrollment = `INSERT INTO enrollment (StudentID) VALUES (?)`;
                            db.query(enrollment, studentID, (err, enrollRes) => {
                                if (err) {
                                    return res.json({ message: "Error in server: " + err });
                                } else if(enrollRes.affectedRows > 0){
                                    return res.json({ message: "Pre enrollment submitted." });
                                } else{
                                    return res.json({ message: "Failed to submit" });
                                }
                            })
                        })
                        .catch(saveErr => {
                            return res.json({ message: "Error saving courses: " + saveErr.message });
                        });

                }
            })
        }
    })
});

router.post('/schedOnCourseChange', (req, res) => {
    const { courseID, studentID } = req.body;

    const sql1 = `SELECT * FROM student WHERE StudentID = ?`;
    const sql2 = `SELECT * FROM classschedule WHERE CourseChecklistID = ? AND ProgramID = ?`;

    db.query(sql1, studentID, (err, stdRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            db.query(sql2, [courseID, stdRes[0].ProgramID], (err, schedRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else {
                    return res.json({ message: "Success", schedInfo: schedRes });
                }
            })
        }
    })
})


router.post('/classSchedIrreg/preEnroll', (req, res) => {
    const { studentID } = req.body;
    const sql1 = `SELECT * FROM student WHERE StudentID = ?`;
    const sql2 = `
    SELECT cs.CourseChecklistID,
        cs.Day,
        cs.StartTime,
        cs.EndTime,
        cs.YearLevel,
        cs.Section,
        cs.Room,
        cs.InstructorName,
        cs.ClassType,
        cc.CourseCode,
        cc.CourseTitle,
        cc.CreditUnitLec,
        cc.CreditUnitLab
    FROM classschedule cs
    JOIN coursechecklist cc
    ON cs.CourseChecklistID = cc.CourseChecklistID
    WHERE cs.ProgramID = ? and cc.ProgramID = ?`;

    db.query(sql1, studentID, (err, stdRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            db.query(sql2, [stdRes[0].ProgramID, stdRes[0].ProgramID], (err, schedRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else {
                    return res.json({ message: "Success", schedData: schedRes });
                }
            })
        }
    })
})


// Approve pre-enrollment
router.post("/adviserApprovePreEnrollment", (req, res) => {
    const getID = "SELECT EmployeeID FROM employee WHERE Email = ?";
    const email = req.session.email;

    db.query(getID, [email], (err, idRes) => {
        if (err) {
            console.error("Error fetching adviser ID:", err);
            return res.json({ message: "Server error" });
        }

        if (idRes.length === 0) {
            return res.json({ message: "Adviser not found" });
        }

        const { preEnrollmentValues } = req.body;

        if (!Array.isArray(preEnrollmentValues) || preEnrollmentValues.length === 0) {
            return res.json({ message: "Invalid data" });
        }

        // Process each pre-enrollment item
        let completed = 0;
        let hasError = false;

        preEnrollmentValues.forEach((course) => {
            const updateQuery = `
                UPDATE preenrollment 
                SET PreEnrollmentStatus = 'Approved', EmployeeID = ? 
                WHERE CourseChecklistID = ? AND StudentID = ?
            `;
            db.query(updateQuery, [idRes[0].EmployeeID, course.CourseChecklistID, course.StudentID], (updateErr) => {
                if (updateErr) {
                    console.error("Error updating pre-enrollment:", updateErr);
                    hasError = true;
                }

                completed++;

                // Send response after processing all updates
                if (completed === preEnrollmentValues.length) {
                    if (hasError) {
                        return res.json({ message: "Some updates failed" });
                    }
                    res.json({ message: "Success" });
                }
            });
        });
    });
});


// Reject pre-enrollment
router.post("/adviserRejectPreEnrollment", async (req, res) => {
    const getID = "SELECT EmployeeID FROM employee WHERE Email = ?";
    const email = req.session.email;

    db.query(getID, [email], (err, idRes) => {
        if (err) {
            console.error("Error fetching adviser ID:", err);
            return res.json({ message: "Server error" });
        }

        if (idRes.length === 0) {
            return res.json({ message: "Adviser not found" });
        }

        const { preEnrollmentValues } = req.body;

        if (!Array.isArray(preEnrollmentValues) || preEnrollmentValues.length === 0) {
            return res.json({ message: "Invalid data" });
        }

        // Process each pre-enrollment item
        let completed = 0;
        let hasError = false;

        preEnrollmentValues.forEach((course) => {
            const updateQuery = `
                UPDATE preenrollment 
                SET PreEnrollmentStatus = 'Not Approved', EmployeeID = ? 
                WHERE CourseChecklistID = ? AND StudentID = ?
            `;
            db.query(updateQuery, [idRes[0].EmployeeID, course.CourseChecklistID, course.StudentID], (updateErr) => {
                if (updateErr) {
                    console.error("Error updating pre-enrollment:", updateErr);
                    hasError = true;
                }

                completed++;

                // Send response after processing all updates
                if (completed === preEnrollmentValues.length) {
                    if (hasError) {
                        return res.json({ message: "Some updates failed" });
                    }
                    res.json({ message: "Success" });
                }
            });
        });
    });
});


router.post('/getPreEnrollmentValuesForAdmin', (req, res) => {
    const { studentID } = req.body;

    const getID = `SELECT * FROM student WHERE StudentID = ?`;

    db.query(getID, studentID, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            const studentID = idRes[0].StudentID;

            if (idRes[0].StudentType === "Regular") {
                const getStatus = `
            SELECT p.CourseChecklistID, 
                   p.StudentID, 
                   c.CourseCode, 
                   c.CourseTitle, 
                   c.CreditUnitLec, 
                   c.CreditUnitLab,
                   p.PreEnrollmentStatus
            FROM preenrollment p
            JOIN coursechecklist c
            ON p.CourseChecklistID = c.CourseChecklistID
            WHERE p.StudentID = ?
            `;

                db.query(getStatus, studentID, (err, statusRes) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    } else if (statusRes.length > 0) {
                        const status = statusRes[0].PreEnrollmentStatus;
                        if (status === "Pending") {
                            return res.json({
                                message: "Waiting for pre-enrollment reg approval",
                                data: statusRes
                            });
                        } else if (status === "Approved") {
                            return res.json({
                                message: "Pre-enrollment is approved",
                                data: statusRes,
                                status: status
                            });
                        }
                    }
                    return res.json({
                        message: "No record found",
                    });
                });
            } else if (idRes[0].StudentType === "Irregular") {
                const getStatus = `
            SELECT p.CourseChecklistID, 
                   p.StudentID, 
                   c.CourseCode, 
                   c.CourseTitle, 
                   c.CreditUnitLec, 
                   c.CreditUnitLab,
                   p.PreEnrollmentStatus,
                   cs.Day,
                   cs.StartTime,
                   cs.EndTime,
                   cs.YearLevel,
                   cs.Section                   
            FROM preenrollment p
            JOIN classschedule cs
            ON p.CourseChecklistID = cs.CourseChecklistID AND p.ClassSchedID = cs.ClassSchedID
            JOIN coursechecklist c
            ON cs.CourseChecklistID = c.CourseChecklistID
            WHERE p.StudentID = ?
            `;

                db.query(getStatus, studentID, (err, statusRes) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    } else if (statusRes.length > 0) {
                        const status = statusRes[0].PreEnrollmentStatus;
                        if (status === "Pending") {
                            return res.json({
                                message: "Waiting for pre-enrollment irreg approval",
                                data: statusRes
                            });
                        } else if (status === "Approved") {
                            return res.json({
                                message: "Pre-enrollment is approved",
                                data: statusRes,
                                status: status
                            });
                        }
                    }
                    return res.json({
                        message: "No record found",
                    });
                });
            }
        }
    });
});


router.get('/getPreEnrollForAdviser', (req, res) => {
    const getStudents = `
    SELECT 
            a.*, 
            s.*
        FROM advising a
        LEFT JOIN preenrollment p ON a.StudentID = p.StudentID
        INNER JOIN student s ON a.StudentID = s.StudentID
        WHERE p.StudentID IS NULL AND a.AdvisingStatus = 'Approved'
            `;

    db.query(getStudents, (err, studentsRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            return res.json({ message: "Success", students: studentsRes });
        }
    });
})

router.post('/submitPreEnrollment', (req, res) => {
    const { courses, studentID } = req.body;

    const emp = `SELECT * FROM employee WHERE EmployeeID = ?`;

    db.query(emp, req.session.email, (err, empRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            const empID = empRes[0].EmployeeID;

            const getStudent = `SELECT * FROM student WHERE StudentID = ?`;
            db.query(getStudent, studentID, (err, stdRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else {
                    const yearSection =
                        (stdRes[0].ProgramID === 1 ? "BSCS" : "BSIT") + " " +
                        (stdRes[0].Year === "First Year" ? 1
                            : stdRes[0].Year === "Second Year" ? 2
                                : stdRes[0].Year === "Third Year" ? 3
                                    : stdRes[0].Year === "Fourth Year" ? 4
                                        : "Mid-Year") +
                        " - " + stdRes[0].Section;

                    const sql = `INSERT INTO preenrollment (CourseChecklistID, EmployeeID, StudentID, YearSection) VALUES (?, ?, ?, ?)`;

                    // Insert advised courses into the database
                    const promises = courses.map(course =>
                        new Promise((resolve, reject) => {
                            db.query(sql, [course, empID, studentID, yearSection], (err) => { // Pass 'course' directly
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        })
                    );

                    Promise.all(promises)
                        .then(() => {
                            console.log("Courses received in backend:", courses);
                            const enrollment = `INSERT INTO enrollment (StudentID) VALUES (?)`;
                            db.query(enrollment, studentID, (err, enrollRes) => {
                                if (err) {
                                    return res.json({ message: "Error in server: " + err });
                                } else if(enrollRes.affectedRows > 0){
                                    return res.json({ message: "Pre enrollment submitted." });
                                } else{
                                    return res.json({ message: "Failed to submit" });
                                }
                            })
                        })
                        .catch(saveErr => {
                            return res.json({ message: "Error saving courses: " + saveErr.message });
                        });

                }
            })
        }
    })
});


router.post('/getEligibleCourse', (req, res) => {
    const { studentID } = req.body;

    const getID = `SELECT * FROM student WHERE StudentID = ?`;

    db.query(getID, studentID, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {

            const getAdvise = `
            SELECT 
            cc.* 
        FROM 
            coursechecklist cc
        LEFT JOIN 
            studentcoursechecklist scc
        ON 
            cc.CourseChecklistID = scc.CourseChecklistID 
            AND scc.StudentID = ?
            AND scc.StdChecklistStatus = 'Verified'
        WHERE 
            cc.ProgramID = ? 
            AND scc.CourseChecklistID IS NULL`;

            db.query(getAdvise, [studentID, idRes[0].ProgramID], (err, adviseRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (adviseRes.length > 0) {
                    return res.json({
                        message: "Success",
                        courses: adviseRes
                    });
                } else {
                    return res.json({
                        message: "No courses available"
                    });
                }
            })
        }
    });
});

router.get('/getPreEnrollmentValues', (req, res) => {
    const getID = `SELECT * FROM student WHERE Email = ?`;

    db.query(getID, req.session.email, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            const studentID = idRes[0].StudentID;

            const getStatus = `
            SELECT p.CourseChecklistID, 
                   p.StudentID, 
                   c.CourseCode, 
                   c.CourseTitle, 
                   c.CreditUnitLec, 
                   c.CreditUnitLab,
                   p.PreEnrollmentStatus
            FROM preenrollment p
            JOIN coursechecklist c
            ON p.CourseChecklistID = c.CourseChecklistID
            WHERE p.StudentID = ?
            `;

            db.query(getStatus, studentID, (err, statusRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (statusRes.length > 0) {
                    const status = statusRes[0].PreEnrollmentStatus;
                    if (status === "Pending") {
                        return res.json({
                            message: "Waiting for pre-enrollment approval",
                            data: statusRes
                        });
                    } else if (status === "Approved") {
                        return res.json({
                            message: "Pre-enrollment is approved",
                            data: statusRes,
                            status: status
                        });
                    }
                }
                return res.json({
                    message: "No record found",
                });
            });
        }
    });
});


router.get('/getPreEnrollmentStatus', (req, res) => {
    const getID = `SELECT * FROM student WHERE Email = ?`;

    db.query(getID, req.session.email, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            const studentID = idRes[0].StudentID;

            const getStatus = `SELECT * FROM preenrollment WHERE StudentID = ?`;

            db.query(getStatus, studentID, (err, statusRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (statusRes.length === 0 || statusRes[0].PreEnrollmentStatus !== "Approved") {
                    return res.json({
                        message: "Cannot proceed, pre-enrollment is not approved",
                        status: "Pending"
                    });
                } else {
                    return res.json({
                        message: "Pre-enrollment is approved",
                        status: statusRes[0].PreEnrollmentStatus
                    });
                }
            })
        }
    });
})


export default router;