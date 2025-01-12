import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import RegIrregDashboard from "/src/pages/RegIrregDashboard";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";

jest.mock("/src/components/AdminDashHeader.jsx", () => () => (
  <div data-testid="mock-header" />
));

jest.mock("axios");

beforeAll(() => {
  global.console.error = jest.fn();
});

afterAll(() => {
  jest.clearAllMocks();
  global.console.error.mockRestore();
});

describe("Unit Testing for RegIrregDashboard Page", () => {
  test("Renders Header component", () => {
    axios.get.mockResolvedValue({
      data: {
        valid: true,
        role: "Regular",
      },
    });

    render(
      <Router>
        <RegIrregDashboard />
      </Router>
    );

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  });

  test("Should display the correct welcome message and profile picture", () => {
    axios.get.mockResolvedValue({
      data: {
        valid: true,
        role: "Regular",
      },
    });

    render(
      <Router>
        <RegIrregDashboard />
      </Router>
    );

    const profilePic = screen.getByTestId("pfp");
    expect(profilePic).toBeInTheDocument();

    const welcomeMessage = screen.getByTestId("welcome-message");
    expect(welcomeMessage).toBeInTheDocument();
  });

  test("Should display the correct society section", () => {
    axios.get.mockResolvedValue({
      data: {
        valid: true,
        role: "Regular",
      },
    });

    render(
      <Router>
        <RegIrregDashboard />
      </Router>
    );

    const society = screen.getAllByTestId("society-section")[0];
    expect(society).toBeInTheDocument();

    const logo = screen.getByTestId("logo");
    expect(logo).toBeInTheDocument();

    const societyName = screen.getByText("Information Technology Society");
    expect(societyName).toBeInTheDocument();
  });

  test("Should show enrollment status and details card", () => {
    axios.get.mockResolvedValue({
      data: {
        valid: true,
        role: "Regular",
      },
    });

    render(
      <Router>
        <RegIrregDashboard />
      </Router>
    );

    const enrollmentDeets = screen.getByTestId("enrollment-details");
    expect(enrollmentDeets).toBeInTheDocument();
  });

  test("Should render class schedule card", () => {
    axios.get.mockResolvedValue({
      data: {
        valid: true,
        role: "Regular",
      },
    });

    render(
      <Router>
        <RegIrregDashboard />
      </Router>
    );

    const classSched = screen.getByTestId("link-section");
    expect(classSched).toBeInTheDocument();
  });

  test("Should navigate to class schedule page when the link is clicked", () => {
    axios.get.mockResolvedValue({
      data: {
        valid: true,
        role: "Regular",
      },
    });

    render(
      <Router>
        <RegIrregDashboard />
      </Router>
    );

    const link = screen.getByTestId("class-schedule-link");
    fireEvent.click(link);
    expect(link.closest("a")).toHaveAttribute("href", "/ClassSchedule");
  });
});
