import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Undergrad from "/src/pages/Undergrad";
import styles from "/src/styles/Undergrad.module.css";
import "@testing-library/jest-dom";

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

describe("Unit Testing for Undergraduate Programs Page", () => {
  test("Checks AOS animations initialization", () => {
    render(<Undergrad />);
    expect(require("aos").init).toHaveBeenCalled();
  });

  test("Should apply the background image correctly to the designated section", () => {
    const { container } = render(<Undergrad />);
    const parallaxSection = container.querySelector(
      '[data-testid="parallax-section"]'
    );
    expect(parallaxSection).not.toBeNull();
    expect(parallaxSection.classList.contains(styles.parallax1)).toBe(true);
  });

  test("Should render components with AOS fade-up animation", async () => {
    const { container } = render(<Undergrad />);
    await waitFor(() => {
      const aosElements = container.querySelectorAll('[data-aos="fade-up"]');
      expect(aosElements.length).toBeGreaterThan(0);
    });
  });

  test("Renders the Undergraduate Programs heading correctly", async () => {
    render(<Undergrad />);
    const allHeadings = screen.getAllByText(/CAVITE STATE UNIVERSITY/i);
    expect(allHeadings[0].tagName).toBe("H2");
    expect(allHeadings[0]).toBeInTheDocument();
    const undergradHeading2 = screen.getByText(/BACOOR CAMPUS/i);
    expect(undergradHeading2).toBeInTheDocument();
  });

  test("Renders the page title", () => {
    render(<Undergrad />);
    const pageTitle = screen.getByText(/UNDERGRADUATE PROGRAMS/i);
    expect(pageTitle).toBeInTheDocument();
  });

  test("Renders Courses Offered section", () => {
    render(<Undergrad />);
    const coursesOffered = screen.getByText(/Courses Offered/i);
    expect(coursesOffered).toBeInTheDocument();
  });

  test("Renders the list of courses", () => {
    render(<Undergrad />);
    const courses = [
      "Bachelor of Secondary Education",
      "Bachelor of Science in Business Management",
      "Bachelor of Science in Computer Science",
      "Bachelor of Science in Criminology",
      "Bachelor of Science in Hospitality Management",
      "Bachelor of Science in Information Technology",
      "Bachelor of Science in Psychology",
    ];

    courses.forEach((course) => {
      const courseElement = screen.getByText(course);
      expect(courseElement).toBeInTheDocument();
    });
  });

  test("Checks table structure and rows", () => {
    render(<Undergrad />);
    const tableRows = screen.getAllByRole("row");
    expect(tableRows).toHaveLength(7);
  });

  test("Renders all the social icon containers", () => {
    render(<Undergrad />);
    const iconContainers = screen.getAllByTestId("icon-container");
    expect(iconContainers).toHaveLength(7);
  });

  test("Renders all the icons correctly", () => {
    render(<Undergrad />);
    const imageElements = screen.getAllByRole("img");
    expect(imageElements).toHaveLength(7);
    expect(imageElements[0].src).toContain("/src/assets/EDUC-logo.svg");
    expect(imageElements[1].src).toContain("/src/assets/BM-logo.svg");
    expect(imageElements[2].src).toContain("/src/assets/ACS-logo.svg");
    expect(imageElements[3].src).toContain("/src/assets/CRIM-logo.svg");
    expect(imageElements[4].src).toContain("/src/assets/HM-logo.svg");
    expect(imageElements[5].src).toContain("/src/assets/ITS-logo.svg");
    expect(imageElements[6].src).toContain("/src/assets/PSYCH-logo.svg");
  });

  test("Renders all the text descriptions", () => {
    render(<Undergrad />);
    expect(screen.getByText("Teacher Education Society")).toBeInTheDocument();
    expect(screen.getByText("Le Manager’s Societe")).toBeInTheDocument();
    expect(
      screen.getByText("Alliance of Computer Scientist")
    ).toBeInTheDocument();
    expect(
      screen.getByText("La Ciencia de Crimines Sociedad")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hospitality Management Society")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Information Technology Society")
    ).toBeInTheDocument();
    expect(screen.getByText("La Liga Psicologia")).toBeInTheDocument();
  });

  test("Renders page footer correctly", async () => {
    render(<Undergrad />);
    const footers = screen.getAllByTestId("footer-copyright");
    expect(footers.length).toBe(footers.length);
    expect(footers[0]).toHaveTextContent(
      /© Copyright.*Cavite State University.*All Rights Reserved./
    );
    expect(footers[0]).toHaveTextContent(/Designed by BSCS 3-5 Group 4/);
  });

  test("Toggles the sidebar overflow state when the button is clicked", async () => {
    render(<Undergrad />);
    const toggleButton = await screen.findByRole("button", {
      name: /Toggle Sidebar/i,
    });
    fireEvent.click(toggleButton);
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(toggleButton);
    expect(document.body.style.overflow).toBe("auto");
  });
});
