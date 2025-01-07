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

router.post('/setEnrollmentStatus', (req, res) => {
    const empID = `SELECT * FROM employee WHERE Email = ?`;    
    const enrollmentStatus = `INSERT INTO enrollment (EmployeeID, StudentID, EnrollmentStatus) VALUES (?, ?, ?)`;
    const updateStd = `
    UPDATE student
    SET StudentType = ?,
        Year = ?,
        Section = ?,
        Semester = ?
    WHERE StudentID = ?`;
    const { studentID, studentType, year, section, semester } = req.body;

    db.query(empID, req.session.email, (err, empRes) => {
        if(err){
            return res.json({ message: "Error in server: " + err });
        } else{
            db.query(enrollmentStatus, [empRes[0].EmployeeID, studentID, "Enrolled"], (err, enrollRes) => {
                if(err){
                    return res.json({ message: "Error in server: " + err });
                } else if(enrollRes.affectedRows > 0){
                    db.query(updateStd, [studentType, year, section, semester, studentID], (err, stdRes) => {
                        if(err){
                            return res.json({ message: "Error in server: " + err });
                        } else if(stdRes.affectedRows > 0){
                            return res.json({ message: "Success" });
                        } else{
                            return res.json({ message: "Failed to update student" });
                        }
                    })
                } else{
                    return res.json({ message: "Failed to enroll student" });
                }
            })
        }
    })

});

router.post('/getChecklistForEnrollmentOff', (req, res) => {
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
                        })),
                        studentData: programRes[0]
                    });
                } else {
                    return res.json({ message: "No checklist found" });
                }
            });
        } else {
            return res.json({ message: "Student not found" });
        }
    });
});



router.get('/getPreEnrollForEnrollmentOff', (req, res) => {
    const getStudents = `
    SELECT DISTINCT 
    s.StudentID, 
    s.CvSUStudentID, 
    s.Firstname, 
    s.Lastname, 
    s.Year, 
    s.Section, 
    s.Semester,
    s.StudentType, 
    r.SocFeePayment
FROM 
    student s
JOIN 
    requirements r ON s.StudentID = r.StudentID
INNER JOIN (
    SELECT DISTINCT StudentID
    FROM studentcoursechecklist
    WHERE StdChecklistStatus = 'Verified'
) c ON s.StudentID = c.StudentID
INNER JOIN 
    preenrollment a ON s.StudentID = a.StudentID
LEFT JOIN 
    enrollment e ON s.StudentID = e.StudentID
WHERE 
    a.PreEnrollmentStatus = 'Approved'
    AND (e.StudentID IS NULL OR e.enrollmentStatus = 'Pending');
            `;

    db.query(getStudents, (err, studentsRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            return res.json({ message: "Success", students: studentsRes });
        }
    });
})

router.get('/getStdEnrollmentStatus', (req, res) => {
    const stdID = `SELECT * FROM student WHERE Email = ?`;

    db.query(stdID, req.session.email, (err, stdRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(stdRes.length > 0){
            const enroll = `SELECT * FROM enrollment WHERE StudentID = ${stdRes[0].StudentID}`;
            db.query(enroll, (err, enrollRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(enrollRes.length > 0){
                    return res.json({message: "Success",
                        enrollStatus: enrollRes[0].EnrollmentStatus
                    });
                } else {
                    return res.json({message: "Student is not yet enrolled"});
                }
            });

        }
    });
});


export default router;