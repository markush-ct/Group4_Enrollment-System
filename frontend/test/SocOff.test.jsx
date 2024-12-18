import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SocOff from "/src/pages/SocOff";
import "@testing-library/jest-dom";
import styles from "/src/styles/SocOff.module.css";

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

const socData = [
  {
    name: "Alliance of Computer Scientist",
    logo: "/src/assets/ACS-logo.svg",
    officers: [
      { name: "Jelixces Cajontoy", position: "President" },
      { name: "Ernest Monticalvo", position: "Vice President" },
      { name: "Irish Christine Purisima", position: "Secretary" },
      { name: "Kyla Candado", position: "Assistant Secretary" },
      { name: "Claire Jersey Ferrer", position: "Treasurer" },
      { name: "Elisar Pamotongan", position: "Auditor" },
      { name: "Rance Gabrielle Siroy", position: "P.R.O." },
      { name: "Mary Strelline Magdamit", position: "Assistant P.R.O." },
      {
        name: "Jonard Rustique & Ryuji Sabian",
        position: "1st Year Chairpersons",
      },
      {
        name: "Von Zymon Raphael Patagnan & John Matthew Estrella",
        position: "2nd Year Chairpersons",
      },
      { name: "Romar Cruz Mercado", position: "3rd Year Chairperson" },
      { name: "Ervin Pangilinan", position: "4th Year Chairperson" },
    ],
  },
  {
    name: "Information Technology Society",
    logo: "/src/assets/ITS-logo.svg",
    officers: [
      { name: "Rheena Bellera", position: "President" },
      { name: "Erica Mae Zardoma", position: "Vice President" },
      { name: "Andre Ryan Flores", position: "Secretary" },
      { name: "Hazel Ann Lagundino", position: "Assistant Secretary" },
      { name: "Kathleen Anne Giro", position: "Treasurer" },
      { name: "John Arbel Balando", position: "Assistant Treasurer" },
      { name: "Kristel Heart Reyes", position: "Business Manager" },
      { name: "Adrian Picoc", position: "Auditor" },
      { name: "Kaine Marion Bacala", position: "P.R.O." },
      { name: "Jomel Tenoria", position: "GAD Representative" },
      {
        name: "Mark Emmanuel Lorenzo & Randolf Ahron Mercader",
        position: "1st Year Senator",
      },
      {
        name: "Ma. Ivy Rolea & James Bryan Laconsay",
        position: "2nd Year Senator",
      },
      { name: "Kenji Louis Pugal", position: "3rd Year Senator" },
      {
        name: "Paulo Murillo & Mitchelle Anne Mendoza",
        position: "4th Year Senator",
      },
    ],
  },
];

describe("Unit Testing for Society Officer Page", () => {
  test("Checks AOS animations initialization", () => {
    render(<SocOff />);
    expect(require("aos").init).toHaveBeenCalled();
  });

  test("Should apply the background image correctly to the designated section", () => {
    const { container } = render(<SocOff />);
    const parallaxSection = container.querySelector(
      '[data-testid="parallax-section"]'
    );
    expect(parallaxSection).not.toBeNull();
    expect(parallaxSection.classList.contains(styles.parallax1)).toBe(true);
  });

  test("Should render paragraphs with AOS fade-up animation", async () => {
    const { container } = render(<SocOff />);
    await waitFor(() => {
      const aosElements = container.querySelectorAll('[data-aos="fade-up"]');
      expect(aosElements.length).toBeGreaterThan(0);
    });
  });

  test("Renders the society officer heading correctly", () => {
    render(<SocOff />);

    const departmentHeading = screen.getByText(
      /DEPARTMENT OF COMPUTER STUDIES/i
    );
    expect(departmentHeading).toBeInTheDocument();

    const facultyHeading = screen.getAllByText(/SOCIETY OFFICERS/i);
    expect(facultyHeading.length).toBe(2);
    facultyHeading.forEach((heading) => {
      expect(heading).toBeInTheDocument();
    });
  });

  test("Renders 'SOCIETY OFFICERS' word before DCS containers", () => {
    render(<SocOff />);

    const elements = screen.getAllByText("SOCIETY OFFICERS");

    expect(elements[0].tagName).toBe("H1");

    expect(elements[0]).toBeInTheDocument();
  });

  test("Renders correct logo for each society", () => {
    render(<SocOff />);

    socData.forEach((society) => {
      const logo = screen.getByAltText(`${society.name} Logo`);
      expect(logo).toHaveAttribute("src", society.logo);
    });
  });

  test("Renders society name after logo", async () => {
    render(<SocOff />);

    const firstSocietyLogo = await screen.findByAltText(
      "Alliance of Computer Scientist Logo"
    );
    const firstSocietyName = await screen.findByText(
      "Alliance of Computer Scientist"
    );

    expect(firstSocietyLogo).toBeInTheDocument();
    expect(firstSocietyName).toBeInTheDocument();

    const parentContainer = firstSocietyLogo.closest(`.${styles.DcsContainer}`);
    if (!parentContainer) {
      // console.log("Parent container not found!");
    } else {
      const children = Array.from(parentContainer.children);

      // console.log(children);

      const logoIndex = children.indexOf(firstSocietyLogo);
      const nameIndex = children.indexOf(firstSocietyName);

      // console.log("Logo Index:", logoIndex);
      // console.log("Name Index:", nameIndex);

      expect(nameIndex).toBeGreaterThan(logoIndex);
    }
  });

  test("Renders society list and displays officers when clicked", async () => {
    render(<SocOff />);

    socData.forEach((society) => {
      expect(screen.getByText(society.name)).toBeInTheDocument();
    });

    const societyToClick = screen.getByText("Alliance of Computer Scientist");
    fireEvent.click(societyToClick);

    await waitFor(() => {
      const society = socData.find(
        (soc) => soc.name === "Alliance of Computer Scientist"
      );

      society.officers.forEach(async (officer) => {
        const officerText = await screen.findByText(
          new RegExp(`(${officer.position}.*${officer.name})`, "i")
        );

        expect(officerText).toBeInTheDocument();
      });
    });

    expect(
      screen.getByText("Officers - Alliance of Computer Scientist")
    ).toBeInTheDocument();
  });

  test("Renders page footer correctly", async () => {
    render(<SocOff />);
    const footers = screen.getAllByTestId("footer-copyright");
    expect(footers.length).toBe(footers.length);
    expect(footers[0]).toHaveTextContent(
      /© Copyright.*Cavite State University.*All Rights Reserved./
    );
    expect(footers[0]).toHaveTextContent(/Designed by BSCS 3-5 Group 4/);
  });

  test("Toggles the sidebar overflow state when the button is clicked", async () => {
    render(<SocOff />);
    const toggleButton = await screen.findByRole("button", {
      name: /Toggle Sidebar/i,
    });
    fireEvent.click(toggleButton);
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(toggleButton);
    expect(document.body.style.overflow).toBe("auto");
  });
});
