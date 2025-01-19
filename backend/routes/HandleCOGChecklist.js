import express from 'express';
import mysql from 'mysql';
import multer from 'multer';
import path from 'path';
import dbConfig from '../db/dbConfig.js';


dotenv.config();
const router = express.Router();

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
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

router.get('/getChecklistStatus', (req, res) => {
    const sql1 = `SELECT * FROM student WHERE Email = ?`;
    const sql2 = `SELECT * FROM studentcoursechecklist WHERE StudentID = ?`;

    db.query(sql1, req.session.email, (err, studentRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (studentRes.length > 0) {
            db.query(sql2, studentRes[0].StudentID, (err, checklistRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (checklistRes.length === 0) {
                    return res.json({ message: "Requirements not yet verified.", checklistStatus: "Pending" });
                } else {
                    // Check for verified, pending, and rejected rows
                    const allVerified = checklistRes.every(row => row.StdChecklistStatus === "Verified");
                    const rejectedRows = checklistRes.filter(row => row.StdChecklistStatus === "Rejected");

                    if (rejectedRows.length > 0) {
                        return res.json({
                            message: "Some requirements were rejected.",
                            checklistStatus: "Rejected",
                            rejected: rejectedRows, // Include rejected rows in the response
                        });
                    } else if (!allVerified) {
                        return res.json({ message: "Requirements not yet verified.", checklistStatus: "Pending" });
                    } else {
                        return res.json({ message: "Requirements verified.", checklistStatus: "Verified" });
                    }
                }
            });
        } else {
            return res.json({ message: "Student not found.", checklistStatus: "Error" });
        }
    });
});



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
    const getID = `SELECT * FROM societyofficer WHERE Email = ?`;

    db.query(getID, req.session.email, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if(idRes.length > 0) {
            const id = idRes[0].SocietyOfficerID;

            const { studentID } = req.body;
            const updateChecklist = `
            UPDATE studentcoursechecklist 
            SET StdChecklistStatus = 'Verified',
                SocietyOfficerID = ?
            WHERE StudentID = ? 
            AND StdChecklistStatus = 'Submitted'`;

            db.query(updateChecklist, [id, studentID], (err, updateRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (updateRes.affectedRows > 0) {                    
                    return res.json({ message: "Requirements verified." });
                } else {
                    return res.json({ message: "Failed to verify checklist." });
                }
            })
        } else {
            return res.json({ message: "Society Officer not found." });
        }
    });
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
                WHERE StdChecklistStatus = 'Submitted'
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

router.post('/submitCOGChecklist', upload.single('cog'), (req, res) => {
    const getStudent = `SELECT * FROM student WHERE Email = ?`;

    db.query(getStudent, req.session.email, (err, stdRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (stdRes.length > 0) {
            const studentID = stdRes[0].StudentID;

            const { checklist } = req.body;
            const cogImagePath = req.file ? req.file.path : req.body.cogURL;

            const checklistEntries = JSON.parse(checklist);

            const insertCOG = `UPDATE requirements
                SET COG = ?
                WHERE StudentID = ?`;

            db.query(insertCOG, [cogImagePath, studentID], (err, cogRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (cogRes.affectedRows > 0) {
                    const deleteDuplicatesQuery = `
                        DELETE FROM studentcoursechecklist
                        WHERE StudentID = ?
                    `;

                    db.query(deleteDuplicatesQuery, [studentID], (err, deleteRes) => {
                        if (err) {
                            return res.json({ message: "Error in deleting duplicates: " + err });
                        }

                        // Step 2: Filter valid entries and prepare for insert or update
                        const validEntries = checklistEntries.filter(entry =>
                            entry.semTaken?.trim() && entry.finalGrade?.trim() && entry.instructor?.trim()
                        );

                        if (validEntries.length > 0) {
                            const checklistValues = validEntries.map(entry => [
                                studentID,
                                entry.CourseChecklistID,
                                entry.semTaken,
                                entry.finalGrade,
                                entry.instructor,
                                'Submitted' // Status
                            ]);


                            // Step 3: Insert new rows or update existing rows with ON DUPLICATE KEY UPDATE
                            const insertChecklistQuery = `
                                INSERT INTO studentcoursechecklist 
                                (StudentID, CourseChecklistID, SYTaken, FinalGrade, InstructorName, StdChecklistStatus)
                                VALUES ?
                            `;

                            db.query(insertChecklistQuery, [checklistValues], (err, checklistRes) => {
                                if (err) {
                                    return res.json({ message: "Error in server: " + err });
                                } else if (checklistRes.affectedRows > 0) {
                                    return res.json({ message: "Checklist submitted successfully." });
                                } else {
                                    return res.json({ message: "No rows were updated or inserted." });
                                }
                            });
                        } else {
                            return res.json({ message: "No valid checklist entries to submit." });
                        }
                    });
                } else {
                    return res.json({ message: "Failed to submit COG." });
                }
            });
        }
    });
});




router.get('/getSubmittedCOG', (req, res) => {
    const getStudent = `SELECT * FROM student WHERE Email = ?`;
    db.query(getStudent, req.session.email, (err, stdRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (stdRes.length > 0) {
            const studentID = stdRes[0].StudentID;

            const getCOG = `SELECT * FROM requirements WHERE StudentID = ?`;
            db.query(getCOG, studentID, (err, cogRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (cogRes.length > 0) {
                    return res.json({ message: "Success", cogPath: cogRes[0].COG });
                } else {
                    return res.json({ message: "No COG submitted." });
                }
            })
        }
    });

});


export default router;