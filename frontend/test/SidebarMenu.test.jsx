import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import SidebarMenu from "/src/components/SidebarMenu";
import { BrowserRouter as Router } from "react-router-dom";

describe("Unit Testing for the Sidebar Menu Component", () => {
  let setSideBar;

  beforeEach(() => {
    setSideBar = jest.fn();
  });

  test("Renders sidebar menu correctly", () => {
    render(
      <Router>
        <SidebarMenu SideBar={false} setSideBar={setSideBar} />
      </Router>
    );

    expect(screen.getByAltText(/cvsu logo/i)).toBeInTheDocument();

    expect(
      screen.getByText(/CAVITE STATE UNIVERSITY BACOOR CITY CAMPUS/i)
    ).toBeInTheDocument();

    const departmentElements = screen.getAllByText(
      /DEPARTMENT OF COMPUTER STUDIES/i
    );
    expect(departmentElements.length).toBeGreaterThan(0);
    expect(departmentElements[0]).toBeInTheDocument();

    expect(screen.getByText(/x/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Admissions/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  test("Sidebar opens and closes when clicking the close button", () => {
    render(
      <Router>
        <SidebarMenu SideBar={false} setSideBar={setSideBar} />
      </Router>
    );

    const closeButton = screen.getByText(/x/i);

    fireEvent.click(closeButton);

    expect(setSideBar).toHaveBeenCalledTimes(1);
  });

  test('Displays and hides "About" dropdown when clicked', async () => {
    render(
      <Router>
        <SidebarMenu SideBar={true} setSideBar={jest.fn()} />
      </Router>
    );

    const aboutNav = screen.getByText(/About/i);
    fireEvent.click(aboutNav);

    const aboutDropdown = screen.getByText(/About/i).closest("li");

    const dropdownItems = within(aboutDropdown).getAllByRole("link");
    expect(dropdownItems).toHaveLength(4);

    expect(dropdownItems[0]).toHaveTextContent(/History of CvSU/i);
    expect(dropdownItems[1]).toHaveTextContent(
      /Mission, Vision, and Core Values/i
    );
    expect(dropdownItems[2]).toHaveTextContent(
      /Department of Computer Studies/i
    );
    expect(dropdownItems[3]).toHaveTextContent(
      /Computer Studies Society Officers/i
    );

    fireEvent.click(aboutNav);

    await waitFor(() => {
      const dropdown = document.querySelector('div[style="display: none;"]');
      expect(dropdown).toBeInTheDocument();
      expect(dropdown).toHaveStyle("display: none");
    });
  });

  test('Displays and hides "Admissions" dropdown when clicked', async () => {
    render(
      <Router>
        <SidebarMenu SideBar={true} setSideBar={jest.fn()} />
      </Router>
    );

    const admissionsNav = screen.getByText(/Admissions/i);
    fireEvent.click(admissionsNav);

    const admissionsDropdown = screen.getByText(/Admissions/i).closest("li");

    const dropdownItems = within(admissionsDropdown).getAllByRole("link");
    expect(dropdownItems).toHaveLength(3);

    expect(dropdownItems[0]).toHaveTextContent(/Apply/i);
    expect(dropdownItems[1]).toHaveTextContent(/Enrollment FAQs/i);
    expect(dropdownItems[2]).toHaveTextContent(/Undergraduate Programs/i);

    fireEvent.click(admissionsNav);

    await waitFor(() => {
      const dropdown = document.querySelector('div[style="display: none;"]');
      expect(dropdown).toBeInTheDocument();
      expect(dropdown).toHaveStyle("display: none");
    });
  });

  test("Links navigate to correct routes", () => {
    render(
      <Router>
        <SidebarMenu SideBar={false} setSideBar={setSideBar} />
      </Router>
    );

    fireEvent.click(screen.getByText(/About/i));

    expect(screen.getByText(/History of CvSU/i)).toHaveAttribute(
      "href",
      "/CvsuHistory"
    );

    expect(
      screen.getByText(/Mission, Vision, and Core Values/i)
    ).toHaveAttribute("href", "/MissionVision");

    const departmentLinks = screen.getAllByText(
      /Department of Computer Studies/i
    );
    expect(departmentLinks[1]).toHaveAttribute("href", "/DcsPage");

    expect(
      screen.getByText(/Computer Studies Society Officers/i)
    ).toHaveAttribute("href", "/SocOff");

    fireEvent.click(screen.getByText(/Admissions/i));

    expect(screen.getByText(/Apply/i)).toHaveAttribute("href", "/Apply");

    expect(screen.getByText(/Enrollment FAQs/i)).toHaveAttribute(
      "href",
      "/FAQS"
    );

    expect(screen.getByText(/Undergraduate Programs/i)).toHaveAttribute(
      "href",
      "/Undergrad"
    );

    expect(screen.getByText(/Contact/i)).toHaveAttribute(
      "href",
      "/MainPage#contact"
    );

    expect(screen.getByText(/Sign In/i)).toHaveAttribute("href", "/LoginPage");
  });

  test("Should call setSideBar when close button is clicked", () => {
    render(
      <Router>
        <SidebarMenu SideBar={false} setSideBar={setSideBar} />
      </Router>
    );

    const closeButton = screen.getByText(/x/i);

    fireEvent.click(closeButton);

    expect(setSideBar).toHaveBeenCalledTimes(1);
  });
});
