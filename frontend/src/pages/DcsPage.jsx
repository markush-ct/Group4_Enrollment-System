import React from "react";
import { useEffect } from "react";
import styles from "/src/styles/DcsPage.module.css";
import { useState } from "react";
import Header from "/src/components/Header.jsx";
import AOS from "aos";
import "aos/dist/aos.css";

function DcsPage() {
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

  const Instructor = [
    "Mikaela Arciaga",
    "Stephen Bacolor",
    "Steffanie Bato, MIT",
    "Edan Belgica",
    "Ralph Christian Bolarda",
    "Jerico Castillo, LPT",
    "Mariel Castillo, LPT",
    "Rafael Carvajal",
    "Alvin Catalo, LPT",
    "Alvin Celino",
    "Rufino Dela Cruz",
    "Lawrence Jimenez",
    "Julios Mojas",
    "Richard Ongayo",
    "Aida Penson, LPT",
    "Nestor Miguel Pimentel",
    "Joven Rios",
    "Rachel Rodriguez",
    "Clarissa Rostrollo",
    "Jessica Sambrano, LPT",
    "Benedick Sarmiento",
    "Jerome Tacata",
    "Russel Villareal, LPT",
    "Redem Decipulo",
    "Jen Jerome Dela Peña, LPT",
    "Roi Francisco",
    "James Mañozo, LPT",
    "Lorenzo Moreno Jr.",
    "Jay-Ar Racadio",
    "Alvina Ramallosa",
    "Niño Rodil",
    "Ryan Paul Roy, LPT",
    "Clarence Salvador",
    "Cesar Talibong II",
  ];

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.mainPage}>
        {/* Parallax Section 1 */}
        <div
          className={`${styles.parallaxSection} ${styles.parallax1}`}
          data-testid="parallax-section"
        >
          <h2>DEPARTMENT OF COMPUTER STUDIES</h2>
          <h1>FACULTY</h1>
        </div>

        {/* Regular Section */}
        <div data-aos="fade-up" className={styles.PageTitle}>
          DEPARTMENT OF COMPUTER STUDIES
        </div>
        <div data-aos="fade-up" className={styles.mainContainer}>
          <div data-aos="fade-up" className={styles.DcsContainer}>
            <div className={styles.DcsIcon}>
              <img src="/src/assets/profile-icon.svg" alt="Profile Icon" />
            </div>
            <h2>Donnalyn B. Montallana, MIT</h2>
            <p>DCS Chairperson</p>
          </div>
        </div>
        <div data-aos="fade-up" className={styles.TwoContainers}>
          <div className={styles.DcsContainer}>
            <div className={styles.DcsIcon}>
              <img src="/src/assets/profile-icon.svg" alt="Profile Icon" />
            </div>
            <h2>ELy Rose L. Panganiban-Briones, MIT</h2>
            <p>CS Program Head</p>
          </div>
          <div className={styles.DcsContainer}>
            <div className={styles.DcsIcon}>
              <img src="/src/assets/profile-icon.svg" alt="Profile Icon" />
            </div>
            <h2>Jovelyn D. Ocampo, MIT</h2>
            <p>IT Program Head</p>
          </div>
        </div>

        <div data-aos="fade-up" className={styles.ProfContainer}>
          <div className={styles.InstructorContainer}>
            <h2 className={styles.InstructorTitle}>INSTRUCTORS</h2>
            <div className={styles.InstructorGrid}>
              {Instructor.map((Instructor, index) => (
                <span key={index} className={styles.InstructorName}>
                  {Instructor}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer} data-testid="footer-copyright">
          <div className={styles.footerCopyright}>
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

export default DcsPage;
