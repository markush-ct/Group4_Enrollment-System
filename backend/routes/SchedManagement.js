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