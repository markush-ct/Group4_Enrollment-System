import { error } from 'console';
import express from 'express';
import mysql from 'mysql';

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

router.get('/getCourseChecklist', (req, res) => {
    const getStudentID = `SELECT * FROM student WHERE Email = ?`;
    const getCourses = `SELECT 
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
        AND scc.StudentID = ?
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

    // Retrieve the StudentID based on email
    db.query(getStudentID, [req.session.email], (err, studentRes) => {
        if (err) {
            return res.json({ message: "Error retrieving student ID: " + err });
        } 
        if (studentRes.length > 0) {
            const studentID = studentRes[0].StudentID;
            const programID = studentRes[0].ProgramID; 

            // Fetch course checklist for the student
            db.query(getCourses, [studentID, programID], (err, courseRes) => {
                if (err) {
                    return res.json({ message: "Error retrieving courses: " + err });
                } 
                if (courseRes.length > 0) {
                    return res.json({
                        message: "Success",
                        checklistData: courseRes.map(row => ({
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
                } else {
                    return res.json({ message: "No courses found for the specified criteria." });
                }
            });
        }
    });
});


router.get('/viewStudentChecklist', (req, res) => {
    const getStudentID = `SELECT * FROM student WHERE Email = ?`;
    const getCourses = `SELECT 
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
        cc.ProgramID = ? -- Dynamically bind ProgramID
        AND (scc.CourseChecklistID IS NULL OR scc.FinalGrade IS NOT NULL) -- Include unmatched or those with grades
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

    // Retrieve the StudentID based on email
    db.query(getStudentID, [req.session.email], (err, studentRes) => {
        if (err) {
            return res.json({ message: "Error retrieving student ID: " + err });
        } 
        if (studentRes.length > 0) {
            const studentID = studentRes[0].StudentID;
            const programID = studentRes[0].ProgramID; 

            // Fetch course checklist for the student
            db.query(getCourses, [studentID, programID], (err, courseRes) => {
                if (err) {
                    return res.json({ message: "Error retrieving courses: " + err });
                } 
                if (courseRes.length > 0) {
                    return res.json({
                        message: "Success",
                        checklistData: courseRes.map(row => ({
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
                } else {
                    return res.json({ message: "No courses found for the specified criteria." });
                }
            });
        } else {
            return res.json({ message: "Student not found with the given email." });
        }
    });
});


export default router;