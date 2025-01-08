const request = require("supertest");
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");

jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
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

app.get("/getTransfereeAdmissionReq", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/getTransfereeAdmissionReq"
    );
    res.json(response.data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching account requests", error: err.message });
  }
});

app.get("/getTransfereePreProgram", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/getTransfereePreProgram"
    );
    res.json(response.data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching previous courses", error: err.message });
  }
});

app.post("/approveTransfereeAdmissionReq", async (req, res) => {
  const { email, name, studentID, submissionDate } = req.body;
  try {
    const response = await axios.post(
      "http://localhost:8080/approveTransfereeAdmissionReq",
      {
        email,
        name,
        studentID,
        submissionDate,
      }
    );
    res.json(response.data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to send approval email", error: err.message });
  }
});

app.post("/rejectTransfereeAdmissionReq", async (req, res) => {
  const { email, name, studentID, rejectionReason } = req.body;
  try {
    const response = await axios.post(
      "http://localhost:8080/rejectTransfereeAdmissionReq",
      {
        email,
        name,
        studentID,
        rejectionReason,
      }
    );
    res.json(response.data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to send rejection email", error: err.message });
  }
});

describe("Unit Testing for Transferee Admission Requests Function", () => {
  describe("For /getTransfereeAdmissionReq", () => {
    it("Should return transferee admission requests", async () => {
      axios.get.mockResolvedValueOnce({
        data: { records: [{ AdmissionID: 1, Email: "test@example.com" }] },
      });

      const res = await request(app)
        .get("/getTransfereeAdmissionReq")
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(200);
      expect(res.body.records).toEqual([
        { AdmissionID: 1, Email: "test@example.com" },
      ]);
    });

    it("Should return error if fetching fails", async () => {
      axios.get.mockRejectedValueOnce(new Error("Error fetching data"));

      const res = await request(app)
        .get("/getTransfereeAdmissionReq")
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error fetching account requests");
    });
  });

  describe("For /getTransfereePreProgram", () => {
    it("Should return transferee previous courses", async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          prevCourses: [
            {
              AdmissionID: 1,
              courseName: "Bachelor of Science in Information Technology",
            },
          ],
        },
      });

      const res = await request(app)
        .get("/getTransfereePreProgram")
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(200);
      expect(res.body.prevCourses).toEqual([
        {
          AdmissionID: 1,
          courseName: "Bachelor of Science in Information Technology",
        },
      ]);
    });

    it("Should return error if fetching previous courses fails", async () => {
      axios.get.mockRejectedValueOnce(
        new Error("Error fetching previous courses")
      );

      const res = await request(app)
        .get("/getTransfereePreProgram")
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error fetching previous courses");
    });
  });

  describe("For /approveTransfereeAdmissionReq", () => {
    it("Should approve transferee admission request successfully", async () => {
      axios.post.mockResolvedValueOnce({
        data: { message: "Transfer Approval sent" },
      });

      const res = await request(app)
        .post("/approveTransfereeAdmissionReq")
        .send({
          email: "test@example.com",
          name: "Unit Test",
          studentID: "12345",
          submissionDate: "2025-01-08",
        })
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Transfer Approval sent");
    });

    it("Should return error when approval fails", async () => {
      axios.post.mockRejectedValueOnce(
        new Error("Failed to send approval email")
      );

      const res = await request(app)
        .post("/approveTransfereeAdmissionReq")
        .send({
          email: "test@example.com",
          name: "Unit Test",
          studentID: "12345",
          submissionDate: "2025-01-08",
        })
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Failed to send approval email");
    });
  });

  describe("For /rejectTransfereeAdmissionReq", () => {
    it("Should reject transferee admission request successfully", async () => {
      axios.post.mockResolvedValueOnce({
        data: { message: "Transfer request rejection sent" },
      });

      const res = await request(app)
        .post("/rejectTransfereeAdmissionReq")
        .send({
          email: "test@example.com",
          name: "Unit Test",
          studentID: "12345",
          rejectionReason: "Not qualified",
        })
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Transfer request rejection sent");
    });

    it("Should return error when rejection fails", async () => {
      axios.post.mockRejectedValueOnce(
        new Error("Failed to send rejection email")
      );

      const res = await request(app)
        .post("/rejectTransfereeAdmissionReq")
        .send({
          email: "test@example.com",
          name: "Unit Test",
          studentID: "12345",
          rejectionReason: "Not qualified",
        })
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Failed to send rejection email");
    });
  });
});

module.exports = app;
