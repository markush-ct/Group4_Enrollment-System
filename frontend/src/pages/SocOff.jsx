import React from "react";
import { useEffect } from "react";
import styles from "/src/styles/SocOff.module.css";
import { useState } from "react";
import Header from "/src/components/Header.jsx";
import AOS from "aos";
import "aos/dist/aos.css";

function SocOff() {
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

  {
    /* FOR SOCIETY LIST HAHAHAHA */
  }
  const socData = [
    {
      name: "Alliance of Computer Scientist",
      logo: "/src/assets/ACS-logo.svg",
      officers: [
        { name: "Jelixces Cajontoy", position: "President" },
        { name: "Ernest Monticalvo", position: "Vice President" },
        { name: "Irish Christine Purisima", position: "Secretary" },
        { name: "Kyla Candado", position: "Assistant Secretary" },
        { name: "Claire Jersey Ferrer", position: "Treasurer" },
        { name: "Elisar Pamotongan", position: "Auditor" },
        { name: "Rance Gabrielle Siroy", position: "P.R.O." },
        { name: "Mary Strelline Magdamit", position: "Assistant P.R.O." },
        {
          name: "Jonard Rustique & Ryuji Sabian",
          position: "1st Year Chairpersons",
        },
        {
          name: "Von Zymon Raphael Patagnan & John Matthew Estrella",
          position: "2nd Year Chairpersons",
        },
        { name: "Romar Cruz Mercado", position: "3rd Year Chairperson" },
        { name: "Ervin Pangilinan", position: "4th Year Chairperson" },
      ],
    },
    {
      name: "Information Technology Society",
      logo: "/src/assets/ITS-logo.svg",
      officers: [
        { name: "Rheena Bellera", position: "President" },
        { name: "Erica Mae Zardoma", position: "Vice President" },
        { name: "Andre Ryan Flores", position: "Secretary" },
        { name: "Hazel Ann Lagundino", position: "Assistant Secretary" },
        { name: "Kathleen Anne Giro", position: "Treasurer" },
        { name: "John Arbel Balando", position: "Assistant Treasurer" },
        { name: "Kristel Heart Reyes", position: "Business Manager" },
        { name: "Adrian Picoc", position: "Auditor" },
        { name: "Kaine Marion Bacala", position: "P.R.O." },
        { name: "Jomel Tenoria", position: "GAD Representative" },
        {
          name: "Mark Emmanuel Lorenzo & Randolf Ahron Mercader",
          position: "1st Year Senator",
        },
        {
          name: "Ma. Ivy Rolea & James Bryan Laconsay",
          position: "2nd Year Senator",
        },
        { name: "Kenji Louis Pugal", position: "3rd Year Senator" },
        {
          name: "Paulo Murillo & Mitchelle Anne Mendoza",
          position: "4th Year Senator",
        },
      ],
    },
  ];

  const [selectedSociety, setSelectedSociety] = useState(null);

  const handleSocietyClick = (society) => {
    setSelectedSociety(society);
  };

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
          <h1>SOCIETY OFFICERS</h1>
        </div>

        {/* Regular Section */}
        <div data-aos="fade-up" className={styles.PageTitle}>
          SOCIETY OFFICERS
        </div>

        <div data-aos="fade-up" className={styles.TwoContainers}>
          {socData.map((society) => (
            <div
              key={society.name}
              className={styles.DcsContainer}
              onClick={() => handleSocietyClick(society)}
            >
              <div className={styles.DcsIcon}>
                <img src={society.logo} alt={`${society.name} Logo`} />
              </div>
              <h2>{society.name}</h2>
            </div>
          ))}
        </div>

        {selectedSociety && (
          <div data-aos="fade-up" className={styles.ProfContainer}>
            <div className={styles.InstructorContainer}>
              <h2 className={styles.InstructorTitle}>
                Officers - {selectedSociety.name}
              </h2>
              {selectedSociety.officers.map((officer) => (
                <p key={officer.name}>
                  <span style={{ fontWeight: 600 }}>{officer.position}</span>:{" "}
                  {officer.name}
                </p>
              ))}
            </div>
          </div>
        )}
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
    </>
  );
}

export default SocOff;
