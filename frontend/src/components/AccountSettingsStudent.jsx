import { useEffect, useState } from "react";
import styles from "/src/styles/AccountSettings.module.css";
import Header from "/src/components/StudentDashHeader.jsx";

function AccountSettings() {
  const [SideBar, setSideBar] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    // Simple check for demonstration purposes (use more secure methods in real apps)
    if (currentPassword === "123") {
      setIsCurrentPasswordValid(true);
    } else {
      alert("Current password is incorrect.");
      setIsCurrentPasswordValid(false);
    }
  };

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



          {/* Account Details */}
          <div className={styles.accountDetails}>
            <h3>LeBron James</h3>           {/* Account Name */}
            <p>Enrollment Officer</p>       {/* Account Role */}
          </div>

          {/* Change Password Section */}
          <div className={styles.changePasswordSection}>
            <h3 className={styles.subHeading}>Change Password</h3>
            {!isCurrentPasswordValid ? (
              <form onSubmit={handleCurrentPasswordSubmit} className={styles.passwordForm}>
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
                <button type="submit" className={styles.submitButton}>
                  <span>Confirm Current Password</span>
                </button>
              </form>
            ) : (
              <form className={styles.passwordForm}>
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

export default AccountSettings;
