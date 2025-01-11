import React from "react";
import { render, screen } from "@testing-library/react";
import SocOfficerDashboard from "/src/pages/SocOfficerDashboard";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import SchoolHeadDashboard from "../src/pages/SchoolHeadDashboard";

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

describe("Unit Testing for Society Officer Dashboard Page", () => {
  test("Renders Header component", () => {
    render(
      <Router>
        <SocOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  });

  test("Should render the profile picture", () => {
    render(
      <Router>
        <SocOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("greeting-text")).toBeInTheDocument();
  });

  test("Should render the name", () => {
    render(
      <Router>
        <SocOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("greeting-text")).toBeInTheDocument();
  });

  test("Should display the logo", () => {
    render(
      <Router>
        <SocOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  test("Should render the 'Total DCS Students' stats", () => {
    render(
      <Router>
        <SocOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("total-dcs-students")).toBeInTheDocument();
  });

  test("Should render the 'Computer Science' stats", () => {
    render(
      <Router>
        <SocOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("cs-stats")).toBeInTheDocument();
  });

  test("Should render the 'Information Technology' stats", () => {
    render(
      <Router>
        <SocOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("it-stats")).toBeInTheDocument();
  });

  test("Should render the enrollment period schedule", () => {
    render(
      <Router>
        <SocOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("enrollment-period")).toBeInTheDocument();
  });

  test("Should render the 'DCS Population Per Program' text", () => {
    render(
      <Router>
        <SocOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("donut-text")).toBeInTheDocument();
  });

  test("Should render the donut chart", () => {
    render(
      <Router>
        <SocOfficerDashboard />
      </Router>
    );

    expect(screen.getByTestId("donut-chart")).toBeInTheDocument();
  });
});
