import { useEffect } from 'react';
import styles from '/src/styles/SignUp.module.css'; 
import { useState } from 'react';
import Header from '/src/components/Header.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

function SignUp() {
    const [programs, setPrograms] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        axios.post('http://localhost:8080/SignUp')
        .then(res => {
            setPrograms(res.data);
        })
        .catch(err => {
            setError('Error from frontend' + err);
        })
    })

    const [SideBar, setSideBar] = useState(false);
    SideBar ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';

    {/* FOR ANIMATION */}
    useEffect(() => {
        AOS.init({
          duration: 1000, 
          once: true, 
        });
      }, []);


      const [applicantCategory, setApplicantCategory] = useState("Freshmen");
    
    return (
        <>
            <Header SideBar={SideBar} setSideBar={setSideBar} />
            
                {/* Parallax Section 1 */}
                <div className={`${styles.parallaxSection} ${styles.parallax1}`}>
                    <h2>CAVITE STATE UNIVERSITY</h2>
                    <h1>DEPARTMENT OF COMPUTER STUDIES</h1>
                </div>

                {/* Application Section */}
                
        <div data-aos="fade-up" className={styles.contentSection}>
            <div data-aos="fade-up" className={styles.PageTitle}>Applicant Sign Up</div>
            <form>
                {/* Applicant Tyep */}
                <div data-aos="fade-up" className={styles.radioGroup}>
                <label>Applicant Type <span className={styles.required}>*</span></label>
                    <label>
                        <input
                            type="radio"
                            name="applicantCategory"
                            value="Freshmen"
                            checked={applicantCategory === "Freshmen"}
                            onChange={() => setApplicantCategory("Freshmen")}
                        />
                        Freshmen
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="applicantCategory"
                            value="Transferee"
                            checked={applicantCategory === "Transferee"}
                            onChange={() => setApplicantCategory("Transferee")}
                        />
                        Transferee
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="applicantCategory"
                            value="Shiftee"
                            checked={applicantCategory === "Shiftee"}
                            onChange={() => setApplicantCategory("Shiftee")}
                        />
                        Shiftee
                    </label>
                </div>
                
                {error && <p className={styles.errorMessage}>{error}</p>}
                {/* Conditional Fields Based on Applicant Type */}
                {applicantCategory === "Freshmen" && (                       
                    
                    
                    <div data-aos="fade-up" className={styles.formGroup}>
                    <label>Given Name <span className={styles.required}>*</span></label>
                    <input type="text" placeholder="Given Name" required />

                    <label>Middle Name</label>
                    <input type="text" placeholder="Middle Name" />

                    <label>Last Name <span className={styles.required}>*</span></label>
                    <input type="text" placeholder="Last Name" required />

                    <label>Name of Senior High School <span className={styles.required}>*</span></label>
                    <input type="text" placeholder="Name of Senior High School" required />

                    <label>Email <span className={styles.required}>*</span></label>
                    <input type="email" placeholder="Email" required />

                    <label>Contact Number <span className={styles.required}>*</span></label>
                    <input type="text" placeholder="Contact Number" required />

                    <label>Academic Preference <span className={styles.required}>*</span></label>
                    <select required>
                        <option value="" selected disabled>Select Academic Preference</option>
                        {programs.length > 0 ? (
                            programs.map((row) => (
                                <option key={row.programID} value={row.programID}>{row.programName}</option>
                            ))
                        ) : ''}
                    </select>
                </div>

                )}

                {applicantCategory === "Transferee" && (
                    <div data-aos="fade-up" className={styles.formGroup}>
                    <label>Given Name <span className={styles.required}>*</span></label>
                    <input type="text" placeholder="Given Name" required />

                    <label>Middle Name</label>
                    <input type="text" placeholder="Middle Name" />

                    <label>Last Name <span className={styles.required}>*</span></label>
                    <input type="text" placeholder="Last Name" required />

                    <label>Name of Last School Attended <span className={styles.required}>*</span></label>
                    <input type="text" placeholder="Name of Last School Attended" required />

                    <label>Email <span className={styles.required}>*</span></label>
                    <input type="email" placeholder="Email" required />

                    <label>Contact Number <span className={styles.required}>*</span></label>
                    <input type="text" placeholder="Contact Number" required />

                    <label>Academic Preference <span className={styles.required}>*</span></label>
                    <select required>
                        <option value="" selected disabled>Select Academic Preference</option>
                        {programs.length > 0 ? (
                            programs.map((row) => (
                                <option key={row.programID} value={row.programID}>{row.programName}</option>
                            ))
                        ) : ''}
                    </select>
                </div>

                )}

                {applicantCategory === "Shiftee" && (
                    <div data-aos="fade-up" className={styles.formGroup}>
                    <label>Given Name <span className={styles.required}>*</span></label>
                    <input type="text" placeholder="Given Name" required />

                    <label>Middle Name</label>
                    <input type="text" placeholder="Middle Name" />

                    <label>Last Name <span className={styles.required}>*</span></label>
                    <input type="text" placeholder="Last Name" required />

                    <label>Student ID <span className={styles.required}>*</span></label>
                    <input type="text" placeholder="Student ID" required />

                    <label>Previous Program <span className={styles.required}>*</span></label>
                    <select required>
                        <option value="" selected disabled>Select Previous Program</option>
                        <option value="Bachelor of Secondary Education">Bachelor of Secondary Education</option>
                        <option value="Bachelor of Science in Business Management">Bachelor of Science in Business Management</option>
                        <option value="Bachelor of Science in Criminology">Bachelor of Science in Criminology</option>
                        <option value="Bachelor of Science in Hospitality Management">Bachelor of Science in Hospitality Management</option>
                        <option value="Bachelor of Science in Psychology">Bachelor of Science in Psychology</option>
                    </select>

                    <label>Year and Section <span className={styles.required}>*</span></label>
                    <input type="text" placeholder="Year and Section" required />

                    <label>CvSU Email <span className={styles.required}>*</span></label>
                    <input type="email" placeholder="CvSU Email" required />

                    <label>Academic Preference <span className={styles.required}>*</span></label>
                    <select required>
                        <option value="">Select Academic Preference</option>
                        {programs.length > 0 ? (
                            programs.map((row) => (
                                <option key={row.programID} value={row.programID}>{row.programName}</option>
                            ))
                        ) : ''}
                    </select>
                </div>

                

                )}
            {/* Register Button */}
            <div className={styles.buttonContainer}>
            <button type="submit" className={styles.registerButton}>
                    <span>Register</span>
                </button></div>
            </form>
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

export default SignUp;
