import express from 'express';
import session from 'express-session';
import mysql from 'mysql';
import nodemailer from 'nodemailer';

const router = express.Router();

// Create a database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cvsuenrollmentsystem'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gerlyntan07@gmail.com', // Sender email
        pass: 'sgpd rzwu zhna gbua' // Sender App Password
    }

});


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


router.get('/getPreEnrollForAdviser', (req, res) => {
    const getStudents = `SELECT DISTINCT s.StudentID, s.CvSUStudentID, s.Firstname, s.Lastname, s.Year, s.Section, s.StudentType, r.SocFeePayment
FROM student s
JOIN requirements r ON s.StudentID = r.StudentID
INNER JOIN (
    SELECT DISTINCT StudentID
    FROM studentcoursechecklist
    WHERE StdChecklistStatus = 'Verified'
) c ON s.StudentID = c.StudentID
INNER JOIN preenrollment a ON s.StudentID = a.StudentID
WHERE a.PreEnrollmentStatus = 'Pending'
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
    const {courses} = req.body;

    const getStudent = `SELECT * FROM student WHERE Email = ?`;
    db.query(getStudent, req.session.email, (err, stdRes) => {
        if(err){
            return res.json({message: "Error in server: " + err}) ;
        } else {
            const studentID = stdRes[0].StudentID;
            const yearSection = 
    (stdRes[0].ProgramID === 1 ? "BSCS" : "BSIT") + " " +
    (stdRes[0].Year === "First Year" ? 1
    : stdRes[0].Year === "Second Year" ? 2
    : stdRes[0].Year === "Third Year" ? 3
    : stdRes[0].Year === "Fourth Year" ? 4
    : "Mid-Year") +
    " - " + stdRes[0].Section;


            const sql = `INSERT INTO preenrollment (CourseChecklistID, StudentID, YearSection) VALUES (?, ?, ?)`;

            // Insert advised courses into the database
            const promises = courses.map(course =>
                new Promise((resolve, reject) => {
                    db.query(sql, [course, studentID, yearSection], (err) => { // Pass 'course' directly
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
                    return res.json({ message: "Pre enrollment submitted." });
                })
                .catch(saveErr => {
                    return res.json({ message: "Error saving courses: " + saveErr.message });
                });

        }
    })
});


router.get('/getEligibleCourse', (req, res) => {
    const getID = `SELECT * FROM student WHERE Email = ?`;

    db.query(getID, req.session.email, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            const studentID = idRes[0].StudentID;

            const getAdvise = `
            SELECT s.StudentID, s.ProgramID, c.CourseChecklistID, c.CourseCode, c.CourseTitle, c.CreditUnitLec, c.CreditUnitLab, c.ProgramID, a.CourseChecklistID
            FROM student s
            JOIN advising a ON s.StudentID = a.StudentID
            JOIN coursechecklist c ON a.CourseChecklistID = c.CourseChecklistID
            WHERE s.StudentID = ?`;

            db.query(getAdvise, studentID, (err, adviseRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if(adviseRes.length > 0){
                    return res.json({
                        message: "Success",
                        courses: adviseRes
                    });
                } else{
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
                } else if(statusRes.length === 0 || statusRes[0].PreEnrollmentStatus !== "Approved"){
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