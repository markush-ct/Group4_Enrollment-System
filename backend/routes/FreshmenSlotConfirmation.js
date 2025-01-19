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

router.post('/handleConfirmSlot', (req, res) => {
     const sql1 = `SELECT * FROM student WHERE Email = ?`;
     const sql2 = `SELECT * FROM admissionform WHERE StudentID = ?`;
     const sql3 = `UPDATE slotconfirmation
     SET IsSlotConfirmed = 1
     WHERE AdmissionID = ?`;

     db.query(sql1, req.session.email, (err, studentRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(studentRes.length > 0){
            db.query(sql2, studentRes[0].StudentID, (err, admissionRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(admissionRes.length > 0){
                    db.query(sql3, admissionRes[0].AdmissionID, (err, slotRes) => {
                        if(err){
                            return res.json({message: "Error in server: " + err});
                        } else if(slotRes.affectedRows > 0){
                            return res.json({message: "Slot Confirmed"});
                        } else{
                            return res.json({message: "Unable to confirm slot"});
                        }
                    })
                }
            })
        }
     })
});

router.get('/getFreshmanSlot', (req, res) => {
    const sql1 = `SELECT * FROM student WHERE Email = ?`;
    const sql2 = `SELECT * FROM admissionform WHERE StudentID = ?`;
    const sql3 = `SELECT * FROM slotconfirmation WHERE AdmissionID = ?`;

    db.query(sql1, req.session.email, (err, studentRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(studentRes.length > 0){
            db.query(sql2, studentRes[0].StudentID, (err, admissionRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(admissionRes.length > 0){
                    db.query(sql3, admissionRes[0].AdmissionID, (err, slotRes) => {
                        if(err){
                            return res.json({message: "Error in server: " + err});
                        } else if(slotRes.length > 0){
                            return res.json({
                                message: "Slot fetched",
                                isSlotConfirmed: slotRes[0].IsSlotConfirmed
                            })
                        } else {
                            return res.json({message: "Unable to fetch slot status"});
                        }
                    })
                }
            })
        }
    })
})

export default router;