import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import StudentDashHeader from "/src/components/StudentDashHeader";
import "@testing-library/jest-dom";
import axios from "axios";

jest.mock("axios");

jest.mock("/src/components/StudentDashSideBar", () => ({
  __esModule: true,
  default: ({ isOpen }) => (
    <div>{isOpen ? "Sidebar Open" : "Sidebar Closed"}</div>
  ),
}));

describe("Unit Testing for StudentDashHeader Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({
      data: { valid: true, name: "Jennie Kim", role: "Enrollment Officer" },
    });

    axios.get.mockResolvedValueOnce({
      data: { uploadPFP: "profile-image.jpg" },
    });

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Menu button has correct src attribute", () => {
    render(
      <Router>
        <StudentDashHeader />
      </Router>
    );

    const menuIcon = screen.getByAltText("Menu");
    expect(menuIcon).toBeInTheDocument();
    expect(menuIcon).toHaveAttribute("src", "/src/assets/menu-button.png");
  });

  test("Sidebar toggles on menu button click", () => {
    render(
      <Router>
        <StudentDashHeader />
      </Router>
    );

    const menuButton = screen.getByRole("button");
    expect(menuButton).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(screen.getByText("Sidebar Open")).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(screen.getByText("Sidebar Closed")).toBeInTheDocument();
  });

  test("Renders the profile image correctly", async () => {
    render(
      <Router>
        <StudentDashHeader />
      </Router>
    );

    await waitFor(() => {
      const profileImage = screen.getByAltText("Profile");
      expect(profileImage).toHaveAttribute(
        "src",
        "http://localhost:8080/profile-image.jpg"
      );
    });
  });

  test("Profile name and role display correctly", async () => {
    render(
      <Router>
        <StudentDashHeader />
      </Router>
    );

    const profileName = await screen.findByText("Jennie Kim");
    expect(profileName).toBeInTheDocument();

    const profileRole = await screen.findByText("Enrollment Officer");
    expect(profileRole).toBeInTheDocument();
  });

  test("Navigates to Account Settings page when profile image is clicked", () => {
    render(
      <Router>
        <StudentDashHeader />
      </Router>
    );

    const profileImage = screen.getByAltText("Profile");
    fireEvent.click(profileImage);

    expect(window.location.pathname).toBe("/AccountSettingsStudent");
  });
});
