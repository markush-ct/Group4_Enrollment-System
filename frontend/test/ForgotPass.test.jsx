import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgotPass from "/src/pages/ForgotPass";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

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
  refresh: jest.fn(),
}));

describe("Unit Testing for Forgot Password Page", () => {
  test("Checks AOS animations initialization", () => {
    render(
      <Router>
        <ForgotPass />
      </Router>
    );
    expect(require("aos").init).toHaveBeenCalled();
  });

  test("Should render component with AOS fade-up animation", async () => {
    const { container } = render(
      <Router>
        <ForgotPass />
      </Router>
    );
    await waitFor(() => {
      const aosElements = container.querySelectorAll('[data-aos="fade-up"]');
      expect(aosElements.length).toBeGreaterThan(0);
    });
  });

  test("Renders the lock icon image with correct src and alt attributes", () => {
    render(
      <Router>
        <ForgotPass />
      </Router>
    );
    const lockIconImg = screen.getByAltText("Lock Icon");
    expect(lockIconImg).toBeInTheDocument();
    expect(lockIconImg).toHaveAttribute("src", "/src/assets/reset-pwlogo.svg");
  });

  test("Renders reset password form with input and button", () => {
    render(
      <Router>
        <ForgotPass />
      </Router>
    );
    expect(screen.getByText("Trouble Logging In?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter your email and we will send you a link to reset your password."
      )
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(screen.getByText("Back to Log In")).toBeInTheDocument();
  });

  test('Navigates to Login page when "Back to Log In" link is clicked', () => {
    render(
      <Router>
        <ForgotPass />
      </Router>
    );
    const backToLoginLink = screen.getByText("Back to Log In");
    fireEvent.click(backToLoginLink);
    expect(window.location.pathname).toBe("/LoginPage");
  });

  test("Should allow the user to input an email", () => {
    render(
      <Router>
        <ForgotPass />
      </Router>
    );
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");
  });

  test("Should send pin code when valid email is entered", async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: "Verification code sent" },
    });
    render(
      <Router>
        <ForgotPass />
      </Router>
    );
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    const resetButton = screen.getByText(/reset password/i);
    fireEvent.click(resetButton);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:8080/sendPin", {
        email: "test@example.com",
      });
      expect(
        screen.getByText(/Enter Verification Code sent to your Email/i)
      ).toBeInTheDocument();
    });
  });

  test("Should show error message if email does not exist", async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: "Email doesn't exist" },
    });
    render(
      <Router>
        <ForgotPass />
      </Router>
    );
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    fireEvent.change(emailInput, {
      target: { value: "nonexistent@example.com" },
    });
    const resetButton = screen.getByText(/reset password/i);
    fireEvent.click(resetButton);
    await waitFor(() => {
      expect(screen.getByText(/Email doesn't exist/i)).toBeInTheDocument();
    });
  });

  test("Should show error message when email is empty", async () => {
    render(
      <Router>
        <ForgotPass />
      </Router>
    );
    const emailInput = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.click(screen.getByText("Reset Password"));
    await waitFor(() => {
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
    });
  });

  test("Closes error popup when close button is clicked", async () => {
    render(
      <Router>
        <ForgotPass />
      </Router>
    );

    fireEvent.click(screen.getByText("Reset Password"));

    const errorPopup = await screen.findByText("Error");
    expect(errorPopup).toBeInTheDocument();

    const closeButton = screen.getByText("×");

    fireEvent.click(closeButton);

    expect(screen.queryByText("Error")).toBeNull();
  });

  test("Toggles the sidebar overflow state when the button is clicked", async () => {
    render(
      <Router>
        <ForgotPass />
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
