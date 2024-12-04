import { useEffect, useState } from "react";
import styles from "/src/styles/AccountSettings.module.css";
import Header from "/src/components/StudentDashHeader.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AccountSettingsStudent() {
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

  //Reuse in other pages that requires logging in
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  //RETURNING ACCOUNT NAME IF LOGGED IN
  useEffect(() => {
    axios
      .get("http://localhost:8080")
      .then((res) => {
        if (res.data.valid) {
          setAccName(res.data.name);
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

  // Handle current password submission
  const handleCurrentPasswordSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:8080/matchPass', { currentPassword })
      .then((res) => {
        if (res.data.message === "Account found") {
          setIsCurrentPasswordValid(true);
        } else {
          setsuccessPrompt(false);
          setsuccessMsg(res.data.message);
          setErrorPrompt(true);
          setErrorMsg(res.data.message);
          setIsCurrentPasswordValid(false);

        }
      })
      .catch((err) => {
        alert("Error: " + err);
      })
  };

  const submitNewPassword = (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setsuccessPrompt(false);
      setsuccessMsg(false);
      setErrorPrompt(true);
      setErrorMsg("Password do not match");
    } else {

      axios.post('http://localhost:8080/changePass', { newPassword, confirmPassword })
        .then((res) => {
          if (res.data.message === "Password changed successfully") {
            setsuccessPrompt(true);
            setsuccessMsg(res.data.message);
            setErrorPrompt(false);
            setErrorMsg(false);
            setIsCurrentPasswordValid(false);
            window.location.reload();
          } else {
            setsuccessPrompt(false);
            setsuccessMsg(false);
            setErrorPrompt(true);
            setErrorMsg("Failed to make changes");
            setIsCurrentPasswordValid(false);
            alert(res.data.message);
          }
        })
        .catch((err) => {
          alert("Error: " + err);
        })
    }
  }

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.contentSection}>
        <div className={styles.PageTitle}>Account Settings</div>

        {/* Profile Section */}
        <div className={styles.profileSection}>
          <div className={styles.profilePhoto}>
            <img
              src='\src\assets\sampleicon.jpg'
              alt="Profile"
              className={styles.profileImage}
            />
          </div>
          <label
            htmlFor="uploadPhoto"
            className={styles.uploadButton}
            aria-label="Upload new profile photo"
          >
            Upload New Profile Photo
          </label>
          <input
            type="file"
            id="uploadPhoto"
            className={styles.fileInput}
            accept="image/*"
          />
        </div>

        {/* SUCCESS PROMPT */}
        {successPrompt && (
          <div data-aos="zoom-out" data-aos-duration="500" className={styles.popup}>
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
                <img src="/src/assets/checkmark.png" alt="Success Icon" className={styles.messageImage} />
              </div>
              <p className={styles.popupText}>{successMsg}</p>
            </div>
          </div>
        )}

        {/* ERROR PROMPT */}
        {errorPrompt && (
          <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupError}>
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
              <div className={styles.MessageError} >
                <img src="/src/assets/errormark.png" alt="Error Icon" className={styles.messageImage} />
              </div>
              <p className={styles.popupTextError}>{errorMsg}</p>
            </div>
          </div>
        )}



        {/* Account Details */}
        <div className={styles.accountDetails}>
          <h3>{accName}</h3>           {/* Account Name */}
          <p>Enrollment Officer</p>       {/* Account Role */}
        </div>

        {/* Change Password Section */}
        <div className={styles.changePasswordSection}>
          <h3 className={styles.subHeading}>Change Password</h3>
          {!isCurrentPasswordValid ? (
            <form className={styles.passwordForm}>
              {/* Current Password */}
              <div className={styles.formGroup}>
                <label htmlFor="currentPassword" className={styles.formLabel}>
                  Current Password
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    id="currentPassword"
                    className={styles.formInput}
                    placeholder=""
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <div
                    className={styles.togglePasswordIcon}
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <img
                      title="Show/Hide Password"
                      src={showCurrentPassword ? '/src/assets/showPass.png' : '/src/assets/hidePass.png'}
                      alt={showCurrentPassword ? 'Hide Password' : 'Show Password'}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className={styles.submitButton} onClick={handleCurrentPasswordSubmit}>
                <span>Confirm Current Password</span>
              </button>
            </form>
          ) : (
            <form className={styles.passwordForm} onSubmit={submitNewPassword}>
              {/* New Password */}
              <div className={styles.formGroup}>
                <label htmlFor="newPassword" className={styles.formLabel}>
                  New Password
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    className={styles.formInput}
                    placeholder=""
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <div
                    className={styles.togglePasswordIcon}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    <img
                      title="Show/Hide Password"
                      src={showNewPassword ? '/src/assets/showPass.png' : '/src/assets/hidePass.png'}
                      alt={showNewPassword ? 'Hide Password' : 'Show Password'}
                    />
                  </div>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.formLabel}>
                  Confirm New Password
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className={styles.formInput}
                    placeholder=""
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <div
                    className={styles.togglePasswordIcon}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <img
                      title="Show/Hide Password"
                      src={showConfirmPassword ? '/src/assets/showPass.png' : '/src/assets/hidePass.png'}
                      alt={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className={styles.submitButton}>
                <span>Update Password</span>
              </button>
            </form>
          )}
        </div>
      </div>

    </>
  );
}

export default AccountSettingsStudent;
