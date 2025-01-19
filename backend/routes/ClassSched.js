import express from 'express';
import mysql from 'mysql';
import dbConfig from './db/dbConfig.js';


dotenv.config();
const router = express.Router();

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    }
});

router.get('/viewSched/regirreg', (req, res) => {
    const sql1 = `SELECT * FROM student WHERE Email = ?`;
    const sql2 = `
    SELECT cs.ClassSchedID,
        cs.CourseChecklistID,
        cs.Day,
        cs.StartTime,
        cs.EndTime,
        cs.YearLevel,
        cs.Section,
        cs.Room,
        cs.InstructorName,
        cs.ClassType,
        cc.CourseCode,
        cc.CourseTitle
    FROM classschedule cs
    JOIN coursechecklist cc
    ON cs.CourseChecklistID = cc.CourseChecklistID
    WHERE cs.ProgramID = ? AND cs.YearLevel = ? AND cs.Section = ?
    `;

    const sql3 = `
    SELECT p.ClassSchedID,
        cs.CourseChecklistID,
        cs.Day,
        cs.StartTime,
        cs.EndTime,
        cs.YearLevel,
        cs.Section,
        cs.Room,
        cs.InstructorName,
        cs.ClassType,
        cc.CourseCode,
        cc.CourseTitle
    FROM preenrollment p
    JOIN classschedule cs
    ON p.ClassSchedID = cs.ClassSchedID
    JOIN coursechecklist cc
    ON cs.CourseChecklistID = cc.CourseChecklistID
    WHERE p.StudentID = ? AND p.PreEnrollmentStatus = 'Approved' AND cs.ProgramID = ?
        `;

    db.query(sql1, req.session.email, (err, stdRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else {
            if(stdRes[0].StudentType === "Regular"){
                const program = stdRes[0].ProgramID;
                const year = stdRes[0].Year;
                const section = stdRes[0].Section;

                db.query(sql2, [program, year, section], (err, schedRes) => {
                    if(err){
                        return res.json({message: "Error in server: " + err});
                    } else if(schedRes.length > 0){
                        return res.json({message: "Success", schedInfo: schedRes});
                    } else{ 
                        return res.json({message: "No schedule found"});
                    }
                })
            } else if (stdRes[0].StudentType === "Irregular"){
                const studentID = stdRes[0].StudentID;
                const program = stdRes[0].ProgramID;

                db.query(sql3, [studentID, program], (err, schedRes) => {
                    if(err){
                        return res.json({message: "Error in server: " + err});
                    } else if(schedRes.length > 0){
                        return res.json({message: "Success", schedInfo: schedRes});
                    } else{ 
                        return res.json({message: "No schedule found"});
                    }
                })
            }
        }
    })
})

export default router;