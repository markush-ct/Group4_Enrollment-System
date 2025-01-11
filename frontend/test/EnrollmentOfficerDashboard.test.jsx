import React from "react";
import { render, screen } from "@testing-library/react";
import EnrollmentOfficerDashboard from "/src/pages/EnrollmentOfficerDashboard";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("/src/components/AdminDashHeader.jsx", () => () => (
  <div data-testid="mock-header" />
));

beforeAll(() => {
  global.console.error = jest.fn();
});

afterAll(() => {
  jest.clearAllMocks();
  global.console.error.mockRestore();
});

describe("Unit Testing for Enrollment Officer Dashboard Page", () => {
  test("Renders Header component", () => {
    render(
      <Router>
        <EnrollmentOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  });

  test("Should render the name", () => {
    render(
      <Router>
        <EnrollmentOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("name-section")).toBeInTheDocument();
  });

  test("Should display the logo", () => {
    render(
      <Router>
        <EnrollmentOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  test("Should render the 'Total Enrolled' card", () => {
    render(
      <Router>
        <EnrollmentOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("total-enrolled-card")).toBeInTheDocument();
  });

  test("Should render the 'Account Request' card", () => {
    render(
      <Router>
        <EnrollmentOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("account-request-card")).toBeInTheDocument();
  });

  test("Should render the 'Total DCS Students' stats", () => {
    render(
      <Router>
        <EnrollmentOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("total-dcs-students")).toBeInTheDocument();
  });

  test("Should render the 'Computer Science' stats", () => {
    render(
      <Router>
        <EnrollmentOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("cs-stats")).toBeInTheDocument();
  });

  test("Should render the 'Information Technology' stats", () => {
    render(
      <Router>
        <EnrollmentOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("it-stats")).toBeInTheDocument();
  });

  test("Should render the 'DCS Population Per Program' text", () => {
    render(
      <Router>
        <EnrollmentOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("donut-text")).toBeInTheDocument();
  });

  test("Should render the donut chart", () => {
    render(
      <Router>
        <EnrollmentOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("donut-chart")).toBeInTheDocument();
  });
});
