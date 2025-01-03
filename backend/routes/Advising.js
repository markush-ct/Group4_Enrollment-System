import express from 'express';
import mysql from 'mysql';
import multer from 'multer';
import path from 'path';

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

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use unique filenames
    },
});

const upload = multer({ storage });

router.use("/uploads", express.static("uploads"));

router.post('/socfeeRejectChecklist', (req, res) => {
    const { studentID } = req.body;
    const updateChecklist = `UPDATE studentcoursechecklist SET StdChecklistStatus = 'Rejected' WHERE StudentID = ? AND StdChecklistStatus = 'Submitted'`;

    db.query(updateChecklist, studentID, (err, updateRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (updateRes.affectedRows > 0) {
            return res.json({ message: "Requirements rejected." });
        } else {
            return res.json({ message: "Failed to reject checklist." });
        }
    })
})

router.post('/socfeeVerifyChecklist', (req, res) => {
    const { studentID } = req.body;
    const updateChecklist = `UPDATE studentcoursechecklist SET StdChecklistStatus = 'Verified' WHERE StudentID = ? AND StdChecklistStatus = 'Submitted'`;

    db.query(updateChecklist, studentID, (err, updateRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (updateRes.affectedRows > 0) {
            return res.json({ message: "Requirements verified." });
        } else {
            return res.json({ message: "Failed to verify checklist." });
        }
    })
})

router.post('/getChecklistForSocOff', (req, res) => {
    const getProgram = `SELECT * FROM societyofficer WHERE Email = ?`;

    db.query(getProgram, req.session.email, (err, programRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (programRes.length > 0) {
            const programID = programRes[0].ProgramID;

            const { studentID } = req.body;
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
        AND scc.StudentID = ? AND scc.StdChecklistStatus = 'Submitted'
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

router.post('/getCOGForSocOff', (req, res) => {
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

router.get('/getReqsForSocOff', (req, res) => {
    const getProgram = `SELECT * FROM societyofficer WHERE Email = ?`;

    db.query(getProgram, req.session.email, (err, programRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (programRes.length > 0) {
            const programID = programRes[0].ProgramID;

            const getStudents = `SELECT s.StudentID, s.CvSUStudentID, s.Firstname, s.Lastname, s.Year, s.Section, s.StudentType, r.SocFeePayment
            FROM student s
            JOIN requirements r ON s.StudentID = r.StudentID
            INNER JOIN (
                SELECT DISTINCT StudentID
                FROM studentcoursechecklist
                WHERE StdChecklistStatus = 'submitted'
            ) c ON s.StudentID = c.StudentID
            WHERE s.ProgramID = ?
            `;

            db.query(getStudents, programID, (err, studentsRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else {
                    return res.json({ message: "Success", students: studentsRes });
                }
            })
        }
    })
})



export default router;