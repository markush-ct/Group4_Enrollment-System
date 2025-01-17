import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { report } from 'process';
import { devNull } from 'os';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import accReqNotif from './routes/accReqNotif.js';
import admissionNotif from './routes/admissionNotif.js';
import getFreshmenConfirmedSlots from './routes/getFreshmenConfirmedSlots.js';
import getShiftingRequestsNotif from './routes/getShiftingRequestsNotif.js';
import socOfficerProgram from './routes/socOfficerProgram.js';
import DCSHeadProgram from './routes/DCSHeadProgram.js';
import postEnrollmentPeriod from './routes/postEnrollmentPeriod.js';
import handleEnrollment from './routes/handleEnrollment.js';
import socFee from './routes/socFee.js';
import FreshmenSlotConfirmation from './routes/FreshmenSlotConfirmation.js';
import AccountManagement from './routes/AccountManagement.js';
import viewChecklist from './routes/viewChecklist.js';
import HandleCOGChecklist from './routes/HandleCOGChecklist.js';
import HandleAdvising from './routes/HandleAdvising.js';
import HandlePreEnrollment from './routes/HandlePreEnrollment.js';
import RegIrregEnrollProgress from './routes/RegIrregDashboardProgress.js';
import HandleEnrollmentStatus from './routes/HandleEnrollmentStatus.js';
import SchedManagement from './routes/SchedManagement.js';
import ClassSched from './routes/ClassSched.js';
import StudentInformation from './routes/StudentInformation.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173", // Local development
        "https://group4-enrollment-system-client.vercel.app" // Deployed frontend URL
    ],
    methods: ["POST", "GET"], // Ensure OPTIONS is allowed
    credentials: true
}));

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cvsuenrollmentsystem'
})


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gerlyntan07@gmail.com', // Sender email
        pass: 'sgpd rzwu zhna gbua' // Sender App Password
    }

});

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use unique filenames
    },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));


app.use('/accReqNotif', accReqNotif);
app.use('/admissionNotif', admissionNotif);
app.use('/getFreshmenConfirmedSlots', getFreshmenConfirmedSlots);
app.use('/getShiftingRequestsNotif', getShiftingRequestsNotif);
app.use('/socOfficerProgram', socOfficerProgram);
app.use('/DCSHeadProgram', DCSHeadProgram);
app.use('/postEnrollmentPeriod', postEnrollmentPeriod);
app.use('/', handleEnrollment);
app.use('/', socFee);
app.use('/', FreshmenSlotConfirmation);
app.use('/', AccountManagement);
app.use('/', viewChecklist);
app.use('/', HandleCOGChecklist);
app.use('/', HandleAdvising);
app.use('/', HandlePreEnrollment);
app.use('/', RegIrregEnrollProgress);
app.use('/', HandleEnrollmentStatus);
app.use('/', SchedManagement);
app.use('/', ClassSched);
app.use('/', StudentInformation);


app.post('/rejectTransfereeAdmissionReq', (req, res) =>{
    const getEmpID = `SELECT * FROM employee where Email = ?`;

    db.query(getEmpID, req.session.email, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (idRes.length > 0) {
            const empID = idRes[0].EmployeeID;

            const { email, name, studentID, rejectionReason } = req.body;

            const updateShiftingReject = `UPDATE admissionform
            SET EmployeeID = ?,
                AssessedBy = ?,
                AdmissionStatus = ?
            WHERE StudentID = ?
            `;

            const updateValues = [
                empID,
                idRes[0].Firstname + " " + idRes[0].Lastname,
                "Rejected",
                studentID
            ];

            db.query(updateShiftingReject, updateValues, (err, updateRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (updateRes.affectedRows > 0) {

                    const emailBody = `
                    Dear ${name},
                    
                    Thank you for your interest in transferring at Cavite State University - Bacoor Campus!. 

                    After careful consideration, we regret to inform you that your transfer request has not been approved at this time.  
                    **Reason for rejection:**  
                    ${rejectionReason}  

                    We understand this news may be disappointing, and we encourage you to continue pursuing your educational goals. If you have any questions or need further clarification, please feel free to reach out to us at (046)476-5029.

                    We wish you the very best in your future endeavors.
                
                    Best regards,
                    ${idRes[0].Firstname + " " + idRes[0].Lastname}
                    `;

                    const mailOptions = {
                        from: 'gerlyntan07@gmail.com',
                        to: email,
                        subject: 'Transfer Request Rejection',
                        text: emailBody,
                    };

                    try {
                        console.log("Sending email with options:", mailOptions);
                        transporter.sendMail(mailOptions);
                        return res.json({ message: "Transfer request rejection sent" });
                    } catch (emailError) {
                        console.error('Error sending email:', emailError);
                        return res.json({ message: "Error sending email", error: emailError.message });
                    }
                } else {
                    return res.json({ message: "Failed to reject transfer request" });
                }
            })
        }
    })
})

app.post('/approveTransfereeAdmissionReq', (req, res) => {
    const getEmpID = `SELECT * FROM employee where Email = ?`;

    db.query(getEmpID, req.session.email, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (idRes.length > 0) {
            const empID = idRes[0].EmployeeID;

            const { email, name, studentID, submissionDate } = req.body;

            const formattedSubmissionDate = new Date(submissionDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const updateSubmissionSched = `UPDATE admissionform
            SET EmployeeID = ?,
                AssessedBy = ?,
                SubmissionSchedule = ?,
                AdmissionStatus = ?
            WHERE StudentID = ?
            `;

            const updateValues = [
                empID,
                idRes[0].Firstname + " " + idRes[0].Lastname,
                submissionDate,
                "Approved",
                studentID
            ];

            db.query(updateSubmissionSched, updateValues, (err, updateRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (updateRes.affectedRows > 0) {

                    const emailBody = `
                    Dear ${name},
                    Congratulations on your transfer approval at Cavite State University - Bacoor Campus!

                    Please mark the following important dates:

                    - **Submission of Requirements:** ${formattedSubmissionDate}  
                    Kindly bring the following documents:
                    1. TOR
                    2. Honorable Dismissal
                    3. Good Moral Certificate
                    4. NBI Clearance
                    
                    We are excited to welcome you to the CvSU - Bacoor community!
                
                    Best regards,
                    ${idRes[0].Firstname + " " + idRes[0].Lastname}
                    `;

                    const mailOptions = {
                        from: 'gerlyntan07@gmail.com',
                        to: email,
                        subject: 'Transfer Approval',
                        text: emailBody,
                    };

                    try {
                        console.log("Sending email with options:", mailOptions);
                        transporter.sendMail(mailOptions);
                        return res.json({ message: "Transfer Approval sent" });
                    } catch (emailError) {
                        console.error('Error sending email:', emailError);
                        return res.json({ message: "Error sending email", error: emailError.message });
                    }
                } else {
                    return res.json({ message: "Failed to approve transfer request" });
                }
            })
        }
    })
})

app.get('/getTransfereePreProgram', (req, res) => {
    const sql1 = `
    SELECT DISTINCT TransfereeCollegeCourse
FROM admissionform
WHERE TransfereeCollegeCourse IS NOT NULL;
`;

db.query(sql1, (err, prevCoursesRes) => {
    if (err) {
        return res.json({ message: "Error in server: " + err });
    } else {
        return res.json({prevCourses: prevCoursesRes});
    }
})
})

app.get('/getTransfereeAdmissionReq', (req, res) => {
    const query = `
        SELECT * 
        FROM student s
        JOIN admissionform af ON s.StudentID = af.StudentID
        WHERE af.AdmissionStatus = 'Submitted'
        AND s.StudentType = 'Transferee'`;

    db.query(query, (err, results) => {

        if (err) {
            return res.json({ message: "Error in server: " + err });
        }

        if (results === undefined || results.length === 0) {
            return res.json({ message: "No records found" });
        }

        if (results.length > 0) {            
            return res.json({
                message: "Fetched records successfully",
                records: results,
            });
        } else {
            return res.json({ message: "No records found" });
        }
    });
})

//STUDENT TABLE AUTO SAVE EVERY INPUT CHANGES
app.post('/saveTransfereeData', (req, res) => {
    //READ FOR STUDENTID COLUMN FIRST
    const readID = `SELECT * FROM student WHERE Email = ?`;
    db.query(readID, req.session.email, (err, idResult) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (idResult.length > 0) {
            const getID = idResult[0].StudentID;

            const updateStudentTbl = `UPDATE student
            SET Firstname = ?,
            Middlename = ?,
            Lastname = ?,
            Gender = ?,
            Age = ?,
            Address = ?,
            DOB = ?
            WHERE Email = ?
            `;

            const studentTblValues = [
                req.body.firstName,
                req.body.middleName,
                req.body.lastName,
                req.body.sex,
                req.body.age,
                req.body.permanentAddress,
                req.body.dateOfBirth,
                req.session.email
            ];

            db.query(updateStudentTbl, studentTblValues, (err, studentTblRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (studentTblRes.affectedRows > 0) {
                    return res.json({ message: "Update success" });
                }
            })
        } else {
            return res.json({ message: "Error retrieving Student ID" });
        }
    })
})

//ADMISSION FORM TABLE AUTO SAVE EVERY INPUT CHANGES
app.post('/saveTransfereeAdmissionForm', upload.single("idPicture"), (req, res) => {
    //READ FOR STUDENTID COLUMN FIRST
    const readID = `SELECT * FROM student WHERE Email = ?`;
    db.query(readID, req.session.email, (err, idResult) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (idResult.length > 0) {
            const getID = idResult[0].StudentID;

            // File path for the uploaded ID picture
            const idPicturePath = req.file ? req.file.path : req.body.idPictureUrl;

            //UPDATE ADMISSION FORM
            const updateQuery = `UPDATE admissionform
            SET ApplyingFor = ?,
            IDPicture = ?,
            ZipCode = ?,
            LRN = ?,
            Religion = ?,
            Nationality = ?,
            CivilStatus = ?,
            PWD = ?,
            PWDSpecification = ?,
            Indigenous = ?,
            IndigenousSpecification = ?,
            FatherName = ?,
            MotherName = ?,
            GuardianName = ?,
            FatherContactNo = ?,
            MotherContactNo = ?,
            GuardianContactNo = ?,
            FatherOccupation = ?,
            MotherOccupation = ?,
            GuardianOccupation = ?,
            GuardianRelationship = ?,
            NoOfSiblings = ?,
            BirthOrder = ?,
            MonthlyFamilyIncome = ?,            
            ElemSchoolName = ?,
            ElemSchoolAddress = ?,
            ElemYearGraduated = ?,
            ElemSchoolType = ?,
            HighSchoolName = ?,
            HighSchoolAddress = ?,
            HighSchoolYearGraduated = ?,
            HighSchoolType = ?,
            SHSchoolName = ?,
            SHSchoolAddress = ?,
            SHYearGraduated = ?,
            SHSchoolType = ?,
            VocationalSchoolName = ?,
            VocationalSchoolAddress = ?,
            VocationalYearGraduated = ?,
            VocationalSchooltype = ?,
            TransfereeCollegeSchoolName = ?,
            TransfereeCollegeSchoolAddress = ?,
            TransfereeCollegeCourse = ?,
            TransfereeCollegeSchoolType = ?,
            MedicalHistory = ?,
            Medication = ?
            WHERE StudentID = ?`;

            const values = [
                req.body.applyingFor,
                idPicturePath,
                req.body.zipCode,
                req.body.lrn,
                req.body.religion,
                req.body.nationality,
                req.body.civilStatus,
                req.body.isPWD,
                req.body.pwd,
                req.body.isIndigenous,
                req.body.indigenous,
                req.body.fatherName,
                req.body.motherName,
                req.body.guardianName,
                req.body.fatherContact,
                req.body.motherContact,
                req.body.guardianContact,
                req.body.fatherOccupation,
                req.body.motherOccupation,
                req.body.guardianOccupation,
                req.body.guardianRelationship,
                req.body.siblings,
                req.body.birthOrder,
                req.body.familyIncome,
                req.body.elementarySchool,
                req.body.elementaryAddress,
                req.body.elementaryYearGraduated,
                req.body.elementarySchoolType,
                req.body.highSchool,
                req.body.jhsAddress,
                req.body.jhsYearGraduated,
                req.body.highSchoolType,
                req.body.seniorHighSchool,
                req.body.seniorHighAddress,
                req.body.seniorHighYearGraduated,
                req.body.seniorHighSchoolType,
                req.body.vocationalSchool,
                req.body.vocationalAddress,
                req.body.vocationalYearGraduated,
                req.body.vocationalSchoolType,
                req.body.transfereeCollegeSchool,
                req.body.transfereeCollegeAddress,
                req.body.transfereeCollegeCourse,
                req.body.transfereeCollegeSchoolType,
                req.body.medicalConditions,
                req.body.medications,
                getID
            ];

            db.query(updateQuery, values, (err, updateRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err, });
                } else if (updateRes.affectedRows > 0) {
                    return res.json({ message: "Update success", idPictureUrl: idPicturePath, results: updateRes });
                } else {
                    return res.json({ message: "Update failed" });
                }
            })
        } else {
            return res.json({ message: "Error retrieving Student ID" });
        }
    })
})

app.get('/getTransfereeData', (req, res) => {
    const getStudentData = `SELECT * FROM student WHERE Email = ?`;
    const getTransfereeData = `SELECT * FROM admissionform WHERE StudentID = ?`;

    db.query(getStudentData, req.session.email, (err, studentRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (studentRes.length > 0) {
            db.query(getTransfereeData, studentRes[0].StudentID, (err, transfereeRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if(transfereeRes.length > 0 ){
                    return res.json({
                        message: "Fetched records successfully",
                        student: studentRes[0],
                        transferee: transfereeRes[0]
                    });
                }
            })
        }
    });
})

app.post('/rejectFreshmenAdmissionReq', (req, res) =>{
    const getEmpID = `SELECT * FROM employee where Email = ?`;

    db.query(getEmpID, req.session.email, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (idRes.length > 0) {
            const empID = idRes[0].EmployeeID;

            const { email, name, studentID, rejectionReason } = req.body;

            const updateShiftingReject = `UPDATE admissionform
            SET EmployeeID = ?,
                AssessedBy = ?,
                AdmissionStatus = ?
            WHERE StudentID = ?
            `;

            const updateValues = [
                empID,
                idRes[0].Firstname + " " + idRes[0].Lastname,
                "Rejected",
                studentID
            ];

            db.query(updateShiftingReject, updateValues, (err, updateRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (updateRes.affectedRows > 0) {

                    const emailBody = `
                    Dear ${name},
                    
                    Thank you for your interest in joining Cavite State University - Bacoor Campus!. 

                    After careful consideration, we regret to inform you that your admission request has not been approved at this time.  
                    **Reason for rejection:**  
                    ${rejectionReason}  

                    We understand this news may be disappointing, and we encourage you to continue pursuing your educational goals. If you have any questions or need further clarification, please feel free to reach out to us at (046)476-5029.

                    We wish you the very best in your future endeavors.
                
                    Best regards,
                    ${idRes[0].Firstname + " " + idRes[0].Lastname}
                    `;

                    const mailOptions = {
                        from: 'gerlyntan07@gmail.com',
                        to: email,
                        subject: 'Admission Request Rejection',
                        text: emailBody,
                    };

                    try {
                        console.log("Sending email with options:", mailOptions);
                        transporter.sendMail(mailOptions);
                        return res.json({ message: "Admission request rejection sent" });
                    } catch (emailError) {
                        console.error('Error sending email:', emailError);
                        return res.json({ message: "Error sending email", error: emailError.message });
                    }
                } else {
                    return res.json({ message: "Failed to reject admission request" });
                }
            })
        }
    })
})

app.post('/approveFreshmenAdmissionReq', (req, res) => {
    const getEmpID = `SELECT * FROM employee where Email = ?`;

    db.query(getEmpID, req.session.email, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (idRes.length > 0) {
            const empID = idRes[0].EmployeeID;

            const { email, name, studentID, submissionDate, examDatetime } = req.body;

            const formattedSubmissionDate = new Date(submissionDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Ensure that examDatetime is in the correct format (YYYY-MM-DDTHH:MM)
            const examDate = new Date(examDatetime);
            const formattedExamDateTime = isNaN(examDate)
            ? "Invalid Date"
            : examDate.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            const updateSubmissionSched = `UPDATE admissionform
            SET EmployeeID = ?,
                AssessedBy = ?,
                DateOfExamAndTime = ?,
                SubmissionSchedule = ?,
                AdmissionStatus = ?
            WHERE StudentID = ?
            `;

            const updateValues = [
                empID,
                idRes[0].Firstname + " " + idRes[0].Lastname,
                examDatetime,
                submissionDate,
                "Approved",
                studentID
            ];

            db.query(updateSubmissionSched, updateValues, (err, updateRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (updateRes.affectedRows > 0) {

                    const emailBody = `
                    Dear ${name},
                    Congratulations on your admission approval at Cavite State University - Bacoor Campus!

                    Please mark the following important dates:

                    - **Examination Date and Time:** ${formattedExamDateTime}  

                    - **Submission of Requirements:** ${formattedSubmissionDate}  
                    Kindly bring the following documents:  
                    1. Accomplished Admission Form  
                    2. Two (2) copies of 1x1 ID pictures with name tags  
                    3. One (1) short ordinary folder  
                    4. Certified True Copy of your G12 Report Card  
                    
                    We are excited to welcome you to the CvSU - Bacoor community!
                
                    Best regards,
                    ${idRes[0].Firstname + " " + idRes[0].Lastname}
                    `;

                    const mailOptions = {
                        from: 'gerlyntan07@gmail.com',
                        to: email,
                        subject: 'Admission Approval',
                        text: emailBody,
                    };

                    try {
                        console.log("Sending email with options:", mailOptions);
                        transporter.sendMail(mailOptions);

                        const getAdmissionID = `SELECT * FROM admissionform WHERE StudentID = ?`;
                        db.query(getAdmissionID, studentID, (err, admissionIDRes) => {
                            if (err) {
                                return res.json({ message: "Error in server: " + err });
                            } else if (admissionIDRes.length > 0) {
                                const slotConfirm = `INSERT INTO slotconfirmation (AdmissionID) VALUES (?)`;
                                db.query(slotConfirm, admissionIDRes[0].AdmissionID, (err, slotRes) => {
                                    if (err) {
                                        return res.json({ message: "Error in server: " + err });
                                    } else if (slotRes.affectedRows > 0) {
                                        return res.json({ message: "Admission Approval sent", admissionID: admissionIDRes[0].AdmissionID });
                                    }
                                });
                            }
                        });

                    } catch (emailError) {
                        console.error('Error sending email:', emailError);
                        return res.json({ message: "Error sending email", error: emailError.message });
                    }
                } else {
                    return res.json({ message: "Failed to approve admission request" });
                }
            })
        }
    })
})

app.get('/getFreshmenAdmissionReq', (req, res) => {
    const query = `
        SELECT * 
        FROM student s
        JOIN admissionform af ON s.StudentID = af.StudentID
        WHERE af.AdmissionStatus = 'Submitted'
        AND s.StudentType = 'Freshman'`;

    db.query(query, (err, results) => {

        if (err) {
            return res.json({ message: "Error in server: " + err });
        }

        if (results === undefined || results.length === 0) {
            return res.json({ message: "No records found" });
        }

        if (results.length > 0) {            
            return res.json({
                message: "Fetched records successfully",
                records: results,
            });
        } else {
            return res.json({ message: "No records found" });
        }
    });
})

app.get('/getTotalShiftingReq', (req, res) => {
    const getProgramQuery = `SELECT * FROM employee WHERE Email = ?`;
    db.query(getProgramQuery, req.session.email, (err, programRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (programRes.length > 0) {
            const programID = programRes[0].ProgramID;

            const sql = `
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

    db.query(sql, programID, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            return res.json({ shiftingReqCount: result.length });
        }
    });
        }
});
})

app.post('/rejectShiftingReq', (req, res) => {
    const getEmpID = `SELECT * FROM employee where Email = ?`;

    db.query(getEmpID, req.session.email, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (idRes.length > 0) {
            const empID = idRes[0].EmployeeID;

            const { email, name, studentID, rejectionReason } = req.body;

            const updateShiftingReject = `UPDATE shiftingform
            SET EmployeeID = ?,
                ShiftingStatus = ?
            WHERE StudentID = ?
            `;

            const updateValues = [
                empID,
                "Rejected",
                studentID
            ];

            db.query(updateShiftingReject, updateValues, (err, updateRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (updateRes.affectedRows > 0) {

                    const emailBody = `
                    Hello ${name},
                    Student ID: ${studentID}

                    I am sorry to inform you that your shifting request has been rejected.
                    
                    Reason for rejection: 
                    ${rejectionReason}
                
                    Best regards,
                    ${idRes[0].Firstname + " " + idRes[0].Lastname}
                    `;

                    const mailOptions = {
                        from: 'gerlyntan07@gmail.com',
                        to: email,
                        subject: 'Rejected Shifting Request',
                        text: emailBody,
                    };

                    try {
                        console.log("Sending email with options:", mailOptions);
                        transporter.sendMail(mailOptions);
                        return res.json({ message: "Shifting Request rejection sent" });
                    } catch (emailError) {
                        console.error('Error sending email:', emailError);
                        return res.json({ message: "Error sending email", error: emailError.message });
                    }
                } else {
                    return res.json({ message: "Failed to reject shifting request" });
                }
            })
        }
    })
})

app.post('/approveShiftingReq', (req, res) => {
    const getEmpID = `SELECT * FROM employee where Email = ?`;

    db.query(getEmpID, req.session.email, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (idRes.length > 0) {
            const empID = idRes[0].EmployeeID;

            const { email, name, studentID, submissionDate } = req.body;

            const formattedDate = new Date(submissionDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const updateSubmissionSched = `UPDATE shiftingform
            SET EmployeeID = ?,
                SubmissionSchedule = ?,
                ShiftingStatus = ?
            WHERE StudentID = ?
            `;

            const updateValues = [
                empID,
                submissionDate,
                "Approved",
                studentID
            ];

            db.query(updateSubmissionSched, updateValues, (err, updateRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (updateRes.affectedRows > 0) {

                    const emailBody = `
                    Hello ${name},
                    Student ID: ${studentID}

                    Your shifting request has been approved!
                    Please come to the department by ${formattedDate} and bring the following requirements:
                    1. Accomplished Shifting Form
                
                    Best regards,
                    ${idRes[0].Firstname + " " + idRes[0].Lastname}
                    `;

                    const mailOptions = {
                        from: 'gerlyntan07@gmail.com',
                        to: email,
                        subject: 'Approved Shifting Request',
                        text: emailBody,
                    };

                    try {
                        console.log("Sending email with options:", mailOptions);
                        transporter.sendMail(mailOptions);
                        return res.json({ message: "Shifting Request approval sent" });
                    } catch (emailError) {
                        console.error('Error sending email:', emailError);
                        return res.json({ message: "Error sending email", error: emailError.message });
                    }
                } else {
                    return res.json({ message: "Failed to approve shifting request" });
                }
            })
        }
    })
})

app.get('/shiftingRequests', (req, res) => {
    const getAdminProgram = `SELECT * FROM employee WHERE Email = ?`;
    db.query(getAdminProgram, req.session.email, (err, adminRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if(adminRes.length > 0 ){
            const programID = adminRes[0].ProgramID;

            if(programID === 1){
                    const query = `
                    SELECT 
                        s.CvSUStudentID, s.ProgramID, s.Email, s.Firstname, s.Middlename, s.Lastname, s.PrevProgram, 
                        sf.PrevProgramAdviser, sf.AcadYear, sf.Reasons, sf.Date 
                    FROM student s
                    JOIN shiftingform sf ON s.CvSUStudentID = sf.StudentID
                    WHERE sf.ShiftingStatus = ? AND s.ProgramID = 1`;

                db.query(query, ["Submitted"], (err, results) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    }

                    if (results.length > 0) {
                        return res.json({
                            message: "Fetched records successfully",
                            records: results,
                        });
                    } else {
                        return res.json({ message: "No records found" });
                    }
                });
            } else if(programID === 2){
                const query = `
                    SELECT 
                        s.CvSUStudentID, s.ProgramID, s.Email, s.Firstname, s.Middlename, s.Lastname, s.PrevProgram, 
                        sf.PrevProgramAdviser, sf.AcadYear, sf.Reasons, sf.Date 
                    FROM student s
                    JOIN shiftingform sf ON s.CvSUStudentID = sf.StudentID
                    WHERE sf.ShiftingStatus = ? AND s.ProgramID = 2`;

                db.query(query, ["Submitted"], (err, results) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    }

                    if (results.length > 0) {
                        return res.json({
                            message: "Fetched records successfully",
                            records: results,
                        });
                    } else {
                        return res.json({ message: "No records found" });
                    }
                });
            }
        }
    });
});

//SUBMIT SHIFTING FORM
app.post('/submitShiftingForm', (req, res) => {
    const getID = `SELECT * FROM student WHERE Email = ?`;
    db.query(getID, req.session.email, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (idRes.length > 0) {
            const submitQuery = `UPDATE shiftingform
            SET ShiftingStatus = ?,
                Date = ?
            WHERE StudentID = ?`;

            const values = [
                "Submitted",
                req.body.dateSubmitted,
                idRes[0].CvSUStudentID
            ];

            db.query(submitQuery, values, (err, submitRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (submitRes.affectedRows > 0) {
                    return res.json({ message: "Form submitted successfully", studentID: idRes[0].CvSUStudentID });
                } else {
                    return res.json({ message: "Unable to submit form" });
                }
            })
        }
    })
})

app.get("/get-shiftee/:id", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM student WHERE CvSUStudentID = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.json({ message: "Error fetching data:" + err });
        }
        res.send(result[0]);
    });
});

// API to fetch admission form data by student ID
app.get("/get-shifteeForm/:id", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM shiftingform WHERE StudentID = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.json({ message: "Error fetching data:" + err });
        }
        res.send(result[0]);
    });
});

app.post('/saveShifteeInfo', (req, res) => {
    const updateSem = `UPDATE student SET Semester = ? WHERE Email = ?`;
    const values = [
        req.body.semester,
        req.session.email
    ];
    db.query(updateSem, values, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (result.affectedRows > 0) {
            return res.json({ message: "Record updated successfully" });
        } else {
            return res.json({ message: "Failed to updated record " });
        }
    })
})

//AUTOSAVING SHIFTING FORM INFO
app.post('/saveShiftingInfo', (req, res) => {
    const getID = `SELECT * FROM student WHERE Email = ?`;

    db.query(getID, req.session.email, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (idRes.length > 0) {

            const updateShiftingForm = `UPDATE shiftingform
            SET PrevProgramAdviser = ?,
                AcadYear = ?,
                Reasons =?
            WHERE StudentID = ?;
            `;

            const values = [
                req.body.prevProgramAdviser,
                req.body.currentAcadYear,
                req.body.reasons,
                idRes[0].CvSUStudentID
            ];

            db.query(updateShiftingForm, values, (err, updateRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (updateRes.affectedRows > 0) {
                    return res.json({ message: "Record updated successfully" });
                } else {
                    return res.json({ message: "Failed to updated record " });
                }
            })
        }
    })
})

//READ SHIFTEE INFO
app.get('/getShifteeInfo', (req, res) => {
    const getStudentInfo = `SELECT * FROM student WHERE Email = ?`;
    const getShiftingInfo = `SELECT *FROM shiftingform WHERE StudentID = ?`;

    db.query(getStudentInfo, req.session.email, (err, studentRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (studentRes.length > 0) {
            const studentInfo = studentRes[0];

            db.query(getShiftingInfo, studentInfo.CvSUStudentID, (err, shiftingRes) => {
                const shiftingInfo = shiftingRes[0];

                return res.json({
                    message: "Fetched records successfully",
                    shiftingStatus: shiftingInfo.ShiftingStatus,
                    prevProgram: studentInfo.PrevProgram,
                    prevProgramAdviser: shiftingInfo.PrevProgramAdviser,
                    studentID: studentInfo.CvSUStudentID,
                    currentAcadYear: shiftingInfo.AcadYear,
                    semester: studentInfo.Semester,
                    reasons: shiftingInfo.Reasons,
                    dateSubmitted: shiftingInfo.Date,
                    submissionDate: shiftingInfo.SubmissionSchedule
                })
            })
        } else {
            return res.json({ message: "Error fetching records" });
        }
    })
})


//READ STUDENT PROGRAM TO DISPLAY PROGRAM IN DASHBOARD
app.get('/getStudentProgram', (req, res) => {
    const getProgramQuery = `SELECT * FROM student WHERE Email = ?`;

    db.query(getProgramQuery, req.session.email, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (result.length > 0) {
            return res.json({
                message: "Program fetched successfully",
                program: result[0].ProgramID
            })
        } else {
            return res.json({ message: "Error fetching program" });
        }
    })
})

//FETCH PREFERRED PROGRAM OF FRESHMEN, TRANSFEREE, AND SHIFTEE
app.get('/getFormData', (req, res) => {
    const readStudent = `SELECT * FROM student WHERE Email = ?`;
    const readForm = `SELECT * FROM admissionform WHERE StudentID = ?`;

    db.query(readStudent, req.session.email, (err, studentResult) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (studentResult.length > 0) {
            const student = studentResult[0];

            db.query(readForm, student.StudentID, (err, formResult) => {
                const form = formResult[0];
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (formResult.length > 0) {

                    // Format examSched (datetime) to 'Month Day, Year Hour:Minute AM/PM'
                    const formatExamSched = (examSched) => {
                        const examDate = new Date(examSched);
                        return isNaN(examDate)
                            ? "Invalid Date"
                            : examDate.toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            });
                    };

                    // Format reqSubmission (date only) to 'Month Day, Year'
                    const formatReqSubmission = (reqSubmission) => {
                        const submissionDate = new Date(reqSubmission);
                        return isNaN(submissionDate)
                            ? "Invalid Date"
                            : submissionDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });
                    };

                    // Format dates
                    const examSchedFormatted = formatExamSched(form.DateOfExamAndTime);
                    const reqSubmissionFormatted = formatReqSubmission(form.SubmissionSchedule);

                    return res.json({
                        preferredProgram: student.ProgramID,
                        studentID: student.StudentID,
                        IDPicture: form.IDPicture,
                        idPictureUrl: form.IDPicture,
                        branch: form.Branch,
                        applyingFor: form.ApplyingFor,
                        controlNo: form.ExamControlNo,
                        strand: form.SHSStrand,
                        finalAve: form.FinalAverage,
                        firstQuarter: form.FirstQuarterAve,
                        secondQuarter: form.SecondQuarterAve,
                        thirdQuarter: form.ThirdQuarterAve,
                        fourthQuarter: form.FourthQuarterAve,
                        firstname: student.Firstname,
                        middlename: student.Middlename,
                        lastname: student.Lastname,
                        zipCode: form.ZipCode,
                        permanentAddress: student.Address,
                        email: student.Email,
                        lrn: form.LRN,
                        contactnum: student.PhoneNo,
                        sex: student.Gender,
                        age: student.Age,
                        dob: student.DOB,
                        religion: form.Religion,
                        nationality: form.Nationality,
                        civilStatus: form.CivilStatus,
                        isPWD: form.PWD,
                        pwd: form.PWDSpecification,
                        isIndigenous: form.Indigenous,
                        indigenous: form.IndigenousSpecification,
                        fatherName: form.FatherName,
                        motherName: form.MotherName,
                        guardianName: form.GuardianName,
                        fatherContact: form.FatherContactNo,
                        motherContact: form.MotherContactNo,
                        guardianContact: form.GuardianContactNo,
                        fatherOccupation: form.FatherOccupation,
                        motherOccupation: form.MotherOccupation,
                        guardianOccupation: form.GuardianOccupation,
                        siblings: form.NoOfSiblings,
                        birthOrder: form.BirthOrder,
                        familyIncome: form.MonthlyFamilyIncome,
                        guardianRelationship: form.GuardianRelationship,
                        elementarySchool: form.ElemSchoolName,
                        elementaryAddress: form.ElemSchoolAddress,
                        elementaryYearGraduated: form.ElemYearGraduated,
                        elementarySchoolType: form.ElemSchoolType,
                        highSchool: form.HighSchoolName,
                        jhsAddress: form.HighSchoolAddress,
                        jhsYearGraduated: form.HighSchoolYearGraduated,
                        highSchoolType: form.HighSchoolType,
                        seniorHighSchool: form.SHSchoolName,
                        seniorHighAddress: form.SHSchoolAddress,
                        seniorHighYearGraduated: form.SHYearGraduated,
                        seniorHighSchoolType: form.SHSchoolType,
                        vocationalSchool: form.VocationalSchoolName,
                        vocationalAddress: form.VocationalSchoolAddress,
                        vocationalYearGraduated: form.VocationalYearGraduated,
                        vocationalSchoolType: form.VocationalSchooltype,
                        medicalConditions: form.MedicalHistory,
                        medications: form.Medication,
                        controlNo: form.ExamControlNo,
                        applicationStatus: form.AdmissionStatus,
                        examSched: examSchedFormatted,
                        reqSubmission: reqSubmissionFormatted,
                    });
                } else {
                    return res.json({ message: "Can't fetch form data" });
                }
            })

        } else {
            return res.json({ message: "Error fetching preferred program" });
        }
    })
})

//SUBMIT ADMISSION FORM
app.post('/submitAdmissionForm', (req, res) => {
    const getID = `SELECT * FROM student WHERE Email = ?`;
    db.query(getID, req.session.email, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (idRes.length > 0) {
            const updateFormStatus = `UPDATE admissionform
            SET AdmissionStatus = 'Submitted'
            WHERE StudentID = ?`;

            db.query(updateFormStatus, idRes[0].StudentID, (err, updateRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (updateRes.affectedRows > 0) {
                    return res.json({ message: "Admission Form submitted successfully.", studentID: idRes[0].StudentID });
                } else {
                    return res.json({ message: "Unable to submit Admission Form" });
                }
            })
        } else {
            return res.json({ message: "Unable to get Student ID" });
        }
    })
})

app.get("/get-student/:id", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM student WHERE StudentID = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.json({ message: "Error fetching data:" + err });
        }
        res.send(result[0]);
    });
});

// API to fetch admission form data by student ID
app.get("/get-form/:id", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM admissionform WHERE StudentID = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.json({ message: "Error fetching data:" + err });
        }
        res.send(result[0]);
    });
});

//ADMISSION FORM TABLE AUTO SAVE EVERY INPUT CHANGES
app.post('/admissionFormTable', upload.single("idPicture"), (req, res) => {
    //READ FOR STUDENTID COLUMN FIRST
    const readID = `SELECT * FROM student WHERE Email = ?`;
    db.query(readID, req.session.email, (err, idResult) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (idResult.length > 0) {
            const getID = idResult[0].StudentID;

            // File path for the uploaded ID picture
            const idPicturePath = req.file ? req.file.path : req.body.idPictureUrl;

            //UPDATE ADMISSION FORM
            const updateQuery = `UPDATE admissionform
            SET IDPicture = ?,
            SHSStrand = ?,
            FinalAverage = ?,
            FirstQuarterAve = ?,
            SecondQuarterAve = ?,
            ThirdQuarterAve = ?,
            FourthQuarterAve = ?,
            ZipCode = ?,
            LRN = ?,
            Religion = ?,
            Nationality = ?,
            CivilStatus = ?,
            PWD = ?,
            PWDSpecification = ?,
            Indigenous = ?,
            IndigenousSpecification = ?,
            FatherName = ?,
            MotherName = ?,
            GuardianName = ?,
            FatherContactNo = ?,
            MotherContactNo = ?,
            GuardianContactNo = ?,
            FatherOccupation = ?,
            MotherOccupation = ?,
            GuardianOccupation = ?,
            GuardianRelationship = ?,
            NoOfSiblings = ?,
            BirthOrder = ?,
            MonthlyFamilyIncome = ?,            
            ElemSchoolName = ?,
            ElemSchoolAddress = ?,
            ElemYearGraduated = ?,
            ElemSchoolType = ?,
            HighSchoolName = ?,
            HighSchoolAddress = ?,
            HighSchoolYearGraduated = ?,
            HighSchoolType = ?,
            SHSchoolName = ?,
            SHSchoolAddress = ?,
            SHYearGraduated = ?,
            SHSchoolType = ?,
            VocationalSchoolName = ?,
            VocationalSchoolAddress = ?,
            VocationalYearGraduated = ?,
            VocationalSchooltype = ?,
            MedicalHistory = ?,
            Medication = ?
            WHERE StudentID = ?`;

            const values = [
                idPicturePath,
                req.body.strand,
                req.body.finalAverage,
                req.body.firstQuarter,
                req.body.secondQuarter,
                req.body.thirdQuarter,
                req.body.fourthQuarter,
                req.body.zipCode,
                req.body.lrn,
                req.body.religion,
                req.body.nationality,
                req.body.civilStatus,
                req.body.isPWD,
                req.body.pwd,
                req.body.isIndigenous,
                req.body.indigenous,
                req.body.fatherName,
                req.body.motherName,
                req.body.guardianName,
                req.body.fatherContact,
                req.body.motherContact,
                req.body.guardianContact,
                req.body.fatherOccupation,
                req.body.motherOccupation,
                req.body.guardianOccupation,
                req.body.guardianRelationship,
                req.body.siblings,
                req.body.birthOrder,
                req.body.familyIncome,
                req.body.elementarySchool,
                req.body.elementaryAddress,
                req.body.elementaryYearGraduated,
                req.body.elementarySchoolType,
                req.body.highSchool,
                req.body.jhsAddress,
                req.body.jhsYearGraduated,
                req.body.highSchoolType,
                req.body.seniorHighSchool,
                req.body.seniorHighAddress,
                req.body.seniorHighYearGraduated,
                req.body.seniorHighSchoolType,
                req.body.vocationalSchool,
                req.body.vocationalAddress,
                req.body.vocationalYearGraduated,
                req.body.vocationalSchoolType,
                req.body.medicalConditions,
                req.body.medications,
                getID
            ];

            db.query(updateQuery, values, (err, updateRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err, });
                } else if (updateRes.affectedRows > 0) {
                    return res.json({ message: "Update success", idPictureUrl: idPicturePath });
                } else {
                    return res.json({ message: "Update failed" });
                }
            })
        } else {
            return res.json({ message: "Error retrieving Student ID" });
        }
    })
})


//STUDENT TABLE AUTO SAVE EVERY INPUT CHANGES
app.post('/studentTable', (req, res) => {
    //READ FOR STUDENTID COLUMN FIRST
    const readID = `SELECT * FROM student WHERE Email = ?`;
    db.query(readID, req.session.email, (err, idResult) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (idResult.length > 0) {
            const getID = idResult[0].StudentID;

            const updateStudentTbl = `UPDATE student
            SET Firstname = ?,
            Middlename = ?,
            Lastname = ?,
            Gender = ?,
            Age = ?,
            Address = ?,
            DOB = ?
            WHERE Email = ?
            `;

            const studentTblValues = [
                req.body.firstName,
                req.body.middleName,
                req.body.lastName,
                req.body.sex,
                req.body.age,
                req.body.permanentAddress,
                req.body.dateOfBirth,
                req.session.email
            ];

            db.query(updateStudentTbl, studentTblValues, (err, studentTblRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (studentTblRes.affectedRows > 0) {
                    return res.json({ message: "Update success" });
                }
            })
        } else {
            return res.json({ message: "Error retrieving Student ID" });
        }
    })
})


//GENERATE RANDOM PASSWORD FOR TEMPORARY ACCOUNT
function generateRandomPassword(length = 8) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
}

// FETCH ACCOUNT REQUESTS
app.get('/getAccountReq', (req, res) => {
    const sql = `
        SELECT CONCAT(Firstname, ' ', Lastname) AS Name, ProgramID, CvSUStudentID as ID, Email, PhoneNo, StudentType AS AccountType FROM student WHERE RegStatus = 'Pending' AND StudentType NOT IN ('Regular', 'Irregular')
        UNION
        SELECT CONCAT(Firstname, ' ', Lastname) AS Name, ProgramID, EmployeeID as ID, Email, PhoneNo, EmpJobRole AS AccountType FROM employee WHERE RegStatus = 'Pending'
        UNION
        SELECT CONCAT(Firstname, ' ', Lastname) AS Name, ProgramID, SocietyOfficerID as ID, Email, PhoneNo, Position AS AccountType
        FROM societyofficer WHERE RegStatus = 'Pending'`;

    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            return res.json({ accReq: result });
        }
    });
});

//SEND ACCOUNT REJECTION
app.post('/sendEmailRejection', async (req, res) => {
    const { email, name, accountType } = req.body;

    if (!email || !name || !accountType) {        
        return res.status(400).json({ message: 'Email and name are required.' });
    }

    const emailBody = `
    Hello ${name},

    Unfortunately, account request for ${email} has been rejected. 

    Best regards,
    CvSU Enrollment Officer
  `;

    const mailOptions = {
        from: 'gerlyntan07@gmail.com',
        to: email,
        subject: 'Account Rejection Notification',
        text: emailBody,
    };


    try {
        console.log('Sending email to:', email);
        await transporter.sendMail(mailOptions);

        if (["Regular", "Irregular", "Freshman", "Transferee", "Shiftee"].includes(accountType)) {
            const updateQuery = `UPDATE student SET RegStatus = 'Rejected' WHERE Email = ?`;
            db.query(updateQuery, email, (err, result) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (result.affectedRows > 0) {
                    return res.json({ message: "Account request rejected" });
                }
            })
        } else if (["DCS Head", "School Head", "Adviser", "Enrollment Officer"].includes(accountType)) {
            const updateQuery = `UPDATE employee SET RegStatus = 'Rejected' WHERE Email = ?`;
            db.query(updateQuery, email, (err, result) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (result.affectedRows > 0) {
                    return res.json({ message: "Account request rejected" });
                }
            })
        } else if (["President",
            "Vice President",
            "Secretary",
            "Assistant Secretary",
            "Treasurer",
            "Assistant Treasurer",
            "Business Manager",
            "Auditor",
            "P.R.O.",
            "Assistant P.R.O.",
            "GAD Representative",
            "1st Year Senator",
            "2nd Year Senator",
            "3rd Year Senator",
            "4th Year Senator",
            "1st Year Chairperson",
            "2nd Year Chairperson",
            "3rd Year Chairperson",
            "4th Year Chairperson"].includes(accountType)) {
            const updateQuery = `UPDATE societyofficer SET RegStatus = 'Rejected' WHERE Email = ?`;
            db.query(updateQuery, email, (err, result) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (result.affectedRows > 0) {
                    return res.json({ message: "Account request rejected" });
                }
            })
        }

    } catch (error) {
        console.error('Error in /sendEmailRejection:', error);
        res.json({
            message: 'Internal server error. Please check your internet connection.',
            error: error.message,
        });
    }
});

//SEND ACCOUNT APPROVAL
app.post('/sendApprovalEmail', async (req, res) => {


    const { email, name, accountType } = req.body;

    if (!email || !name || !accountType) {
        return res.status(400).json({ message: 'Email and name are required.' });
    }

    const tempPassword = generateRandomPassword(8);

    const emailBody = `
    Hello ${name},

    Your account has been approved! 
    Please use the following temporary password to log in:

    Email: ${email}
    Temporary Password: ${tempPassword}

    After logging in, please change your password as soon as possible.

    Best regards,
    CvSU Enrollment Officer
  `;

    const mailOptions = {
        from: 'gerlyntan07@gmail.com',
        to: email,
        subject: 'Account Approval Notification',
        text: emailBody,
    };


    try {
        console.log('Sending email to:', email, "With account type of: ", accountType);
        await transporter.sendMail(mailOptions);

        //QUERY FOR CREATING THE ACCOUNT IN ACCOUNT TABLE
        const createAcc = `INSERT INTO account (Name, Email, Password, Role, Status)
                            VALUES (?,?,?,?,?)`;

        if (["Regular", "Irregular"].includes(accountType)) {
            const updateQuery = `UPDATE student SET StdStatus = 'Active', RegStatus = 'Accepted' WHERE Email = ?`;
            db.query(updateQuery, email, (err, result) => {
                if (err) {
                    return res.json({ message: "Error in server" + err });
                } else if (result.affectedRows > 0) {
                    const values = [
                        name,
                        email,
                        tempPassword,
                        "Student",
                        "Active"
                    ];
                    db.query(createAcc, values, (err, result) => {
                        if (err) {
                            return res.json({ message: "Error in server" + err });
                        } else if (result.affectedRows > 0) {
                            return res.json({ message: "Account saved" });
                        }
                    })
                }
            })
        } else if (accountType === "Freshman") {
            const updateQuery = `UPDATE student SET StdStatus = 'Active', RegStatus = 'Accepted' WHERE Email = ?`;

            db.query(updateQuery, email, (err, result) => {
                if (err) {
                    return res.json({ message: "Error in server" + err });
                } else if (result.affectedRows > 0) {
                    const values = [
                        name,
                        email,
                        tempPassword,
                        "Student",
                        "Active"
                    ];
                    db.query(createAcc, values, (err, result) => {
                        if (err) {
                            return res.json({ message: "Error in server" + err });
                        } else if (result.affectedRows > 0) {
                            const studentIDQuery = `SELECT StudentID, LastSchoolAttended FROM student WHERE Email = ?`;

                            db.query(studentIDQuery, email, (err, result) => {
                                if (err) {
                                    return res.json({ message: "Error in server" + err });
                                } else if (result.length > 0) {
                                    const studentID = result[0].StudentID;
                                    const shsSchool = result[0].LastSchoolAttended;
                                    const randomControlNums = Array.from({ length: 5 }, () => crypto.randomBytes(1)[0] % 10)
                                        .map(num => num.toString().padStart(1, '0'))
                                        .join('');

                                    const insertQuery = `INSERT INTO admissionform (StudentID, Branch, ExamControlNo, SHSchoolName, AdmissionStatus)
                                                        VALUES(?,?,?,?,?)`;
                                    const values = [
                                        studentID,
                                        "CvSU - Bacoor",
                                        randomControlNums,
                                        shsSchool,
                                        "Pending"
                                    ];

                                    db.query(insertQuery, values, (err, result) => {
                                        if (err) {
                                            return res.json({ message: "Error in server" + err });
                                        } else if (result.affectedRows > 0) {
                                            return res.json({ message: "Account saved" });
                                        }
                                    })
                                }
                            })

                        }
                    })
                }
            })
        } else if (accountType === "Transferee") {
            const updateQuery = `UPDATE student SET StdStatus = 'Active', RegStatus = 'Accepted' WHERE Email = ?`;
            db.query(updateQuery, email, (err, result) => {
                if (err) {
                    return res.json({ message: "Error in server" + err });
                } else if (result.affectedRows > 0) {
                    const values = [
                        name,
                        email,
                        tempPassword,
                        "Student",
                        "Active"
                    ];
                    db.query(createAcc, values, (err, result) => {
                        if (err) {
                            return res.json({ message: "Error in server" + err });
                        } else if (result.affectedRows > 0) {
                            const studentIDQuery = `SELECT StudentID, LastSchoolAttended FROM student WHERE Email = ?`;

                            db.query(studentIDQuery, email, (err, result) => {
                                if (err) {
                                    return res.json({ message: "Error in server" + err });
                                } else if (result.length > 0) {
                                    const studentID = result[0].StudentID;
                                    const lastSchool = result[0].LastSchoolAttended;
                                    const randomControlNums = Array.from({ length: 5 }, () => crypto.randomBytes(1)[0] % 10)
                                        .map(num => num.toString().padStart(1, '0'))
                                        .join('');

                                    const insertQuery = `INSERT INTO admissionform (StudentID, Branch, ExamControlNo, TransfereeCollegeSchoolName, AdmissionStatus)
                                                        VALUES(?,?,?,?,?)`;
                                    const values = [
                                        studentID,
                                        "CvSU - Bacoor",
                                        randomControlNums,
                                        lastSchool,
                                        "Pending"
                                    ];

                                    db.query(insertQuery, values, (err, result) => {
                                        if (err) {
                                            return res.json({ message: "Error in server" + err });
                                        } else if (result.affectedRows > 0) {
                                            return res.json({ message: "Account saved" });
                                        }
                                    })
                                }
                            })

                        }
                    })
                }
            })
        } else if (accountType === "Shiftee") {
            const updateQuery = `UPDATE student SET StdStatus = 'Active', RegStatus = 'Accepted' WHERE Email = ?`;
            db.query(updateQuery, email, (err, result) => {
                if (err) {
                    return res.json({ message: "Error in server" + err });
                } else if (result.affectedRows > 0) {
                    const values = [
                        name,
                        email,
                        tempPassword,
                        "Student",
                        "Active"
                    ];
                    db.query(createAcc, values, (err, result) => {
                        if (err) {
                            return res.json({ message: "Error in server" + err });
                        } else if (result.affectedRows > 0) {
                            const studentIDQuery = `SELECT CvSUStudentID FROM student WHERE Email = ?`;
                            db.query(studentIDQuery, email, (err, result) => {
                                if (err) {
                                    return res.json({ message: "Error in server" + err });
                                } else if (result.length > 0) {
                                    const studentID = result[0].CvSUStudentID;

                                    const insertQuery = `INSERT INTO shiftingform (StudentID, SchoolName, ShiftingStatus)
                                                        VALUES(?,?,?)`;

                                    const values = [
                                        studentID,
                                        "CvSU - Bacoor",
                                        "Pending"
                                    ];

                                    db.query(insertQuery, values, (err, result) => {
                                        if (err) {
                                            return res.json({ message: "Error in server" + err });
                                        } else if (result.affectedRows > 0) {
                                            return res.json({ message: "Account saved" });
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        } else if (["DCS Head", "School Head", "Adviser", "Enrollment Officer"].includes(accountType)) {
            const updateQuery = `UPDATE employee SET RegStatus = 'Accepted' WHERE Email = ?`;
            db.query(updateQuery, email, (err, result) => {
                if (err) {
                    return res.json({ message: "Error in server" + err });
                } else if (result.affectedRows > 0) {
                    const values = [
                        name,
                        email,
                        tempPassword,
                        accountType,
                        "Active"
                    ];

                    db.query(createAcc, values, (err, result) => {
                        if (err) {
                            return res.json({ message: "Error in server" + err });
                        } else if (result.affectedRows > 0) {
                            return res.json({ message: "Account Saved" });
                        }
                    })
                }
            })
        } else if (["President",
            "Vice President",
            "Secretary",
            "Assistant Secretary",
            "Treasurer",
            "Assistant Treasurer",
            "Business Manager",
            "Auditor",
            "P.R.O.",
            "Assistant P.R.O.",
            "GAD Representative",
            "1st Year Senator",
            "2nd Year Senator",
            "3rd Year Senator",
            "4th Year Senator",
            "1st Year Chairperson",
            "2nd Year Chairperson",
            "3rd Year Chairperson",
            "4th Year Chairperson"].includes(accountType)) {
            const updateQuery = `UPDATE societyofficer SET RegStatus = 'Accepted' WHERE Email = ?`;
            db.query(updateQuery, email, (err, result) => {
                if (err) {
                    return res.json({ message: "Error in server" + err });
                } else if (result.affectedRows > 0) {
                    const values = [
                        name,
                        email,
                        tempPassword,
                        "Society Officer",
                        "Active"
                    ];

                    db.query(createAcc, values, (err, result) => {
                        if (err) {
                            return res.json({ message: "Error in server" + err });
                        } else if (result.affectedRows > 0) {
                            return res.json({ message: "Account Saved" });
                        }
                    })
                }
            })
        }

    } catch (error) {
        console.error('Error in /sendApprovalEmail:', error);
        res.json({
            message: 'Internal server error. Please check your internet connection.',
            error: error.message,
        });
    }
});


//FETCH TOTAL NUMBER OF PENDING ACCOUNT REQUESTS
app.get('/pendingAccounts', (req, res) => {
    const studentQuery = `SELECT COUNT(*) AS studentCount from student WHERE RegStatus = 'Pending'`;
    const socOfficerQuery = `SELECT COUNT(*) AS socOfficerCount from societyofficer WHERE RegStatus = 'Pending'`;
    const employeeQuery = `SELECT COUNT(*) AS employeeCount from employee WHERE RegStatus = 'Pending'`;

    db.query(studentQuery, (err, studentResult) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            db.query(socOfficerQuery, (err, socOfficerResult) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else {
                    db.query(employeeQuery, (err, employeeResult) => {
                        if (err) {
                            return res.json({ message: "Error in server: " + err });
                        } else {
                            return res.json({
                                studentCount: studentResult[0].studentCount,
                                socOfficerCount: socOfficerResult[0].socOfficerCount,
                                employeeCount: employeeResult[0].employeeCount
                            })
                        }
                    })
                }
            })
        }
    })
})

app.get('/programs', (req, res) => {
    //GET PROGRAMS (IT & CS)
    const sql = `SELECT * FROM program`;
    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ message: 'Error' + err })
        } else {
            const programs = result.map(row => ({
                programID: row.ProgramID,
                programName: row.ProgramName,
            }));

            return res.json(programs);

        }
    })
})

//COUNT NUMBER OF REGULAR STUDENTS IN CS FOR ADMIN DASHBOARD
app.get('/getCS', (req, res) => {
    const sql = `SELECT COUNT(*) AS CScount from student WHERE (StudentType = 'Regular' OR StudentType = 'Irregular') AND RegStatus = 'Accepted' AND ProgramID = 1`;
    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            return res.json({ CScount: result[0].CScount });
        }
    })
});

//COUNT NUMBER OF REGULAR STUDENTS IN IT FOR ADMIN DASHBOARD
app.get('/getIT', (req, res) => {
    const sql = `SELECT COUNT(*) AS ITcount from student WHERE (StudentType = 'Regular' OR StudentType = 'Irregular') AND RegStatus = 'Accepted' AND ProgramID = 2`;
    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            return res.json({ ITcount: result[0].ITcount });
        }
    })
});


//SIGN UP FOR REG/IRREG, SOC OFFICER, AND EMPLOYEE
app.post('/CreateAcc', (req, res) => {
    //AVOID EMAIL DUPLICATION IN ACCOUNT TABLE
    const emailQuery = `SELECT * FROM account WHERE Email = ?`;

    db.query(emailQuery, req.body.email, (err, result) => {
        if (err) return res.json({ message: "Error in server: " + err });

        if (result.length >= 1) {
            return res.json({ message: "Email exists" });
        } else {
            //STORE DIFFERENT DATA ON DIFFERENT COLUMNS DEPENDING ON APPLICANT TYPE
            const applicantType = req.body.applicantCategory;

            if (applicantType === "Regular/Irregular") {
                //CHECK IF STUDENT EXISTS IN THE REGISTRAR'S DATABASE
                const checkStudent = `SELECT * FROM student WHERE ProgramID = ? AND CvSUStudentID = ? AND Email = ? AND StudentType = ?`;

                const studentValues = [
                    req.body.program,
                    req.body.studentID,
                    req.body.email,
                    req.body.regIrreg
                ];

                db.query(checkStudent, studentValues, (err, oldStudentResult) => {

                    if (err) {
                        return res.json({ message: "Error: " + err });
                    } else if (oldStudentResult.length === 0) {
                        return res.json({ message: "No matching record found. Please verify your inputs and try again." });
                    } else if (oldStudentResult.length > 0) {
                        const student = oldStudentResult[0];

                        const inputProgramID = Number(req.body.program);
                        const inputStudentID = Number(req.body.studentID);

                        const trimmedEmail = student.Email.trim().toLowerCase();
                        const trimmedStudentType = student.StudentType.trim().toLowerCase();
                        const inputEmail = req.body.email.trim().toLowerCase();
                        const inputRegIrreg = req.body.regIrreg.trim().toLowerCase();


                        if (student.RegStatus === "Accepted") {
                            return res.json({ message: "You already have an active account in our record." });
                        } else if (student.RegStatus === "Pending") {
                            if (req.body.email !== student.Email) {
                                return res.json({ message: "Please use your CvSU Email" });

                                //AUTOMATE SIGN UP IF STUDENT EXISTS IN THE REGISTRAR'S DATABASE
                            } else if (inputProgramID === student.ProgramID &&
                                inputStudentID === student.CvSUStudentID &&
                                inputEmail === trimmedEmail &&
                                inputRegIrreg === trimmedStudentType) {

                                const tempPassword = generateRandomPassword(8);

                                const nameConcat = student.Firstname + " " + student.Lastname;
                                const emailBody = `
                                Hello ${nameConcat},
                                
                                Your account has been approved! Please use the following temporary password to log in:
    
                                Email: ${req.body.email}
                                Temporary Password: ${tempPassword}
    
                                After logging in, please change your password as soon as possible.
                                
                                Best regards,
                                CvSU Enrollment Officer
                                `;

                                const mailOptions = {
                                    from: 'gerlyntan07@gmail.com',
                                    to: req.body.email,
                                    subject: 'Account Approval Notification',
                                    text: emailBody,
                                };

                                transporter.sendMail(mailOptions, (emailErr) => {
                                    if (emailErr) {
                                        console.error('Error sending email:', emailErr);
                                        return res.json({ message: 'Error sending email' });
                                    }


                                    const updateStudent = `UPDATE student SET PhoneNo = ?, RegStatus = 'Accepted' WHERE Email = ?`;
                                    const createOldStudentAcc = `INSERT INTO account (Name, Email, Password, Role) 
                                                                VALUES(?,?,?,?)`;

                                    db.query(updateStudent, [req.body.contactnum, req.body.email], (err, updateOldStudent) => {
                                        if (err) {
                                            return res.json({ message: "Error in server: " + err });
                                        } else if (updateOldStudent.affectedRows > 0) {

                                            const insertValues = [
                                                nameConcat,
                                                req.body.email,
                                                tempPassword,
                                                "Student"
                                            ];

                                            db.query(createOldStudentAcc, insertValues, (err, insertResult) => {
                                                if (err) {
                                                    return res.json({ message: "Error in server: " + err });
                                                } else if (insertResult.affectedRows > 0) {
                                                    return res.json({ message: "Sign up successful. Wait for your temporary account to be sent through your email." });
                                                }
                                            })
                                        }
                                    })
                                });
                            } else {                                
                                return res.json({ message: "Error: " + err });
                            }
                        }
                    }
                })

            } else if (applicantType === "Society Officer") {
                //AVOID EMAIL DUPLICATION IN SOCIETYOFFICER TABLE
                const socOfficerEmailQuery = `SELECT * FROM societyofficer WHERE Email = ?`;
                db.query(socOfficerEmailQuery, req.body.email, (err, result) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    } else if (result.length >= 1) {
                        return res.json({ message: "Email exists" });
                    } else {
                        const socOfficerQuery = `INSERT INTO societyofficer (Firstname, Middlename, Lastname, Email, PhoneNo, ProgramID, Position)
                                                VALUES(?, ?, ?, ?, ?, ?, ?)`;
                        const socOfficerValues = [
                            req.body.firstname,
                            req.body.middlename,
                            req.body.lastname,
                            req.body.email,
                            req.body.contactnum,
                            req.body.program,
                            req.body.position
                        ]

                        db.query(socOfficerQuery, socOfficerValues, (err, result) => {
                            if (err) {
                                return res.json({ message: "Error in server: " + err });
                            } else if (result.affectedRows > 0) {
                                return res.json({ message: "Sign up successful. Wait for your temporary account to be sent through your email." });
                            } else {
                                return res.json({ message: "Sign up failed. No rows affected" });
                            }
                        })
                    }
                })
            } else if (applicantType === "Employee") {
                //AVOID ID DUPLICATION IN EMPLOYEE TABLE
                const employeeIDQuery = `SELECT * FROM employee WHERE EmployeeID = ?`;
                db.query(employeeIDQuery, req.body.employeeID, (err, result) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    } else if (result.length >= 1) {
                        return res.json({ message: "Employee ID exists" });
                    } else {
                        //AVOID EMAIL DUPLICATION IN EMPLOYEE TABLE
                        const employeeEmailQuery = `SELECT * FROM employee WHERE Email = ?`;
                        db.query(employeeEmailQuery, req.body.email, (err, result) => {
                            if (err) {
                                return res.json({ message: "Error in server: " + err });
                            } else if (result.length >= 1) {
                                return res.json({ message: "Email exists" });
                            } else {
                                //NO PROGRAM ID STORED FOR ADVISER, ENROLLMENT OFFICER AND SCHOOL HEAD
                                if (req.body.position === "Adviser" || req.body.position === "Enrollment Officer" || req.body.position === "School Head") {
                                    const employeeQuery = `INSERT INTO employee (Firstname, Middlename, Lastname, EmployeeID, Email, PhoneNo, EmpJobRole)
                                                        VALUES(?, ?, ?, ?, ?, ?, ?)`;
                                    const employeeValues = [
                                        req.body.firstname,
                                        req.body.middlename,
                                        req.body.lastname,
                                        req.body.employeeID,
                                        req.body.email,
                                        req.body.contactnum,
                                        req.body.position
                                    ]

                                    db.query(employeeQuery, employeeValues, (err, result) => {
                                        if (err) {
                                            return res.json({ message: "Error in server: " + err });
                                        } else if (result.affectedRows > 0) {
                                            return res.json({ message: "Sign up successful. Wait for your temporary account to be sent through your email." });
                                        } else {
                                            return res.json({ message: "Sign up failed. No rows affected" });
                                        }
                                    })

                                    //WITH PROGRAM ID STORED FOR ADVISER AND DCS HEAD
                                } else if (req.body.position === "DCS Head") {
                                    const employeeQuery = `INSERT INTO employee (Firstname, Middlename, Lastname, EmployeeID, Email, PhoneNo, EmpJobRole, ProgramID)
                                                        VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
                                    const employeeValues = [
                                        req.body.firstname,
                                        req.body.middlename,
                                        req.body.lastname,
                                        req.body.employeeID,
                                        req.body.email,
                                        req.body.contactnum,
                                        req.body.position,
                                        req.body.program
                                    ]

                                    db.query(employeeQuery, employeeValues, (err, result) => {
                                        if (err) {
                                            return res.json({ message: "Error in server: " + err });
                                        } else if (result.affectedRows > 0) {
                                            return res.json({ message: "Sign up successful. Wait for your temporary account to be sent through your email." });
                                        } else {
                                            return res.json({ message: "Sign up failed. No rows affected" });
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }
        }
    })
})

//SIGN UP FOR FRESHMEN, TRANSFERES, AND SHIFTEES
app.post('/SignUp', (req, res) => {
    //CHECK IF EMAIL EXISTS TO AVOID ENTRY DUPLICATION
    const emailQuery = `SELECT * FROM student WHERE Email = ?`;

    db.query(emailQuery, req.body.email, (err, result) => {
        if (err) return res.json("Error in server: " + err);

        if (result.length >= 1) {
            return res.json({ message: "Email exists" });
        } else {
            const applicantType = req.body.applicantCategory;
            //STORE DIFFERENT DATA ON DIFFERENT COLUMNS DEPENDING ON STUDENT TYPE
            if (applicantType === "Freshman" || applicantType === "Transferee") {
                const query1 = `INSERT INTO student (StudentType, Firstname, Middlename, Lastname, LastSchoolAttended, Email, PhoneNo, ProgramID)
                                VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
                const values1 = [
                    applicantType,
                    req.body.firstname,
                    req.body.middlename,
                    req.body.lastname,
                    req.body.lastschoolattended,
                    req.body.email,
                    req.body.contactnum,
                    req.body.preferredProgram
                ]

                db.query(query1, values1, (err, result) => {
                    if (err) {
                        return res.json({ message: "Error in server" + err })
                    } else if (result.affectedRows > 0) {
                        return res.json({ message: "Sign up successful. Wait for your temporary account to be sent through your email." });
                    } else {
                        return res.json({ message: "Sign up failed. No rows affected" });
                    }
                })
            } else if (applicantType === "Shiftee") {
                //CHECK IF CvSU STUDENT ID EXISTS TO AVOID ENTRY DUPLICATION
                const studentIDQuery = `SELECT * FROM student WHERE CvSUStudentID = ?`;

                db.query(studentIDQuery, req.body.studentID, (err, result) => {
                    if (err) return res.json({ message: "Error in server" + err });

                    if (result.length >= 1) {
                        return res.json({ message: "Student ID exists" })
                    } else {
                        const query2 = `INSERT INTO student (StudentType, Firstname, Middlename, Lastname, CvSUStudentID, PrevProgram, Year, Email, PhoneNo, ProgramID)
                                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                        const values2 = [
                            applicantType,
                            req.body.firstname,
                            req.body.middlename,
                            req.body.lastname,
                            req.body.studentID,
                            req.body.prevProgram,
                            req.body.year,
                            req.body.email,
                            req.body.contactnum,
                            req.body.preferredProgram
                        ]

                        db.query(query2, values2, (err, result) => {
                            if (err) {
                                return res.json({ message: "Error in server" + err });
                            } else if (result.affectedRows > 0) {
                                return res.json({ message: "Sign up successful. Wait for your temporary account to be sent through your email." });
                            } else {
                                return res.json({ message: "Sign up failed. No rows affected" });
                            }
                        })
                    }
                })
            }
        }
    })
})


let verificationPins = {};
//SEND VERIFICATION CODE
app.post('/sendPin', (req, res) => {
    const email = req.body.email;

    const emailQuery = `SELECT * FROM account WHERE Email = ?`;
    db.query(emailQuery, [email], (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " } + err);
        } else if (result.length === 0) {
            return res.json({ message: "Email doesn't exist" });
        } else if (result.length > 0) {
            const randomPin = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
            verificationPins[email] = randomPin;

            const emailBody = `
            We received a request to reset the password for your account.

            CODE: ${randomPin}

            If you didn't make the request, ignore this email. Otherwise, you can reset your password.`;

            const mailOptions = {
                from: 'gerlyntan07@gmail.com',
                to: email,
                subject: 'Password Reset Verification Code',
                text: emailBody,
            };

            try {
                transporter.sendMail(mailOptions);
                return res.json({ message: "Verification code sent" });
            } catch (emailError) {
                return res.json({ message: "Error sending email", error: emailError.message });
            }
        }
    })
})

app.post('/verifyPin', (req, res) => {
    const email = req.body.email;
    const pin = req.body.pin;

    if (verificationPins[email] && verificationPins[email] === pin) {
        delete verificationPins[email];
        return res.json({ message: "Verified" });
    } else {
        return res.json({ message: "Incorrect or expired PIN" });
    }
})


app.post('/resetPass', (req, res) => {
    const { email, newPassword } = req.body;

    const updateQuery = `UPDATE account SET Password = ? WHERE Email = ?`;
    db.query(updateQuery, [newPassword, email], (err, result) => {
        if (err) {
            return res.json({ message: "Error updating password: " + err });
        } else if (result.affectedRows > 0) {
            return res.json({ message: "Password updated successfully" });
        }
    })
})

//CHANGE PFP
app.post('/changePFP', upload.single("uploadPFP"), (req, res) => {
    const getAcc = `SELECT * FROM account WHERE Email = ?`;
    db.query(getAcc, req.session.email, (err, accResult) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (accResult.length > 0) {
            // File path for the uploaded PFP
            const pfpPath = req.file ? req.file.path : req.body.pfpURL;

            const updatePFP = `UPDATE account SET ProfilePicture = ? WHERE Email = ?`;
            const values = [
                pfpPath,
                req.session.email
            ]
            db.query(updatePFP, values, (err, pfpResult) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (pfpResult.affectedRows > 0) {
                    return res.json({
                        message: "Successfully changed Profile Picture",
                        pfpURL: pfpPath
                    })
                }
            })
        }
    })
})

//GET PFP
app.get('/getPFP', (req, res) => {
    const getPFPQuery = `SELECT * FROM account WHERE Email = ?`;
    db.query(getPFPQuery, req.session.email, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (result.length > 0) {
            return res.json({
                uploadPFP: result[0].ProfilePicture,
                pfpURL: result[0].ProfilePicture
            });
        }
    })
})

//GET ACCOUNT INFO
app.get('/getAccInfo', (req, res) => {
    if (["Regular", "Irregular", "Transferee", "Shiftee", "Freshman"].includes(req.session.role)) {
        const getStudent = `SELECT * FROM student WHERE Email = ?`;
        db.query(getStudent, req.session.email, (err, studentRes) => {
            if (err) {
                return res.json({ message: "Error in server: " + err });
            } else if (studentRes.length > 0) {
                const stdInfo = studentRes[0];

                return res.json({
                    message: "Fetch successful",
                    firstName: stdInfo.Firstname,
                    middleName: stdInfo.Middlename,
                    lastName: stdInfo.Lastname,
                    email: req.session.email,
                    gender: stdInfo.Gender,
                    age: stdInfo.Age,
                    phoneNo: stdInfo.PhoneNo,
                    address: stdInfo.Address,
                    dob: stdInfo.DOB
                })
            } else {
                return res.json({ message: "Error fetching account information: " });
            }
        })
    } else if (["Adviser", "DCS Head", "School Head", "Enrollment Officer"].includes(req.session.role)) {
        const getEmployee = `SELECT * FROM employee WHERE Email = ?`;
        db.query(getEmployee, req.session.email, (err, empResult) => {
            if (err) {
                return res.json({ message: "Error in server: " + err });
            } else if (empResult.length > 0) {
                const empInfo = empResult[0];

                return res.json({
                    message: "Fetch successful",
                    firstName: empInfo.Firstname,
                    middleName: empInfo.Middlename,
                    lastName: empInfo.Lastname,
                    email: req.session.email,
                    gender: empInfo.Gender,
                    phoneNo: empInfo.PhoneNo,
                    address: empInfo.Address,
                    dob: empInfo.DOB,
                    position: empInfo.EmpJobRole
                })
            }
        })
    } else if (req.session.role === "Society Officer") {
        const getSoc = `SELECT * FROM societyofficer WHERE Email = ?`;
        db.query(getSoc, req.session.email, (err, socResult) => {
            if (err) {
                return res.json({ message: "Error in server: " + err });
            } else if (socResult.length > 0) {
                const socInfo = socResult[0];

                return res.json({
                    message: "Fetch successful",
                    firstName: socInfo.Firstname,
                    middleName: socInfo.Middlename,
                    lastName: socInfo.Lastname,
                    email: req.session.email,
                    gender: socInfo.Gender,
                    phoneNo: socInfo.PhoneNo,
                    address: socInfo.Address,
                    dob: socInfo.DOB,
                    position: socInfo.Position
                })
            }
        })
    }
})

//SAVE ACCOUNT INFO CHANGES
app.post('/saveAccInfo', (req, res) => {

    if (["Regular", "Irregular", "Transferee", "Shiftee", "Freshman"].includes(req.session.role)) {
        const values = [
            req.body.firstName,
            req.body.middleName,
            req.body.lastName,
            req.body.gender === "Female" ? "F" : "M",
            req.body.age,
            req.body.phoneNo,
            req.body.address,
            req.body.dob,
            req.session.email
        ];

        const updateStudent = `UPDATE student
        SET Firstname = ?,
            Middlename = ?,
            Lastname = ?,
            Gender = ?,
            Age = ?,
            PhoneNo = ?,
            Address = ?,
            DOB = ?
        WHERE Email = ?`;

        db.query(updateStudent, values, (err, studentRes) => {
            if (err) {
                return res.json({ message: "Error in server: " + err });
            } else if (studentRes.affectedRows > 0) {

                const updateAccName = `UPDATE account SET Name = ? WHERE Email = ?`;
                const nameConcat = req.body.firstName + " " + req.body.lastName;
                db.query(updateAccName, [nameConcat, req.session.email], (err, accNameUpdateRes) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    } else if (accNameUpdateRes.affectedRows > 0) {
                        return res.json({ message: "Account updated successfully" });
                    }
                })
            } else {
                return res.json({ message: "Unable to update account" });
            }
        });
    } else if (["Adviser", "DCS Head", "School Head", "Enrollment Officer"].includes(req.session.role)) {
        const values1 = [
            req.body.firstName,
            req.body.middleName,
            req.body.lastName,
            req.body.gender === "Female" ? "F" : "M",
            req.body.phoneNo,
            req.body.address,
            req.body.dob,
            req.session.email
        ];

        const updateEmp = `UPDATE employee
        SET Firstname = ?,
            Middlename = ?,
            Lastname = ?,
            Gender = ?,
            PhoneNo = ?,
            Address = ?,
            DOB = ?
        WHERE Email = ?`;

        db.query(updateEmp, values1, (err, empRes) => {
            if (err) {
                return res.json({ message: "Error in server: " + err });
            } else if (empRes.affectedRows > 0) {
                const updateAccName = `UPDATE account SET Name = ? WHERE Email = ?`;
                const nameConcat = req.body.firstName + " " + req.body.lastName;
                db.query(updateAccName, [nameConcat, req.session.email], (err, accNameUpdateRes) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    } else if (accNameUpdateRes.affectedRows > 0) {
                        return res.json({ message: "Account updated successfully" });
                    }
                })
            } else {
                return res.json({ message: "Unable to update account" });
            }
        });
    } else if (req.session.role === "Society Officer") {
        const values2 = [
            req.body.firstName,
            req.body.middleName,
            req.body.lastName,
            req.body.gender === "Female" ? "F" : "M",
            req.body.phoneNo,
            req.body.address,
            req.body.dob,
            req.session.email
        ];

        const updateSoc = `UPDATE societyofficer
        SET Firstname = ?,
            Middlename = ?,
            Lastname = ?,
            Gender = ?,
            PhoneNo = ?,
            Address = ?,
            DOB = ?
        WHERE Email = ?`;

        db.query(updateSoc, values2, (err, empRes) => {
            if (err) {
                return res.json({ message: "Error in server: " + err });
            } else if (empRes.affectedRows > 0) {
                const updateAccName = `UPDATE account SET Name = ? WHERE Email = ?`;
                const nameConcat = req.body.firstName + " " + req.body.lastName;
                db.query(updateAccName, [nameConcat, req.session.email], (err, accNameUpdateRes) => {
                    if (err) {
                        return res.json({ message: "Error in server: " + err });
                    } else if (accNameUpdateRes.affectedRows > 0) {
                        return res.json({ message: "Account updated successfully" });
                    }
                })
            } else {
                return res.json({ message: "Unable to update account" });
            }
        });
    }
})

//ACCOUNT SETTINGS MATCH CURRENT PASS
app.post('/matchPass', (req, res) => {

    const sql = `SELECT * FROM account WHERE Email = ? AND Password = ?`;

    db.query(sql, [req.session.email, req.body.currentPassword], (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (result.length > 0) {
            return res.json({ message: "Account found", accountData: result[0] });
        } else if (result.length === 0) {
            return res.json({ message: "Incorrect password" });
        } else {
            return res.json({ message: "Account not found" });
        }
    })
})

//CHANGE PASS (ACCOUNT SETTINGS)
app.post('/changePass', (req, res) => {
    const values = [
        req.body.confirmPassword,
        req.session.email
    ];

    const changePassQuery = `UPDATE account SET Password = ? WHERE Email = ?`;
    db.query(changePassQuery, values, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (result.affectedRows === 1) {
            return res.json({ message: "Password changed successfully" });
        } else {
            return res.json({ message: "Error changing password" });
        }
    })
})

//LOGOUT
app.post("/logoutFunction", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.json({ valid: false, message: "Logout failed." });
            }
            res.clearCookie("connect.sid"); // Session cookie
            res.clearCookie("rememberMe"); // Clear Remember Me cookie
            return res.json({ valid: false, message: "Logout successful." });
        });
    } else {
        return res.json({ valid: false, message: "No active session." });
    }
});

//LOGIN
app.get('/', (req, res) => {
    if (req.session && req.session.accountID) {
        const getName = `SELECT * FROM account WHERE Email = ?`;
        db.query(getName, req.session.email, (err, result) => {
            if (err) {
                return res.json({ valid: false });
            } else if (result.length > 0) {
                return res.json({
                    valid: true,
                    accountID: req.session.accountID,
                    role: req.session.role,
                    name: result[0].Name,
                    email: req.session.email
                })
            }
        })
    } else if (req.cookies.rememberMe) {
        const rememberedData = JSON.parse(req.cookies.rememberMe);

        // Validate and auto-login the user based on cookie data
        const validateQuery = `SELECT * FROM account WHERE AccountID = ? AND Email = ?`;
        db.query(validateQuery, [rememberedData.accountID, rememberedData.email], (err, result) => {
            if (err || result.length === 0) {
                return res.json({ valid: false });
            }

            const user = result[0];
            req.session.accountID = rememberedData.accountID;
            req.session.role = rememberedData.role;
            req.session.email = rememberedData.email;

            return res.json({
                valid: true,
                accountID: req.session.accountID,
                role: req.session.role,
                email: req.session.email
            });
        });
    } else {
        return res.json({ valid: false })
    }
})

app.post('/LoginPage', (req, res) => {
    const sql = `SELECT * FROM account WHERE Email = ? AND Password = ?`;
    const { email, password, rememberMe } = req.body;

    db.query(sql, [email, password], (err, result) => {
        if (err) return res.json({ message: "Error in server" + err });

        const user = result[0];
        if (result.length > 0) {
            if (user.Status === "Terminated") {
                return res.json({ message: "Account is no longer active. Fill out contact form to ask for reactivation", isLoggedIn: false });
            } else if (user.Status === "Active") {
                if (user.Role === "Student") {

                    const studentTypeQuery = `SELECT StudentType from student WHERE Email = ?`;
                    db.query(studentTypeQuery, email, (err, studentResult) => {
                        if (err) {
                            return res.json({ message: "Error in server: " + err });
                        } else if (studentResult.length > 0) {
                            const studentType = studentResult[0].StudentType;

                            req.session.accountID = user.AccountID;
                            req.session.role = studentType;
                            req.session.email = user.Email;
                            req.session.studentID = user.StudentID;

                            if (rememberMe) {
                                // Set a cookie to remember the email
                                res.cookie('rememberedEmail', email, {
                                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                                    httpOnly: false, // Allows client-side access for pre-filling
                                    secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
                                });
                            } else {
                                // Clear the email cookie if Remember Me is unchecked
                                res.clearCookie('rememberedEmail');
                            }

                            return res.json({
                                message: 'Login successful',
                                role: studentType,
                                email: req.session.email,
                                accountID: req.session.accountID,
                                status: user.Status,
                                isLoggedIn: true,
                                studentID: req.session.studentID,
                            });
                        }
                    })
                } else {
                    req.session.accountID = user.AccountID;
                    req.session.role = user.Role;
                    req.session.email = user.Email;

                    if (rememberMe) {
                        // Set a cookie to remember the email
                        res.cookie('rememberedEmail', email, {
                            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                            httpOnly: false, // Allows client-side access for pre-filling
                            secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
                        });
                    } else {
                        // Clear the email cookie if Remember Me is unchecked
                        res.clearCookie('rememberedEmail');
                    }

                    return res.json({
                        message: 'Login successful',
                        role: req.session.role,
                        email: req.session.email,
                        accountID: req.session.accountID,
                        status: user.Status,
                        isLoggedIn: true
                    });
                }

            }

        } else {
            return res.json({ message: "Invalid credentials", isLoggedIn: false })
        }
    });
});

app.listen(8080, () => {
    console.log('Server is running');
})