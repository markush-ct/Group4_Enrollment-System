import { useEffect } from 'react';
import styles from '/src/styles/Undergrad.module.css'; 
import { useState } from 'react';
import Header from '/src/components/Header.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Undergrad() {

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
                {/* Parallax Section 1 */}
                <div className={`${styles.parallaxSection} ${styles.parallax1}`}>
                    <h2>CAVITE STATE UNIVERSITY</h2>
                    <h1>BACOOR CAMPUS</h1>
                </div>

                <div data-aos="fade-up" className={styles.PageTitle}>Undergraduate Programs</div>

                <div data-aos="fade-up" className={styles.contentSection}>
                    
                    <h2 data-aos="fade-up">Courses Offered</h2>
                    <table>
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
                    </table>
                </div>

                {/* Soc Icon Section */}
                
            
            <div data-aos="fade-up" className={styles.SocContainers}>
                <div className={styles.iconContainer}>
                    <div className={styles.SocIcon}>
                        <img src="/src/assets/EDUC-logo.svg" alt="Profile Icon" />
                    </div>
                    <p>Teacher Education Society</p>
                </div>
                <div className={styles.iconContainer}>
                    <div className={styles.SocIcon}>
                        <img src="/src/assets/BM-logo.svg" alt="Profile Icon" />
                    </div>
                    <p>Le Manager’s Societe</p>
                </div>
                <div className={styles.iconContainer}>
                    <div className={styles.SocIcon}>
                        <img src="/src/assets/ACS-logo.svg" alt="Profile Icon" />
                    </div>
                    <p>Alliance of Computer Scientist</p>
                </div>
                <div className={styles.iconContainer}>
                    <div className={styles.SocIcon}>
                        <img src="/src/assets/CRIM-logo.svg" alt="Profile Icon" />
                    </div>
                    <p>La Ciencia de Crimines Sociedad</p>
                </div>
                <div className={styles.iconContainer}>
                    <div className={styles.SocIcon}>
                        <img src="/src/assets/HM-logo.svg" alt="Profile Icon" />
                    </div>
                    <p>Hospitality Management Society</p>
                </div>
                <div className={styles.iconContainer}>
                    <div className={styles.SocIcon}>
                        <img src="/src/assets/ITS-logo.svg" alt="Profile Icon" />
                    </div>
                    <p>Information Technology Society</p>
                </div>
                <div className={styles.iconContainer}>
                    <div className={styles.SocIcon}>
                        <img src="/src/assets/PSYCH-logo.svg" alt="Profile Icon" />
                    </div>
                    <p>La Liga Psicologia</p>
                </div>
            
            </div>

            
      





                {/* Footer */}
                <footer className={styles.footer}>
                    <div className={styles.footerCopyright}>
                        <p>© Copyright <span>Cavite State University</span>. All Rights Reserved</p>
                        <p>Designed by <span className={styles.highlighted}>BSCS 3-5 Group 4</span></p>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default Undergrad;
