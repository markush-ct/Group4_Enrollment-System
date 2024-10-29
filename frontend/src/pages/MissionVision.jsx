import { useEffect } from 'react';
import styles from '/src/styles/MissionVision.module.css'; 
import { useState } from 'react';
import Header from '/src/components/Header.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';

function MissionVision() {

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
                    <h1>Mission, Vision and Core Values</h1>
                </div>

                {/* Regular Section */}
                <div data-aos="fade-up" className={styles.contentSection}>
                    <h2 data-aos="fade-up">Mission</h2>
                    <p data-aos="fade-up">Cavite State University shall provide excellent, equitable and 
                        relevant educational opportunities in the arts, sciences and 
                        technology through quality instruction and responsive research 
                        and development activities. It shall produce professional, skilled
                         and morally upright individuals for global competitiveness.</p>

                    <h2 data-aos="fade-up"><i>Hangarin ng Pamantasan</i></h2>
                    <p data-aos="fade-up"><i>“Ang Cavite State university ay makapagbigay ng mahusay, pantay at 
                        makabuluhang edukasyon sa sining, agham at teknolohiya sa pamamagitan 
                        ng may kalidad na pagtuturo at tumutugon sa pangangailangang pananaliksik
                         at mga gawaing pangkaunlaran. Makalikha ito ng mga indibidwal ng dalubhasa, 
                         may kasaysayan at kagandahan-asal sa pandaigdigang kakayahan.”</i></p>
                         <br></br>
                         <br></br>
                
                    <h2 data-aos="fade-up">Vision</h2>
                    <p data-aos="fade-up">The premier university in historic Cavite globally recognized for
                         excellence in character development, academics, research, innovation
                          and sustainable community engagement.</p>

                    <h2 data-aos="fade-up"><i>Mithiin ng Pamantasan</i></h2>
                    <p data-aos="fade-up"><i>“Ang nangungunang pamantasan sa makasaysayang Kabite na kinikilala sa 
                        kahusayan sa paghubog ng mga indibidwal na may pandaigdigang kakayahan at
                         kagandahang asal.”</i></p>
                         
                    <br></br>
                    <br></br>

                    <h2 data-aos="fade-up">Quality Policy</h2>
                    <p data-aos="fade-up">We <span style={{ color: '#129406', fontSize: '30px' }}>C</span>ommit to the highest standards of education, 
                            <span style={{ color: '#129406', fontSize: '30px' }}>V</span>alue our 
                        stakeholders, <span style={{ color: '#129406', fontSize: '30px' }}>S</span>trive for continual improvement of our products 
                        and services, and <span style={{ color: '#129406', fontSize: '30px' }}>U</span>phold the University’s tenets of Truth, Excellence, 
                        and Service to produce globally competitive and morally upright individuals.</p>

                        <br></br>
                         <br></br>
                         <br></br>
                
                    <h2 data-aos="fade-up" style={{ textAlign: 'center' }}>Core Values</h2>
                    <p data-aos="fade-up" className={styles.CoreValues}>Truth&emsp;  &emsp; Excellence &emsp; &emsp; Service</p>
                    <br></br>


                    <h2 data-aos="fade-up">Goals of the CvSU Bacoor City Campus</h2>
                    <p data-aos="fade-up">In support to the Vision and Mission of the
                     University, CvSU – Bacoor City Campus shall:</p>
                     <p data-aos="fade-up" className={styles.boxText}>1. provide quality and affordable education which promotes 
                        intellectual growth, academic excellence and moral integrity;<br></br><br></br>
                        2. prepare students to meet the demands of the global market and respond to the society’s needs;<br></br><br></br>
                        3. develop innovative and scholarly researchers who have the ability to create new 
                        understanding in quest for quality 
                        research through inquiry, analysis and problem solving; and<br></br><br></br>
                        4. produce globally competitive graduates with full competence in their fields of study.</p>


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

export default MissionVision;
