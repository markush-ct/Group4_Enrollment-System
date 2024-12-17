import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DcsPage from "/src/pages/DcsPage"; // Path to your DcsPage component
import "@testing-library/jest-dom";
import AOS from "aos"; // To mock AOS

// Mock Header component since it is imported
jest.mock("/src/components/Header.jsx", () => ({
  __esModule: true,
  default: ({ SideBar, setSideBar }) => (
    <div>
      <button onClick={() => setSideBar(!SideBar)}>Toggle Sidebar</button>
    </div>
  ),
}));

// Mock AOS since we don't want to run actual animations in tests
jest.mock("aos", () => ({
  init: jest.fn(),
}));

describe("Unit testing for DcsPage", () => {
  it("renders the DcsPage component correctly", () => {
    render(<DcsPage />);

    // Check if the DCS Chairperson and others are rendered
    expect(
      screen.getByText(/DEPARTMENT OF COMPUTER STUDIES/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/FACULTY/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Donnalyn B. Montallana, MIT/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/DCS Chairperson/i)).toBeInTheDocument();

    // Check if Instructor names are rendered
    expect(screen.getByText(/Mikaela Arciaga/i)).toBeInTheDocument();
    expect(screen.getByText(/Stephen Bacolor/i)).toBeInTheDocument();
  });

  it("toggles the sidebar overflow state when the button is clicked", () => {
    render(<DcsPage />);

    // Click on the toggle sidebar button to change overflow state
    const toggleButton = screen.getByRole("button", {
      name: /Toggle Sidebar/i,
    });

    fireEvent.click(toggleButton); // First click: should set overflow to 'hidden'
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(toggleButton); // Second click: should set overflow to 'auto'
    expect(document.body.style.overflow).toBe("auto");
  });

  it("initializes AOS correctly", () => {
    render(<DcsPage />);

    // Check if AOS.init is called during component mount
    expect(AOS.init).toHaveBeenCalledWith({
      duration: 1000,
      once: true,
    });
  });

  it("renders the footer correctly", () => {
    render(<DcsPage />);

    // Check if footer and its content are rendered
    expect(
      screen.getByText(
        /© Copyright Cavite State University. All Rights Reserved/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Designed by BSCS 3-5 Group 4/i)
    ).toBeInTheDocument();
  });
});
