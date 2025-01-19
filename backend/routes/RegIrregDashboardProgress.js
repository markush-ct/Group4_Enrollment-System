import express from 'express';
import session from 'express-session';
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

router.get('/enrollStatusProgress', (req, res) => {
    const stdID = `SELECT * FROM student WHERE Email = ?`;

    db.query(stdID, req.session.email, (err, stdRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(stdRes.length > 0){
            const enroll = `SELECT * FROM enrollment WHERE StudentID = ${stdRes[0].StudentID} AND EnrollmentStatus = 'Enrolled'`;
            db.query(enroll, (err, enrollRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(enrollRes.length > 0){
                    return res.json({message: "Success"});
                } else {
                    return res.json({message: "Not yet enrolled"});
                }
            });

        }
    });
})

router.get('/preEnrollProgress', (req, res) => {
    const stdID = `SELECT * FROM student WHERE Email = ?`;

    db.query(stdID, req.session.email, (err, stdRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(stdRes.length > 0){
            const preEnroll = `SELECT * FROM preenrollment WHERE StudentID = ${stdRes[0].StudentID} AND PreEnrollmentStatus = 'Approved'`;
            db.query(preEnroll, (err, preEnrollRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(preEnrollRes.length > 0){
                    return res.json({message: "Success"});
                } else {
                    return res.json({message: "Pre-enrollment is not yet verified"});
                }
            });

        }
    });
})

router.get('/adviseProgress', (req, res) => {
    const stdID = `SELECT * FROM student WHERE Email = ?`;

    db.query(stdID, req.session.email, (err, stdRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(stdRes.length > 0){
            const advise = `SELECT * FROM advising WHERE StudentID = ${stdRes[0].StudentID} AND AdvisingStatus = 'Approved'`;
            db.query(advise, (err, adviseRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(adviseRes.length > 0){
                    return res.json({message: "Success"});
                } else {
                    return res.json({message: "Advice is not yet sent"});
                }
            });

        }
    });
})

router.get('/reqsProgress', (req, res) => {
    const stdID = `SELECT * FROM student WHERE Email = ?`;

    db.query(stdID, req.session.email, (err, stdRes) => {
        if(err){
            return res.json({ message: "Error in server: " + err });
        } else if (stdRes.length > 0) {
            const reqs = `SELECT * FROM studentcoursechecklist WHERE StudentID = ${stdRes[0].StudentID}`;            
            db.query(reqs, (err, reqsRes) => {
                if(err){
                    return res.json({ message: "Error in server: " + err });
                } else {

                    const cog = `SELECT * FROM requirements WHERE StudentID = ?`;
                    db.query(cog, stdRes[0].StudentID, (err, cogRes) => {
                        if(err){
                            return res.json({ message: "Error in server: " + err });
                        } else if(cogRes[0].SocFeePayment !== "Paid" || cogRes[0].COG === null){
                            return res.json({ message: "Requirements are not yet verified" });
                        } else{
                            // Check if there is any row with StdChecklistStatus not 'Verified'
                            const unverifiedRows = reqsRes.some(row => row.StdChecklistStatus !== 'Verified');
                            
                            if (unverifiedRows || reqsRes.length === 0) {
                                return res.json({ message: "Requirements are not yet verified" });
                            } else {
                                return res.json({ message: "Success" });
                            }                            
                        }
                    })
                    
                }
            });
        }
    });
});


router.get('/socFeeProgress', (req, res) => {
    const stdID = `SELECT * FROM student WHERE Email = ?`;

    db.query(stdID, req.session.email, (err, stdRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else if(stdRes.length > 0){
            const socfee = `SELECT * FROM requirements WHERE StudentID = ${stdRes[0].StudentID} AND SocFeePayment = 'Paid'`;
            db.query(socfee, (err, socfeeRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(socfeeRes.length > 0){
                    return res.json({message: "Success"});
                } else {
                    return res.json({message: "Soc Fee Payment is Not Paid"});
                }
            });

        }
    });
})

export default router;