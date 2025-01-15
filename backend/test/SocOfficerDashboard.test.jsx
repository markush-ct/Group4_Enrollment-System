const request = require("supertest");
const express = require("express");
const axios = require("axios");

jest.mock("axios");

const app = express();
app.use(express.json());

app.get("/getPFP", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/getPFP");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile picture" });
  }
});

app.get("/socOfficerProgram", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/socOfficerProgram");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching program details" });
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

app.post("/postEnrollmentPeriod", async (req, res) => {
  const { start, end, status } = req.body;
  try {
    const response = await axios.post(
      "http://localhost:8080/postEnrollmentPeriod",
      { start, end, status }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error posting enrollment period" });
  }
});

app.get("/viewEnrollmentPeriod", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/viewEnrollmentPeriod"
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollment period" });
  }
});

app.post("/startEnrollment", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:8080/startEnrollment");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error starting enrollment" });
  }
});

app.post("/finishEnrollment", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:8080/finishEnrollment");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error finishing enrollment" });
  }
});

describe("Unit Testing for Society Officer Dashboard Function", () => {
  describe("For /getPFP", () => {
    it("Should return profile picture URL", async () => {
      axios.get.mockResolvedValue({ data: { pfpURL: "profilepic.jpg" } });

      const response = await request(app).get("/getPFP");

      expect(response.status).toBe(200);
      expect(response.body.pfpURL).toBe("profilepic.jpg");
    });

    it("Should handle error when fetching profile picture", async () => {
      axios.get.mockRejectedValue(new Error("Error fetching profile picture"));

      const response = await request(app).get("/getPFP");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching profile picture");
    });
  });

  describe("For /socOfficerProgram", () => {
    it("Should return SOC officer program details", async () => {
      axios.get.mockResolvedValue({
        data: { program: { name: "Tech Program" } },
      });

      const response = await request(app).get("/socOfficerProgram");

      expect(response.status).toBe(200);
      expect(response.body.program.name).toBe("Tech Program");
    });

    it("Should handle error when fetching program details", async () => {
      axios.get.mockRejectedValue(new Error("Error fetching program details"));

      const response = await request(app).get("/socOfficerProgram");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching program details");
    });
  });

  describe("For /getCS", () => {
    it("Should return CS student count", async () => {
      axios.get.mockResolvedValue({ data: { CScount: 200 } });

      const response = await request(app).get("/getCS");

      expect(response.status).toBe(200);
      expect(response.body.CScount).toBe(200);
    });

    it("Should handle error when fetching CS student count", async () => {
      axios.get.mockRejectedValue(new Error("Error fetching CS count"));

      const response = await request(app).get("/getCS");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching CS count");
    });
  });

  describe("For /getIT", () => {
    it("Should return IT student count", async () => {
      axios.get.mockResolvedValue({ data: { ITcount: 150 } });

      const response = await request(app).get("/getIT");

      expect(response.status).toBe(200);
      expect(response.body.ITcount).toBe(150);
    });

    it("Should handle error when fetching IT student count", async () => {
      axios.get.mockRejectedValue(new Error("Error fetching IT count"));

      const response = await request(app).get("/getIT");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching IT count");
    });
  });

  describe("For /postEnrollmentPeriod", () => {
    it("Should post a new enrollment period", async () => {
      const enrollmentData = {
        start: "2025-01-01",
        end: "2025-02-01",
        status: "Pending",
      };

      axios.post.mockResolvedValue({
        data: { message: "Enrollment period posted successfully." },
      });

      const response = await request(app)
        .post("/postEnrollmentPeriod")
        .send(enrollmentData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Enrollment period posted successfully."
      );
    });

    it("Should handle error when posting enrollment period", async () => {
      const enrollmentData = {
        start: "2025-01-01",
        end: "2025-02-01",
        status: "Pending",
      };

      axios.post.mockRejectedValue(
        new Error("Error posting enrollment period")
      );

      const response = await request(app)
        .post("/postEnrollmentPeriod")
        .send(enrollmentData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error posting enrollment period");
    });
  });

  describe("For /startEnrollment", () => {
    it("Should start the enrollment period", async () => {
      axios.post.mockResolvedValue({
        data: { message: "Enrollment is now ongoing" },
      });

      const response = await request(app).post("/startEnrollment");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Enrollment is now ongoing");
    });

    it("Should handle error when starting enrollment", async () => {
      axios.post.mockRejectedValue(new Error("Error starting enrollment"));

      const response = await request(app).post("/startEnrollment");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error starting enrollment");
    });
  });

  describe("For /finishEnrollment", () => {
    it("Should finish the enrollment period", async () => {
      axios.post.mockResolvedValue({ data: { message: "Enrollment ended" } });

      const response = await request(app).post("/finishEnrollment");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Enrollment ended");
    });

    it("Should handle error when finishing enrollment", async () => {
      axios.post.mockRejectedValue(new Error("Error finishing enrollment"));

      const response = await request(app).post("/finishEnrollment");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error finishing enrollment");
    });
  });

  describe("For /viewEnrollmentPeriod", () => {
    it("Should return enrollment period details", async () => {
      axios.get.mockResolvedValue({
        data: {
          enrollmentPeriod: {
            Start: "2025-01-01",
            End: "2025-02-01",
            Status: "Pending",
          },
        },
      });

      const response = await request(app).get("/viewEnrollmentPeriod");

      expect(response.status).toBe(200);
      expect(response.body.enrollmentPeriod.Start).toBe("2025-01-01");
      expect(response.body.enrollmentPeriod.End).toBe("2025-02-01");
      expect(response.body.enrollmentPeriod.Status).toBe("Pending");
    });

    it("Should handle error when fetching enrollment period", async () => {
      axios.get.mockRejectedValue(
        new Error("Error fetching enrollment period")
      );

      const response = await request(app).get("/viewEnrollmentPeriod");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching enrollment period");
    });
  });
});

module.exports = app;
