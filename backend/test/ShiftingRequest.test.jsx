const request = require("supertest");
const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

jest.mock("mysql", () => ({
  createConnection: jest.fn().mockReturnValue({
    query: jest.fn(),
  }),
}));

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn(),
  }),
}));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(bodyParser.json());

const db = mysql.createConnection();

app.get("/shiftingRequests", (req, res) => {
  const programID = req.query.programID;
  db.query(
    "SELECT * FROM shiftingform WHERE ProgramID = ?",
    [programID],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Error fetching records" });
      if (result.length === 0) {
        return res.status(200).json({ message: "No records found" });
      }
      return res
        .status(200)
        .json({ message: "Fetched records successfully", records: result });
    }
  );
});

app.post("/approveShiftingReq", (req, res) => {
  const { email, name, studentID, submissionDate } = req.body;
  db.query(
    "UPDATE shiftingform SET status = 'approved' WHERE CvSUStudentID = ?",
    [studentID],
    (err, result) => {
      if (err || result.affectedRows === 0) {
        return res
          .status(200)
          .json({ message: "Failed to approve shifting request" });
      }
      const transporter = nodemailer.createTransport();
      transporter.sendMail({
        to: email,
        subject: "Shifting Request Approved",
        text: "Your request has been approved",
      });
      return res
        .status(200)
        .json({ message: "Shifting Request approval sent" });
    }
  );
});

app.post("/rejectShiftingReq", (req, res) => {
  const { email, name, studentID, rejectionReason } = req.body;
  db.query(
    "UPDATE shiftingform SET status = 'rejected', rejectionReason = ? WHERE CvSUStudentID = ?",
    [rejectionReason, studentID],
    (err, result) => {
      if (err || result.affectedRows === 0) {
        return res
          .status(200)
          .json({ message: "Failed to reject shifting request" });
      }
      const transporter = nodemailer.createTransport();
      transporter.sendMail({
        to: email,
        subject: "Shifting Request Rejected",
        text: rejectionReason,
      });
      return res
        .status(200)
        .json({ message: "Shifting Request rejection sent" });
    }
  );
});

describe("Unit Testing for Shifting Request Function", () => {
  describe("For /shiftingRequests", () => {
    it("Should return shifting requests", async () => {
      const mockAdminRes = [{ ProgramID: 1 }];
      const mockResults = [
        {
          CvSUStudentID: "123",
          ProgramID: 1,
          Email: "nini@bp.com",
          Firstname: "Jennie",
          Middlename: "Rubyjane",
          Lastname: "Kim",
          PrevProgram: "Bachelor of Science in Psychology",
          PrevProgramAdviser: "Ms. Kim Jisoo",
          AcadYear: "2024-2025",
          Reasons: "Trip lang",
          Date: "2025-07-01",
        },
      ];

      db.query.mockImplementationOnce((query, params, callback) => {
        if (query.includes("employee")) {
          callback(null, mockAdminRes);
        } else if (query.includes("shiftingform")) {
          callback(null, mockResults);
        }
      });

      const res = await request(app)
        .get("/shiftingRequests")
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Fetched records successfully");
      expect(res.body.records).toEqual(mockResults);
    });

    it("Should return no records found if no shifting requests are found", async () => {
      const mockAdminRes = [{ ProgramID: 1 }];
      db.query.mockImplementationOnce((query, params, callback) => {
        if (query.includes("employee")) {
          callback(null, mockAdminRes);
        } else if (query.includes("shiftingform")) {
          callback(null, []);
        }
      });

      const res = await request(app)
        .get("/shiftingRequests")
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("No records found");
    });
  });

  describe("For /approveShiftingReq", () => {
    it("Should approve a shifting request and send an email", async () => {
      const mockAdminRes = [
        { EmployeeID: 1, Firstname: "Enrollment", Lastname: "Officer" },
      ];
      const mockShiftingFormRes = [
        {
          CvSUStudentID: "123",
          Email: "nini@bp.com",
          Name: "Jennie Kim",
        },
      ];
      const mockEmailResponse = { response: "Message sent" };

      db.query.mockImplementationOnce((query, params, callback) => {
        if (query.includes("employee")) {
          callback(null, mockAdminRes);
        } else if (query.includes("shiftingform")) {
          callback(null, mockShiftingFormRes);
        } else if (query.includes("UPDATE shiftingform")) {
          callback(null, { affectedRows: 1 });
        }
      });

      const res = await request(app)
        .post("/approveShiftingReq")
        .send({
          email: "nini@bp.com",
          name: "Jennie Kim",
          studentID: "123",
          submissionDate: "2025-07-01",
        })
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Shifting Request approval sent");
    });

    it("Should fail to approve if update fails", async () => {
      const mockAdminRes = [
        { EmployeeID: 1, Firstname: "Enrollment", Lastname: "Officer" },
      ];
      db.query.mockImplementationOnce((query, params, callback) => {
        if (query.includes("employee")) {
          callback(null, mockAdminRes);
        } else if (query.includes("UPDATE shiftingform")) {
          callback(null, { affectedRows: 0 });
        }
      });

      const res = await request(app)
        .post("/approveShiftingReq")
        .send({
          email: "nini@bp.com",
          name: "Jennie Kim",
          studentID: "123",
          submissionDate: "2025-07-01",
        })
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Failed to approve shifting request");
    });
  });

  describe("For /rejectShiftingReq", () => {
    it("Should reject a shifting request and send an email", async () => {
      const mockAdminRes = [
        { EmployeeID: 1, Firstname: "Enrollment", Lastname: "Officer" },
      ];
      const mockShiftingFormRes = [
        {
          CvSUStudentID: "123",
          Email: "nini@bp.com",
          Name: "Jennie Kim",
        },
      ];

      db.query.mockImplementationOnce((query, params, callback) => {
        if (query.includes("employee")) {
          callback(null, mockAdminRes);
        } else if (query.includes("shiftingform")) {
          callback(null, mockShiftingFormRes);
        } else if (query.includes("UPDATE shiftingform")) {
          callback(null, { affectedRows: 1 });
        }
      });

      const res = await request(app)
        .post("/rejectShiftingReq")
        .send({
          email: "nini@bp.com",
          name: "Jennie Kim",
          studentID: "123",
          rejectionReason: "Not eligible",
        })
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Shifting Request rejection sent");
    });

    it("Should fail to reject if update fails", async () => {
      const mockAdminRes = [
        { EmployeeID: 1, Firstname: "Enrollment", Lastname: "Officer" },
      ];
      db.query.mockImplementationOnce((query, params, callback) => {
        if (query.includes("employee")) {
          callback(null, mockAdminRes);
        } else if (query.includes("UPDATE shiftingform")) {
          callback(null, { affectedRows: 0 });
        }
      });

      const res = await request(app)
        .post("/rejectShiftingReq")
        .send({
          email: "nini@bp.com",
          name: "Jennie Kim",
          studentID: "123",
          rejectionReason: "Not eligible",
        })
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Failed to reject shifting request");
    });
  });
});

module.exports = app;
