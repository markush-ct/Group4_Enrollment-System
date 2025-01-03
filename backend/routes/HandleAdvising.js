import express from 'express';
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


router.post('/sendEmailAdvise', (req, res) => {
    const { studentID, courses, adviseMessage } = req.body;

    // Validate request body
    if (!studentID || !courses || courses.length === 0 || !adviseMessage) {
        return res.json({ message: "All fields (studentID, courses, adviseMessage) are required." });
    }

    // Get employee details based on session email
    const getEmp = `SELECT * FROM employee WHERE Email = ?`;
    db.query(getEmp, req.session.email, (err, empRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err.message });
        }

        if (empRes.length === 0) {
            return res.json({ message: "Employee not found." });
        }

        const empID = empRes[0].EmployeeID;

        // Get student details
        const getStudent = `SELECT * FROM student WHERE StudentID = ?`;
        db.query(getStudent, [studentID], (err, studentRes) => {
            if (err) {
                return res.json({ message: "Error fetching student data: " + err.message });
            }

            if (studentRes.length === 0) {
                return res.json({ message: "Student not found." });
            }

            const studentName = `${studentRes[0].Firstname} ${studentRes[0].Lastname}`;
            const cvsuStudentID = studentRes[0].CvSUStudentID;
            const studentEmail = studentRes[0].Email; // Assuming student has an email field

            // Query to get course titles based on course IDs
            const getCourses = `SELECT CourseTitle FROM coursechecklist WHERE CourseChecklistID IN (?)`;
            db.query(getCourses, [courses], (err, coursesRes) => {
                if (err) {
                    return res.json({ message: "Error fetching course titles: " + err.message });
                }

            const courseTitles = coursesRes.map(course => `- ${course.CourseTitle}`).join('\n');


                // Prepare email content
                const emailBody = `
                Advise For: ${studentName} - (${cvsuStudentID})\n
                Message: 
                ${adviseMessage}\n
                Advised Courses:
                ${courseTitles}
                `;

                // Set up email options
                const mailOptions = {
                    from: 'your-email@gmail.com', // Your email address
                    to: studentEmail,
                    subject: 'Advising Notification',
                    text: emailBody,
                };

                // Send the email
                transporter.sendMail(mailOptions, (emailErr, info) => {
                    if (emailErr) {
                        console.error("Error sending email:", emailErr);
                        return res.json({ message: "Error sending email: " + emailErr.message });
                    }

                    const sql = `INSERT INTO advising (StudentID, EmployeeID, CourseChecklistID) VALUES (?, ?, ?)`;

                    // Insert advised courses into the database
                    const promises = courses.map(course =>
                        new Promise((resolve, reject) => {
                            db.query(sql, [studentID, empID, course], (err) => { // Pass 'course' directly
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
                            return res.json({ message: "Courses saved and email sent successfully." });
                        })
                        .catch(saveErr => {
                            return res.json({ message: "Error saving courses: " + saveErr.message });
                        });
                });
            });
        });
    });
});



router.post('/getCoursesForAdviser', (req, res) => {
    const { studentID } = req.body;

    const sql1 = `SELECT * FROM student WHERE StudentID = ?`;
    const sql2 = `SELECT * FROM coursechecklist WHERE ProgramID = ?`;

    db.query(sql1, studentID, (err, studentRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (studentRes.length > 0) {
            const programID = studentRes[0].ProgramID;

            db.query(sql2, programID, (err, coursesRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else {
                    return res.json({ message: "Success", courses: coursesRes });
                }
            });
        }
    })
});

router.post('/getChecklistForAdviser', (req, res) => {
    const getProgram = `SELECT * FROM student WHERE StudentID = ?`;
    const { studentID } = req.body;

    db.query(getProgram, studentID, (err, programRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (programRes.length > 0) {
            const programID = programRes[0].ProgramID;

            const getStdChecklist = `SELECT 
        cc.CourseChecklistID, 
        cc.ProgramID, 
        cc.YearLevel, 
        cc.Semester, 
        scc.StudentID,
        scc.FinalGrade,
        scc.InstructorName,
        scc.SYTaken,
        cc.CourseCode,
        cc.CourseTitle,
        cc.CreditUnitLec,
        cc.CreditUnitLab,
        cc.ContactHrsLec,
        cc.ContactHrsLab,
        cc.PreRequisite
    FROM 
        coursechecklist cc
    LEFT JOIN 
        studentcoursechecklist scc
    ON 
        cc.CourseChecklistID = scc.CourseChecklistID 
        AND scc.StudentID = ? AND scc.StdChecklistStatus = 'Verified'
    WHERE 
        cc.ProgramID = ?
        AND (scc.CourseChecklistID IS NULL OR scc.FinalGrade IS NOT NULL)
    ORDER BY 
        CASE 
            WHEN cc.YearLevel = 'First Year' THEN 1
            WHEN cc.YearLevel = 'Second Year' THEN 2
            WHEN cc.YearLevel = 'Third Year' THEN 3
            WHEN cc.YearLevel = 'Mid-Year' THEN 4
            WHEN cc.YearLevel = 'Fourth Year' THEN 5
            ELSE 6
        END ASC,
        CASE 
            WHEN cc.Semester = 'First Semester' THEN 1
            WHEN cc.Semester = 'Second Semester' THEN 2
            ELSE 3
        END ASC`;

            db.query(getStdChecklist, [studentID, programID], (err, checklistRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (checklistRes.length > 0) {
                    return res.json({
                        message: "Success",
                        checklistData: checklistRes.map(row => ({
                            yearLevel: row.YearLevel,
                            semester: row.Semester,
                            courseDetails: {
                                courseID: row.CourseChecklistID,
                                code: row.CourseCode,
                                title: row.CourseTitle,
                                creditLec: row.CreditUnitLec,
                                creditLab: row.CreditUnitLab,
                                contactHrsLec: row.ContactHrsLec,
                                contactHrsLab: row.ContactHrsLab,
                                preReq: row.PreRequisite
                            },
                            finalGrade: row.FinalGrade,
                            instructor: row.InstructorName,
                            syTaken: row.SYTaken
                        }))
                    });
                }
            });
        }
    });
});

router.post('/getCOGForAdviser', (req, res) => {
    const { studentID } = req.body;
    const getCOG = `SELECT * FROM requirements WHERE StudentID = ?`;

    db.query(getCOG, studentID, (err, cogRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (cogRes.length > 0) {
            return res.json({ message: "Success", cogPath: cogRes[0].COG });
        }
    })
});

router.get('/getReqsForAdviser', (req, res) => {
    const getStudents = `SELECT s.StudentID, s.CvSUStudentID, s.Firstname, s.Lastname, s.Year, s.Section, s.StudentType, r.SocFeePayment
        FROM student s
        JOIN requirements r ON s.StudentID = r.StudentID
        INNER JOIN (
            SELECT DISTINCT StudentID
            FROM studentcoursechecklist
            WHERE StdChecklistStatus = 'Verified'
        ) c ON s.StudentID = c.StudentID
        LEFT JOIN advising a ON s.StudentID = a.StudentID AND a.AdvisingStatus = 'Approved'
        WHERE a.StudentID IS NULL
            `;

    db.query(getStudents, (err, studentsRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            return res.json({ message: "Success", students: studentsRes });
        }
    });
})

router.get('/getAdvisingResult', (req, res) => {
    const sql1 = `SELECT * FROM student WHERE Email = ?`;
    const sql2 = `SELECT * FROM advising WHERE StudentID = ?`;

    db.query(sql1, req.session.email, (err, studentRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (studentRes.length > 0) {
            db.query(sql2, studentRes[0].StudentID, (err, advisingRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (advisingRes.length === 0 || advisingRes[0].AdvisingStatus !== "Approved") {
                    return res.json({ message: "Cannot proceed to pre-enrollment. Advising is not yet approved.", advisingStatus: "Pending" });
                } else {
                    return res.json({ message: "Advising is approved. Proceed to pre-enrollment.", advisingStatus: advisingRes[0].AdvisingStatus });
                }
            })
        }
    })
});


export default router;