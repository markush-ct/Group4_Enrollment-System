import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import TransfereeAdmissionRequests from "/src/pages/TransfereeAdmissionRequests";

jest.mock("/src/components/AdminDashHeader.jsx", () => () => (
  <div data-testid="mock-header" />
));

jest.mock("aos", () => ({
  init: jest.fn(),
}));

beforeAll(() => {
  global.console.error = jest.fn();
  global.console.log = jest.fn();
  global.console.warn = jest.fn();
});

afterAll(() => {
  jest.clearAllMocks();
  global.console.error.mockRestore();
  global.console.log.mockRestore();
  global.console.warn.mockRestore();
});

describe("Unit Testing for Transferee Admission Request Page", () => {
  test("Renders Header component", () => {
    render(
      <Router>
        <TransfereeAdmissionRequests />
      </Router>
    );

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  });

  test("Checks AOS animations initialization", async () => {
    render(
      <Router>
        <TransfereeAdmissionRequests />
      </Router>
    );

    await waitFor(() => {
      expect(require("aos").init).toHaveBeenCalled();
    });
  });

  test("Should render components with AOS fade-up animation", async () => {
    const { container } = render(
      <Router>
        <TransfereeAdmissionRequests />
      </Router>
    );

    await waitFor(() => {
      const fadeUpElements = container.querySelectorAll('[data-aos="fade-up"]');
      expect(fadeUpElements.length).toBeGreaterThan(0);
    });
  });

  test("Renders Transfer Requests", () => {
    render(
      <Router>
        <TransfereeAdmissionRequests />
      </Router>
    );

    const elements = screen.getAllByText(/Transfer Requests/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  test("Should render a dropdown with filter options", () => {
    render(
      <Router>
        <TransfereeAdmissionRequests />
      </Router>
    );

    expect(screen.getByLabelText(/Filter by Program:/i)).toBeInTheDocument();

    const filterDropdown = screen.getByRole("combobox");
    expect(filterDropdown).toBeInTheDocument();
  });

  test("Renders request table", () => {
    render(
      <Router>
        <TransfereeAdmissionRequests />
      </Router>
    );

    expect(screen.getByTestId("request-table")).toBeInTheDocument();
  });

  test("Renders table headers correctly", () => {
    render(
      <Router>
        <TransfereeAdmissionRequests />
      </Router>
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Previous Program")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });
});
