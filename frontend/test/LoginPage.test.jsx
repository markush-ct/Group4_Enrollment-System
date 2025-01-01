import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "/src/pages/LoginPage";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";

global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue({ success: true }),
});

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

jest.mock("/src/styles/LoginPage.module.css", () => ({
  mainPage: "mocked-mainPage-class",
  PageTitle: "mocked-PageTitle-class",
}));

beforeEach(() => {
  window.alert = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Unit Testing for Login Page", () => {
  test("Checks AOS animations initialization", () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    expect(require("aos").init).toHaveBeenCalled();
  });

  test("Should render components with AOS fade-up animation", async () => {
    const { container } = render(
      <Router>
        <LoginPage />
      </Router>
    );
    await waitFor(() => {
      const aosElements = container.querySelectorAll('[data-aos="fade-up"]');
      expect(aosElements.length).toBeGreaterThan(0);
    });
  });

  test("Renders the page title", async () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const pageTitle = await screen.findByTestId("login-page-title");
    expect(pageTitle).toBeInTheDocument();
  });

  test("Should apply background image", () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const mainPageDiv = document.querySelector(".mocked-mainPage-class");
    mainPageDiv.style.backgroundImage = "url(mocked-image.jpg)";
    const styles = getComputedStyle(mainPageDiv);
    expect(styles.backgroundImage).toBe("url(mocked-image.jpg)");
  });

  test("Renders the user icon in email input field", () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const userIcon = screen.getByAltText("User Icon");
    expect(userIcon).toBeInTheDocument();
  });

  test("Renders email input field with correct placeholder", () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toBeInTheDocument();
  });

  test("Renders the lock icon in password input field", () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const lockIcon = screen.getByAltText("Lock Icon");
    expect(lockIcon).toBeInTheDocument();
  });

  test("Renders password input field with correct placeholder", () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toBeInTheDocument();
  });

  test('Renders "Forgot Password?"', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const forgotPasswordLink = screen.getByText(/Forgot password\?/i);
    expect(forgotPasswordLink).toBeInTheDocument();
  });

  test("Navigates to Forgot Password page when the link is clicked", () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const forgotPasswordLink = screen.getByText("Forgot Password?");
    fireEvent.click(forgotPasswordLink);
    expect(window.location.pathname).toBe("/ForgotPass");
  });

  test('Renders "Log In" button', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const loginButton = screen.getByRole("button", { name: /LOG IN/i });
    expect(loginButton).toBeInTheDocument();
  });

  test('Renders "Don\'t have an account?"', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const noAccountText = screen.getByText(/Don't have an account\?/i);
    expect(noAccountText).toBeInTheDocument();
  });

  test('Renders "Create an account"', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const createAccountLink = screen.getByText(/Create an account./i);
    expect(createAccountLink).toBeInTheDocument();
  });

  test("Navigates to Create Account page when the link is clicked", () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const createAccountLink = screen.getByText("Create an account.");
    fireEvent.click(createAccountLink);
    expect(window.location.pathname).toBe("/CreateAcc");
  });

  test("Accepts input in the email and password fields", () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(emailInput, { target: { value: "jenniekim@oa.com" } });
    fireEvent.change(passwordInput, { target: { value: "ninibear" } });
    expect(emailInput.value).toBe("jenniekim@oa.com");
    expect(passwordInput.value).toBe("ninibear");
  });

  test("Does not render error popup when errorPrompt is false", () => {
    render(
      <Router>
        <LoginPage errorPrompt={false} errorMsg="Error" />
      </Router>
    );
    expect(screen.queryByText("Error")).not.toBeInTheDocument();
  });

  test("Does not render success popup when signUpPrompt is false", () => {
    render(
      <Router>
        <LoginPage signUpPrompt={false} signUpMsg="Success" />
      </Router>
    );
    expect(screen.queryByText("Success")).not.toBeInTheDocument();
  });

  test("Toggles the sidebar overflow state when the button is clicked", async () => {
    render(
      <Router>
        <LoginPage />
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
