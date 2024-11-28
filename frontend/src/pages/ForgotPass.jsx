import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '/src/styles/ForgotPass.module.css';
import Header from '/src/components/Header.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';

function ForgotPass() {
    const [SideBar, setSideBar] = useState(false);
    const [verificationPrompt, setVerificationPrompt] = useState(false);
    const [passwordResetPrompt, setPasswordResetPrompt] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false); // if password isn't same
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // for success popup
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false); // for confirmation popup
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [values, setValues] = useState({
        email: '',
        pin: ['', '', '', ''],
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        document.body.style.overflow = SideBar ? 'hidden' : 'auto';
    }, [SideBar]);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const handleResetClick = () => {
        if (!values.email) {
            setErrorMessage('Email is required.');
            return;
        }
        setErrorMessage('');
        setVerificationPrompt(true);
    };

    const handlePinChange = (index, value) => {
        if (isNaN(value) || value.length > 1) return;
        const newPin = [...values.pin];
        newPin[index] = value;
        setValues({ ...values, pin: newPin });

        if (value && index < 3) {
            document.getElementById(`pin-${index + 1}`).focus();
        }
    };

    const handlePinSubmit = () => {
        if (values.pin.some((digit) => digit === '') || values.pin.join('').length !== 4) {
            setErrorMessage('Please enter all 4 digits of the PIN.');
            return;
        }
        setErrorMessage('');
        setVerificationPrompt(false);
        setPasswordResetPrompt(true);
    };

    const handlePasswordSubmit = () => { // error popup
        if (!values.newPassword || !values.confirmPassword) {
            setErrorMessage('Both fields are required.');
            setShowErrorPopup(true); 
            return;
        }

        if (values.newPassword !== values.confirmPassword) {
            setErrorMessage('Passwords do not match.');
            setShowErrorPopup(true); 
            return;
        }

        setErrorMessage('');
        setShowSuccessPopup(true); // Show success popup
        setShowConfirmationPopup(true); //  confirmation popup
        setPasswordResetPrompt(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const handleConfirmChange = () => { //confirmation
      
      setShowConfirmationPopup(false); // close
      setShowSuccessPopup(true); 
   
      setValues({
          email: '',
          pin: ['', '', '', ''],
          newPassword: '',
          confirmPassword: '',
      });
  };
  

    return (
        <>
            <Header SideBar={SideBar} setSideBar={setSideBar} />
            <div className={styles.mainPage}>
                <div data-aos="fade-up" className={styles.resetContainer}>
                    <div className={styles.lockIcon}>
                        <img src="/src/assets/reset-pwlogo.svg" alt="Lock Icon" />
                    </div>

                    <h2>Trouble Logging in?</h2>
                    <p>Enter your email and we will send you a link to reset your password.</p>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className={styles.inputField}
                        value={values.email}
                        onChange={(e) => setValues({ ...values, email: e.target.value })}
                    />
                    <button className={styles.resetButton} onClick={handleResetClick}>
                        <span>Reset Password</span>
                    </button>
                </div>

                <div data-aos="fade-up" className={styles.backToLogin}>
                    <Link to="/LoginPage">Back to Log in</Link>
                </div>
            </div>

            {/* Verification pin Prompt */}
            {verificationPrompt && (
                <div data-aos="zoom-out" data-aos-duration="500" className={styles.popup}>
                    <div className={styles.popupContent}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setVerificationPrompt(false)}
                        >
                            &times;
                        </button>
                        <div className={styles.Message}>
                            <img src="/src/assets/verify-icon.png" alt="Verification Icon" className={styles.messageImage} />
                        </div>
                        <div className={styles.popupHeader}>
                            <h2>Enter Verification Code</h2>
                        </div>

                        <div className={styles.pinContainer}>
                            {values.pin.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`pin-${index}`}
                                    type="text"
                                    maxLength="1"
                                    className={styles.pinInput}
                                    value={digit}
                                    onChange={(e) => handlePinChange(index, e.target.value)}
                                />
                            ))}
                        </div>
                        <button className={styles.resetButton} onClick={handlePinSubmit}>
                            <span>Confirm</span>
                        </button>
                    </div>
                </div>
            )}

            {/* New Password Container */}
            {passwordResetPrompt && (
                <div data-aos="zoom-out" data-aos-duration="500" className={styles.popup}>
                    <div className={styles.popupContent}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setPasswordResetPrompt(false)}
                        >
                            &times;
                        </button>
                        <div className={styles.popupHeader}>
                            <h2>Set New Password</h2>
                        </div>

                        <div className={styles.inputGroup}>
                            <div className={styles.inputContainer}>
                                <input
                                    name="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    className={styles.inputField}
                                    value={values.newPassword}
                                    onChange={(e) => setValues({ ...values, newPassword: e.target.value })}
                                />
                                <div className={styles.toggleNewPasswordIcon} onClick={togglePasswordVisibility}>
                                    <img
                                        title="Show/Hide Password"
                                        src={showPassword ? '/src/assets/showPass.png' : '/src/assets/hidePass.png'}
                                        alt={showPassword ? 'Hide Password' : 'Show Password'}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <div className={styles.inputContainer}>
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    className={styles.inputField}
                                    value={values.confirmPassword}
                                    onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })}
                                />
                                <div className={styles.toggleConfirmPasswordIcon} onClick={toggleConfirmPasswordVisibility}>
                                    <img
                                        title="Show/Hide Password"
                                        src={showConfirmPassword ? '/src/assets/showPass.png' : '/src/assets/hidePass.png'}
                                        alt={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                                    />
                                </div>
                            </div>
                        </div>

                        <button className={styles.resetButton} onClick={handlePasswordSubmit}>
                            <span>Confirm</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Error Popup */}
            {showErrorPopup && (
                <div data-aos="zoom-out" data-aos-duration="500" className={styles.popup}>
                    <div className={styles.popupContent}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setShowErrorPopup(false)}
                        >
                            &times;
                        </button>
                        <div className={styles.popupHeader}>
                            <h2>Error</h2>
                        </div>
                        <p className={styles.errorText}>{errorMessage}</p>
                        <button className={styles.resetButton} onClick={() => setShowErrorPopup(false)}>
                            <span>Close</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
                <div data-aos="zoom-out" data-aos-duration="500" className={styles.popup}>
                    <div className={styles.popupContent}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setShowSuccessPopup(false)}
                        >
                            &times;
                        </button>
                        <div className={styles.popupHeader}>
                            <h2>Success</h2>
                        </div>
                        <p className={styles.successText}>Your password has been successfully reset!</p>
                        <button className={styles.resetButton} onClick={() => setShowSuccessPopup(false)}>
                            <span>Close</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Popup */}
{showConfirmationPopup && (
    <div data-aos="zoom-out" data-aos-duration="500" className={styles.popup}>
        <div className={styles.popupContent}>
            <button
                className={styles.closeButton}
                onClick={() => setShowConfirmationPopup(false)}
            >
                &times;
            </button>
            <div className={styles.popupHeader}>
                <h3>Confirm Password Change</h3>
            </div>
            <p>Are you sure you want to change your password?</p>
            <div className={styles.popupActions}>
                <button className={styles.confirmButtonYes} onClick={handleConfirmChange}>
                    <span>Yes</span>
                </button>
                <button className={styles.confirmButtonNo} onClick={() => setShowConfirmationPopup(false)}>
                    <span>No</span>
                </button>
            </div>
        </div>
    </div>
)}


        </>
    );
}

export default ForgotPass;
