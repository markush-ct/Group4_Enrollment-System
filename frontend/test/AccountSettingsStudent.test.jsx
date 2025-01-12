import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountSettingsStudent from "/src/components/AccountSettingsStudent";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

jest.mock("/src/components/StudentDashHeader.jsx", () => () => (
  <div data-testid="mock-header" />
));

describe("Unit Testing for Student Account Settings Component", () => {
  beforeAll(() => {
    global.console.error = jest.fn();
    axios.get.mockResolvedValue({
      data: {
        message: "Fetch successful",
        user: {},
      },
    });
    axios.post.mockResolvedValue({
      data: { message: "Account updated successfully" },
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
    global.console.error.mockRestore();
  });

  test("Renders Header component", () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  });

  test("Renders Account Settings text", () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    const pageTitle = screen.getByText("Account Settings");
    expect(pageTitle).toBeInTheDocument();
  });

  test("Renders profile picture", async () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    const profileImage = await screen.findByTestId("profile-image");
    expect(profileImage).toBeInTheDocument();
  });

  test("Renders Upload Profile Picture", async () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    const uploadButton = screen.getByTestId("upload-button");
    expect(uploadButton).toBeInTheDocument();
  });

  test("Renders name and role", async () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    const accountName = await screen.findByTestId("account-name");
    expect(accountName).toBeInTheDocument();
    const accountRole = await screen.findByTestId("account-role");
    expect(accountRole).toBeInTheDocument();
  });

  test("Renders and toggles between Change Password and Edit Profile", () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    const toggleButton = screen.getByTestId("toggle-button");
    expect(toggleButton).toHaveTextContent("Change Password");
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent("Edit Profile");
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent("Change Password");
  });

  test("Should render the password form when the 'Change Password' is clicked", () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    expect(screen.queryByTestId("password-form")).toBeNull();
    fireEvent.click(screen.getByTestId("toggle-button"));
    expect(screen.getByTestId("password-form")).toBeInTheDocument();
  });

  test("Renders account settings form", () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    const form = screen.getByTestId("account-settings-form");
    expect(form).toBeInTheDocument();
  });

  test("Renders Personal Information", () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    const subHeading = screen.getByTestId("sub-heading");
    expect(subHeading).toBeInTheDocument();
    expect(subHeading).toHaveTextContent("Personal Information");
  });

  test("Renders all labels with the correct text", () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    expect(screen.getByTestId("first-name-label")).toHaveTextContent(
      "First Name:"
    );
    expect(screen.getByTestId("middle-name-label")).toHaveTextContent(
      "Middle Name:"
    );
    expect(screen.getByTestId("last-name-label")).toHaveTextContent(
      "Last Name:"
    );
    expect(screen.getByTestId("email-label")).toHaveTextContent("Email:");
    expect(screen.getByTestId("gender-label")).toHaveTextContent("Gender:");
    expect(screen.getByTestId("phonenum-label")).toHaveTextContent(
      "Phone Number:"
    );
    expect(screen.getByTestId("age-label")).toHaveTextContent("Age:");
    expect(screen.getByTestId("address-label")).toHaveTextContent("Address:");
    expect(screen.getByTestId("dob-label")).toHaveTextContent("Date of Birth:");
  });

  test("Toggles edit mode and shows save changes button", async () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    const editButton = screen.getByTestId("edit-button");
    expect(editButton).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    fireEvent.click(editButton);
    await waitFor(() => {
      expect(screen.getByText("Save Changes")).toBeInTheDocument();
    });
  });

  test("Fills input fields in edit mode", async () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    const editButton = screen.getByTestId("edit-button");
    fireEvent.click(editButton);
    const firstNameInput = screen.getByTestId("first-name-input");
    fireEvent.change(firstNameInput, { target: { value: "Jennie" } });
    expect(firstNameInput.value).toBe("Jennie");
    const middleNameInput = screen.getByTestId("middle-name-input");
    fireEvent.change(middleNameInput, { target: { value: "Rubyjane" } });
    expect(middleNameInput.value).toBe("Rubyjane");
    const lastNameInput = screen.getByTestId("last-name-input");
    fireEvent.change(lastNameInput, { target: { value: "Kim" } });
    expect(lastNameInput.value).toBe("Kim");
    const ageInput = screen.getByTestId("age-input");
    fireEvent.change(ageInput, { target: { value: 29 } });
    expect(ageInput.value).toBe("29");
    const phoneInput = screen.getByTestId("phonenum-input");
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    expect(phoneInput.value).toBe("1234567890");
    const addressInput = screen.getByTestId("address-input");
    fireEvent.change(addressInput, { target: { value: "South Korea" } });
    expect(addressInput.value).toBe("South Korea");
  });

  test("Disables email input field in edit mode", () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    const editButton = screen.getByTestId("edit-button");
    fireEvent.click(editButton);
    const emailInput = screen.getByTestId("email-input");
    expect(emailInput).toBeDisabled();
  });

  test("Shows gender dropdown in edit mode", async () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    const editButton = screen.getByTestId("edit-button");
    fireEvent.click(editButton);
    const genderSelect = screen.getByTestId("gender-select");
    expect(genderSelect).toBeInTheDocument();
  });

  test("Shows DOB date input type in edit mode", async () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    const editButton = screen.getByTestId("edit-button");
    fireEvent.click(editButton);
    const dobInput = screen.getByTestId("dob-input");
    expect(dobInput).toBeInTheDocument();
  });

  test("Saves changes after clicking save changes button", async () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    const editButton = screen.getByTestId("edit-button");
    fireEvent.click(editButton);

    const firstNameInput = screen.getByTestId("first-name-input");
    fireEvent.change(firstNameInput, { target: { value: "Ninibear" } });

    const saveButton = screen.getByText("Save Changes");
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(screen.getByTestId("first-name-value")).toHaveTextContent(
        "Ninibear"
      )
    );
  });

  test("Saves account information when save button is clicked", async () => {
    render(
      <Router>
        <AccountSettingsStudent />
      </Router>
    );
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  });
});
