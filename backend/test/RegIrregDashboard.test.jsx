const request = require("supertest");
const express = require("express");
const axios = require("axios");

jest.mock("axios");

const app = express();
app.use(express.json());

app.get("/getStudentProgram", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/getStudentProgram");
    if (response.data.program === 1) {
      res.status(200).send({ program: "BSCS" });
    } else if (response.data.program === 2) {
      res.status(200).send({ program: "BSIT" });
    } else {
      res.status(404).send({ message: "Program not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching student program" });
  }
});

app.get("/getEnrollment", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/getEnrollment");
    if (response.data.message === "Enrollment fetched successfully") {
      const enrollmentPeriod = response.data.enrollmentPeriod;
      if (
        enrollmentPeriod.Status === "Pending" ||
        enrollmentPeriod.Status === "Ongoing"
      ) {
        res.status(200).send({ enrollmentStatus: "active", enrollmentPeriod });
      } else {
        res.status(200).send({ enrollmentStatus: "inactive" });
      }
    } else {
      res.status(404).send({ message: "Enrollment not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching enrollment" });
  }
});

app.get("/auth", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080");
    if (response.data.valid) {
      res.status(200).send({ name: response.data.name });
    } else {
      res.status(401).send({ message: "Invalid session" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error validating user session" });
  }
});

app.get("/socFeeProgress", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/socFeeProgress");
    if (response.data.message === "Success") {
      res.status(200).send({ progress: true });
    } else {
      res.status(404).send({ progress: false });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching socFee progress" });
  }
});

app.get("/reqsProgress", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/reqsProgress");
    if (response.data.message === "Success") {
      res.status(200).send({ progress: true });
    } else {
      res.status(404).send({ progress: false });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching requirements progress" });
  }
});

app.get("/adviseProgress", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/adviseProgress");
    if (response.data.message === "Success") {
      res.status(200).send({ progress: true });
    } else {
      res.status(404).send({ progress: false });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching advise progress" });
  }
});

app.get("/preEnrollProgress", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/preEnrollProgress");
    if (response.data.message === "Success") {
      res.status(200).send({ progress: true });
    } else {
      res.status(404).send({ progress: false });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching pre-enrollment progress" });
  }
});

app.get("/enrollStatusProgress", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/enrollStatusProgress"
    );
    if (response.data.message === "Success") {
      res.status(200).send({ progress: true });
    } else {
      res.status(404).send({ progress: false });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching enrollment status progress" });
  }
});

app.get("/getPFP", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/getPFP");
    if (response.data.pfpURL) {
      res.status(200).send({ pfpURL: response.data.pfpURL });
    } else {
      res.status(404).send({ message: "Profile picture not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching profile picture" });
  }
});

describe("Unit Testing for RegIrregDashboard Function", () => {
  describe("For /getStudentProgram", () => {
    it("Should return BSCS when program is 1", async () => {
      axios.get.mockResolvedValue({ data: { program: 1 } });

      const response = await request(app).get("/getStudentProgram");
      expect(response.status).toBe(200);
      expect(response.body.program).toBe("BSCS");
    });

    it("Should return BSIT when program is 2", async () => {
      axios.get.mockResolvedValue({ data: { program: 2 } });

      const response = await request(app).get("/getStudentProgram");
      expect(response.status).toBe(200);
      expect(response.body.program).toBe("BSIT");
    });

    it("Should return 'Program not found' if program is neither 1 nor 2", async () => {
      axios.get.mockResolvedValue({ data: { program: 3 } });

      const response = await request(app).get("/getStudentProgram");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Program not found");
    });

    it("Should return 'Error fetching student program' if there is an error fetching the program", async () => {
      axios.get.mockRejectedValue(new Error("Failed"));

      const response = await request(app).get("/getStudentProgram");
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching student program");
    });
  });

  describe("For /socFeeProgress", () => {
    it("Should return progress true for socFeeProgress", async () => {
      axios.get.mockResolvedValue({ data: { message: "Success" } });

      const response = await request(app).get("/socFeeProgress");
      expect(response.status).toBe(200);
      expect(response.body.progress).toBe(true);
    });

    it("Should return progress false for socFeeProgress when failure", async () => {
      axios.get.mockResolvedValue({ data: { message: "Failure" } });

      const response = await request(app).get("/socFeeProgress");
      expect(response.status).toBe(404);
      expect(response.body.progress).toBe(false);
    });
  });

  describe("For /reqsProgress", () => {
    it("Should return progress true for reqsProgress", async () => {
      axios.get.mockResolvedValue({ data: { message: "Success" } });

      const response = await request(app).get("/reqsProgress");
      expect(response.status).toBe(200);
      expect(response.body.progress).toBe(true);
    });

    it("Should return progress false for reqsProgress when failure", async () => {
      axios.get.mockResolvedValue({ data: { message: "Failure" } });

      const response = await request(app).get("/reqsProgress");
      expect(response.status).toBe(404);
      expect(response.body.progress).toBe(false);
    });
  });

  describe("For /adviseProgress", () => {
    it("Should return progress true for adviseProgress", async () => {
      axios.get.mockResolvedValue({ data: { message: "Success" } });

      const response = await request(app).get("/adviseProgress");
      expect(response.status).toBe(200);
      expect(response.body.progress).toBe(true);
    });

    it("Should return progress false for adviseProgress when failure", async () => {
      axios.get.mockResolvedValue({ data: { message: "Failure" } });

      const response = await request(app).get("/adviseProgress");
      expect(response.status).toBe(404);
      expect(response.body.progress).toBe(false);
    });
  });

  describe("For /preEnrollProgress", () => {
    it("Should return progress true for preEnrollProgress", async () => {
      axios.get.mockResolvedValue({ data: { message: "Success" } });

      const response = await request(app).get("/preEnrollProgress");
      expect(response.status).toBe(200);
      expect(response.body.progress).toBe(true);
    });

    it("Should return progress false for preEnrollProgress when failure", async () => {
      axios.get.mockResolvedValue({ data: { message: "Failure" } });

      const response = await request(app).get("/preEnrollProgress");
      expect(response.status).toBe(404);
      expect(response.body.progress).toBe(false);
    });
  });

  describe("For /enrollStatusProgress", () => {
    it("Should return progress true for enrollStatusProgress", async () => {
      axios.get.mockResolvedValue({ data: { message: "Success" } });

      const response = await request(app).get("/enrollStatusProgress");
      expect(response.status).toBe(200);
      expect(response.body.progress).toBe(true);
    });

    it("Should return progress false for enrollStatusProgress when failure", async () => {
      axios.get.mockResolvedValue({ data: { message: "Failure" } });

      const response = await request(app).get("/enrollStatusProgress");
      expect(response.status).toBe(404);
      expect(response.body.progress).toBe(false);
    });
  });

  describe("For /auth", () => {
    it("Should return correct credentials when session is valid", async () => {
      axios.get.mockResolvedValue({ data: { valid: true, name: "John Doe" } });

      const response = await request(app).get("/auth");
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("John Doe");
    });

    it("Should return 'Invalid session' when session is invalid", async () => {
      axios.get.mockResolvedValue({ data: { valid: false } });

      const response = await request(app).get("/auth");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid session");
    });

    it("Should return 'Error validating user session' if there is an error validating session", async () => {
      axios.get.mockRejectedValue(new Error("Failed"));

      const response = await request(app).get("/auth");
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error validating user session");
    });
  });

  describe("For /getPFP", () => {
    it("Should return the profile picture URL when it exists", async () => {
      axios.get.mockResolvedValue({
        data: { pfpURL: "http://localhost:8080/images/profile.jpg" },
      });

      const response = await request(app).get("/getPFP");
      expect(response.status).toBe(200);
      expect(response.body.pfpURL).toBe(
        "http://localhost:8080/images/profile.jpg"
      );
    });

    it("Should return 'Profile picture not found' if profile picture is not found", async () => {
      axios.get.mockResolvedValue({ data: {} });

      const response = await request(app).get("/getPFP");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Profile picture not found");
    });

    it("Should return 'Error fetching profile picture' if there is an error fetching the profile picture", async () => {
      axios.get.mockRejectedValue(new Error("Error fetching PFP"));

      const response = await request(app).get("/getPFP");
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching profile picture");
    });
  });

  describe("For /getEnrollment", () => {
    it("Should return enrollment status when status is Ongoing", async () => {
      axios.get.mockResolvedValue({
        data: {
          message: "Enrollment fetched successfully",
          enrollmentPeriod: { Status: "Ongoing" },
        },
      });

      const response = await request(app).get("/getEnrollment");
      expect(response.status).toBe(200);
      expect(response.body.enrollmentStatus).toBe("active");
      expect(response.body.enrollmentPeriod.Status).toBe("Ongoing");
    });

    it("Should return enrollment status when status is Closed", async () => {
      axios.get.mockResolvedValue({
        data: {
          message: "Enrollment fetched successfully",
          enrollmentPeriod: { Status: "Closed" },
        },
      });

      const response = await request(app).get("/getEnrollment");
      expect(response.status).toBe(200);
      expect(response.body.enrollmentStatus).toBe("inactive");
    });

    it("Should return 'Enrollment not found' if enrollment not found", async () => {
      axios.get.mockResolvedValue({
        data: { message: "Enrollment not found" },
      });

      const response = await request(app).get("/getEnrollment");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Enrollment not found");
    });

    it("Should return 'Error fetching enrollment' if there is an error fetching enrollment", async () => {
      axios.get.mockRejectedValue(new Error("Failed"));

      const response = await request(app).get("/getEnrollment");
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching enrollment");
    });
  });
});

module.exports = app;
