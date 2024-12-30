import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import SignUp from "/src/pages/SignUp";
import styles from "/src/styles/SignUp.module.css";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import axiosMock from "axios-mock-adapter";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

const mockAxios = new axiosMock(axios);

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

describe("Unit Testing for Sign Up Page", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation((message) => {
      if (
        message.includes("Warning: An update to") &&
        message.includes("was not wrapped in act(...)")
      ) {
        return;
      }
      console.error(message);
    });
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    mockAxios.reset();
  });

  test("Checks AOS animations initialization", () => {
    render(<SignUp />);
    expect(require("aos").init).toHaveBeenCalled();
  });

  test("Should apply the background image correctly to the designated section", () => {
    const { container } = render(<SignUp />);
    const parallaxSection = container.querySelector(
      '[data-testid="parallax-section"]'
    );
    expect(parallaxSection).not.toBeNull();
    expect(parallaxSection.classList.contains(styles.parallax1)).toBe(true);
  });

  test("Should render components with AOS fade-up animation", async () => {
    const { container } = render(<SignUp />);
    await waitFor(() => {
      const aosElements = container.querySelectorAll('[data-aos="fade-up"]');
      expect(aosElements.length).toBeGreaterThan(0);
    });
  });

  test("Renders Sign Up Page heading correctly", () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );
    expect(
      screen.getAllByText(/CAVITE STATE UNIVERSITY/i).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(/DEPARTMENT OF COMPUTER STUDIES/i)
    ).toBeInTheDocument();
  });

  test("Renders 'APPLICANT SIGN UP'", () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );
    expect(screen.getByText(/APPLICANT SIGN UP/i)).toBeInTheDocument();
  });

  test("Renders radio buttons for applicant category", () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );
    expect(screen.getByLabelText(/Freshman/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Transferee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Shiftee/i)).toBeInTheDocument();
  });

  test("Updates state when an applicant category is selected", async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    const freshmanRadio = screen.getByLabelText(/Freshman/i);
    const transfereeRadio = screen.getByLabelText(/Transferee/i);
    const shifteeRadio = screen.getByLabelText(/Shiftee/i);

    userEvent.click(freshmanRadio);

    expect(freshmanRadio).toBeChecked();
    expect(transfereeRadio).not.toBeChecked();
    expect(shifteeRadio).not.toBeChecked();

    userEvent.click(transfereeRadio);

    await waitFor(() => {
      expect(transfereeRadio).toBeChecked();
      expect(freshmanRadio).not.toBeChecked();
      expect(shifteeRadio).not.toBeChecked();
    });

    userEvent.click(shifteeRadio);

    await waitFor(() => {
      expect(shifteeRadio).toBeChecked();
      expect(freshmanRadio).not.toBeChecked();
      expect(transfereeRadio).not.toBeChecked();
    });
  });

  test("Renders all fields based on selected applicant category", async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    userEvent.click(screen.getByLabelText(/Freshman/i));

    await waitFor(() => {
      expect(screen.getByTestId("f-firstname")).toBeInTheDocument();
      expect(screen.getByTestId("f-middlename")).toBeInTheDocument();
      expect(screen.getByTestId("f-lastname")).toBeInTheDocument();
      expect(screen.getByTestId("f-lastschoolattended")).toBeInTheDocument();
      expect(screen.getByTestId("f-email")).toBeInTheDocument();
      expect(screen.getByTestId("f-contactnum")).toBeInTheDocument();
      expect(screen.getByTestId("f-preferredProgram")).toBeInTheDocument();
    });

    userEvent.click(screen.getByLabelText(/Transferee/i));

    await waitFor(() => {
      expect(screen.getByTestId("t-firstname")).toBeInTheDocument();
      expect(screen.getByTestId("t-middlename")).toBeInTheDocument();
      expect(screen.getByTestId("t-lastname")).toBeInTheDocument();
      expect(screen.getByTestId("t-lastschoolattended")).toBeInTheDocument();
      expect(screen.getByTestId("t-email")).toBeInTheDocument();
      expect(screen.getByTestId("t-contactnum")).toBeInTheDocument();
      expect(screen.getByTestId("t-preferredProgram")).toBeInTheDocument();
    });

    userEvent.click(screen.getByLabelText(/Shiftee/i));

    await waitFor(() => {
      expect(screen.getByTestId("s-firstname")).toBeInTheDocument();
      expect(screen.getByTestId("s-middlename")).toBeInTheDocument();
      expect(screen.getByTestId("s-lastname")).toBeInTheDocument();
      expect(screen.getByTestId("s-stdID")).toBeInTheDocument();
      expect(screen.getByTestId("s-prevProgram")).toBeInTheDocument();
      expect(screen.getByTestId("s-year")).toBeInTheDocument();
      expect(screen.getByTestId("s-email")).toBeInTheDocument();
      expect(screen.getByTestId("s-contactnum")).toBeInTheDocument();
      expect(screen.getByTestId("s-preferredProgram")).toBeInTheDocument();
    });
  });

  test("Fetches Academic Preference options in the select dropdown for all categories from API", async () => {
    mockAxios.onGet("http://localhost:8080/programs").reply(200, [
      { programID: 1, programName: "Bachelor of Science in Computer Science" },
      {
        programID: 2,
        programName: "Bachelor of Science in Information Technology",
      },
    ]);

    render(
      <Router>
        <SignUp />
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

  test("Shows validation error when required fields are empty for Freshman category", async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    const submitButton = screen.getByTestId("register-button");
    fireEvent.click(submitButton);

    const firstnameField = screen.getByTestId("f-firstname");
    const lastnameField = screen.getByTestId("f-lastname");
    const schoolField = screen.getByTestId("f-lastschoolattended");
    const emailField = screen.getByTestId("f-email");
    const contactnumField = screen.getByTestId("f-contactnum");
    const programField = screen.getByTestId("f-preferredProgram");

    expect(firstnameField).toHaveAttribute("required");
    expect(lastnameField).toHaveAttribute("required");
    expect(schoolField).toHaveAttribute("required");
    expect(emailField).toHaveAttribute("required");
    expect(contactnumField).toHaveAttribute("required");
    expect(programField).toHaveAttribute("required");
  });

  test("Shows validation error when required fields are empty for Transferee category", async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    const submitButton = screen.getByTestId("register-button");
    fireEvent.click(submitButton);

    fireEvent.click(screen.getByLabelText("Transferee"));

    const firstnameField = screen.getByTestId("t-firstname");
    const lastnameField = screen.getByTestId("t-lastname");
    const schoolField = screen.getByTestId("t-lastschoolattended");
    const emailField = screen.getByTestId("t-email");
    const contactnumField = screen.getByTestId("t-contactnum");
    const programField = screen.getByTestId("t-preferredProgram");

    expect(firstnameField).toHaveAttribute("required");
    expect(lastnameField).toHaveAttribute("required");
    expect(schoolField).toHaveAttribute("required");
    expect(emailField).toHaveAttribute("required");
    expect(contactnumField).toHaveAttribute("required");
    expect(programField).toHaveAttribute("required");
  });

  test("Shows validation error when required fields are empty for Shiftee category", async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    fireEvent.click(screen.getByLabelText("Shiftee"));

    const submitButton = screen.getByTestId("register-button");
    fireEvent.click(submitButton);

    const firstnameField = screen.getByTestId("s-firstname");
    const lastnameField = screen.getByTestId("s-lastname");
    const studentIDField = screen.getByTestId("s-stdID");
    const prevProgramField = screen.getByTestId("s-prevProgram");
    const yearField = screen.getByTestId("s-year");
    const emailField = screen.getByTestId("s-email");
    const contactnumField = screen.getByTestId("s-contactnum");
    const programField = screen.getByTestId("s-preferredProgram");

    expect(firstnameField).toHaveAttribute("required");
    expect(lastnameField).toHaveAttribute("required");
    expect(studentIDField).toHaveAttribute("required");
    expect(prevProgramField).toHaveAttribute("required");
    expect(yearField).toHaveAttribute("required");
    expect(emailField).toHaveAttribute("required");
    expect(contactnumField).toHaveAttribute("required");
    expect(programField).toHaveAttribute("required");
  });

  test("Renders the Register button", () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    const registerButton = screen.getByRole("button", { name: /register/i });
    expect(registerButton).toBeInTheDocument();
  });

  test("Renders page footer correctly", async () => {
    render(
      <Router>
        <SignUp />
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
        <SignUp />
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
