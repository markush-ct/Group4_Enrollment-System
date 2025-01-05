import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AdminDashSideBar from "/src/components/AdminDashSideBar";
import axios from "axios";

import logoutFunction from "/src/components/logoutFunction.jsx";

jest.mock("axios");

jest.mock("/src/components/logoutFunction.jsx", () => jest.fn());

describe("Unit Testing for AdminDashSideBar Component", () => {
  let toggleSidebarMock;

  beforeEach(() => {
    toggleSidebarMock = jest.fn();
    axios.get.mockResolvedValue({
      data: { valid: true, name: "User", role: "Enrollment Officer" },
    });

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  const renderSidebarWithRole = (role) => {
    axios.get.mockResolvedValueOnce({
      data: { valid: true, name: "User", role },
    });

    render(
      <Router>
        <AdminDashSideBar isOpen={true} toggleSidebar={toggleSidebarMock} />
      </Router>
    );
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Renders the CvSU logo", () => {
    renderSidebarWithRole("Enrollment Officer");
    const logo = screen.getByAltText("cvsu logo");
    expect(logo).toBeInTheDocument();
  });

  test("Renders the university name", () => {
    renderSidebarWithRole("Enrollment Officer");
    const universityName = screen.getByText(
      "CAVITE STATE UNIVERSITY - BACOOR CITY CAMPUS"
    );
    expect(universityName).toBeInTheDocument();
  });

  test("Renders the department name", () => {
    renderSidebarWithRole("Enrollment Officer");
    const departmentName = screen.getByText(/DEPARTMENT OF COMPUTER STUDIES/i);
    expect(departmentName).toBeInTheDocument();
  });

  test("Renders the close button", () => {
    renderSidebarWithRole("Enrollment Officer");
    const closeButton = screen.getByAltText("Close Sidebar");

    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute("src");
  });

  test("Closes sidebar when close button is clicked", () => {
    renderSidebarWithRole("Enrollment Officer");

    const closeButton = screen.getByAltText("Close Sidebar");
    fireEvent.click(closeButton);

    expect(toggleSidebarMock).toHaveBeenCalledTimes(1);
  });

  test("Renders the correct sidebar menu items", async () => {
    renderSidebarWithRole("Enrollment Officer");

    const dashboard = await screen.findByText("Dashboard");
    expect(dashboard).toBeInTheDocument();

    const accountRequest = await screen.findByText("Account Request");
    const enrollment = await screen.findByText("Enrollment");
    const accountmanagement = await screen.findByText("Account Management");

    expect(accountRequest).toBeInTheDocument();
    expect(enrollment).toBeInTheDocument();
    expect(accountmanagement).toBeInTheDocument();
  });

  test("Renders icons correctly", () => {
    renderSidebarWithRole("Enrollment Officer");

    const accountSettingsIcon = screen.getByAltText(/account settings/i);
    expect(accountSettingsIcon).toBeInTheDocument();

    const logoutIcon = screen.getByAltText(/log out/i);
    expect(logoutIcon).toBeInTheDocument();
  });

  test("Sidebar links navigate correctly", async () => {
    renderSidebarWithRole("Enrollment Officer");

    const menuItems = [
      {
        name: "Dashboard",
        path: "/EnrollmentOfficerDashboard",
      },
      {
        name: "Account Request",
        path: "/AccountRequest",
      },
      {
        name: "Enrollment",
        path: "/AdminEnrollment",
      },
      {
        name: "Account Management",
        path: "/AccountManagement",
      },
      {
        name: "Account Settings",
        path: "/AccountSettings",
      },
    ];

    const accountSettingsLink = await screen.findByText("Account Settings");
    fireEvent.click(accountSettingsLink);
    expect(window.location.pathname).toBe("/AccountSettings");

    for (const { name, path } of menuItems) {
      if (name !== "Account Settings") {
        const link = await screen.findByText(name);
        fireEvent.click(link);
        expect(window.location.pathname).toBe(path);
      }
    }
  });

  test("Handles log out functionality", () => {
    renderSidebarWithRole("Enrollment Officer");

    const logoutButton = screen.getByText("Log Out");
    fireEvent.click(logoutButton);

    expect(logoutFunction).toHaveBeenCalledTimes(1);
  });
});
