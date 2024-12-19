import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MissionVision from "/src/pages/MissionVision";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import styles from "/src/styles/MissionVision.module.css";

jest.mock("/src/components/Header.jsx", () => () => (
  <div data-testid="mock-header" />
));
jest.mock("aos", () => ({
  init: jest.fn(),
}));

describe("Unit Testing for the Mission and Vision Page", () => {
  test("Renders Header component", () => {
    render(
      <Router>
        <MissionVision />
      </Router>
    );

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  });

  test("Checks AOS animations initialization", async () => {
    render(
      <Router>
        <MissionVision />
      </Router>
    );

    await waitFor(() => {
      expect(require("aos").init).toHaveBeenCalled();
    });
  });

  test("Should render paragraphs with AOS fade-up animation", async () => {
    const { container } = render(
      <Router>
        <MissionVision />
      </Router>
    );

    await waitFor(() => {
      const paragraphs = container.querySelectorAll('p[data-aos="fade-up"]');
      expect(paragraphs.length).toBeGreaterThan(0);
    });
  });

  test("Should apply the background image correctly to the designated section", () => {
    const { container } = render(
      <Router>
        <MissionVision />
      </Router>
    );

    const parallaxSection = container.querySelector(
      '[data-testid="parallax-section"]'
    );
    expect(parallaxSection).not.toBeNull();
    expect(parallaxSection.classList.contains(styles.parallax1)).toBe(true);
  });

  test("Renders the MissionVision component", () => {
    render(
      <Router>
        <MissionVision />
      </Router>
    );

    const heading = screen.getByRole("heading", {
      name: /CAVITE STATE UNIVERSITY/i,
    });
    expect(heading).toBeInTheDocument();

    expect(
      screen.getByText(/Mission, Vision and Core Values/i, { selector: "h1" })
    ).toBeInTheDocument();
  });

  test("Renders Mission, Hangarin ng Pamantasan, Vision, Mithiin ng Pamantasan, Quality Policy, and Core Values correctly.", async () => {
    render(
      <Router>
        <MissionVision />
      </Router>
    );

    const missionText = screen.getAllByText(/Mission/i);
    expect(missionText.length).toBeGreaterThan(0);

    expect(
      screen.getByText(/Cavite State University shall provide excellent/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Hangarin ng Pamantasan/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Ang Cavite State university ay makapagbigay ng mahusay, pantay at makabuluhang edukasyon/i
      )
    ).toBeInTheDocument();

    const visionHeaders = screen.getAllByRole("heading", { name: /Vision/i });
    expect(visionHeaders.length).toBeGreaterThan(0);
    expect(visionHeaders[0]).toBeInTheDocument();
    expect(
      screen.getByText(/The premier university in historic Cavite globally/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Mithiin ng Pamantasan/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Ang nangungunang pamantasan sa makasaysayang Kabite/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Quality Policy/i)).toBeInTheDocument();

    const qualityPolicyText = screen.getByText(/We/i).closest("p");

    const normalizeText = (text) => {
      return text
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/,\s*/g, ", ")
        .trim();
    };

    const expectedText = normalizeText(
      "we commit to the highest standards of education, value our stakeholders, strive for continual improvement of our products and services, and uphold the university’s tenets of truth, excellence, and service to produce globally competitive and morally upright individuals."
    );

    const actualText = normalizeText(qualityPolicyText.textContent);

    expect(actualText).toBe(expectedText);

    const missionVisionHeading = screen.getByRole("heading", {
      name: /Mission, Vision and Core Values/i,
      level: 1,
    });

    expect(missionVisionHeading).toBeInTheDocument();

    const coreValuesHeading = screen.getByRole("heading", {
      name: /Core Values/i,
      level: 2,
    });

    expect(coreValuesHeading).toBeInTheDocument();

    const coreValuesText = screen.getAllByText(/Truth.*Excellence.*Service/i);

    expect(coreValuesText.length).toBeGreaterThan(0);

    expect(coreValuesText[1]).toHaveTextContent("Truth");
    expect(coreValuesText[1]).toHaveTextContent("Excellence");
    expect(coreValuesText[1]).toHaveTextContent("Service");
  });

  test("Renders the goals of CvSU Bacoor City Campus", () => {
    render(
      <Router>
        <MissionVision />
      </Router>
    );

    expect(
      screen.getByText(/Goals of the CvSU Bacoor City Campus/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /In support to the Vision and Mission of the University, CvSU – Bacoor City Campus shall:/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/1. provide quality and affordable education/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /2. prepare students to meet the demands of the global market/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/3. develop innovative and scholarly researchers/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/4. and produce globally competitive graduates/i)
    ).toBeInTheDocument();
  });

  test("Should render content section div in the document", () => {
    render(<MissionVision />);

    const contentSectionDiv = screen.getByTestId("content-section");

    expect(contentSectionDiv).toBeInTheDocument();
  });

  test("Renders page footer correctly", async () => {
    render(
      <Router>
        <MissionVision />
      </Router>
    );

    const footers = screen.getAllByTestId("footer-copyright");

    expect(footers.length).toBe(footers.length);

    expect(footers[0]).toHaveTextContent(
      /© Copyright.*Cavite State University.*All Rights Reserved./
    );
    expect(footers[0]).toHaveTextContent(/Designed by BSCS 3-5 Group 4/);
  });
});
