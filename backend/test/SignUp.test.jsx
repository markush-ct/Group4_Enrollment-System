const request = require("supertest");
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cvsuenrollmentsystem",
});

jest.mock("mysql", () => ({
  createConnection: jest.fn().mockReturnValue({
    query: jest.fn(),
  }),
}));

app.post("/SignUp", (req, res) => {
  const {
    email,
    applicantCategory,
    firstname,
    middlename,
    lastname,
    contactnum,
    preferredProgram,
    studentID,
    prevProgram,
    year,
  } = req.body;

  if (applicantCategory === "Freshman" || applicantCategory === "Transferee") {
    const emailQuery = "SELECT * FROM student WHERE Email = ?";
    db.query(emailQuery, [email], (err, result) => {
      if (err)
        return res.status(500).json({ message: "Error in server: " + err });
      if (result.length > 0)
        return res.status(200).json({ message: "Email exists" });

      const query =
        "INSERT INTO student (StudentType, Firstname, Middlename, Lastname, Email, PhoneNo, ProgramID) VALUES (?, ?, ?, ?, ?, ?, ?)";
      db.query(
        query,
        [
          applicantCategory,
          firstname,
          middlename,
          lastname,
          email,
          contactnum,
          preferredProgram,
        ],
        (err, result) => {
          if (err)
            return res.status(500).json({ message: "Error in server: " + err });
          if (result.affectedRows > 0) {
            return res.status(200).json({
              message:
                "Sign up successful. Wait for your temporary account to be sent through your email.",
            });
          }
          return res
            .status(400)
            .json({ message: "Sign up failed. No rows affected" });
        }
      );
    });
  } else if (applicantCategory === "Shiftee") {
    const studentIDQuery = "SELECT * FROM student WHERE CvSUStudentID = ?";
    db.query(studentIDQuery, [studentID], (err, result) => {
      if (err)
        return res.status(500).json({ message: "Error in server: " + err });
      if (result.length > 0)
        return res.status(200).json({ message: "Student ID exists" });

      const query =
        "INSERT INTO student (StudentType, Firstname, Middlename, Lastname, CvSUStudentID, PrevProgram, Year, Email, PhoneNo, ProgramID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      db.query(
        query,
        [
          applicantCategory,
          firstname,
          middlename,
          lastname,
          studentID,
          prevProgram,
          year,
          email,
          contactnum,
          preferredProgram,
        ],
        (err, result) => {
          if (err)
            return res.status(500).json({ message: "Error in server: " + err });
          if (result.affectedRows > 0) {
            return res.status(200).json({
              message:
                "Sign up successful. Wait for your temporary account to be sent through your email.",
            });
          }
          return res
            .status(400)
            .json({ message: "Sign up failed. No rows affected" });
        }
      );
    });
  }
});

describe("Unit Testing for Sign Up Function", () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('Should return "Email exists" if email already exists for Freshman or Transferee', async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, [{ email: "hyeinlee@newjeans.com" }]);
    });

    const response = await request(app).post("/SignUp").send({
      email: "hyeinlee@newjeans.com",
      applicantCategory: "Freshman",
      firstname: "Hyein",
      middlename: "Grace",
      lastname: "Lee",
      contactnum: "123456789",
      preferredProgram: "Bachelor of Science in Computer Science",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Email exists");
  });

  it("Should return success message if sign up is successful for Freshman or Transferee", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, []);
    });
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).post("/SignUp").send({
      email: "rosesarerosie@bp.com",
      applicantCategory: "Transferee",
      firstname: "Rosie",
      middlename: "Chaeyoung",
      lastname: "Park",
      contactnum: "987654321",
      preferredProgram: "Bachelor of Science in Information Technology",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Sign up successful. Wait for your temporary account to be sent through your email."
    );
  });

  it('Should return "Student ID exists" if CvSUStudentID already exists for Shiftee', async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, [{ CvSUStudentID: "20221000009" }]);
    });

    const response = await request(app).post("/SignUp").send({
      studentID: "20221000009",
      email: "sooya@bp.com",
      applicantCategory: "Shiftee",
      firstname: "Jisoo",
      middlename: "Sooya",
      lastname: "Kim",
      prevProgram: "Bachelor of Science in Psychology",
      year: "Second Year",
      contactnum: "1122334455",
      preferredProgram: "Bachelor of Science in Information Technology",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Student ID exists");
  });

  it("Should return success message if sign up is successful for Shiftee", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, []);
    });
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).post("/SignUp").send({
      studentID: "2022267890",
      email: "jenniekim@bp.com",
      applicantCategory: "Shiftee",
      firstname: "Jennie",
      middlename: "Rubyjane",
      lastname: "Kim",
      prevProgram: "Bachelor of Science in Business Management",
      year: "Third Year",
      contactnum: "2233445566",
      preferredProgram: "Bachelor of Science in Computer Science",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Sign up successful. Wait for your temporary account to be sent through your email."
    );
  });

  it('Should return "Sign up failed. No rows affected" if the insert fails', async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, []);
    });
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, { affectedRows: 0 });
    });

    const response = await request(app).post("/SignUp").send({
      email: "failerror@test.com",
      applicantCategory: "Freshman",
      firstname: "Unit",
      middlename: "Test",
      lastname: "Error",
      contactnum: "234567890",
      preferredProgram: "Bachelor of Science in Information Technology",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Sign up failed. No rows affected");
  });

  it("Should return error if there is a database error", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error("Database error"));
    });

    const response = await request(app).post("/SignUp").send({
      email: "fail@test.com",
      applicantCategory: "Freshman",
      firstname: "Sharaine",
      middlename: "Galvez",
      lastname: "Gomez",
      contactnum: "9876543210",
      preferredProgram: "Bachelor of Science in Computer Science",
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "Error in server: Error: Database error"
    );
  });
});

module.exports = app;
