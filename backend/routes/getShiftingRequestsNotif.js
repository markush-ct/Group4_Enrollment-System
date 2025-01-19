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

router.get('/', (req, res) => {
    const programQuery = `SELECT * FROM employee WHERE Email = ? AND EmpJobRole = 'DCS Head'`;
    db.query(programQuery, req.session.email, (err, programResult) => {
        if (err) {
            return res.json({ message: "Error in server: " + err.message });
        } else if(programResult.length > 0) {
            const program = programResult[0].ProgramID;

            const studentCountQuery = `
            SELECT 
                s.CvSUStudentID,
                COUNT(sf.StudentID) AS studentCount
            FROM 
                student s
            LEFT JOIN 
                shiftingform sf
            ON 
                s.CvSUStudentID = sf.StudentID
            WHERE
                s.RegStatus = 'Accepted' 
                AND s.StudentType = 'Shiftee' 
                AND sf.ShiftingStatus = 'Submitted'
                AND s.ProgramID = ? 
            GROUP BY 
                s.CvSUStudentID`;

            db.query(studentCountQuery, program, (err, studentRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err.message });
                }

                return res.json({
                    studentCount: studentRes.length 
                });
                
            });
        }
    });

});

export default router;