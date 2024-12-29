import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateAcc from "/src/pages/CreateAcc";
import styles from "/src/styles/CreateAcc.module.css";
import axios from "axios";
import axiosMock from "axios-mock-adapter";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const mockAxios = new axiosMock(axios);

const mockPrograms = [
  { programID: "1", programName: "Program 1" },
  { programID: "2", programName: "Program 2" },
];

const mockSetValues = jest.fn();

jest.mock("/src/components/Header.jsx", () => ({
  __esModule: true,
  default: ({ SideBar, setSideBar }) => (
    <div>
      <button onClick={() => setSideBar(!SideBar)} aria-label="Toggle Sidebar">
        Toggle Sidebar
      </button>
    </div>
  ),
}));

jest.mock("aos", () => ({
  init: jest.fn(),
}));

describe("Unit Testing for Create Account Page", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation((message) => {
      if (
        message.includes("Warning: An update to") &&
        message.includes("was not wrapped in act(...)")
      ) {
        // Suppress the specific warning related to act
        return;
      }
      // Call the original console.error for all other messages
      console.error(message);
    });
  });

  afterEach(() => {
    console.error.mockRestore(); // Restore original console.error after each test
  });

  beforeEach(() => {
    mockAxios.reset();
  });

  test("Checks AOS animations initialization", () => {
    render(<CreateAcc />);
    expect(require("aos").init).toHaveBeenCalled();
  });

  test("Should apply the background image correctly to the designated section", () => {
    const { container } = render(<CreateAcc />);
    const parallaxSection = container.querySelector(
      '[data-testid="parallax-section"]'
    );
    expect(parallaxSection).not.toBeNull();
    expect(parallaxSection.classList.contains(styles.parallax1)).toBe(true);
  });

  test("Should render components with AOS fade-up animation", async () => {
    const { container } = render(<CreateAcc />);
    await waitFor(() => {
      const aosElements = container.querySelectorAll('[data-aos="fade-up"]');
      expect(aosElements.length).toBeGreaterThan(0);
    });
  });

  test("Renders create Account Page heading correctly", () => {
    render(
      <Router>
        <CreateAcc />
      </Router>
    );
    expect(
      screen.getAllByText(/CAVITE STATE UNIVERSITY/i).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(/DEPARTMENT OF COMPUTER STUDIES/i)
    ).toBeInTheDocument();
  });

  test("Renders 'CREATE ACCOUNT'", () => {
    render(
      <Router>
        <CreateAcc />
      </Router>
    );
    expect(screen.getByText(/CREATE ACCOUNT/i)).toBeInTheDocument();
  });

  test("Renders radio buttons for category", () => {
    render(
      <Router>
        <CreateAcc />
      </Router>
    );
    expect(screen.getByLabelText(/Regular\/Irregular/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Society Officer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Employee/i)).toBeInTheDocument();
  });

  test("Updates state when a category is selected", async () => {
    render(
      <Router>
        <CreateAcc />
      </Router>
    );

    const regIrregRadio = screen.getByLabelText(/Regular\/Irregular/i);
    const socOffRadio = screen.getByLabelText(/Society Officer/i);
    const employeeRadio = screen.getByLabelText(/Employee/i);

    userEvent.click(regIrregRadio);

    expect(regIrregRadio).toBeChecked();
    expect(socOffRadio).not.toBeChecked();
    expect(employeeRadio).not.toBeChecked();

    userEvent.click(socOffRadio);

    await waitFor(() => {
      expect(socOffRadio).toBeChecked();
      expect(employeeRadio).not.toBeChecked();
      expect(regIrregRadio).not.toBeChecked();
    });

    userEvent.click(employeeRadio);

    await waitFor(() => {
      expect(employeeRadio).toBeChecked();
      expect(regIrregRadio).not.toBeChecked();
      expect(socOffRadio).not.toBeChecked();
    });
  });

  test("Fetches Program options in the select dropdown for all categories from API", async () => {
    mockAxios.onGet("http://localhost:8080/programs").reply(200, [
      { programID: 1, programName: "Bachelor of Science in Computer Science" },
      {
        programID: 2,
        programName: "Bachelor of Science in Information Technology",
      },
    ]);

    render(
      <Router>
        <CreateAcc />
      </Router>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Bachelor of Science in Computer Science")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Bachelor of Science in Information Technology")
      ).toBeInTheDocument();
    });
  });

  test("Renders fields for Regular/Irregular category", () => {
    const values = {
      applicantCategory: "Regular/Irregular",
      firstname: "",
      middlename: "",
      lastname: "",
      studentID: "",
      email: "",
      contactnum: "",
      program: "",
      regIrreg: "",
    };

    render(
      <CreateAcc
        values={values}
        setValues={mockSetValues}
        programs={mockPrograms}
      />
    );

    expect(screen.getByTestId("ri-firstname")).toBeInTheDocument();
    expect(screen.getByTestId("ri-middlename")).toBeInTheDocument();
    expect(screen.getByTestId("ri-lastname")).toBeInTheDocument();
    expect(screen.getByTestId("ri-stdID")).toBeInTheDocument();
    expect(screen.getByTestId("ri-email")).toBeInTheDocument();
    expect(screen.getByTestId("ri-contactnum")).toBeInTheDocument();
    expect(screen.getByTestId("ri-program")).toBeInTheDocument();
    expect(screen.getByTestId("ri-regIrreg")).toBeInTheDocument();
  });

  test("Renders fields for Society Officer category", () => {
    render(
      <Router>
        <CreateAcc />
      </Router>
    );

    const societyOfficerRadio = screen.getByLabelText("Society Officer");
    fireEvent.click(societyOfficerRadio);

    const firstnameField = screen.getByTestId("s-firstname");
    const middlenameField = screen.getByTestId("s-middlename");
    const lastnameField = screen.getByTestId("s-lastname");
    const emailField = screen.getByTestId("s-email");
    const contactnumField = screen.getByTestId("s-contactnum");
    const programField = screen.getByTestId("s-program");

    expect(firstnameField).toBeInTheDocument();
    expect(middlenameField).toBeInTheDocument();
    expect(lastnameField).toBeInTheDocument();
    expect(emailField).toBeInTheDocument();
    expect(contactnumField).toBeInTheDocument();
    expect(programField).toBeInTheDocument();
  });

  test("Renders fields for Employee category", () => {
    const values = {
      applicantCategory: "Employee",
      firstname: "",
      middlename: "",
      lastname: "",
      employeeID: "",
      email: "",
      contactnum: "",
      position: "",
      program: "",
    };

    render(
      <CreateAcc
        values={values}
        setValues={mockSetValues}
        programs={mockPrograms}
      />
    );

    fireEvent.click(screen.getByLabelText("Employee"));

    expect(screen.getByTestId("e-firstname")).toBeInTheDocument();
    expect(screen.getByTestId("e-middlename")).toBeInTheDocument();
    expect(screen.getByTestId("e-lastname")).toBeInTheDocument();
    expect(screen.getByTestId("e-empID")).toBeInTheDocument();
    expect(screen.getByTestId("e-email")).toBeInTheDocument();
    expect(screen.getByTestId("e-contactnum")).toBeInTheDocument();
    expect(screen.getByTestId("e-position")).toBeInTheDocument();
  });

  test("Conditionally renders program dropdown for Employee with DCS Head role", () => {
    const values = {
      applicantCategory: "Employee",
      firstname: "",
      middlename: "",
      lastname: "",
      employeeID: "",
      email: "",
      contactnum: "",
      position: "DCS Head",
      program: "",
    };

    render(
      <CreateAcc
        values={values}
        setValues={mockSetValues}
        programs={mockPrograms}
      />
    );

    fireEvent.click(screen.getByLabelText("Employee"));

    const positionDropdown = screen.getByTestId("e-position");
    expect(positionDropdown).toBeInTheDocument();

    fireEvent.change(positionDropdown, { target: { value: "DCS Head" } });

    expect(positionDropdown).toHaveValue("DCS Head");

    expect(screen.getByTestId("e-program")).toBeInTheDocument();
  });

  test("Renders the Register button", () => {
    render(
      <Router>
        <CreateAcc />
      </Router>
    );

    const registerButton = screen.getByRole("button", { name: /register/i });
    expect(registerButton).toBeInTheDocument();
  });

  test("Renders page footer correctly", async () => {
    render(
      <Router>
        <CreateAcc />
      </Router>
    );

    const footers = screen.getAllByTestId("footer-copyright");
    expect(footers.length).toBe(footers.length);
    expect(footers[0]).toHaveTextContent(
      /© Copyright.*Cavite State University.*All Rights Reserved./
    );
    expect(footers[0]).toHaveTextContent(/Designed by BSCS 3-5 Group 4/);
  });

  test("Toggles the sidebar overflow state when the button is clicked", async () => {
    render(
      <Router>
        <CreateAcc />
      </Router>
    );
    const toggleButton = await screen.findByRole("button", {
      name: /Toggle Sidebar/i,
    });
    fireEvent.click(toggleButton);
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(toggleButton);
    expect(document.body.style.overflow).toBe("auto");
  });
});
