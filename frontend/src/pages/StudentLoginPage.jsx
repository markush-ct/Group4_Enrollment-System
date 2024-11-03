import { useEffect } from 'react';
import styles from '/src/styles/LoginPage.module.css'; 
import { useState } from 'react';
import Header from '/src/components/Header.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';

function StudentLoginPage() {

    const [SideBar, setSideBar] = useState(false);
    SideBar ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';

    {/* FOR ANIMATION */}
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
                {/* Regular Section */}
                <div data-aos="fade-up" className={styles.PageTitle}>Student Portal</div>
      <div data-aos="fade-up" className={styles.formContainer}>
        <form>
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <img src="/src/assets/login-userlogo.svg" alt="User Icon" />
            </div>
            <input type="text" placeholder="Username" required />
          </div>
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <img src="/src/assets/login-pwlogo.svg" alt="Lock Icon" />
            </div>
            <input type="password" placeholder="Temporary Password" required />
          </div>

          {/*Options Section */}
          <div className={styles.options}>
            <label className={styles.rememberMe}>
              <input type="checkbox" name="remember" />
              Remember Me
            </label>
            <a href="/forgot-password" className={styles.forgotPassword}>Forgot Password?</a>
          </div>

          <button type="submit" className={styles.loginButton}><span>LOGIN</span></button>
        </form>
      </div>
    </div>
                

        </>
    );
}

export default StudentLoginPage;
