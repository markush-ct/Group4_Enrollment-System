const request = require("supertest");
const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

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

app.post("/CreateAcc", (req, res) => {
  const {
    applicantCategory,
    email,
    program,
    studentID,
    regIrreg,
    contactnum,
    firstname,
    lastname,
    middlename,
    position,
    employeeID,
  } = req.body;

  let query = "";
  let params = [];
  if (applicantCategory === "Regular/Irregular") {
    query = "SELECT * FROM account WHERE Email = ?";
    params = [email];
  } else if (applicantCategory === "Society Officer") {
    query = "SELECT * FROM societyofficer WHERE Email = ?";
    params = [email];
  } else if (applicantCategory === "Employee") {
    query = "SELECT * FROM employee WHERE Email = ?";
    params = [email];
  }

  db.query(query, params, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error in server: " + err.message });
    }
    if (result.length > 0) {
      return res.json({ message: "Email exists" });
    }

    if (applicantCategory === "Regular/Irregular") {
      db.query(
        "SELECT * FROM student WHERE ProgramID = ? AND CvSUStudentID = ?",
        [program, studentID],
        (err, studentResult) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error in server: " + err.message });
          }

          if (studentResult.length === 0) {
            return res.json({
              message:
                "No matching record found. Please verify your inputs and try again.",
            });
          }

          const accountQuery =
            "INSERT INTO account (Email, StudentID, ProgramID, RegIrreg, ContactNum) VALUES (?, ?, ?, ?, ?)";
          const accountParams = [
            email,
            studentID,
            program,
            regIrreg,
            contactnum,
          ];

          db.query(accountQuery, accountParams, (err, accountResult) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Error in server: " + err.message });
            }
            res.json({
              message:
                "Sign up successful. Wait for your temporary account to be sent through your email.",
            });
          });
        }
      );
    } else if (applicantCategory === "Society Officer") {
      const societyOfficerQuery =
        "INSERT INTO societyofficer (Email, Firstname, Lastname, Middlename, ContactNum, Program, Position) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const societyOfficerParams = [
        email,
        firstname,
        lastname,
        middlename,
        contactnum,
        program,
        position,
      ];

      db.query(societyOfficerQuery, societyOfficerParams, (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error in server: " + err.message });
        }
        res.json({
          message:
            "Sign up successful. Wait for your temporary account to be sent through your email.",
        });
      });
    } else if (applicantCategory === "Employee") {
      db.query(
        "SELECT * FROM employee WHERE EmployeeID = ?",
        [employeeID],
        (err, employeeResult) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error in server: " + err.message });
          }

          if (employeeResult.length > 0) {
            return res.json({ message: "Employee ID exists" });
          }

          const employeeQuery =
            "INSERT INTO employee (Email, Firstname, Lastname, EmployeeID, ContactNum, Program, Position) VALUES (?, ?, ?, ?, ?, ?, ?)";
          const employeeParams = [
            email,
            firstname,
            lastname,
            employeeID,
            contactnum,
            program,
            position,
          ];

          db.query(employeeQuery, employeeParams, (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Error in server: " + err.message });
            }
            res.json({
              message:
                "Sign up successful. Wait for your temporary account to be sent through your email.",
            });
          });
        }
      );
    } else {
      res.status(400).json({ message: "Invalid applicant category" });
    }
  });
});

describe("Unit Testing for Create Account Function", () => {
  let queryMock;

  beforeEach(() => {
    queryMock = mysql.createConnection().query;
    queryMock.mockReset();
  });

  it("Should return error if email already exists in the account table", async () => {
    queryMock.mockImplementationOnce((sql, params, callback) => {
      callback(null, [{ Email: params[0] }]);
    });

    const response = await request(app).post("/CreateAcc").send({
      email: "existingemail@example.com",
      applicantCategory: "Regular/Irregular",
    });

    expect(response.body.message).toBe("Email exists");
  });

  it("Should successfully create a Regular/Irregular student account", async () => {
    queryMock.mockImplementation((sql, params, callback) => {
      if (sql.includes("SELECT * FROM account WHERE Email = ?")) {
        callback(null, []);
      } else if (sql.includes("SELECT * FROM student WHERE ProgramID = ?")) {
        callback(null, [
          {
            CvSUStudentID: 123,
            ProgramID: 1,
            Email: "student@example.com",
            RegStatus: "Pending",
          },
        ]);
      } else if (sql.includes("INSERT INTO account")) {
        callback(null, { affectedRows: 1 });
      }
    });

    const response = await request(app).post("/CreateAcc").send({
      applicantCategory: "Regular/Irregular",
      email: "student@example.com",
      program: "1",
      studentID: "123",
      regIrreg: "Regular",
      contactnum: "09123456789",
    });

    expect(response.body.message).toBe(
      "Sign up successful. Wait for your temporary account to be sent through your email."
    );
  });

  it("Should handle errors during the creation of the student account", async () => {
    queryMock.mockImplementationOnce((sql, params, callback) => {
      callback(new Error("Database error"));
    });

    const response = await request(app).post("/CreateAcc").send({
      applicantCategory: "Regular/Irregular",
      email: "student@example.com",
      program: "1",
      studentID: "123",
      regIrreg: "Regular",
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error in server: Database error");
  });

  it("Should return error if email already exists for Society Officer", async () => {
    queryMock.mockImplementationOnce((sql, params, callback) => {
      callback(null, [{ Email: params[0] }]);
    });

    const response = await request(app).post("/CreateAcc").send({
      email: "existingemail@example.com",
      applicantCategory: "Society Officer",
    });

    expect(response.body.message).toBe("Email exists");
  });

  it("Should successfully create a Society Officer account", async () => {
    queryMock.mockImplementation((sql, params, callback) => {
      if (sql.includes("SELECT * FROM societyofficer WHERE Email = ?")) {
        callback(null, []);
      } else if (sql.includes("INSERT INTO societyofficer")) {
        callback(null, { affectedRows: 1 });
      }
    });

    const response = await request(app).post("/CreateAcc").send({
      applicantCategory: "Society Officer",
      email: "societyofficer@example.com",
      firstname: "John",
      middlename: "Smith",
      lastname: "Doe",
      contactnum: "09123456789",
      program: "Computer Science",
      position: "President",
    });

    expect(response.body.message).toBe(
      "Sign up successful. Wait for your temporary account to be sent through your email."
    );
  });

  it("Should handle errors when creating Society Officer account", async () => {
    queryMock.mockImplementationOnce((sql, params, callback) => {
      callback(new Error("Database error"));
    });

    const response = await request(app).post("/CreateAcc").send({
      applicantCategory: "Society Officer",
      email: "societyofficer@example.com",
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error in server: Database error");
  });

  it("Should return error if email already exists for Employee", async () => {
    queryMock.mockImplementationOnce((sql, params, callback) => {
      callback(null, [{ Email: params[0] }]);
    });

    const response = await request(app).post("/CreateAcc").send({
      email: "employee@example.com",
      applicantCategory: "Employee",
    });

    expect(response.body.message).toBe("Email exists");
  });

  it("Should successfully create an Employee account", async () => {
    queryMock.mockImplementation((sql, params, callback) => {
      if (sql.includes("SELECT * FROM employee WHERE EmployeeID = ?")) {
        callback(null, []);
      } else if (sql.includes("SELECT * FROM employee WHERE Email = ?")) {
        callback(null, []);
      } else if (sql.includes("INSERT INTO employee")) {
        callback(null, { affectedRows: 1 });
      }
    });

    const response = await request(app).post("/CreateAcc").send({
      applicantCategory: "Employee",
      email: "employee@example.com",
      firstname: "Jane",
      lastname: "Doe",
      employeeID: "123",
      contactnum: "09123456789",
      program: "Computer Science",
      position: "DCS Head",
    });

    expect(response.body.message).toBe(
      "Sign up successful. Wait for your temporary account to be sent through your email."
    );
  });

  it("Should handle errors when creating Employee account", async () => {
    queryMock.mockImplementationOnce((sql, params, callback) => {
      callback(new Error("Database error"));
    });

    const response = await request(app).post("/CreateAcc").send({
      applicantCategory: "Employee",
      email: "employee@example.com",
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error in server: Database error");
  });
});

module.exports = app;
