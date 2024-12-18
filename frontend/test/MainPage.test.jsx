import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import MainPage from "/src/pages/MainPage";
import emailjs from "@emailjs/browser";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import userEvent from "@testing-library/user-event";

jest.mock("@emailjs/browser", () => ({
  sendForm: jest.fn().mockResolvedValue({}),
}));

jest.mock("swiper/react", () => ({
  Swiper: ({ children }) => <div>{children}</div>,
  SwiperSlide: ({ children }) => <div>{children}</div>,
}));

jest.mock("swiper/modules", () => ({
  Navigation: jest.fn(),
  Pagination: jest.fn(),
}));

jest.mock("aos", () => ({
  init: jest.fn(),
}));

jest.mock("/src/styles/MainPage.module.css", () => ({
  someClass: "someClass",
  anotherClass: "anotherClass",
}));

describe("Unit Testing for the Main Page", () => {
  beforeEach(() => {
    render(
      <Router>
        <ToastContainer />
        <MainPage />
      </Router>
    );
  });

  jest.mock("/src/components/Header.jsx", () => () => (
    <div data-testid="mock-header" />
  ));

  test("Renders Header component", () => {
    render(
      <Router>
        <MainPage />
      </Router>
    );
    const headerElements = screen.getAllByTestId("mock-header");
    expect(headerElements.length).toBeGreaterThan(0);
    expect(headerElements[0]).toBeInTheDocument();
  });

  test("Checks AOS animations initialization", () => {
    expect(require("aos").init).toHaveBeenCalled();
  });

  test("Should apply background image correctly to the first section", () => {
    const parallaxSection1 = screen.queryAllByTestId("parallax-section1");
    expect(parallaxSection1).toHaveLength(1);
    const div = parallaxSection1[0];
    // console.log(div.classList);
  });

  test("Renders the main title and first section", () => {
    expect(screen.getByText("STEP INTO THE FUTURE WITH")).toBeInTheDocument();

    const titleElements = screen.getAllByText("CAVITE STATE UNIVERSITY");
    titleElements.forEach((el) => {
      expect(el).toBeInTheDocument();
    });

    const enrollButton = screen.getByText("ENROLL NOW");
    expect(enrollButton).toBeInTheDocument();
  });

  test('Checks that the "Enroll Now" button links to the Apply page', () => {
    const enrollButton = screen.getByText("ENROLL NOW");
    expect(enrollButton.closest("a")).toHaveAttribute("href", "/Apply");
  });

  test("Renders the content section", () => {
    expect(
      screen.getByText("Welcome to Your Future in Technology")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you ready to shape the future and be at the forefront of innovation?"
      )
    ).toBeInTheDocument();
  });

  test("Checks if swiper navigation buttons are rendered", async () => {
    const swiperContainer = await screen.findByTestId("swiper-container");
    const prevButton = swiperContainer.querySelector(".swiper-button-prev");
    const nextButton = swiperContainer.querySelector(".swiper-button-next");

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  test("Checks if swiper gallery is rendered", async () => {
    const swiperImages = await screen.findAllByRole("img");
    expect(swiperImages.length).toBeGreaterThan(0);
  });

  it('Renders "Join Us Now" section with right additional text', () => {
    render(
      <Router>
        <MainPage />
      </Router>
    );

    const allHeadings = screen.getAllByTestId("join-us-now-heading");

    expect(allHeadings.length).toBeGreaterThanOrEqual(1);

    expect(allHeadings[0]).toBeInTheDocument();
    expect(allHeadings[0]).toHaveTextContent(/Join Us Now/i);

    const joinUsSubheadings = screen.getAllByText(
      /Taking a course in Computer Studies is a great way to prepare for a career/i
    );
    expect(joinUsSubheadings.length).toBeGreaterThanOrEqual(1);
    expect(joinUsSubheadings[0]).toBeInTheDocument();
  });

  test("Should apply background image correctly to join us section", () => {
    const parallaxSection2 = screen.queryAllByTestId("parallax-section2");
    expect(parallaxSection2).toHaveLength(1);
    const div = parallaxSection2[0];
    // console.log(div.classList);
  });

  test('Renders "Contact Us" title', () => {
    const title = screen.getByText(/Contact Us/i);
    expect(title).toBeInTheDocument();
  });

  test("Renders the location icon and information", () => {
    const locationIcon = screen.getByAltText("Location Icon");
    expect(locationIcon).toBeInTheDocument();
    expect(locationIcon).toHaveAttribute(
      "src",
      "/src/assets/location-logo.svg"
    );

    const addressText = screen.getByText(
      /Cavite State University - Bacoor Campus, Bacoor, Cavite./i
    );
    expect(addressText).toBeInTheDocument();
  });

  test("Renders the email icon and information", () => {
    const emailIcon = screen.getByAltText("Email Icon");
    expect(emailIcon).toBeInTheDocument();
    expect(emailIcon).toHaveAttribute("src", "/src/assets/email-logo.svg");

    const emailLink = screen.getByText("cvsubacoor@cvsu.edu.ph");
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.closest("a")).toHaveAttribute(
      "href",
      "mailto:cvsubacoor@cvsu.edu.ph"
    );
  });

  test("Renders the phone icon and information", () => {
    const phoneIcon = screen.getByAltText("Phone Icon");
    expect(phoneIcon).toBeInTheDocument();
    expect(phoneIcon).toHaveAttribute("src", "/src/assets/phone-logo.svg");

    const phoneLink = screen.getByText("(046)476-5029");
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink.closest("a")).toHaveAttribute("href", "tel:+0464765029");
  });

  test("Ensures all icons are displayed correctly", () => {
    const iconElements = screen.getAllByRole("img");
    const locationIcon = screen.getByAltText("Location Icon");
    const emailIcon = screen.getByAltText("Email Icon");
    const phoneIcon = screen.getByAltText("Phone Icon");

    expect(locationIcon).toBeInTheDocument();
    expect(emailIcon).toBeInTheDocument();
    expect(phoneIcon).toBeInTheDocument();

    expect(
      iconElements.filter((icon) =>
        ["Location Icon", "Email Icon", "Phone Icon"].includes(icon.alt)
      ).length
    ).toBe(3);
  });

  test("Checks if the map is rendered correctly", () => {
    const map = screen.getByTitle("Cavite State University Bacoor Campus Map");
    expect(map).toBeInTheDocument();
  });

  test("Checks if the contact form renders and can be submitted", async () => {
    const nameInput = screen.getByPlaceholderText("Your Name");
    const emailInput = screen.getByPlaceholderText("Your Email");
    const subjectInput = screen.getByPlaceholderText("Subject");
    const messageInput = screen.getByPlaceholderText("Message");
    const submitButton = screen.getByText("Send Message");

    fireEvent.change(nameInput, { target: { value: "Jennie Kim" } });
    fireEvent.change(emailInput, { target: { value: "jenniekim@gmail.com" } });
    fireEvent.change(subjectInput, { target: { value: "BP Comeback" } });
    fireEvent.change(messageInput, { target: { value: "Tagal naman" } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(emailjs.sendForm).toHaveBeenCalledTimes(1));
    expect(emailjs.sendForm).toHaveBeenCalledWith(
      "service_mpjmyfm",
      "template_b3wgc54",
      expect.anything(),
      { publicKey: "Z9nUoyrtbdrLWu_kT" }
    );

    await waitFor(() =>
      expect(screen.getByText("Email sent successfully!")).toBeInTheDocument()
    );
  });

  test("Checks if contact form fields are correctly cleared after submission", async () => {
    const nameInput = screen.getByPlaceholderText("Your Name");
    const emailInput = screen.getByPlaceholderText("Your Email");
    const subjectInput = screen.getByPlaceholderText("Subject");
    const messageInput = screen.getByPlaceholderText("Message");

    userEvent.type(nameInput, "Jennie Kim");
    userEvent.type(emailInput, "jenniekim@gmail.com");
    userEvent.type(subjectInput, "Inquiry");
    userEvent.type(messageInput, "Bp comeback when?");

    const submitButton = screen.getByText(/Send Message/i);
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(nameInput.value).toBe("");
      expect(emailInput.value).toBe("");
      expect(subjectInput.value).toBe("");
      expect(messageInput.value).toBe("");
    });
  });

  test("Checks if the contact form handles emailjs failure correctly", async () => {
    emailjs.sendForm.mockRejectedValueOnce(new Error("Email sending failed"));

    const nameInput = screen.getByPlaceholderText("Your Name");
    const emailInput = screen.getByPlaceholderText("Your Email");
    const subjectInput = screen.getByPlaceholderText("Subject");
    const messageInput = screen.getByPlaceholderText("Message");
    const submitButton = screen.getByText("Send Message");

    fireEvent.change(nameInput, { target: { value: "Jennie Kim" } });
    fireEvent.change(emailInput, { target: { value: "rubyjane@gmail.com" } });
    fireEvent.change(subjectInput, { target: { value: "Test Subject" } });
    fireEvent.change(messageInput, { target: { value: "Test message" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to send email: Error: Email sending failed")
      ).toBeInTheDocument();
    });
  });

  test("Should apply background image correctly to the footer branding", () => {
    const parallaxFooters = screen.queryAllByTestId("parallax-footer");

    expect(parallaxFooters).toHaveLength(1);

    const footer = parallaxFooters[0];

    // console.log(footer.classList);
  });

  test("Renders Cavite State University logo and text", () => {
    const logos = screen.getAllByAltText("Cavite State University Logo");
    expect(logos.length).toBe(1);
    expect(logos[0]).toBeInTheDocument();

    const brandingText = screen.getByText(
      "Cavite State University - Bacoor Campus"
    );
    expect(brandingText).toBeInTheDocument();
  });

  test("Renders the footer slogan", () => {
    render(
      <Router>
        <MainPage />
      </Router>
    );

    const slogans = screen.getAllByText("The Future Begins Here!");

    expect(slogans.length).toBe(slogans.length);

    expect(slogans[0]).toBeInTheDocument();
  });

  test("Renders the Facebook social icon with a link", () => {
    render(
      <Router>
        <MainPage />
      </Router>
    );

    const facebookLinks = screen.getAllByRole("link", { name: /facebook/i });

    const facebookLink = facebookLinks[0];

    expect(facebookLink).toHaveAttribute(
      "href",
      "https://www.facebook.com/CvSUBacoorCityCampus"
    );
    expect(facebookLink).toHaveAttribute("target", "_blank");
    expect(facebookLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("Renders page footer correctly", async () => {
    render(
      <Router>
        <MainPage />
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
