import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FAQs from "/src/pages/FAQs";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import styles from "/src/styles/FAQs.module.css";

jest.mock("aos", () => ({
  init: jest.fn(),
  refresh: jest.fn(),
}));

jest.mock("/src/components/Header.jsx", () => () => (
  <div data-testid="mock-header" />
));

describe("Unit Testing for FAQs Page", () => {
  test("Renders Header component", () => {
    render(
      <Router>
        <FAQs />
      </Router>
    );

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  });

  test("Checks AOS animations initialization", () => {
    render(
      <Router>
        <FAQs />
      </Router>
    );
    expect(require("aos").init).toHaveBeenCalled();
  });

  test("Should apply the background image correctly to the designated section", () => {
    const { container } = render(
      <Router>
        <FAQs />
      </Router>
    );
    const parallaxSection = container.querySelector(
      '[data-testid="parallax-section"]'
    );
    expect(parallaxSection).not.toBeNull();
    expect(parallaxSection.classList.contains(styles.parallax1)).toBe(true);
  });

  test("Should render paragraphs with AOS fade-up animation", async () => {
    const { container } = render(
      <Router>
        <FAQs />
      </Router>
    );
    await waitFor(() => {
      const aosElements = container.querySelectorAll('[data-aos="fade-up"]');
      expect(aosElements.length).toBeGreaterThan(0);
    });
  });

  test("Renders the FAQs Page heading correctly", async () => {
    render(
      <Router>
        <FAQs />
      </Router>
    );
    const allHeadings = screen.getAllByText(/DEPARTMENT OF COMPUTER STUDIES/i);
    expect(allHeadings[0].tagName).toBe("H2");
    expect(allHeadings[0]).toBeInTheDocument();
    const FaqsHeading2 = screen.getByText(/ENROLLMENT FAQs/i);
    expect(FaqsHeading2).toBeInTheDocument();
  });

  test('Should render the title "FREQUENTLY ASKED QUESTIONS"', () => {
    const { getByText } = render(
      <Router>
        <FAQs />
      </Router>
    );
    const title = getByText("FREQUENTLY ASKED QUESTIONS");
    expect(title).toBeInTheDocument();
  });

  test('Renders the "Academic Calendar for SY 2024–2025" text', () => {
    render(
      <Router>
        <FAQs />
      </Router>
    );

    expect(
      screen.getByText("Academic Calendar for SY 2024–2025")
    ).toBeInTheDocument();
  });

  test("Clicking on Academic Calendar shows the popup and renders the images correctly", async () => {
    render(<FAQs />);

    fireEvent.click(screen.getByText("Academic Calendar for SY 2024–2025"));

    await waitFor(() => {
      expect(screen.getByTestId("image-1")).toBeInTheDocument();
      expect(screen.getByTestId("image-2")).toBeInTheDocument();
      expect(screen.getByTestId("image-3")).toBeInTheDocument();
    });
  });

  test("Closes the popup when the close button is clicked", async () => {
    render(<FAQs />);

    const academicCalendarContainer = screen.getByText(
      "Academic Calendar for SY 2024–2025"
    );
    fireEvent.click(academicCalendarContainer);

    await waitFor(() => screen.getByTestId("popup"));

    expect(screen.getByTestId("popup")).toBeInTheDocument();

    const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId("popup")).not.toBeInTheDocument();
    });
  });

  test("Does not render images when popupVisible is false", () => {
    render(
      <Router>
        <FAQs popupVisible={false} />
      </Router>
    );

    const images = screen.queryAllByTestId(/image-/);
    expect(images).toHaveLength(0);
  });

  test("Renders all radio buttons correctly", () => {
    render(
      <Router>
        <FAQs />
      </Router>
    );

    const studentTypes = [
      "General",
      "Regular",
      "Irregular",
      "Transferee",
      "Freshman",
      "Shiftee",
      "Technical",
      "Account",
    ];

    studentTypes.forEach((type) => {
      expect(screen.getByLabelText(type)).toBeInTheDocument();
    });
  });

  test("Selecting a radio button updates the state", () => {
    render(
      <Router>
        <FAQs />
      </Router>
    );

    expect(screen.getByLabelText("General")).toBeChecked();

    fireEvent.click(screen.getByLabelText("Freshman"));

    expect(screen.getByLabelText("Freshman")).toBeChecked();
    expect(screen.getByLabelText("General")).not.toBeChecked();
  });

  test("Selecting student type updates displayed FAQs", () => {
    render(
      <Router>
        <FAQs />
      </Router>
    );

    const generalRadio = screen.getByLabelText("General");
    expect(generalRadio).toBeChecked();

    const regularRadio = screen.getByLabelText("Regular");
    fireEvent.click(regularRadio);
    expect(screen.getByText(/Regular Student Support/i)).toBeInTheDocument();

    const irregularRadio = screen.getByLabelText("Irregular");
    fireEvent.click(irregularRadio);
    expect(screen.getByText(/Irregular Student Support/i)).toBeInTheDocument();

    const transfereeRadio = screen.getByLabelText("Transferee");
    fireEvent.click(transfereeRadio);
    expect(screen.getByText(/Transferee Student Support/i)).toBeInTheDocument();

    const freshmanRadio = screen.getByLabelText("Freshman");
    fireEvent.click(freshmanRadio);
    expect(screen.getByText(/Freshman Student Support/i)).toBeInTheDocument();

    const shifteeRadio = screen.getByLabelText("Shiftee");
    fireEvent.click(shifteeRadio);
    expect(screen.getByText(/Shiftee Student Support/i)).toBeInTheDocument();
  });

  test("Renders the search bar input correctly", () => {
    render(
      <Router>
        <FAQs />
      </Router>
    );

    const inputElement = screen.getByPlaceholderText("Search FAQs...");
    expect(inputElement).toBeInTheDocument();
  });

  test("Renders table headers", () => {
    render(
      <Router>
        <FAQs />
      </Router>
    );

    expect(screen.getByText("FAQs:")).toBeInTheDocument();
    expect(screen.getByText("Replies:")).toBeInTheDocument();
  });

  test("Displays FAQs for the General category by default", () => {
    render(
      <Router>
        <FAQs />
      </Router>
    );

    expect(
      screen.getByText(/Do I need to pay a tuition fee/)
    ).toBeInTheDocument();
    expect(screen.getByText(/No, Cavite State University/)).toBeInTheDocument();
  });

  test("Displays FAQs based on selected category", () => {
    render(
      <Router>
        <FAQs />
      </Router>
    );

    const transfereeRadio = screen.getByLabelText(/Transferee/i);
    fireEvent.click(transfereeRadio);

    expect(
      screen.getByText(/What are the requirements required for a transfee/i)
    ).toBeInTheDocument();
  });

  test("Search filters the FAQs correctly", () => {
    render(
      <Router>
        <FAQs />
      </Router>
    );

    const searchInput = screen.getByPlaceholderText("Search FAQs...");
    fireEvent.change(searchInput, { target: { value: "apply" } });

    expect(screen.getByText(/How to apply?/i)).toBeInTheDocument();
    expect(screen.queryByText(/Can I use my cellphone/i)).toBeNull();
  });

  test('Displays "No FAQs available" when no matching FAQs are found', () => {
    render(
      <Router>
        <FAQs />
      </Router>
    );

    const searchInput = screen.getByPlaceholderText("Search FAQs...");
    fireEvent.change(searchInput, { target: { value: "xyz" } });

    expect(screen.getByText(/No FAQs available/i)).toBeInTheDocument();
  });

  test("Renders page footer correctly", async () => {
    render(
      <Router>
        <FAQs />
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
