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

router.post('/addStudent/studentInfo', (req, res) => {
    const values = [
        req.body.program,
        req.body.email,
        req.body.studentID,
        req.body.firstname,
        req.body.middlename,
        req.body.lastname,
        req.body.dob,
        req.body.year,
        req.body.section,
        req.body.studentType,
        req.body.semester,
        'Active',
        'Pending',
    ];

    const readID = `SELECT * FROM student WHERE CvSUStudentID = ?`;
    db.query(readID, req.body.studentID, (err, idRes) => {
        if(err) {
            return res.json({message: "Error in server: " + err});
        } else if(idRes.length > 0){
            return res.json({message: "Student ID exists"});
        } else if(idRes.length === 0){
            const insert = `INSERT INTO student (ProgramID, Email, CvSUStudentID, Firstname, Middlename, Lastname, DOB, Year, Section, StudentType, Semester, StdStatus, RegStatus)
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            db.query(insert, values, (err, insertRes) => {
                if(err) {
                    return res.json({message: "Error in server: " + err});
                } else if(insertRes.affectedRows > 0){
                    return res.json({message: "Success"});
                } else {
                    return res.json({message: "Failed to add student."});
                }
            })
        }
    })
})

router.post('/getEnrollStatus/studentInfo', (req, res) => {
    const { studentID } = req.body;
    const enrollStatus = `SELECT * FROM enrollment WHERE StudentID = ?`;
    db.query(enrollStatus, studentID, (err, readRes) => {
        if(err) {
            return res.json({message: "Error in server: " + err});
        } else if(readRes.length > 0){
            if(readRes[0].EnrollmentStatus === "Enrolled"){
                return res.json({message: "Success", enrollStatus: "Enrolled"});
            } else if (readRes[0].EnrollmentStatus === "Pending") {
                return res.json({message: "Success", enrollStatus: "Pending"});
            } else {
                return res.json({message: "Failed", enrollStatus: "Not Enrolled"});
            }
        } else if(readRes.length === 0){
            return res.json({message: "Failed", enrollStatus: "Not Enrolled"});
        }
    })
});

router.get('/getAllStudent', (req, res) => {
    const read = `SELECT * FROM student WHERE StudentType IN ('Regular', 'Irregular')`;
    db.query(read, (err, readRes) => {
        if(err) {
            return res.json({message: "Error in server: " + err});
        } else if(readRes.length > 0){
            return res.json({message: "Success", studentRes: readRes});
        } else if(readRes.length === 0) {
            return res.json({message: "No student was found"});
        }
    })
})

export default router;