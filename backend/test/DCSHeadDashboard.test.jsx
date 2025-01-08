const request = require("supertest");
const express = require("express");
const axios = require("axios");

jest.mock("axios");

const app = express();
app.use(express.json());

app.get("/DCSHeadProgram", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/DCSHeadProgram");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching program" });
  }
});

app.get("/getCS", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/getCS");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching CS count" });
  }
});

app.get("/getIT", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/getIT");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching IT count" });
  }
});

app.get("/getTotalShiftingReq", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/getTotalShiftingReq"
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shifting request count" });
  }
});

app.get("/dcsViewEnrollment", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/dcsViewEnrollment");
    if (
      response.data.enrollmentPeriod.Status === "Pending" ||
      response.data.enrollmentPeriod.Status === "Ongoing"
    ) {
      res.status(200).json(response.data);
    } else {
      res.status(200).json({ message: "Enrollment period is not ongoing" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollment data" });
  }
});

describe("Unit Testing for DCS Head Dashboard Function", () => {
  describe("For /DCSHeadProgram", () => {
    it("Should return the program data", async () => {
      axios.get.mockResolvedValue({
        data: { program: "Bachelor of Science in Computer Science" },
      });

      const response = await request(app).get("/DCSHeadProgram");

      expect(response.status).toBe(200);
      expect(response.body.program).toBe(
        "Bachelor of Science in Computer Science"
      );

      axios.get.mockResolvedValue({
        data: { program: "Bachelor of Science in Information Technology" },
      });

      const response2 = await request(app).get("/DCSHeadProgram");

      expect(response2.status).toBe(200);
      expect(response2.body.program).toBe(
        "Bachelor of Science in Information Technology"
      );
    });

    it("Should handle errors correctly", async () => {
      axios.get.mockRejectedValue(new Error("Error fetching program"));

      const response = await request(app).get("/DCSHeadProgram");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching program");
    });
  });

  describe("For /getCS", () => {
    it("Should return the CS student count", async () => {
      axios.get.mockResolvedValue({
        data: { CScount: 200 },
      });

      const response = await request(app).get("/getCS");

      expect(response.status).toBe(200);
      expect(response.body.CScount).toBe(200);
    });

    it("Should handle errors correctly", async () => {
      axios.get.mockRejectedValue(new Error("Error fetching CS count"));

      const response = await request(app).get("/getCS");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching CS count");
    });
  });

  describe("For /getIT", () => {
    it("Should return the IT student count", async () => {
      axios.get.mockResolvedValue({
        data: { ITcount: 150 },
      });

      const response = await request(app).get("/getIT");

      expect(response.status).toBe(200);
      expect(response.body.ITcount).toBe(150);
    });

    it("Should handle errors correctly", async () => {
      axios.get.mockRejectedValue(new Error("Error fetching IT count"));

      const response = await request(app).get("/getIT");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching IT count");
    });
  });

  describe("For /getTotalShiftingReq", () => {
    it("Should return the total shifting requests count", async () => {
      axios.get.mockResolvedValue({
        data: { shiftingReqCount: 50 },
      });

      const response = await request(app).get("/getTotalShiftingReq");

      expect(response.status).toBe(200);
      expect(response.body.shiftingReqCount).toBe(50);
    });

    it("Should handle errors correctly", async () => {
      axios.get.mockRejectedValue(
        new Error("Error fetching shifting request count")
      );

      const response = await request(app).get("/getTotalShiftingReq");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        "Error fetching shifting request count"
      );
    });
  });

  describe("For /dcsViewEnrollment", () => {
    it("Should return enrollment period if status is Pending or Ongoing", async () => {
      axios.get.mockResolvedValue({
        data: {
          message: "Enrollment fetched successfully",
          enrollmentPeriod: { Status: "Ongoing" },
        },
      });

      const response = await request(app).get("/dcsViewEnrollment");

      expect(response.status).toBe(200);
      expect(response.body.enrollmentPeriod.Status).toBe("Ongoing");
    });

    it("Should handle errors correctly", async () => {
      axios.get.mockRejectedValue(new Error("Error fetching enrollment data"));

      const response = await request(app).get("/dcsViewEnrollment");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching enrollment data");
    });

    it("Should handle unexpected status in enrollment", async () => {
      axios.get.mockResolvedValue({
        data: {
          message: "Enrollment fetched successfully",
          enrollmentPeriod: { Status: "Closed" },
        },
      });

      const response = await request(app).get("/dcsViewEnrollment");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Enrollment period is not ongoing");
    });
  });
});

module.exports = app;
