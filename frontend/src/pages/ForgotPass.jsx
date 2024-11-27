import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom installed
import styles from '/src/styles/ForgotPass.module.css'; 
import Header from '/src/components/Header.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';

function ForgotPass() {
  const [SideBar, setSideBar] = useState(false);
  const [values, setValues] = useState({
    email: '',
    password: ''
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
            placeholder="Email" 
            className={styles.inputField} 
          />
          <button className={styles.resetButton}><span>Reset Password</span></button> {/* TODO: Pagkaclick nito, ppopup naman container na nag aask ng verification code */}
        </div>
        {/* BACK TO LOG IN PAGE */}
        <div data-aos="fade-up" className={styles.backToLogin}>
          <Link to="/LoginPage">Back to Log in</Link>
        </div>
      </div>
    </>
  );
}

export default ForgotPass;
