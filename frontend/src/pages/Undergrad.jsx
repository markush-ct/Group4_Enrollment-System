import React from "react";
import { useEffect } from "react";
import styles from "/src/styles/Undergrad.module.css";
import { useState } from "react";
import Header from "/src/components/Header.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import educLogo from "/src/assets/EDUC-logo.svg";
import bmLogo from "/src/assets/BM-logo.svg";
import acsLogo from "/src/assets/ACS-logo.svg";
import crimLogo from "/src/assets/CRIM-logo.svg";
import hmLogo from "/src/assets/HM-logo.svg";
import itsLogo from "/src/assets/ITS-logo.svg";
import psychLogo from "/src/assets/PSYCH-logo.svg";

function Undergrad() {
  const [SideBar, setSideBar] = useState(false);
  SideBar
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "auto");

  {
    /* FOR ANIMATION */
  }
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
        {/* Parallax Section 1 */}
        <div
          className={`${styles.parallaxSection} ${styles.parallax1}`}
          data-testid="parallax-section"
        >
          <h2>CAVITE STATE UNIVERSITY</h2>
          <h1>BACOOR CAMPUS</h1>
        </div>

        <div data-aos="fade-up" className={styles.PageTitle}>
          Undergraduate Programs
        </div>

        <div data-aos="fade-up" className={styles.contentSection}>
          <h2 data-aos="fade-up">Courses Offered</h2>
          <table>
            <tbody>
              <tr>
                <td>Bachelor of Secondary Education</td>
              </tr>
              <tr>
                <td>Bachelor of Science in Business Management</td>
              </tr>
              <tr>
                <td>Bachelor of Science in Computer Science</td>
              </tr>
              <tr>
                <td>Bachelor of Science in Criminology</td>
              </tr>
              <tr>
                <td>Bachelor of Science in Hospitality Management</td>
              </tr>
              <tr>
                <td>Bachelor of Science in Information Technology</td>
              </tr>
              <tr>
                <td>Bachelor of Science in Psychology</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Soc Icon Section */}

        <div data-aos="fade-up" className={styles.SocContainers}>
          <div className={styles.iconContainer} data-testid="icon-container">
            <div className={styles.SocIcon}>
              <img src={educLogo} alt="Profile Icon" />
            </div>
            <p>Teacher Education Society</p>
          </div>
          <div className={styles.iconContainer} data-testid="icon-container">
            <div className={styles.SocIcon}>
              <img src={bmLogo} alt="Profile Icon" />
            </div>
            <p>Le Manager’s Societe</p>
          </div>
          <div className={styles.iconContainer} data-testid="icon-container">
            <div className={styles.SocIcon}>
              <img src={acsLogo} alt="Profile Icon" />
            </div>
            <p>Alliance of Computer Scientist</p>
          </div>
          <div className={styles.iconContainer} data-testid="icon-container">
            <div className={styles.SocIcon}>
              <img src={crimLogo}alt="Profile Icon" />
            </div>
            <p>La Ciencia de Crimines Sociedad</p>
          </div>
          <div className={styles.iconContainer} data-testid="icon-container">
            <div className={styles.SocIcon}>
              <img src={hmLogo} alt="Profile Icon" />
            </div>
            <p>Hospitality Management Society</p>
          </div>
          <div className={styles.iconContainer} data-testid="icon-container">
            <div className={styles.SocIcon}>
              <img src={itsLogo} alt="Profile Icon" />
            </div>
            <p>Information Technology Society</p>
          </div>
          <div className={styles.iconContainer} data-testid="icon-container">
            <div className={styles.SocIcon}>
              <img src={psychLogo} alt="Profile Icon" />
            </div>
            <p>La Liga Psicologia</p>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div
            className={styles.footerCopyright}
            data-testid="footer-copyright"
          >
            <p>
              © Copyright <span>Cavite State University</span>. All Rights
              Reserved.
            </p>
            <p>
              Designed by{" "}
              <span className={styles.highlighted}>BSCS 3-5 Group 4</span>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Undergrad;
