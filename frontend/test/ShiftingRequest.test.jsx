import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ShiftingRequest from "/src/pages/ShiftingRequest";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("/src/components/AdminDashHeader.jsx", () => () => (
  <div data-testid="mock-header" />
));

jest.mock("aos", () => ({
  init: jest.fn(),
}));

jest.mock("axios", () => ({
  defaults: {
    withCredentials: false,
  },
  get: jest.fn().mockResolvedValue({ data: [] }),
}));

beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("Unit Testing for Shifting Request Page", () => {
  test("Renders Header component", () => {
    render(
      <Router>
        <ShiftingRequest />
      </Router>
    );

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  });

  test("Checks AOS animations initialization", async () => {
    render(
      <Router>
        <ShiftingRequest />
      </Router>
    );

    await waitFor(() => {
      expect(require("aos").init).toHaveBeenCalled();
    });
  });

  test("Should render components with AOS fade-up animation", async () => {
    const { container } = render(
      <Router>
        <ShiftingRequest />
      </Router>
    );

    await waitFor(() => {
      const fadeUpElements = container.querySelectorAll('[data-aos="fade-up"]');
      expect(fadeUpElements.length).toBeGreaterThan(0);
    });
  });

  test("Renders Shifting Request", () => {
    render(
      <Router>
        <ShiftingRequest />
      </Router>
    );

    const elements = screen.getAllByText(/Shifting Request/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  test("Should render a dropdown with filter options", () => {
    render(
      <Router>
        <ShiftingRequest />
      </Router>
    );

    expect(screen.getByLabelText(/Filter by Program:/i)).toBeInTheDocument();

    const filterDropdown = screen.getByRole("combobox");
    expect(filterDropdown).toBeInTheDocument();

    expect(
      screen.getByText("Bachelor of Secondary Education")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Bachelor of Science in Business Management")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Bachelor of Science in Criminology")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Bachelor of Science in Hospitality Management")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Bachelor of Science in Psychology")
    ).toBeInTheDocument();
  });

  test("Renders table headers", () => {
    render(
      <Router>
        <ShiftingRequest />
      </Router>
    );

    expect(screen.getByText("Student ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Previous Program")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test('Displays "No shifting request found" when no requests are available', async () => {
    render(
      <Router>
        <ShiftingRequest />
      </Router>
    );

    await waitFor(() => {
      const noRequestRow = screen.getByRole("row", {
        name: /No shifting requests found./i,
      });
      expect(noRequestRow).toBeInTheDocument();
    });
  });
});
