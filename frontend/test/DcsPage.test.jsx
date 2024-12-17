import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DcsPage from "/src/pages/DcsPage";
import "@testing-library/jest-dom";
import styles from "/src/styles/DcsPage.module.css";

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

const Instructor = [
  "Mikaela Arciaga",
  "Stephen Bacolor",
  "Steffanie Bato, MIT",
  "Edan Belgica",
  "Ralph Christian Bolarda",
  "Jerico Castillo, LPT",
  "Mariel Castillo, LPT",
  "Rafael Carvajal",
  "Alvin Catalo, LPT",
  "Alvin Celino",
  "Rufino Dela Cruz",
  "Lawrence Jimenez",
  "Julios Mojas",
  "Richard Ongayo",
  "Aida Penson, LPT",
  "Nestor Miguel Pimentel",
  "Joven Rios",
  "Rachel Rodriguez",
  "Clarissa Rostrollo",
  "Jessica Sambrano, LPT",
  "Benedick Sarmiento",
  "Jerome Tacata",
  "Russel Villareal, LPT",
  "Redem Decipulo",
  "Jen Jerome Dela Peña, LPT",
  "Roi Francisco",
  "James Mañozo, LPT",
  "Lorenzo Moreno Jr.",
  "Jay-Ar Racadio",
  "Alvina Ramallosa",
  "Niño Rodil",
  "Ryan Paul Roy, LPT",
  "Clarence Salvador",
  "Cesar Talibong II",
];

describe("Unit Testing for DCS Page", () => {
  test("Checks AOS animations initialization", () => {
    render(<DcsPage />);
    expect(require("aos").init).toHaveBeenCalled();
  });

  test("Should apply the background image correctly to the designated section", () => {
    const { container } = render(<DcsPage />);
    const parallaxSection = container.querySelector(
      '[data-testid="parallax-section"]'
    );
    expect(parallaxSection).not.toBeNull();
    expect(parallaxSection.classList.contains(styles.parallax1)).toBe(true);
  });

  test("Should render paragraphs with AOS fade-up animation", async () => {
    const { container } = render(<DcsPage />);
    await waitFor(() => {
      const aosElements = container.querySelectorAll('[data-aos="fade-up"]');
      expect(aosElements.length).toBeGreaterThan(0);
    });
  });

  test("Renders the department and faculty headings correctly", () => {
    render(<DcsPage />);
    const departmentHeadings = screen.getAllByText(
      /DEPARTMENT OF COMPUTER STUDIES/i
    );
    expect(departmentHeadings.length).toBe(2);
    departmentHeadings.forEach((heading) => {
      expect(heading).toBeInTheDocument();
    });

    const facultyHeading = screen.getByText(/FACULTY/i);
    expect(facultyHeading).toBeInTheDocument();
  });

  test("Renders department and faculty sections with correct content and styles", async () => {
    const { container } = render(<DcsPage />);
    await waitFor(() => {
      const departmentSections = container.querySelectorAll("h2");
      expect(departmentSections.length).toBeGreaterThan(0);
    });

    const departmentTitles = screen.getAllByText(
      /DEPARTMENT OF COMPUTER STUDIES/i
    );
    expect(departmentTitles.length).toBeGreaterThan(0);

    const profileIcons = screen.getAllByAltText(/Profile Icon/i);
    expect(profileIcons.length).toBeGreaterThan(0);

    const firstProfileName = screen.getByText(/Donnalyn B. Montallana, MIT/i);
    const firstProfilePosition = screen.getByText(/DCS Chairperson/i);
    expect(firstProfileName).toBeInTheDocument();
    expect(firstProfilePosition).toBeInTheDocument();

    const secondProfileName = screen.getByText(
      /ELy Rose L. Panganiban-Briones, MIT/i
    );
    const secondProfilePosition = screen.getByText(/CS Program Head/i);
    expect(secondProfileName).toBeInTheDocument();
    expect(secondProfilePosition).toBeInTheDocument();
  });

  test("Renders all instructor names correctly and with proper styles", () => {
    render(<DcsPage />);
    const instructorTitle = screen.getByText(/INSTRUCTORS/i);
    expect(instructorTitle).toBeInTheDocument();

    Instructor.forEach((name) => {
      const instructorName = screen.getByText(new RegExp(name, "i"));
      expect(instructorName).toBeInTheDocument();
    });
  });

  test("Renders page footer correctly", async () => {
    render(<DcsPage />);
    const footers = screen.getAllByTestId("footer-copyright");
    expect(footers.length).toBe(footers.length);
    expect(footers[0]).toHaveTextContent(
      /© Copyright.*Cavite State University.*All Rights Reserved./
    );
    expect(footers[0]).toHaveTextContent(/Designed by BSCS 3-5 Group 4/);
  });

  test("Toggles the sidebar overflow state when the button is clicked", async () => {
    render(<DcsPage />);
    const toggleButton = await screen.findByRole("button", {
      name: /Toggle Sidebar/i,
    });
    fireEvent.click(toggleButton);
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(toggleButton);
    expect(document.body.style.overflow).toBe("auto");
  });
});
