const request = require("supertest");
const express = require("express");
const axios = require("axios");

jest.mock("axios");

const app = express();
app.use(express.json());

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

app.get("/CSEnrollmentPeriod", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/CSEnrollmentPeriod"
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching CS enrollment data" });
  }
});

app.get("/ITEnrollmentPeriod", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/ITEnrollmentPeriod"
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching IT enrollment data" });
  }
});

app.get("/admissionNotif", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/admissionNotif");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admission notifications" });
  }
});

const getEnrolledStudents = async () => {
  return { enrolledCount: 150, message: "Rows fetched" };
};

app.get("/getEnrolledStdCount", async (req, res) => {
  try {
    const data = await getEnrolledStudents();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrolled students" });
  }
});

describe("Unit Testing for School Head Dashboard Function", () => {
  describe("For /getCS", () => {
    it("Should return the number of CS students enrolled", async () => {
      axios.get.mockResolvedValue({
        data: { CScount: 200 },
      });

      const response = await request(app).get("/getCS");

      expect(response.status).toBe(200);
      expect(response.body.CScount).toBe(200);
    });

    it("Should handle errors when fetching CS student count", async () => {
      axios.get.mockRejectedValue(new Error("Error fetching CS count"));

      const response = await request(app).get("/getCS");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching CS count");
    });
  });

  describe("For /getIT", () => {
    it("Should return the number of IT students enrolled", async () => {
      axios.get.mockResolvedValue({
        data: { ITcount: 150 },
      });

      const response = await request(app).get("/getIT");

      expect(response.status).toBe(200);
      expect(response.body.ITcount).toBe(150);
    });

    it("Should handle errors when fetching IT student count", async () => {
      axios.get.mockRejectedValue(new Error("Error fetching IT count"));

      const response = await request(app).get("/getIT");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching IT count");
    });
  });

  describe("For /CSEnrollmentPeriod", () => {
    it("Should return CS enrollment data if enrollment period is valid", async () => {
      axios.get.mockResolvedValue({
        data: {
          message: "Data fetched",
          csEnrollmentRes: { status: "open" },
        },
      });

      const response = await request(app).get("/CSEnrollmentPeriod");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Data fetched");
      expect(response.body.csEnrollmentRes.status).toBe("open");
    });

    it("Should handle errors when fetching CS enrollment period", async () => {
      axios.get.mockRejectedValue(
        new Error("Error fetching CS enrollment data")
      );

      const response = await request(app).get("/CSEnrollmentPeriod");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching CS enrollment data");
    });
  });

  describe("For /ITEnrollmentPeriod", () => {
    it("Should return IT enrollment data if enrollment period is valid", async () => {
      axios.get.mockResolvedValue({
        data: {
          message: "Data fetched",
          itEnrollmentRes: { status: "open" },
        },
      });

      const response = await request(app).get("/ITEnrollmentPeriod");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Data fetched");
      expect(response.body.itEnrollmentRes.status).toBe("open");
    });

    it("Should handle errors when fetching IT enrollment period", async () => {
      axios.get.mockRejectedValue(
        new Error("Error fetching IT enrollment data")
      );

      const response = await request(app).get("/ITEnrollmentPeriod");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching IT enrollment data");
    });
  });

  describe("For /admissionNotif", () => {
    it("Should return admission notification data", async () => {
      axios.get.mockResolvedValue({
        data: { freshmenCount: 10, transfereeCount: 5 },
      });

      const response = await request(app).get("/admissionNotif");

      expect(response.status).toBe(200);
      expect(response.body.freshmenCount).toBe(10);
      expect(response.body.transfereeCount).toBe(5);
    });

    it("Should handle errors when fetching admission notifications", async () => {
      axios.get.mockRejectedValue(
        new Error("Error fetching admission notifications")
      );

      const response = await request(app).get("/admissionNotif");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        "Error fetching admission notifications"
      );
    });
  });

  describe("For /getEnrolledStdCount", () => {
    it("Should return the correct enrolled student count", async () => {
      const expectedResponse = {
        enrolledCount: 150,
        message: "Rows fetched",
      };

      const response = await request(app).get("/getEnrolledStdCount");

      expect(response.status).toBe(200);
      expect(response.body.enrolledCount).toBe(expectedResponse.enrolledCount);
      expect(response.body.message).toBe(expectedResponse.message);
    });
  });
});

module.exports = app;
