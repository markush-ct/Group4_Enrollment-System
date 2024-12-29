import express from 'express';
import mysql from 'mysql';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

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

function generateRandomPassword(length = 8) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gerlyntan07@gmail.com', // Sender email
        pass: 'sgpd rzwu zhna gbua' // Sender App Password
    }
});

router.post('/activateAccount', async (req, res) => {
    const { email, name, role } = req.body;

    if (!email || !name || !role) {
        console.error('Missing email or name:', req.body);
        return res.json({ message: 'Email and name are required.' });
    }

    const tempPassword = generateRandomPassword(8);

    const emailBody = `
    Hello ${name},

    Your account has been activated. Login with your temporary password and change it as soon as possible.

    Username: ${email}
    Temporary Password: ${tempPassword}

    Best regards,
    CvSU Enrollment Officer
  `;

    const mailOptions = {
        from: 'gerlyntan07@gmail.com',
        to: email,
        subject: 'Account Activation',
        text: emailBody,
    };


    try {
        console.log('Sending email to:', email);
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully', emailBody);

        const terminateQuery = `UPDATE account
        SET Status = 'Active',
            Password = ?
        WHERE Email = ?`;
        
        db.query(terminateQuery, [tempPassword, email], (err, terminateRes) => {
            if(err){
                return res.json({message: "Error in server: " + err});
            } else if(terminateRes.affectedRows > 0){
                return res.json({message: "Account status activated"});
            }
        })

    } catch (error) {
        console.error('Error in /activateAccount:', error);
        res.json({
            message: 'Internal server error. Please check your internet connection.',
            error: error.message,
        });
    }
});

router.post('/terminateAccount', async (req, res) => {
    const { email, name, role } = req.body;

    if (!email || !name || !role) {
        console.error('Missing email or name:', req.body);
        return res.json({ message: 'Email and name are required.' });
    }

    const emailBody = `
    Hello ${name},

    Your account has been terminated. 

    Best regards,
    CvSU Enrollment Officer
  `;

    const mailOptions = {
        from: 'gerlyntan07@gmail.com',
        to: email,
        subject: 'Account Termination',
        text: emailBody,
    };


    try {
        console.log('Sending email to:', email);
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');

        const terminateQuery = `UPDATE account
        SET Status = 'Terminated'
        WHERE Email = ?`;
        
        db.query(terminateQuery, email, (err, terminateRes) => {
            if(err){
                return res.json({message: "Error in server: " + err});
            } else if(terminateRes.affectedRows > 0){
                return res.json({message: "Account status terminated"});
            }
        })

    } catch (error) {
        console.error('Error in /terminateAccount:', error);
        res.json({
            message: 'Internal server error. Please check your internet connection.',
            error: error.message,
        });
    }
});

router.get('/getAccounts', (req, res) => {
    const sql1 = `
SELECT 
a.AccountID,
  a.Email,
  a.Name,
  a.Role,
  a.Status,
  s.StudentID,
  s.CvSUStudentID,
  s.StudentType,
  s.StdStatus,
  so.ProgramID,  
  so.Position,
  e.EmpStatus
FROM 
  account a
LEFT JOIN 
  student s ON a.Email = s.Email
LEFT JOIN 
  societyofficer so ON a.Email = so.Email
LEFT JOIN 
  employee e ON a.Email = e.Email;
`;

    db.query(sql1, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            return res.json({
                message: "Records fetched",
                accountResults: result.map(row => ({
                    account: {
                        accountID: row.AccountID,
                        email: row.Email,
                        name: row.Name,
                        role: row.Role,
                        accStatus: row.Status,
                    },
                    student: {
                        studentID: row.StudentID,
                        cvsuStudentID: row.CvSUStudentID,
                        email: row.Email,
                        studentType: row.StudentType,
                        studentStatus: row.StdStatus,
                    },
                    socOfficer: {
                        programID: row.ProgramID,
                        position: row.Position,
                        email: row.Email,
                    }
                }))
            })
        }
    })
});

export default router;