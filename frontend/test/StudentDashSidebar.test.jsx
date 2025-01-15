import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import StudentDashSideBar from "/src/components/StudentDashSideBar";
import axios from "axios";
import logoutFunction from "/src/components/logoutFunction.jsx";

jest.mock("axios");
jest.mock("/src/components/logoutFunction.jsx", () => jest.fn());

describe("Unit Testing for StudentDashSideBar Component", () => {
  let toggleSidebarMock;

  beforeEach(() => {
    toggleSidebarMock = jest.fn();
    axios.get.mockResolvedValue({
      data: { valid: true, name: "User", role: "Student", type: "Regular" },
    });

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  const renderSidebarWithRole = (role) => {
    axios.get.mockResolvedValueOnce({
      data: { valid: true, name: "User", role },
    });

    render(
      <Router>
        <StudentDashSideBar isOpen={true} toggleSidebar={toggleSidebarMock} />
      </Router>
    );
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Renders the CvSU logo", () => {
    renderSidebarWithRole("Student");
    const logo = screen.getByAltText("CVSU Logo");
    expect(logo).toBeInTheDocument();
  });

  test("Renders the university name", () => {
    renderSidebarWithRole("Student");
    const universityName = screen.getByText(
      "CAVITE STATE UNIVERSITY - BACOOR CITY CAMPUS"
    );
    expect(universityName).toBeInTheDocument();
  });

  test("Renders the department name", () => {
    renderSidebarWithRole("Student");
    const departmentName = screen.getByText(/DEPARTMENT OF COMPUTER STUDIES/i);
    expect(departmentName).toBeInTheDocument();
  });

  test("Renders the close button", () => {
    renderSidebarWithRole("Student");
    const closeButton = screen.getByAltText("Close Sidebar");

    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute("src");
  });

  test("Closes sidebar when close button is clicked", () => {
    renderSidebarWithRole("Student");

    const closeButton = screen.getByAltText("Close Sidebar");
    fireEvent.click(closeButton);

    expect(toggleSidebarMock).toHaveBeenCalledTimes(1);
  });

  test("Renders the correct sidebar menu items", async () => {
    renderSidebarWithRole("Regular");

    const dashboard = await screen.findByText(/dashboard/i);
    expect(dashboard).toBeInTheDocument();

    const enrollment = await screen.findByText(/enrollment/i);

    const checklist = await screen.findByText(/checklist/i);

    expect(dashboard).toBeInTheDocument();
    expect(enrollment).toBeInTheDocument();
    expect(checklist).toBeInTheDocument();
  });

  test("Renders icons correctly", () => {
    renderSidebarWithRole("Student");

    const accountSettingsIcon = screen.getByAltText(/account settings/i);
    expect(accountSettingsIcon).toBeInTheDocument();

    const logoutIcon = screen.getByAltText(/log out/i);
    expect(logoutIcon).toBeInTheDocument();
  });

  test("Handles log out functionality", () => {
    renderSidebarWithRole("Regular");

    const logoutButton = screen.getByText("Log Out");
    fireEvent.click(logoutButton);

    expect(logoutFunction).toHaveBeenCalledTimes(1);
  });
});
