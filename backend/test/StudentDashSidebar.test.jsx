const request = require("supertest");
const express = require("express");
const axios = require("axios");

jest.mock("axios");

const app = express();
app.use(express.json());

app.get("/api/student", async (req, res) => {
  try {
    const response = await axios.get("http://external-api-url");
    if (response.data.valid) {
      if (response.data.role === "Regular") {
        return res.status(200).json({
          role: "Regular",
          navBtn: [
            { name: "Dashboard", path: "/RegIrregDashboard" },
            { name: "Enrollment", path: "/EnrollmentRegular" },
            { name: "Checklist", path: "/StudentChecklist" },
          ],
        });
      } else if (response.data.role === "Freshman") {
        return res.status(200).json({
          role: "Freshman",
          navBtn: [{ name: "Admission Form", path: "/FreshmenAdmissionForm" }],
        });
      } else if (response.data.role === "Irregular") {
        return res.status(200).json({
          role: "Irregular",
          navBtn: [
            { name: "Dashboard", path: "/RegIrregDashboard" },
            { name: "Enrollment", path: "/EnrollmentRegular" },
            { name: "Checklist", path: "/StudentChecklist" },
          ],
        });
      } else if (response.data.role === "Transferee") {
        return res.status(200).json({
          role: "Transferee",
          navBtn: [
            { name: "Admission Form", path: "/TransfereeAdmissionForm" },
          ],
        });
      } else if (response.data.role === "Shiftee") {
        return res.status(200).json({
          role: "Shiftee",
          navBtn: [{ name: "Shiftee Form", path: "/ShifteeForm" }],
        });
      }
    }
    return res.status(401).json({ message: "User is not authorized" });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching student data" });
  }
});

describe("Unit Testing for StudentDashSidebar Function", () => {
  it("Returns correct menu items and its navigation links for Regular role", async () => {
    axios.get.mockResolvedValue({
      data: { valid: true, role: "Regular" },
    });

    const response = await request(app).get("/api/student");

    expect(response.status).toBe(200);
    expect(response.body.role).toBe("Regular");
    expect(response.body.navBtn).toEqual([
      { name: "Dashboard", path: "/RegIrregDashboard" },
      { name: "Enrollment", path: "/EnrollmentRegular" },
      { name: "Checklist", path: "/StudentChecklist" },
    ]);
  });

  it("Returns correct menu items and its navigation links for Irregular role", async () => {
    axios.get.mockResolvedValue({
      data: { valid: true, role: "Irregular" },
    });

    const response = await request(app).get("/api/student");

    expect(response.status).toBe(200);
    expect(response.body.role).toBe("Irregular");
    expect(response.body.navBtn).toEqual([
      { name: "Dashboard", path: "/RegIrregDashboard" },
      { name: "Enrollment", path: "/EnrollmentRegular" },
      { name: "Checklist", path: "/StudentChecklist" },
    ]);
  });

  it("Returns correct menu items and its navigation links for Freshman role", async () => {
    axios.get.mockResolvedValue({
      data: { valid: true, role: "Freshman" },
    });

    const response = await request(app).get("/api/student");

    expect(response.status).toBe(200);
    expect(response.body.role).toBe("Freshman");
    expect(response.body.navBtn).toEqual([
      { name: "Admission Form", path: "/FreshmenAdmissionForm" },
    ]);
  });

  it("Returns correct menu items and its navigation links for Transferee role", async () => {
    axios.get.mockResolvedValue({
      data: { valid: true, role: "Transferee" },
    });

    const response = await request(app).get("/api/student");

    expect(response.status).toBe(200);
    expect(response.body.role).toBe("Transferee");
    expect(response.body.navBtn).toEqual([
      { name: "Admission Form", path: "/TransfereeAdmissionForm" },
    ]);
  });

  it("Returns correct menu items and its navigation links for Shiftee role", async () => {
    axios.get.mockResolvedValue({
      data: { valid: true, role: "Shiftee" },
    });

    const response = await request(app).get("/api/student");

    expect(response.status).toBe(200);
    expect(response.body.role).toBe("Shiftee");
    expect(response.body.navBtn).toEqual([
      { name: "Shiftee Form", path: "/ShifteeForm" },
    ]);
  });

  it("Returns error for invalid user", async () => {
    axios.get.mockResolvedValue({
      data: { valid: false },
    });

    const response = await request(app).get("/api/student");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("User is not authorized");
  });

  it("Handles API error gracefully", async () => {
    axios.get.mockRejectedValue(new Error("API error"));

    const response = await request(app).get("/api/student");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error fetching student data");
  });
});

module.exports = app;
