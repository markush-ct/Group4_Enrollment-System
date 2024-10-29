import { useEffect } from 'react';
import styles from '/src/styles/SocOff.module.css'; 
import { useState } from 'react';
import Header from '/src/components/Header.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';

function SocOff() {

    const [SideBar, setSideBar] = useState(false);
    SideBar ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';

    {/* FOR ANIMATION */}
    useEffect(() => {
        AOS.init({
          duration: 1000, 
          once: true, 
        });
      }, []);

      {/* FOR SOCIETY LIST HAHAHAHA */}
      const socData = [
        {
            name: 'ACS',
            logo: '/src/assets/ACS-logo.svg',
            officers: [
              { name: 'Jelixces Cajontoy', position: 'President' },
              { name: 'Ernest Monticalvo', position: 'Vice President' },
              { name: 'Irish Christine Purisima', position: 'Secretary' },
              { name: 'Kyla Candado', position: 'Assistant Secretary' },
              { name: 'Claire Jersey Ferrer', position: 'Treasurer' },
              { name: 'Elisar Pamotongan', position: 'Auditor' },
              { name: 'Rance Gabrielle Siroy', position: 'P.R.O.' },
              { name: 'Mary Strelline Magdamit', position: 'Assistant P.R.O.' },
              { name: 'Jonard Rustique & Ryuji Sabian', position: '1st Year Chairpersons' },
              { name: 'Von Zymon Raphael Patagnan & John Matthew Estrella', position: '2nd Year Chairpersons' },
              { name: 'Romar Cruz Mercado', position: '3rd Year Chairperson' },
              { name: 'Ervin Pangilinan', position: '4th Year Chairperson' },
              
            ],
          },
          {
            name: 'ITS',
            logo: '/src/assets/ITS-logo.svg',
            officers: [
              { name: 'Gerlyn Tan', position: 'Prime Minister' },
              { name: 'Donna Virtudez', position: 'Kupal' },
              { name: 'Neil Yvan Caliwan', position: 'Goodboy' },
              { name: 'Aubrey Gripon', position: 'Member' },
              { name: 'Jennylle Adao', position: 'Member' },
              { name: 'Rosemarie Abelon', position: 'Member' },
              { name: 'Jessica Dimailig', position: 'Member' },
              // Add more officers as needed
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
                <div className={`${styles.parallaxSection} ${styles.parallax1}`}>
                    <h2>DEPARTMENT OF COMPUTER STUDIES</h2>
                    <h1>SOCIETY OFFICERS</h1>
                </div>

                {/* Regular Section */}
                <div data-aos="fade-up" className={styles.PageTitle}>SOCIETY OFFICERS</div>
                
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
            <h2 className={styles.InstructorTitle}>Officers - {selectedSociety.name}</h2>
            {selectedSociety.officers.map((officer) => (
              <p key={officer.name}>
                <span style={{fontWeight: 600}}>{officer.position}</span>: {officer.name}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>




                {/* Footer */}
                <footer className={styles.footer}>
                    <div className={styles.footerCopyright}>
                        <p>© Copyright <span>Cavite State University</span>. All Rights Reserved</p>
                        <p>Designed by <span className={styles.highlighted}>BSCS 3-5 Group 4</span></p>
                    </div>
                </footer>
        
        </>
    );
}

export default SocOff;
