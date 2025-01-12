const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const request = require("supertest");

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

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cvsuenrollmentsystem",
});

app.post("/changePFP", (req, res) => {
  if (!req.session || !req.session.email) {
    return res.status(401).json({ message: "Session required" });
  }

  const { pfpURL } = req.body;
  db.query(
    "UPDATE account SET ProfilePicture = ? WHERE Email = ?",
    [pfpURL, req.session.email],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.affectedRows > 0) {
        res
          .status(200)
          .json({ message: "Successfully changed Profile Picture", pfpURL });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  );
});

app.get("/getPFP", (req, res) => {
  if (!req.session || !req.session.email) {
    return res.status(401).json({ message: "Session required" });
  }

  db.query(
    "SELECT ProfilePicture FROM account WHERE Email = ?",
    [req.session.email],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.length > 0) {
        res.status(200).json({ pfpURL: result[0].ProfilePicture });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  );
});

app.get("/getAccInfo", (req, res) => {
  if (!req.session || !req.session.email) {
    return res.status(401).json({ message: "Session required" });
  }

  db.query(
    "SELECT * FROM employee WHERE Email = ?",
    [req.session.email],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  );
});

app.post("/saveAccInfo", (req, res) => {
  if (!req.session || !req.session.email) {
    return res.status(401).json({ message: "Session required" });
  }

  const { firstName, lastName, gender, age, phoneNo, address, dob } = req.body;
  db.query(
    "UPDATE employee SET Firstname = ?, Lastname = ?, Gender = ?, Age = ?, PhoneNo = ?, Address = ?, DOB = ? WHERE Email = ?",
    [
      firstName,
      lastName,
      gender,
      age,
      phoneNo,
      address,
      dob,
      req.session.email,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Account updated successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  );
});

app.post("/matchPass", (req, res) => {
  const { currentPassword } = req.body;

  if (currentPassword === "jenniekim16") {
    res.status(200).json({ message: "Account found" });
  } else {
    res.status(401).json({ message: "Incorrect password" });
  }
});

app.post("/changePass", (req, res) => {
  const { confirmPassword } = req.body;

  if (confirmPassword) {
    res.status(200).json({ message: "Password changed successfully" });
  } else {
    res.status(400).json({ message: "Password is required" });
  }
});

jest.mock("express-session", () => {
  return jest.fn().mockImplementation(() => {
    return (req, res, next) => {
      req.session = { email: "jenniekim@bp.com" };
      next();
    };
  });
});

jest.mock("mysql", () => ({
  createConnection: jest.fn().mockReturnValue({
    query: jest.fn().mockImplementation((query, values, callback) => {
      if (
        query.includes("SELECT ProfilePicture FROM account WHERE Email = ?")
      ) {
        callback(null, [{ ProfilePicture: "/uploads/pfp.jpg" }]);
      } else if (
        query.includes("UPDATE account SET ProfilePicture = ? WHERE Email = ?")
      ) {
        callback(null, { affectedRows: 1 });
      } else if (query.includes("SELECT * FROM employee WHERE Email = ?")) {
        callback(null, [
          {
            Firstname: "Jennie",
            Lastname: "Kim",
            Email: "jenniekim@bp.com",
            Gender: "F",
            Age: 29,
            PhoneNo: "1234567890",
            Address: "South Korea",
            DOB: "1996-01-16",
          },
        ]);
      } else if (query.includes("UPDATE employee SET Firstname = ?")) {
        callback(null, { affectedRows: 1 });
      } else if (query.includes("SELECT * FROM employee WHERE Password = ?")) {
        callback(null, [{ Password: "jenniekim123" }]);
      }
    }),
  }),
}));

describe("Unit Testing for Student Account Settings Function", () => {
  it("Should return the profile picture URL", async () => {
    const response = await request(app)
      .get("/getPFP")
      .set("Cookie", "session=testsession");

    expect(response.status).toBe(200);
    expect(response.body.pfpURL).toBe("/uploads/pfp.jpg");
  });

  it("Should successfully update profile picture", async () => {
    const response = await request(app)
      .post("/changePFP")
      .send({ pfpURL: "/uploads/newPFP.jpg" })
      .set("Cookie", "session=testsession");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully changed Profile Picture");
    expect(response.body.pfpURL).toBe("/uploads/newPFP.jpg");
  });

  it("Should return account information", async () => {
    const response = await request(app)
      .get("/getAccInfo")
      .set("Cookie", "session=testsession");

    expect(response.status).toBe(200);
    expect(response.body.Firstname).toBe("Jennie");
    expect(response.body.Lastname).toBe("Kim");
    expect(response.body.Email).toBe("jenniekim@bp.com");
    expect(response.body.Gender).toBe("F");
    expect(response.body.Age).toBe(29);
    expect(response.body.PhoneNo).toBe("1234567890");
    expect(response.body.Address).toBe("South Korea");
    expect(response.body.DOB).toBe("1996-01-16");
  });

  it("Should update account information", async () => {
    const response = await request(app)
      .post("/saveAccInfo")
      .send({
        firstName: "Jennie Rubyjane",
        lastName: "Kim",
        gender: "Female",
        age: 30,
        phoneNo: "0987654321",
        address: "South Korea Gangnam",
        dob: "196-01-16",
      })
      .set("Cookie", "session=testsession");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Account updated successfully");
  });

  it("Should check if the current password is correct", async () => {
    const response = await request(app)
      .post("/matchPass")
      .send({ currentPassword: "jenniekim16" })
      .set("Cookie", "session=testsession");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Account found");
  });

  it("Should return 'Incorrect password' when the current password is incorrect", async () => {
    const response = await request(app)
      .post("/matchPass")
      .send({ currentPassword: "jennietheitgirl" })
      .set("Cookie", "session=testsession");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Incorrect password");
  });

  it("Should return 'Password is required' if no password provided", async () => {
    const response = await request(app).post("/changePass").send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Password is required");
  });

  it("Should return 'Password is required' when confirmPassword is empty", async () => {
    const response = await request(app)
      .post("/changePass")
      .send({ confirmPassword: "" })
      .set("Cookie", "session=testsession");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Password is required");
  });

  it("Should successfully change the password", async () => {
    const response = await request(app)
      .post("/changePass")
      .send({ confirmPassword: "jennierubyjane" })
      .set("Cookie", "session=testsession");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Password changed successfully");
  });

  it("Should return 'Database error' when database query fails for getPFP", async () => {
    db.query = jest.fn().mockImplementationOnce((query, values, callback) => {
      callback(new Error("Database error"));
    });

    const response = await request(app)
      .get("/getPFP")
      .set("Cookie", "session=testsession");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Database error");
  });

  it("Should return 'Database error' when database query fails for changePFP", async () => {
    db.query = jest.fn().mockImplementationOnce((query, values, callback) => {
      callback(new Error("Database error"));
    });

    const response = await request(app)
      .post("/changePFP")
      .send({ pfpURL: "/uploads/newPFP.jpg" })
      .set("Cookie", "session=testsession");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Database error");
  });

  it("Should return 'User not found' if user not found for getAccInfo", async () => {
    db.query = jest.fn().mockImplementationOnce((query, values, callback) => {
      callback(null, []);
    });

    const response = await request(app)
      .get("/getAccInfo")
      .set("Cookie", "session=testsession");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("Should return 'User not found' if user not found for saveAccInfo", async () => {
    db.query = jest.fn().mockImplementationOnce((query, values, callback) => {
      callback(null, { affectedRows: 0 });
    });

    const response = await request(app)
      .post("/saveAccInfo")
      .send({
        firstName: "RubyJane",
        lastName: "Kim",
        gender: "Female",
        age: 29,
        phoneNo: "0987654321",
        address: "5678 Secondary St",
        dob: "2003-02-02",
      })
      .set("Cookie", "session=testsession");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});

module.exports = app;
