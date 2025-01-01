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

app.post("/sendPin", (req, res) => {
  const { email } = req.body;

  if (!email || email === "") {
    return res.status(400).json({ message: "Email is required." });
  }

  const query = "SELECT * FROM account WHERE Email = ?";
  db.query(query, [email], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length > 0) {
      return res.status(200).json({ message: "Verification code sent" });
    } else {
      return res.status(400).json({ message: "Email doesn't exist" });
    }
  });
});

app.post("/verifyPin", (req, res) => {
  const { email, pin } = req.body;

  if (!email || !pin || pin.length !== 4) {
    return res.status(400).json({ message: "Invalid PIN or missing fields." });
  }

  const correctPin = "1234";
  if (pin === correctPin) {
    return res.status(200).json({ message: "Verified" });
  } else {
    return res.status(400).json({ message: "Invalid PIN" });
  }
});

app.post("/resetPass", (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email and new password are required." });
  }

  const query = "UPDATE account SET Password = ? WHERE Email = ?";
  db.query(query, [newPassword, email], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Database error" });
    }

    if (results.affectedRows > 0) {
      return res.status(200).json({ message: "Password updated successfully" });
    } else {
      return res.status(400).json({ message: "Failed to update password" });
    }
  });
});

describe("Unit Testing for Forgot Password Function", () => {
  beforeEach(() => {
    mysql.createConnection().query.mockReset();
  });

  it("Should return an error when email is missing", async () => {
    const response = await request(app).post("/sendPin").send({ email: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email is required.");
  });

  it("Should return a success message when verification code is sent", async () => {
    mysql
      .createConnection()
      .query.mockImplementationOnce((sql, params, callback) => {
        if (sql.includes("SELECT * FROM account WHERE Email = ?")) {
          callback(null, [{ Email: params[0] }]);
        }
      });

    const response = await request(app)
      .post("/sendPin")
      .send({ email: "test@sample.com" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Verification code sent");
  });

  it("Should return an error if email does not exist", async () => {
    mysql
      .createConnection()
      .query.mockImplementationOnce((sql, params, callback) => {
        callback(null, []);
      });

    const response = await request(app)
      .post("/sendPin")
      .send({ email: "nonexistentemail@sample.com" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email doesn't exist");
  });

  it("Should return an error for invalid or missing PIN", async () => {
    const response = await request(app)
      .post("/verifyPin")
      .send({ email: "test@sample.com", pin: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid PIN or missing fields.");
  });

  it("Should return a success message when PIN is correct", async () => {
    const response = await request(app)
      .post("/verifyPin")
      .send({ email: "test@sample.com", pin: "1234" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Verified");
  });

  it("Should return an error for incorrect PIN", async () => {
    const response = await request(app)
      .post("/verifyPin")
      .send({ email: "test@sample.com", pin: "0000" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid PIN");
  });

  it("Should return an error when new password is missing", async () => {
    const response = await request(app)
      .post("/resetPass")
      .send({ newPassword: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email and new password are required.");
  });

  it("Should return a success message when password is updated successfully", async () => {
    mysql
      .createConnection()
      .query.mockImplementationOnce((sql, params, callback) => {
        if (sql.includes("UPDATE account SET Password = ? WHERE Email = ?")) {
          callback(null, { affectedRows: 1 });
        }
      });

    const response = await request(app)
      .post("/resetPass")
      .send({ email: "test@sample.com", newPassword: "test12345" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Password updated successfully");
  });

  it("Should return an error when password update fails", async () => {
    mysql
      .createConnection()
      .query.mockImplementationOnce((sql, params, callback) => {
        callback(null, { affectedRows: 0 });
      });

    const response = await request(app)
      .post("/resetPass")
      .send({ email: "test@sample.com", newPassword: "test123" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Failed to update password");
  });

  it("Should return an error if there is a database error during password update", async () => {
    mysql
      .createConnection()
      .query.mockImplementationOnce((sql, params, callback) => {
        callback(new Error("Database error"), null);
      });

    const response = await request(app)
      .post("/resetPass")
      .send({ email: "test@sample.com", newPassword: "test123" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});

module.exports = app;
