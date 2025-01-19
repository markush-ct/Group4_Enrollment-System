import express from 'express';
import mysql from 'mysql';
import nodemailer from 'nodemailer';
import dbConfig from './db/dbConfig.js';


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

router.post('/getClassSched/popup', (req, res) => {
    const getProgram = `SELECT * FROM societyofficer WHERE Email = ?`;
    const getSched = `
    SELECT
        c.CourseChecklistID,
        c.CourseCode,
        c.CourseTitle,
        cs.ClassType,
        cs.ProgramID,
        cs.Day,
        cs.StartTime,
        cs.EndTime,
        cs.InstructorName
    FROM coursechecklist c
    JOIN classschedule cs
    ON c.CourseChecklistID = cs.CourseChecklistID
    WHERE cs.YearLevel = ? AND cs.Section = ? AND cs.ProgramID = ?
    `;

    db.query(getProgram, req.session.email, (err, programRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else {
            const { year, section } = req.body;
            const program = programRes[0].ProgramID;

            db.query(getSched, [year, section, program], (err, schedRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if (schedRes.length > 0){
                    return res.json({
                        message: "Success",
                        schedInfo: schedRes
                    })
                } else {
                    return res.json({message: "No schedule found"});
                }
            })
        }
    })
})

router.get('/getClassSched/table', (req, res) => {
    const getProgram = `SELECT * FROM societyofficer WHERE Email = ?`;
    const getSections = `SELECT DISTINCT YearLevel, Section FROM classschedule WHERE ProgramID = ?`

    db.query(getProgram, req.session.email, (err, programRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else {
            db.query(getSections, programRes[0].ProgramID, (err, sectionRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(sectionRes.length > 0){
                    return res.json({
                        message: "Success",
                        sections: sectionRes
                    });
                } else {
                    return res.json({message: "No sections found"});
                }
            })
        }
    })
})

router.post('/postClassSched', (req, res) => {
    const getID = `SELECT * FROM societyofficer WHERE Email = ?`;
    const insertQuery = `INSERT INTO classschedule (ProgramID, SocietyOfficerID, CourseChecklistID, Day, StartTime, EndTime, YearLevel, Section, Room, InstructorName, ClassType)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
    

    db.query(getID, req.session.email, (err, idRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else{
            const values = [
                idRes[0].ProgramID,
                idRes[0].SocietyOfficerID,
                req.body.courseCode,
                req.body.day,
                req.body.startTime,
                req.body.endTime,
                req.body.year,
                req.body.section,
                req.body.room,
                req.body.instructor,
                req.body.classType,
            ];

            db.query(insertQuery, values, (err, insertRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if (insertRes.affectedRows > 0){
                    return res.json({message: "Success"});
                } else {
                    return res.json({message: "Failed to create Class Schedule"});
                }
            })
        }
    })
})

router.get('/getOptionsForSched', (req, res) => {
    const getProgram = `SELECT * FROM societyofficer WHERE Email = ?`;
    const getCourses = `SELECT * FROM coursechecklist WHERE ProgramID = ?`;

    db.query(getProgram, req.session.email, (err, programRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else {
            db.query(getCourses, programRes[0].ProgramID, (err, courseRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else {
                    return res.json({
                        message: "Success",
                        courseData: courseRes
                    })
                }
            })
        }
    })
})


export default router;