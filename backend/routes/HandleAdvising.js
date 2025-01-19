import express from 'express';
import mysql from 'mysql';
import nodemailer from 'nodemailer';
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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gerlyntan07@gmail.com', // Sender email
        pass: 'sgpd rzwu zhna gbua' // Sender App Password
    }

});

router.post('/getAdviceStatus/advising', (req, res) => {
    const {studentID} = req.body;
    const sql1 = `SELECT * FROM advising WHERE StudentID = ?`;
    db.query(sql1, studentID, (err, adviceRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(adviceRes.length === 0){
            return res.json({message: "Not yet scheduled"});
        } else if(adviceRes.length > 0){
            if(adviceRes[0].AdvisingStatus === "Pending"){
                return res.json({message: "Pending", sched: adviceRes[0].Schedule});
            }
        } else{
            return res.json({message: "Unable to fetch student advising record."});
        }
    })
})

router.post('/setAdvisingStatus', (req, res) => {
    const { studentID } = req.body;
    const sql = `UPDATE advising
    SET AdvisingStatus = 'Approved'
    WHERE StudentID = ?`;

    db.query(sql, studentID, (err, updateRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(updateRes.affectedRows > 0){
            return res.json({message: "Success"});
        } else {
            return res.json({message: "Failed"});
        }
    })
})


router.post('/sendAdvisingSched', (req, res) => {
    const { studentID, sched } = req.body;

    const getEmp = `SELECT * FROM employee WHERE Email = ?`;

    db.query(getEmp, req.session.email, (err, empRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else {
            const insert = `INSERT INTO advising (EmployeeID, StudentID, Schedule) VALUES (?, ?, ?)`;
            db.query(insert, [empRes[0].EmployeeID, studentID, sched], (err, insertRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(insertRes.affectedRows > 0){
                    return res.json({message:"Success"});
                } else{
                    return res.json({message:"Failed"});
                }
            })
        }
    })
});



router.post('/getCoursesForAdviser', (req, res) => {
    const { studentID } = req.body;

    const sql1 = `SELECT * FROM student WHERE StudentID = ?`;
    const sql2 = `
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

    db.query(sql1, studentID, (err, studentRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (studentRes.length > 0) {
            const programID = studentRes[0].ProgramID;

            db.query(sql2, [studentID, programID], (err, coursesRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else {
                    return res.json({ message: "Success", courses: coursesRes });
                }
            });
        } else {
            return res.json({ message: "Student not found." });
        }
    });
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
    const getStudents = `SELECT s.StudentID, s.CvSUStudentID, s.Firstname, s.Lastname, s.Year, s.Section, s.StudentType, s.Semester, r.SocFeePayment, a.AdvisingStatus
        FROM student s
        JOIN requirements r ON s.StudentID = r.StudentID
        INNER JOIN (
            SELECT DISTINCT StudentID
            FROM studentcoursechecklist
            WHERE StdChecklistStatus = 'Verified'
        ) c ON s.StudentID = c.StudentID
        LEFT JOIN advising a ON s.StudentID = a.StudentID AND a.AdvisingStatus = 'Approved'
        WHERE a.StudentID IS NULL AND r.SocFeePayment = 'Paid' AND r.COG IS NOT NULL
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
            db.query(sql2, studentRes[0].StudentID, (err, adviceRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if(adviceRes.length > 0){
                    if(adviceRes[0].AdvisingStatus === "Pending"){
                        return res.json({ message: "Cannot proceed to pre-enrollment. Advising is not yet finished.", advisingStatus: "Pending", sched: adviceRes[0].Schedule });
                    } else if(adviceRes[0].AdvisingStatus === "Approved"){
                        return res.json({ message: "Advising is approved. Proceed to pre-enrollment.", advisingStatus: adviceRes[0].AdvisingStatus, sched: adviceRes[0].Schedule });
                    }
                } else if ((adviceRes.length === 0)){
                    return res.json({ message: "Cannot proceed to pre-enrollment. Advising is not yet approved." });
                }
            })
        }
    })
});


export default router;