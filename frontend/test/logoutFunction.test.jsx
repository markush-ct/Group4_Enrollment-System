import axios from "axios";
import "jest-localstorage-mock";
import logoutFunction from "/src/components/logoutFunction";

jest.mock("axios");

const navigate = jest.fn();

beforeEach(() => {
  global.localStorage = {
    removeItem: jest.fn(),
    setItem: jest.fn(),
    getItem: jest.fn(),
    clear: jest.fn(),
  };

  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
  console.log.mockRestore();
  console.error.mockRestore();
});

describe("Unit Testing for Log Out", () => {
  test("Should successfully log out and navigate to Login Page", async () => {
    axios.post.mockResolvedValue({
      data: { message: "Logged out successfully" },
    });

    await logoutFunction(navigate);

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8080/logoutFunction",
      {},
      { withCredentials: true }
    );

    expect(localStorage.removeItem).toHaveBeenCalledWith("authToken");

    expect(navigate).toHaveBeenCalledWith("/LoginPage");
  });

  test("Should handle errors during log out and not navigate", async () => {
    axios.post.mockRejectedValue(new Error("Error logging out"));

    await logoutFunction(navigate);

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8080/logoutFunction",
      {},
      { withCredentials: true }
    );

    expect(localStorage.removeItem).not.toHaveBeenCalled();

    expect(navigate).not.toHaveBeenCalled();
  });
});
