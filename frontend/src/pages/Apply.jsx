import { useEffect } from 'react';
import styles from '/src/styles/Apply.module.css'; 
import { useState } from 'react';
import Header from '/src/components/Header.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Apply() {

    const [SideBar, setSideBar] = useState(false);
    SideBar ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';

    {/* FOR ANIMATION */}
    useEffect(() => {
        AOS.init({
          duration: 1000, 
          once: true, 
        });
      }, []);
    
      const enrollmentProcess = {
        Freshmen: `
SENIOR HIGH SCHOOL GRADUATES AND ALS PASSER:
1. Go to link ng application signup dito
2. Fill up and have your email verified
3. Check your registered email for your temporary login credentials.
4. Sign in using the provided temporary account. Then, update your password promptly.
5. Click “Sign in“, then select “Application Form“ Type: Freshmen. Fill out all the necessary information then submit once done.
6. Wait for your application result. 
7. Once successful, confirm your slot, then download and print the Notice of Admission (NOA). Failure to confirm your slot 5(?) days after your application result has been posted will mean forfeiture of application.

REQUIREMENTS TO BE SUBMITTED IN SCHOOL (SENIOR HIGH SCHOOL GRADUATES):
1. Accomplished application form with 1x1 picture and signature
2. Notice of Admission (NOA)
3. Original copy of Grade 12 Report Card
4. Original copy of Good Moral Certificate

REQUIREMENTS TO BE SUBMITTED IN SCHOOL (ALS PASSERS):
1. Accomplished application form with 1x1 picture and signature
2. Notice of Admission (NOA)
3. Original copy of Rating (COR) with eligibility to enroll in College`,

        Transferee: `1. Go to link ng application signup dito
2. Fill up and have your email verified
3. Check your registered email for your temporary login credentials.
4. Sign in using the provided temporary account. Then, update your password promptly.
5. Click “Sign in“, then select “Application Form“ Type: Transferee. Fill out all the necessary information then submit once done.
6. Wait for your application result. 

REQUIRED DOCUMENTS TO BE SUBMITTED IN SCHOOL:
1. Accomplished application form with 1x1 picture and signature
2. Notice of Admission (NOA)
3. Original copy of Transcript of Records
4. Honorable Dismissal
5. Certificate of Good Moral Character
6. NBI or Police Clearance`,
        Shiftee: `1. Ask permission to your department head about shifting programs 15 days prior to enrollment period. 
2. Once permitted, go to link ng application signup dito
3. Fill up and have your email verified
4. Check your registered email for your temporary login credentials.
5. Sign in using the provided temporary account. Then, update your password promptly.
6. Click “Sign in“, then select “Application Form“ Type: Shifter. Fill out all the necessary information then submit once done.
7. Wait for your shifting request result. 

REQUIRED DOCUMENTS TO BE SUBMITTED IN SCHOOL:
1. Accomplished Shifting Form with 1x1 picture and signature
2. 

REMINDER:
1. It is not guaranteed that you can shift to IT/CS unless the reason is valid.
2. Your strand in senior high school must be aligned to IT/CS.
Accepted shs strands:
TVI-ICT
TVL
STEM`,
        Regular:  `1. Fill up and submit registration form at linkditongsignuppageforoldstudents
2. Check your registered email for your temporary login credentials. 
3. Sign in using the provided temporary account. Then, update your password promptly.
4. Click “Enroll Now” and check your Society Fee payment status.
5. If paid, fill out the Google Form link provided. Then, submit a screenshot for proof of attendance.
6. Submit soft copy of COG (make sure it is clear and legible). Fill out digital checklist and submit.
7. Adviser will send an advise and the lists of courses you are eligible to take.
8. Fill out the pre-enrollment form and submit.
9. Check your enrollment status.`,
        Irregular: `1. Fill up and submit registration form at linkditongsignuppageforoldstudents
2. Check your registered email for your temporary login credentials. 
3. Sign in using the provided temporary account. Then, update your password promptly.
4. Click “Enroll Now” and check your Society Fee payment status.
5. If paid, fill out the Google Form link provided. Then, submit a screenshot for proof of attendance.
6. Submit soft copy of COG (make sure it is clear and legible). Fill out digital checklist and submit.
7. Adviser will send an advise and the lists of courses you are eligible to take.
8. Fill out the pre-enrollment form and submit.
9. Check your enrollment status.`
    };
    

        const [selectedType, setSelectedType] = useState(null);

    
        const handleContainerClick = (type) => {
            setSelectedType(type);
        };
    
        const closePopup = () => {
            setSelectedType(null);
        };
    

      




    return (
        <>
            <Header SideBar={SideBar} setSideBar={setSideBar} />
            
                {/* Parallax Section 1 */}
                <div className={`${styles.parallaxSection} ${styles.parallax1}`}>
                    <h2>CAVITE STATE UNIVERSITY</h2>
                    <h1>ADMISSIONS</h1>
                </div>

                {/* Application Section */}
                <div data-aos="fade-up"className={styles.contentSection}>
                <div data-aos="fade-up" className={styles.PageTitle}>Application Procedures</div>

                    <div onClick={() => handleContainerClick("Freshmen")} className={styles.studentContainer}>
                        <img src="/src/assets/arrow-icon.svg" alt="Arrow Icon" />
                        Freshmen
                    </div>
                    <div onClick={() => handleContainerClick("Transferee")} className={styles.studentContainer}>
                        <img src="/src/assets/arrow-icon.svg" alt="Arrow Icon" />
                        Transferee
                    </div>
                    <div onClick={() => handleContainerClick("Shiftee")} className={styles.studentContainer}>
                        <img src="/src/assets/arrow-icon.svg" alt="Arrow Icon" />
                        Shiftee
                    </div>

                    {selectedType && (
                        <div data-aos="fade-up" className={styles.popup}>
                            <div className={styles.popupContent}>
                                <div className={styles.popupHeader}>
                                <button onClick={closePopup} className={styles.closeButton}>✖</button>
                                    <h2>Application Procedures</h2>
                                    
                                  
                                </div>
                                <div data-aos="fade-up" className={styles.studentType}>
                                <span>{selectedType}</span>
                                </div>
                                <div className={styles.popupText}>
                                    {enrollmentProcess[selectedType].split('\n').map((step, index) => (
                                        <p key={index}>{step}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                        {/* Old Stduent Section */}
                        <div data-aos="fade-up" className={styles.PageTitle2}>Enrollment Procedures For Old Students</div>

                                <div onClick={() => handleContainerClick("Regular")} className={styles.studentContainer}>
                                    <img src="/src/assets/arrow-icon.svg" alt="Arrow Icon" />
                                        Regular Student
                                </div>
                                <div onClick={() => handleContainerClick("Irregular")} className={styles.studentContainer}>
                                    <img src="/src/assets/arrow-icon.svg" alt="Arrow Icon" />
                                    Regular Student
                                </div>

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

export default Apply;
