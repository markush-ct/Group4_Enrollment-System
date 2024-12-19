import React from 'react';
import { useEffect } from 'react';
import styles from '/src/styles/CvsuHistory.module.css'; 
import { useState } from 'react';
import Header from '/src/components/Header.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';

function CvsuHistory() {

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
                <div className={`${styles.parallaxSection} ${styles.parallax1}`} data-testid="parallax-section">
                    <h2>CAVITE STATE UNIVERSITY</h2>
                    <h1>HISTORY</h1>
                </div>

                {/* Regular Section */}
                <div data-aos="fade-up" className={styles.contentSection}>
                    <h2 data-aos="fade-up">About CvSU</h2>
                    <p data-aos="fade-up">The Cavite State University (CvSU) has its humble beginnings in 1906 as the 
                        Indang Intermediate School with the American Thomasites as the first teachers. 
                        Several transformations in the name of the school took place; Indang Farm School in 1918, 
                        Indang Rural High School in 1927, and Don Severino National Agriculture School in 1958. 
                        In 1964, the school was converted into a State College by virtue of Republic Act 3917 and 
                        became known as Don Severino Agricultural College (DSAC).</p>
                    <p data-aos="fade-up">On January 22, 1998, by virtue of Republic Act No.8468, DSAC was converted into Cavite State University. 
                        In 2001, Cavite College of Fisheries (CACOF) in Naic, Cavite and Cavite College of 
                        Arts and Trade (CCAT) in Rosario, Cavite, were integrated to the University by virtue 
                        of CHED Memo No. 27 s. 2000. Since then, additional campuses in the province were 
                        established through memoranda of agreement with the LGUs. At present, CvSU has 11 
                        campuses in the province. The main campus, approximately 70 hectares in land area 
                        and named as Don Severino delas Alas Campus, is in Indang, Cavite.</p>
                    <p data-aos="fade-up">CvSU is mandated “to provide excellent, equitable and relevant educational 
                        opportunities in the arts, sciences and technology through quality instruction, 
                        and responsive research and development activities. It shall produce professional, 
                        skilled and morally upright individuals for global competitiveness.”</p>
                    <p data-aos="fade-up">The University is offering close to 100 curricular programs in the undergraduate 
                        and graduate levels. It has more than 25,000 students and 1,200 faculty and staff 
                        from all campuses. The University is also authorized to certify and confer appropriate 
                        academic degrees in accordance with the Expanded Tertiary Education and Accreditation 
                        Program (ETEEAP). It has been accredited by TESDA as Trade and Testing Venue, and 
                        designated by the Department of Agriculture as the National Center for Research and 
                        Development for Coffee and Urban Agriculture. It also hosts the Southern Tagalog 
                        Agriculture Research and Development Consortium (STARDEC), the Affiliated Renewable 
                        Energy Center for Region IV-A, and the Regional ICT Center for Region IV-A.</p>
                    <p data-aos="fade-up">CvSU adheres to its commitment to Truth, Excellence and Service as it aims to 
                        be the “premier University in historic Cavite recognized for excellence in the 
                        development of globally competitive and morally upright individuals”.</p>
        


                </div>

                {/* Footer */}
                <footer className={styles.footer}>
                    <div className={styles.footerCopyright}>
                        <p>© Copyright <span>Cavite State University</span>. All Rights Reserved.</p>
                        <p>Designed by <span className={styles.highlighted}>BSCS 3-5 Group 4</span></p>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default CvsuHistory;
