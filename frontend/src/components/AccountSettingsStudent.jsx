import React from "react";
import { useEffect, useState } from "react";
import styles from "/src/styles/AccountSettings.module.css";
import Header from "/src/components/StudentDashHeader.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import check from "/src/assets/checkmark.png";
import errormark from "/src/assets/errormark.png";
import editIcon from "/src/assets/edit-icon.png";

function AccountSettingsStudent() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  const [SideBar, setSideBar] = useState(false);
  const [accName, setAccName] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successPrompt, setsuccessPrompt] = useState(false); //success
  const [successMsg, setsuccessMsg] = useState("");
  const [errorPrompt, setErrorPrompt] = useState(false); //errors
  const [errorMsg, setErrorMsg] = useState("");
  const [accRole, setAccRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordView, setIsChangePasswordView] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [pfp, setPFP] = useState({
    uploadPFP: null,
    pfpURL: "",
  });
  const [uploadedPFP, setUploadedPFP] = useState(null);
  const [accInfo, setAccInfo] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    gender: "",
    age: "",
    phoneNo: "",
    address: "",
    dob: "",
  });

  //Reuse in other pages that requires logging in
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  //RETURNING ACCOUNT NAME IF LOGGED IN
  useEffect(() => {
    axios
      .get(`${backendUrl}`)
      .then((res) => {
        if (res.data.valid) {
          setAccName(res.data.name);
          setAccRole(res.data.role);
        } else {
          navigate("/LoginPage");
        }
      })
      //RETURNING ERROR IF NOT
      .catch((err) => {
        console.error("Error validating user session:", err);
      });
  }, []);
  //Reuse in other pages that requires logging in

  // Prevent body scroll when sidebar is active
  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [SideBar]);

  const handleToggleView = () => {
    setIsChangePasswordView(!isChangePasswordView);
  };

  //FETCH ACCOUNT INFO
  useEffect(() => {
    axios
      .get(`${backendUrl}/getAccInfo`)
      .then((res) => {
        if (res.data.message === "Fetch successful") {
          setAccInfo({
            firstName: res.data.firstName,
            middleName: res.data.middleName,
            lastName: res.data.lastName,
            email: res.data.email,
            gender: res.data.gender === "F" ? "Female" : "Male",
            age: res.data.age,
            phoneNo: res.data.phoneNo,
            address: res.data.address,
            dob: res.data.dob,
          });

          // console.log(res.data);
        } else {
          alert("Error fetching account info");
        }
      })
      .catch((err) => {
        alert("Error: " + err);
      });

    axios
      .get(`${backendUrl}/getPFP`)
      .then((res) => {
        setUploadedPFP(res.data.pfpURL);
        setPFP({
          uploadPFP: res.data.uploadPFP || null,
          pfpURL: res.data.pfpURL || "",
        });
      })
      .catch((err) => {
        alert("Error: " + err);
      });
  }, []);

  //AUTOSAVE PFP
  useEffect(() => {
    const timer = setTimeout(() => {
      autoSave();
    }, 1000);

    return () => clearTimeout(timer);
  }, [pfp]);

  const autoSave = () => {
    setIsSaving(true);

    const data = new FormData();
    if (pfp.uploadPFP) {
      data.append("uploadPFP", pfp.uploadPFP);
    }
    data.append("pfpURL", pfp.pfpURL);

    axios
      .post(`${backendUrl}/changePFP`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        // console.log("Student saved successfully:", res.data);

        setUploadedPFP(`${backendUrl}/${res.data.pfpURL}`);
      })
      .catch((err) => {
        alert("Error: " + err);
      });
  };

  const handleUploadChange = (e) => {
    setPFP({ ...pfp, uploadPFP: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccInfo((prevAccInfo) => ({
      ...prevAccInfo,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    axios
      .post(`${backendUrl}/saveAccInfo`, accInfo)
      .then((res) => {
        if (res.data.message === "Account updated successfully") {
          // console.log(res.data);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setErrorMsg(res.data.message);
          setErrorPrompt(true);
          setsuccessMsg("");
          setsuccessPrompt(false);
        }
      })
      .catch((err) => {
        setErrorMsg("Error: " + err);
        setErrorPrompt(true);
        setsuccessMsg("");
        setsuccessPrompt(false);
      });
  };

  // Handle current password submission
  const handleCurrentPasswordSubmit = (event) => {
    event.preventDefault();

    if (!currentPassword) {
      setErrorPrompt(true);
      setErrorMsg("Current password is required");
      return;
    }

    axios
      .post(`${backendUrl}/matchPass`, { currentPassword })
      .then((res) => {
        if (res.data.message === "Account found") {
          setIsCurrentPasswordValid(true);
        } else {
          setsuccessPrompt(false);
          setsuccessMsg(res.data.message);
          setErrorPrompt(true);
          setErrorMsg(res.data.message);
          setIsCurrentPasswordValid(false);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      })
      .catch((err) => {
        alert("Error: " + err);
      });
  };

  const submitNewPassword = (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setsuccessPrompt(false);
      setsuccessMsg(false);
      setErrorPrompt(true);
      setErrorMsg("Password do not match");
    } else {
      axios
        .post(`${backendUrl}/changePass`, {
          newPassword,
          confirmPassword,
        })
        .then((res) => {
          if (res.data.message === "Password changed successfully") {
            setsuccessPrompt(true);
            setsuccessMsg(res.data.message);
            setErrorPrompt(false);
            setErrorMsg(false);
            setIsCurrentPasswordValid(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          } else {
            setIsCurrentPasswordValid(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            alert(res.data.message);
          }
        })
        .catch((err) => {
          alert("Error: " + err);
        });
    }
  };

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.contentSection}>
        <div className={styles.PageTitle}>Account Settings</div>

        <div className={styles.accountContainer}>
          {/* Left Column - Profile Section */}
          <div className={styles.leftColumn}>
            <div className={styles.profileSection}>
              <div className={styles.profilePhoto}>
                <img
                  src={uploadedPFP}
                  alt="Profile"
                  className={styles.profileImage}
                  data-testid="profile-image"
                />
              </div>
              <label
                htmlFor="uploadPFP"
                className={styles.uploadButton}
                aria-label="Upload Profile Picture"
                data-testid="upload-button"
              >
                <span>Upload Profile Picture</span>
              </label>
              <input
                type="file"
                id="uploadPFP"
                name="uploadPFP"
                className={styles.fileInput}
                accept="image/*"
                onChange={handleUploadChange}
                data-testid="file-input"
              />
              <h3 data-testid="account-name">{accName}</h3>
              <p data-testid="account-role">{accRole}</p>
            </div>
            <button
              className={styles.changePasswordButton}
              onClick={handleToggleView}
              data-testid="toggle-button"
            >
              {isChangePasswordView ? "Edit Profile" : "Change Password"}
            </button>
          </div>

          {/* SUCCESS PROMPT */}
          {successPrompt && (
            <div
              data-aos="zoom-out"
              data-aos-duration="500"
              className={styles.popup}
            >
              <div className={styles.popupContent}>
                <button
                  className={styles.closeButton}
                  onClick={() => setsuccessPrompt(false)}
                >
                  &times;
                </button>
                <div className={styles.popupHeader}>
                  <h2>Success</h2>
                </div>
                <div className={styles.Message}>
                  <img
                    src={check}
                    alt="Success Icon"
                    className={styles.messageImage}
                  />
                </div>
                <p className={styles.popupText}>{successMsg}</p>
              </div>
            </div>
          )}

          {/* ERROR PROMPT */}
          {errorPrompt && (
            <div
              data-aos="zoom-out"
              data-aos-duration="500"
              className={styles.popupError}
            >
              <div className={styles.popupContentError}>
                <button
                  className={styles.closeButton}
                  onClick={() => setErrorPrompt(false)}
                >
                  &times;
                </button>
                <div className={styles.popupHeaderError}>
                  <h2>Error</h2>
                </div>
                <div className={styles.MessageError}>
                  <img
                    src={errormark}
                    alt="Error Icon"
                    className={styles.messageImage}
                  />
                </div>
                <p className={styles.popupTextError}>{errorMsg}</p>
              </div>
            </div>
          )}

          <div
            className={styles.rightColumn}
            data-testid="account-settings-form"
          >
            {!isChangePasswordView ? (
              <div className={styles.profileEditSection}>
                <h3 className={styles.subHeading} data-testid="sub-heading">
                  Personal Information
                </h3>
                <div className={styles.editButtonContainer}>
                  <button
                    data-testid="edit-button"
                    className={styles.editButton}
                    onClick={() => {
                      if (isEditing) {
                        // Save changes when switching to view mode
                        handleSaveChanges(); // Call your save function here
                      }
                      setIsEditing(!isEditing); // Toggle editing state
                    }}
                  >
                    {isEditing ? (
                      <>Save Changes</>
                    ) : (
                      <>
                        Edit{" "}
                        <img
                          src={editIcon}
                          className={styles.editIcon}
                          alt="Edit"
                        />
                      </>
                    )}
                  </button>
                </div>

                <div className={styles.profileInfo}>
                  <div className={styles.infoRow}>
                    <span
                      className={styles.infoLabel}
                      data-testid="first-name-label"
                    >
                      First Name:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className={styles.editInput}
                        placeholder="Enter First Name"
                        value={accInfo.firstName}
                        onChange={handleInputChange}
                        data-testid="first-name-input"
                      />
                    ) : (
                      <span
                        className={styles.infoValue}
                        data-testid="first-name-value"
                      >
                        {accInfo.firstName}
                      </span>
                    )}
                  </div>

                  <div className={styles.infoRow}>
                    <span
                      className={styles.infoLabel}
                      data-testid="middle-name-label"
                    >
                      Middle Name:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        id="middleName"
                        name="middleName"
                        className={styles.editInput}
                        placeholder="Enter Middle Name"
                        value={accInfo.middleName}
                        onChange={handleInputChange}
                        data-testid="middle-name-input"
                      />
                    ) : (
                      <span className={styles.infoValue}>
                        {accInfo.middleName}
                      </span>
                    )}
                  </div>

                  <div className={styles.infoRow}>
                    <span
                      className={styles.infoLabel}
                      data-testid="last-name-label"
                    >
                      Last Name:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className={styles.editInput}
                        placeholder="Enter Last Name"
                        value={accInfo.lastName}
                        onChange={handleInputChange}
                        data-testid="last-name-input"
                      />
                    ) : (
                      <span className={styles.infoValue}>
                        {accInfo.lastName}
                      </span>
                    )}
                  </div>

                  <div className={styles.infoRow}>
                    <span
                      className={styles.infoLabel}
                      data-testid="email-label"
                    >
                      Email:
                    </span>
                    {isEditing ? (
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={styles.editInput}
                        value={accInfo.email}
                        onChange={handleInputChange}
                        data-testid="email-input"
                        disabled
                      />
                    ) : (
                      <span className={styles.infoValue}>{accInfo.email}</span>
                    )}
                  </div>

                  <div className={styles.infoRow}>
                    <span
                      className={styles.infoLabel}
                      data-testid="gender-label"
                    >
                      Gender:
                    </span>
                    {isEditing ? (
                      <select
                        name="gender"
                        id="gender"
                        className={styles.editInput}
                        value={accInfo.gender}
                        onChange={handleInputChange}
                        data-testid="gender-select"
                      >
                        <option value="" disabled>
                          Select Gender
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    ) : (
                      <span className={styles.infoValue}>{accInfo.gender}</span>
                    )}
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel} data-testid="age-label">
                      Age:
                    </span>
                    {isEditing ? (
                      <input
                        type="number"
                        id="age"
                        name="age"
                        className={styles.editInput}
                        placeholder="Enter Age"
                        value={accInfo.age}
                        onChange={handleInputChange}
                        data-testid="age-input"
                      />
                    ) : (
                      <span className={styles.infoValue}>{accInfo.age}</span>
                    )}
                  </div>

                  <div className={styles.infoRow}>
                    <span
                      className={styles.infoLabel}
                      data-testid="phonenum-label"
                    >
                      Phone Number:
                    </span>
                    {isEditing ? (
                      <input
                        type="tel"
                        id="phoneNo"
                        name="phoneNo"
                        className={styles.editInput}
                        placeholder="Enter Phone Number"
                        value={accInfo.phoneNo}
                        onChange={handleInputChange}
                        data-testid="phonenum-input"
                      />
                    ) : (
                      <span className={styles.infoValue}>
                        {accInfo.phoneNo}
                      </span>
                    )}
                  </div>

                  <div className={styles.infoRow}>
                    <span
                      className={styles.infoLabel}
                      data-testid="address-label"
                    >
                      Address:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className={styles.editInput}
                        placeholder="Enter Address"
                        value={accInfo.address}
                        onChange={handleInputChange}
                        data-testid="address-input"
                      />
                    ) : (
                      <span className={styles.infoValue}>
                        {accInfo.address}
                      </span>
                    )}
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel} data-testid="dob-label">
                      Date of Birth:
                    </span>
                    {isEditing ? (
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        className={styles.editInput}
                        value={
                          accInfo.dob === "0000-00-00" || !accInfo.dob
                            ? ""
                            : accInfo.dob
                        }
                        onChange={handleInputChange}
                        data-testid="dob-input"
                      />
                    ) : (
                      <span className={styles.infoValue}>
                        {accInfo.dob === "0000-00-00" || !accInfo.dob
                          ? ""
                          : new Date(accInfo.dob).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.profileEditSection}>
                <h3 className={styles.subHeading}>Change Password</h3>
                {!isCurrentPasswordValid ? (
                  <form
                    className={styles.passwordForm}
                    data-testid="password-form"
                  >
                    {/* Current Password */}
                    <div className={styles.formGroup}>
                      <label
                        htmlFor="currentPassword"
                        className={styles.formLabel}
                      >
                        Current Password
                      </label>
                      <div className={styles.inputContainer}>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          id="currentPassword"
                          className={styles.formInput}
                          placeholder=""
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className={styles.submitButton}
                      onClick={handleCurrentPasswordSubmit}
                    >
                      <span>Confirm</span>
                    </button>
                  </form>
                ) : (
                  <form
                    className={styles.passwordForm}
                    onSubmit={submitNewPassword}
                  >
                    <div className={styles.formGroup}>
                      <label htmlFor="newPassword" className={styles.formLabel}>
                        New Password
                      </label>
                      <div className={styles.inputContainer}>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="newPassword"
                          className={styles.formInput}
                          placeholder=""
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label
                        htmlFor="confirmPassword"
                        className={styles.formLabel}
                      >
                        Confirm New Password
                      </label>
                      <div className={styles.inputContainer}>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          className={styles.formInput}
                          placeholder=""
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                      <span>Update Password</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountSettingsStudent;
