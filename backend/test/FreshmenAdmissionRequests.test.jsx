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

app.get("/getFreshmenAdmissionReq", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/getFreshmenAdmissionReq"
    );
    res.json(response.data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching account requests", error: err.message });
  }
});

app.get("/getFreshmenConfirmedSlots", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/getFreshmenConfirmedSlots"
    );
    res.json(response.data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching confirmed slots", error: err.message });
  }
});

app.post("/approveFreshmenAdmissionReq", async (req, res) => {
  const { email, name, studentID, submissionDate, examDatetime } = req.body;
  try {
    const response = await axios.post(
      "http://localhost:8080/approveFreshmenAdmissionReq",
      {
        email,
        name,
        studentID,
        submissionDate,
        examDatetime,
      }
    );
    res.json(response.data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to send approval email", error: err.message });
  }
});

app.post("/rejectFreshmenAdmissionReq", async (req, res) => {
  const { email, name, studentID, rejectionReason } = req.body;
  try {
    const response = await axios.post(
      "http://localhost:8080/rejectFreshmenAdmissionReq",
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

describe("Unit Testing for Freshmen Admission Requests Function", () => {
  describe("For /getFreshmenAdmissionReq", () => {
    it("Should return freshmen admission requests", async () => {
      axios.get.mockResolvedValueOnce({
        data: { records: [{ AdmissionID: 1, Email: "test@example.com" }] },
      });

      const res = await request(app)
        .get("/getFreshmenAdmissionReq")
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(200);
      expect(res.body.records).toEqual([
        { AdmissionID: 1, Email: "test@example.com" },
      ]);
    });

    it("Should return error if fetching fails", async () => {
      axios.get.mockRejectedValueOnce(new Error("Error fetching data"));

      const res = await request(app)
        .get("/getFreshmenAdmissionReq")
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error fetching account requests");
    });
  });

  describe("For /getFreshmenConfirmedSlots", () => {
    it("Should return confirmed freshmen slots", async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          admissionRes: [
            { SlotID: 1, Email: "test@example.com", Status: "Confirmed" },
          ],
        },
      });

      const res = await request(app)
        .get("/getFreshmenConfirmedSlots")
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(200);
      expect(res.body.admissionRes).toEqual([
        { SlotID: 1, Email: "test@example.com", Status: "Confirmed" },
      ]);
    });

    it("Should return error if fetching confirmed slots fails", async () => {
      axios.get.mockRejectedValueOnce(new Error("Error fetching slots"));

      const res = await request(app)
        .get("/getFreshmenConfirmedSlots")
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error fetching confirmed slots");
    });
  });

  describe("For /approveFreshmenAdmissionReq", () => {
    it("Should approve freshmen admission request successfully", async () => {
      axios.post.mockResolvedValueOnce({
        data: { message: "Admission Approval sent" },
      });

      const res = await request(app)
        .post("/approveFreshmenAdmissionReq")
        .send({
          email: "test@example.com",
          name: "Unit Test",
          studentID: "12345",
          submissionDate: "2025-01-08",
          examDatetime: "2025-01-09",
        })
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Admission Approval sent");
    });

    it("Should return error when approval fails", async () => {
      axios.post.mockRejectedValueOnce(
        new Error("Failed to send approval email")
      );

      const res = await request(app)
        .post("/approveFreshmenAdmissionReq")
        .send({
          email: "test@example.com",
          name: "Unit Test",
          studentID: "12345",
          submissionDate: "2025-01-08",
          examDatetime: "2025-01-09",
        })
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Failed to send approval email");
    });
  });

  describe("For /rejectFreshmenAdmissionReq", () => {
    it("Should reject freshmen admission request successfully", async () => {
      axios.post.mockResolvedValueOnce({
        data: { message: "Admission request rejection sent" },
      });

      const res = await request(app)
        .post("/rejectFreshmenAdmissionReq")
        .send({
          email: "test@example.com",
          name: "Unit Test",
          studentID: "12345",
          rejectionReason: "Not qualified",
        })
        .set("Cookie", "session_id=someSessionId");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Admission request rejection sent");
    });

    it("Should return error when rejection fails", async () => {
      axios.post.mockRejectedValueOnce(
        new Error("Failed to send rejection email")
      );

      const res = await request(app)
        .post("/rejectFreshmenAdmissionReq")
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
