import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import FreshmenAdmissionRequests from "/src/pages/FreshmenAdmissionRequests";

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

describe("Unit Testing for Freshman Admission Request Page", () => {
  test("Renders Header component", () => {
    render(
      <Router>
        <FreshmenAdmissionRequests />
      </Router>
    );

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  });

  test("Checks AOS animations initialization", async () => {
    render(
      <Router>
        <FreshmenAdmissionRequests />
      </Router>
    );

    await waitFor(() => {
      expect(require("aos").init).toHaveBeenCalled();
    });
  });

  test("Should render components with AOS fade-up animation", async () => {
    const { container } = render(
      <Router>
        <FreshmenAdmissionRequests />
      </Router>
    );

    await waitFor(() => {
      const fadeUpElements = container.querySelectorAll('[data-aos="fade-up"]');
      expect(fadeUpElements.length).toBeGreaterThan(0);
    });
  });

  test("Renders Admission Requests", () => {
    render(
      <Router>
        <FreshmenAdmissionRequests />
      </Router>
    );

    const elements = screen.getAllByText(/Admission Requests/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  test("Should render a dropdown with filter options", () => {
    render(
      <Router>
        <FreshmenAdmissionRequests />
      </Router>
    );

    expect(screen.getByLabelText(/Filter by Strand:/i)).toBeInTheDocument();

    const filterDropdown = screen.getByRole("combobox");
    expect(filterDropdown).toBeInTheDocument();

    expect(screen.getByText("STEM")).toBeInTheDocument();
    expect(screen.getByText("ICT")).toBeInTheDocument();
  });

  test("Renders request table", () => {
    render(
      <Router>
        <FreshmenAdmissionRequests />
      </Router>
    );

    expect(screen.getByTestId("request-table")).toBeInTheDocument();
  });

  test("Renders table headers correctly", () => {
    render(
      <Router>
        <FreshmenAdmissionRequests />
      </Router>
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Strand")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("Should render the correct image src for switch icon", () => {
    render(
      <Router>
        <FreshmenAdmissionRequests activeView="Request" />
      </Router>
    );

    const imgElement = screen.getByRole("img");
    expect(imgElement).toHaveAttribute("src", "/src/assets/switch-icon.png");
  });

  test("Switch icon alt text should change when toggled", () => {
    const { rerender } = render(
      <Router>
        <FreshmenAdmissionRequests activeView="Request" />
      </Router>
    );

    let imgElement = screen.getByRole("img");
    expect(imgElement).toHaveAttribute("alt", "Confirm Slot");

    fireEvent.click(screen.getByRole("button"));

    rerender(
      <Router>
        <FreshmenAdmissionRequests activeView="Confirm" />
      </Router>
    );
    imgElement = screen.getByRole("img");
    expect(imgElement).toHaveAttribute("alt", "Request");
  });

  test('Displays "No freshmen admission request found" when no requests are available', async () => {
    render(
      <Router>
        <FreshmenAdmissionRequests />
      </Router>
    );

    await waitFor(() => {
      const noRequestRow = screen.getByRole("row", {
        name: /No freshmen admission requests found./i,
      });
      expect(noRequestRow).toBeInTheDocument();
    });
  });
});
