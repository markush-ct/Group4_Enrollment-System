const request = require("supertest");
const express = require("express");
const session = require("express-session");
const app = express();

app.use(
  session({
    secret: "test-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.post("/logoutFunction", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.json({ valid: false, message: "Logout failed." });
      }
      res.clearCookie("connect.sid");
      res.clearCookie("rememberMe");
      return res.json({ valid: false, message: "Logout successful." });
    });
  } else {
    return res.json({ valid: false, message: "No active session." });
  }
});

describe("Unit Testing for Log Out Function", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  it("Should successfully log out and destroy session", async () => {
    const agent = request.agent(app);
    await agent.post("/login").send({ username: "user", password: "password" });

    const response = await agent.post("/logoutFunction");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      valid: false,
      message: "Logout successful.",
    });
  });

  it("Should handle error while destroying session", async () => {
    const agent = request.agent(app);

    const spy = jest
      .spyOn(session.Session.prototype, "destroy")
      .mockImplementationOnce((callback) => {
        callback(new Error("Session destruction failed"));
      });

    const response = await agent.post("/logoutFunction");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      valid: false,
      message: "Logout failed.",
    });

    spy.mockRestore();
  });
});

module.exports = app;
