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

router.post('/', (req, res) => {
    const sql1 = `SELECT * FROM societyofficer WHERE Email = ?`;
    const sql2 = `UPDATE enrollmentperiod 
    SET SocietyOfficerID = ?, 
        Start = ?,
        End = ?,
        Status = ?
    WHERE ProgramID = ?`;

    const insertQuery = `
        INSERT INTO requirements (StudentID)
        SELECT StudentID
        FROM student
        WHERE StudentType IN ('Regular', 'Irregular') 
        AND RegStatus = 'Accepted'
        AND StudentID NOT IN (SELECT StudentID FROM requirements);
    `;

    const updateQuery = `
        UPDATE requirements
        SET SocFeePayment = 'Pending',
            SocietyOfficerID = null,
            COG = null
        WHERE StudentID IN (SELECT StudentID FROM student WHERE StudentType IN ('Regular', 'Irregular'))
    `;

    db.query(sql1, [req.session.email], (err, socOffResult) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(socOffResult.length > 0){
            const values = [
                socOffResult[0].SocietyOfficerID,
                req.body.start,
                req.body.end,
                "Pending",
                socOffResult[0].ProgramID,
            ];

            db.query(sql2, values, (err, postingRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(postingRes.affectedRows > 0){ 
                    db.query(insertQuery, (err, insertRes) => {
                        if(err){
                            return res.json({message: "Error in server: " + err});
                        } else if(insertRes.affectedRows > 0){
                            
                            db.query(updateQuery, (err, updateRes) => {
                                if(err){
                                    return res.json({message: "Error in server: " + err});
                                } else if(updateRes.affectedRows > 0){
                                    return res.json({message: "Enrollment period posted successfully."});
                                }
                            });
                        } else{
                            db.query(updateQuery, (err, updateRes) => {
                                if(err){
                                    return res.json({message: "Error in server: " + err});
                                } else if(updateRes.affectedRows > 0){
                                    return res.json({message: "Enrollment period posted successfully."});
                                }
                            });
                        }
                    });                
                } else{
                    return res.json({message: "Error inserting in requirements table."});
                }
            });
        } else{
            return res.json({message: "Society officer not found."});
        }
    });
});

export default router;