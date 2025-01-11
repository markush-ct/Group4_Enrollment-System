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

app.get("/getPFP", (req, res) => {
  const getPFPQuery = `SELECT * FROM account WHERE Email = ?`;
  db.query(getPFPQuery, req.cookies.email, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error in server: " + err });
    } else if (result.length > 0) {
      return res.json({
        uploadPFP: result[0].ProfilePicture,
        pfpURL: result[0].ProfilePicture,
      });
    } else {
      return res.json({
        uploadPFP: undefined,
        pfpURL: undefined,
      });
    }
  });
});

jest.mock("mysql", () => ({
  createConnection: jest.fn().mockReturnValue({
    query: jest.fn(),
  }),
}));

describe("Unit Testing for StudentDashHeader - getPFP Function", () => {
  it("Should return profile picture URL when email is found", async () => {
    const mockResult = [
      {
        ProfilePicture: "http://localhost:8080/profile-image.jpg",
      },
    ];
    db.query.mockImplementation((query, email, callback) => {
      callback(null, mockResult);
    });

    const response = await request(app)
      .get("/getPFP")
      .set("Cookie", ["email=test@example.com"]);

    expect(response.status).toBe(200);
    expect(response.body.uploadPFP).toBe(
      "http://localhost:8080/profile-image.jpg"
    );
    expect(response.body.pfpURL).toBe(
      "http://localhost:8080/profile-image.jpg"
    );
  });

  it("Should return an empty profile picture URL when no user is found", async () => {
    db.query.mockImplementation((query, email, callback) => {
      callback(null, []);
    });

    const response = await request(app)
      .get("/getPFP")
      .set("Cookie", ["email=test@example.com"]);

    expect(response.status).toBe(200);
    expect(response.body.uploadPFP).toBeUndefined();
    expect(response.body.pfpURL).toBeUndefined();
  });

  it("Should return an error message when there is a database error", async () => {
    db.query.mockImplementation((query, email, callback) => {
      callback(new Error("Database error"), null);
    });

    const response = await request(app)
      .get("/getPFP")
      .set("Cookie", ["email=test@example.com"]);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "Error in server: Error: Database error"
    );
  });
});

module.exports = app;
