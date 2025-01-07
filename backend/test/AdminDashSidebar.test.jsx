const request = require("supertest");
const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

jest.mock("mysql", () => ({
  createConnection: jest.fn().mockReturnValue({
    query: jest.fn(),
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

db.getAccountRequestNotif = jest.fn();
db.getAdmissionNotifications = jest.fn();
db.getShiftingNotifications = jest.fn();

app.get("/accReqNotif", async (req, res) => {
  try {
    const data = await db.getAccountRequestNotif();
    res.status(200).json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting account request notifications" });
  }
});

app.get("/admissionNotif", async (req, res) => {
  try {
    const data = await db.getAdmissionNotifications();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error getting admission notifications" });
  }
});

app.get("/getShiftingRequestsNotif", async (req, res) => {
  try {
    const data = await db.getShiftingNotifications();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error getting shifting notifications" });
  }
});

describe("Unit Testing for AdminDashSidebar Function", () => {
  describe("For /accReqNotif", () => {
    it("Should return account request notifications", async () => {
      const mockData = { studentCount: 5, empCount: 3, societyCount: 2 };
      jest.spyOn(db, "getAccountRequestNotif").mockResolvedValue(mockData);
      const res = await request(app).get("/accReqNotif");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it("Should return 'Error getting account request notifications' in case of a database failure", async () => {
      jest
        .spyOn(db, "getAccountRequestNotif")
        .mockRejectedValue(new Error("Database error"));
      const res = await request(app).get("/accReqNotif");
      expect(res.status).toBe(500);
      expect(res.body.message).toBe(
        "Error getting account request notifications"
      );
    });

    it("Should return an empty data when no data available", async () => {
      jest.spyOn(db, "getAccountRequestNotif").mockResolvedValue({});
      const res = await request(app).get("/accReqNotif");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({});
    });
  });

  describe("For /admissionNotif", () => {
    it("Should return admission notifications", async () => {
      const mockData = { freshmenCount: 3, transfereeCount: 2 };
      jest.spyOn(db, "getAdmissionNotifications").mockResolvedValue(mockData);
      const res = await request(app).get("/admissionNotif");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it("Should return 'Error getting admission notifications' in case of a database failure", async () => {
      jest
        .spyOn(db, "getAdmissionNotifications")
        .mockRejectedValue(new Error("Database error"));
      const res = await request(app).get("/admissionNotif");
      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error getting admission notifications");
    });

    it("Should return an empty data when no data available", async () => {
      jest.spyOn(db, "getAdmissionNotifications").mockResolvedValue({});
      const res = await request(app).get("/admissionNotif");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({});
    });
  });

  describe("For /getShiftingRequestsNotif", () => {
    it("Should return shifting notifications", async () => {
      const mockData = { studentCount: 4 };
      jest.spyOn(db, "getShiftingNotifications").mockResolvedValue(mockData);
      const res = await request(app).get("/getShiftingRequestsNotif");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it("Should return 'Error getting shifting notifications' in case of a database failure.", async () => {
      jest
        .spyOn(db, "getShiftingNotifications")
        .mockRejectedValue(new Error("Database error"));
      const res = await request(app).get("/getShiftingRequestsNotif");
      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error getting shifting notifications");
    });

    it("Should return an empty data when no data available", async () => {
      jest.spyOn(db, "getShiftingNotifications").mockResolvedValue({});
      const res = await request(app).get("/getShiftingRequestsNotif");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({});
    });
  });
});
