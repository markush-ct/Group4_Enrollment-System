import { useEffect, useState } from "react";
import styles from "/src/styles/AccountSettings.module.css";
import Header from "/src/components/AdminDashHeader.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AccountSettings() {
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
  const [accRole, setAccRole] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordView, setIsChangePasswordView] = useState(false);

  const [accInfo, setAccInfo] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    gender: '',
    age: '',
    phoneNo: '',
    address: '',
    dob: '',
  });


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
    axios.post('http://localhost:8080/getAccInfo', accRole)
    .then((res) => {
      if(res.data.message === "Fetch successful"){
        setAccInfo({
          firstName: res.data.firstName,
          middleName: res.data.middleName,
          lastName: res.data.lastName,
          email: res.data.email,
          gender: res.data.gender,
          age: res.data.age,
          phoneNo: res.data.phoneNo,
          address: res.data.address,
          dob: res.data.dob,
        });
      } else{
        alert("Error fetching account info");
      }
    })
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccInfo({ ...setAccInfo, [name]: value });
  };

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


        
  
        <div className={styles.accountContainer}>
          {/* Left Column - Profile Section */}
          <div className={styles.leftColumn}>
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
                aria-label="Upload Profile Picture"
              >
                <span>Upload Profile Picture</span>
              </label>
              <input
                type="file"
                id="uploadPhoto"
                className={styles.fileInput}
                accept="image/*"
              />
              <h3>{accName}</h3>
              <p>{accRole}</p>
            </div>
            <button
              className={styles.changePasswordButton}
              onClick={handleToggleView}
            >
              {isChangePasswordView ? "Edit Profile" : "Change Password" }
            </button>
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

  
   
          <div className={styles.rightColumn}>
            {!isChangePasswordView ? (
              <div className={styles.profileEditSection}>
                <h3 className={styles.subHeading}>Personal Info</h3>
                <div className={styles.editButtonContainer}>
                <button
  className={styles.editButton}
  onClick={() => setIsEditing(!isEditing)}
>
  {isEditing ? (
    <>
      Save Changes
    </>
  ) : (
    <>
      Edit <img src="/src/assets/edit-icon.png" className={styles.editIcon} alt="Edit" />
    </>
  )}
</button>

                </div>
  
                <div className={styles.profileInfo}>
             
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>First Name:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        className={styles.editInput}
                        placeholder="Enter First Name"
                        value={accInfo.firstName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span className={styles.infoValue}>{accInfo.firstName}</span>
                    )}
                  </div>
  
             
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Middle Name:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        className={styles.editInput}
                        placeholder="Enter Middle Name"
                        value={accInfo.middleName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span className={styles.infoValue}>{accInfo.middleName}</span>
                    )}
                  </div>
  
            
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Last Name:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        className={styles.editInput}
                        placeholder="Enter Last Name"
                        value={accInfo.lastName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span className={styles.infoValue}>{accInfo.lastName}</span>
                    )}
                  </div>
  
          
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Email:</span>
                    {isEditing ? (
                      <input
                        type="email"
                        className={styles.editInput}
                        value={accInfo.email}
                        onChange={handleInputChange}
                        disabled
                      />
                    ) : (
                      <span className={styles.infoValue}>{accInfo.email}</span>
                    )}
                  </div>
  
    
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Gender:</span>
                    {isEditing ? (
                      <select
                        className={styles.editInput}
                        value={accInfo.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </select>
                    ) : (
                      <span className={styles.infoValue}>{accInfo.gender}</span>
                    )}
                  </div>
  
        
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Age:</span>
                    {isEditing ? (
                      <input
                        type="number"
                        className={styles.editInput}
                        placeholder="Enter Age"
                        value={accInfo.age}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span className={styles.infoValue}>{accInfo.age}</span>
                    )}
                  </div>
  
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Phone Number:</span>
                    {isEditing ? (
                      <input
                        type="tel"
                        className={styles.editInput}
                        placeholder="Enter Phone Number"
                        value={accInfo.phoneNo}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span className={styles.infoValue}>{accInfo.phoneNo}</span>
                    )}
                  </div>
  
     
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Address:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        className={styles.editInput}
                        placeholder="Enter Address"
                        value={accInfo.address}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span className={styles.infoValue}>{accInfo.address}</span>
                    )}
                  </div>
  
   
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Date of Birth:</span>
                    {isEditing ? (
                      <input
                        type="date"
                        className={styles.editInput}
                        value={accInfo.dob}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span className={styles.infoValue}>{accInfo.dob}</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              
                <div className={styles.profileEditSection}>
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
                                    <span>Confirm</span>
                                  </button>
                                </form>
                  ) : (
                    <form className={styles.passwordForm} onSubmit={submitNewPassword}>
        
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
export default AccountSettings;
  