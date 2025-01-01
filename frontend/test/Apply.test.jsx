import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Apply from "/src/pages/Apply";
import "@testing-library/jest-dom";
import styles from "/src/styles/Apply.module.css";

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
  refresh: jest.fn(),
}));

describe("Unit Testing for Apply Page", () => {
  test("Checks AOS animations initialization", () => {
    render(<Apply />);
    expect(require("aos").init).toHaveBeenCalled();
  });

  test("Should apply the background image correctly to the designated section", () => {
    const { container } = render(<Apply />);
    const parallaxSection = container.querySelector(
      '[data-testid="parallax-section"]'
    );
    expect(parallaxSection).not.toBeNull();
    expect(parallaxSection.classList.contains(styles.parallax1)).toBe(true);
  });

  test("Should render components with AOS fade-up animation", async () => {
    const { container } = render(<Apply />);
    await waitFor(() => {
      const aosElements = container.querySelectorAll('[data-aos="fade-up"]');
      expect(aosElements.length).toBeGreaterThan(0);
    });
  });

  test("Renders the Apply Page heading correctly", async () => {
    render(<Apply />);
    const allHeadings = screen.getAllByText(/CAVITE STATE UNIVERSITY/i);
    expect(allHeadings[0].tagName).toBe("H2");
    expect(allHeadings[0]).toBeInTheDocument();
    const applyHeading2 = screen.getByText(/ADMISSIONS/i);
    expect(applyHeading2).toBeInTheDocument();
  });

  test('Should render the title "Application Procedures"', () => {
    const { getByText } = render(<Apply />);
    const title = getByText("Application Procedures");
    expect(title).toBeInTheDocument();
  });

  test('Should render the title "Enrollment Procedures For Old Students"', () => {
    const { getByText } = render(<Apply />);
    const title = getByText("Enrollment Procedures For Old Students");
    expect(title).toBeInTheDocument();
  });

  test("Should render the page with all the student containers and their names", () => {
    render(<Apply />);

    expect(screen.getByTestId("freshman-container")).toBeInTheDocument();
    expect(screen.getByTestId("transferee-container")).toBeInTheDocument();
    expect(screen.getByTestId("shiftee-container")).toBeInTheDocument();
    expect(screen.getByTestId("regular-container")).toBeInTheDocument();
    expect(screen.getByTestId("irregular-container")).toBeInTheDocument();

    expect(screen.getByTestId("freshman-container")).toHaveTextContent(
      "Freshman"
    );
    expect(screen.getByTestId("transferee-container")).toHaveTextContent(
      "Transferee"
    );
    expect(screen.getByTestId("shiftee-container")).toHaveTextContent(
      "Shiftee"
    );
    expect(screen.getByTestId("regular-container")).toHaveTextContent(
      "Regular Student"
    );
    expect(screen.getByTestId("irregular-container")).toHaveTextContent(
      "Irregular Student"
    );
  });

  test("Should render all arrow icons with correct src and alt attributes", () => {
    const { getAllByAltText } = render(<Apply />);

    const arrowIcons = getAllByAltText("Arrow Icon");

    arrowIcons.forEach((arrowIcon) => {
      expect(arrowIcon).toBeInTheDocument();
      expect(arrowIcon).toHaveAttribute("src", "/src/assets/arrow-icon.svg");
    });
  });

  test("Should display the correct procedure when Freshman is clicked", () => {
    render(<Apply />);

    fireEvent.click(screen.getByTestId("freshman-container"));

    expect(
      screen.getByRole("heading", { name: "Application Procedures" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("freshman-container")).toHaveTextContent(
      /Freshman/i
    );

    expect(screen.getByText(/Go to the sign up link/i)).toBeInTheDocument();
    expect(screen.getByText(/Click here to sign up/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Fill out and have your email verified/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Check your registered email for your temporary login credentials/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Sign in using the provided temporary account/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        (content, element) =>
          content.includes("Click") && content.includes("Sign in")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Fill out all the necessary information then submit once done/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Wait for your application result/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Once successful, confirm your slot/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Failure to confirm your slot 5 days after your application result/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /REQUIREMENTS TO BE SUBMITTED IN SCHOOL \(SENIOR HIGH SCHOOL GRADUATES\)/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Accomplished application form with 1x1 picture and signature/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Original copy of Grade 12 Report Card/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Original copy of Good Moral Certificate/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /REQUIREMENTS TO BE SUBMITTED IN SCHOOL \(ALS PASSERS\)/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Original copy of Rating \(COR\) with eligibility to enroll in College/i
      )
    ).toBeInTheDocument();
  });

  test("Should display the correct procedure when Transferee is clicked", () => {
    render(<Apply />);

    fireEvent.click(screen.getByTestId("transferee-container"));

    expect(
      screen.getByRole("heading", { name: "Application Procedures" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("transferee-container")).toHaveTextContent(
      /Transferee/i
    );

    expect(screen.getByText(/Go to the sign up link/i)).toBeInTheDocument();
    expect(screen.getByText(/Click here to sign up/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Fill out and have your email verified/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Check your registered email for your temporary login credentials/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Sign in using the provided temporary account/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        (content, element) =>
          content.includes("Click") && content.includes("Sign in")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Fill out all the necessary information then submit once done/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Wait for your application result/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/REQUIRED DOCUMENTS TO BE SUBMITTED IN SCHOOL:/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Accomplished application form with 1x1 picture and signature/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Notice of Admission \(NOA\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Original copy of Transcript of Records/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Honorable Dismissal/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Certificate of Good Moral Character/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/NBI or Police Clearance/i)).toBeInTheDocument();
  });

  test("Should display the correct procedure when Shiftee is clicked", () => {
    render(<Apply />);

    fireEvent.click(screen.getByTestId("shiftee-container"));

    expect(
      screen.getByRole("heading", { name: "Application Procedures" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("shiftee-container")).toHaveTextContent(
      /Shiftee/i
    );

    expect(
      screen.getByText(
        /Ask permission to your department head about shifting programs 15 days prior to the enrollment period./i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Click here to sign up/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Fill out and have your email verified/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Check your registered email for your temporary login credentials/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Sign in using the provided temporary account/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        (content, element) =>
          content.includes("Click") && content.includes("Sign in")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Fill out all the necessary information then submit once done/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Wait for your shifting request result/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/REQUIRED DOCUMENTS TO BE SUBMITTED IN SCHOOL:/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Accomplished Shifting Form with 1x1 picture and signature/i
      )
    ).toBeInTheDocument();

    expect(screen.getByText(/REMINDER:/i)).toBeInTheDocument();

    const reminderText = screen.getByText(
      /It is not guaranteed that you can shift to IT\/CS/i
    );
    const reasonText = screen.getByText(/unless the reason is valid/i);

    expect(reminderText).toBeInTheDocument();
    expect(reasonText).toBeInTheDocument();

    expect(
      screen.getByText(
        /Your strand in senior high school must be aligned to IT\/CS/i
      )
    ).toBeInTheDocument();

    expect(screen.getByText(/Accepted SHS strands:/i)).toBeInTheDocument();
    expect(screen.getByText(/TVL-ICT/i)).toBeInTheDocument();
    expect(screen.getByText(/TVL/i)).toBeInTheDocument();
    expect(screen.getByText(/STEM/i)).toBeInTheDocument();
  });

  test("Should display the correct procedure when Regular is clicked", () => {
    render(<Apply />);

    fireEvent.click(screen.getByTestId("regular-container"));

    expect(
      screen.getByRole("heading", { name: "Enrollment Procedures" })
    ).toBeInTheDocument();

    expect(screen.getByTestId("regular-container")).toHaveTextContent(
      /Regular/i
    );

    expect(
      screen.getByText(/Fill out and submit registration form at/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/signup link/i)).toBeInTheDocument();

    expect(
      screen.getByText(
        /Check your registered email for your temporary login credentials/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Sign in using the provided temporary account/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Click/i)).toBeInTheDocument();

    expect(screen.getByText(/Enroll Now/i)).toBeInTheDocument();

    expect(
      screen.getByText(/and check your society fee payment status/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Submit a soft copy of your COG \(make sure it is clear and legible\)/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Fill out digital checklist and submit/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Society officer will update the status of your digital checklist/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Adviser will send an advise and the lists of courses you are eligible to take/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Fill out the pre-enrollment form and submit/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Check your enrollment status/i)
    ).toBeInTheDocument();
  });

  test("Should display the correct procedure when Irregular is clicked", () => {
    render(<Apply />);

    fireEvent.click(screen.getByTestId("irregular-container"));

    expect(
      screen.getByRole("heading", { name: "Enrollment Procedures" })
    ).toBeInTheDocument();

    expect(screen.getByTestId("irregular-container")).toHaveTextContent(
      /Irregular/i
    );

    expect(
      screen.getByText(/Fill out and submit registration form at/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/signup link/i)).toBeInTheDocument();

    expect(
      screen.getByText(
        /Check your registered email for your temporary login credentials/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Sign in using the provided temporary account/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Click/i)).toBeInTheDocument();

    expect(screen.getByText(/Enroll Now/i)).toBeInTheDocument();

    expect(
      screen.getByText(/and check your society fee payment status/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Submit a soft copy of your COG \(make sure it is clear and legible\)/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Fill out digital checklist and submit/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Society officer will update the status of your digital checklist/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Adviser will send an advise and the lists of courses you are eligible to take/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Fill out the pre-enrollment form and submit/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Check your enrollment status/i)
    ).toBeInTheDocument();
  });

  test("Should display the correct links for all student types", () => {
    render(<Apply />);

    fireEvent.click(screen.getByTestId("freshman-container"));
    const signUpLinkSH = screen.getByRole("link", {
      name: /Click here to sign up/i,
    });
    expect(signUpLinkSH).toHaveAttribute("href", "/SignUp");

    fireEvent.click(screen.getByTestId("transferee-container"));
    const signUpLinkT = screen.getByRole("link", {
      name: /Click here to sign up/i,
    });
    expect(signUpLinkT).toHaveAttribute("href", "/SignUp");

    fireEvent.click(screen.getByTestId("shiftee-container"));
    const signUpLinkSh = screen.getByRole("link", {
      name: /Click here to sign up/i,
    });
    expect(signUpLinkSh).toHaveAttribute("href", "/SignUp");

    fireEvent.click(screen.getByTestId("regular-container"));
    const signUpLinkR = screen.getByRole("link", { name: /signup link/i });
    expect(signUpLinkR).toHaveAttribute("href", "/CreateAcc");

    fireEvent.click(screen.getByTestId("irregular-container"));
    const signUpLinkI = screen.getByRole("link", { name: /signup link/i });
    expect(signUpLinkI).toHaveAttribute("href", "/CreateAcc");
  });

  test("Should close the popup when the close button is clicked for all containers", () => {
    render(<Apply />);

    fireEvent.click(screen.getByTestId("freshman-container"));
    expect(
      screen.getByRole("heading", { name: "Application Procedures" })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "✖" }));
    expect(
      screen.queryByRole("heading", { name: "Application Procedures" })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("transferee-container"));
    expect(
      screen.getByRole("heading", { name: "Application Procedures" })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "✖" }));
    expect(
      screen.queryByRole("heading", { name: "Application Procedures" })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("shiftee-container"));
    expect(
      screen.getByRole("heading", { name: "Application Procedures" })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "✖" }));
    expect(
      screen.queryByRole("heading", { name: "Application Procedures" })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("regular-container"));
    expect(
      screen.getByRole("heading", { name: "Enrollment Procedures" })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "✖" }));
    expect(
      screen.queryByRole("heading", { name: "Enrollment Procedures" })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("irregular-container"));
    expect(
      screen.getByRole("heading", { name: "Enrollment Procedures" })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "✖" }));
    expect(
      screen.queryByRole("heading", { name: "Enrollment Procedures" })
    ).not.toBeInTheDocument();
  });

  test("Renders page footer correctly", async () => {
    render(<Apply />);
    const footers = screen.getAllByTestId("footer-copyright");
    expect(footers.length).toBe(footers.length);
    expect(footers[0]).toHaveTextContent(
      /© Copyright.*Cavite State University.*All Rights Reserved./
    );
    expect(footers[0]).toHaveTextContent(/Designed by BSCS 3-5 Group 4/);
  });

  test("Toggles the sidebar overflow state when the button is clicked", async () => {
    render(<Apply />);
    const toggleButton = await screen.findByRole("button", {
      name: /Toggle Sidebar/i,
    });
    fireEvent.click(toggleButton);
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(toggleButton);
    expect(document.body.style.overflow).toBe("auto");
  });
});
