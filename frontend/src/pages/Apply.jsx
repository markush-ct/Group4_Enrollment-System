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
<b>SENIOR HIGH SCHOOL GRADUATES AND ALS PASSERS:</b><br>
1. Go to the sign up link <a href="/SignUp" target="_blank"><b> "Click here to sign up"</b></a>.<br>
2. Fill up and have your email verified<br>
3. Check your registered email for your temporary login credentials.<br>
4. Sign in using the provided temporary account. Then, update your password promptly.<br>
5. Click "<b>Sign in</b>", then select “<b>Application Form</b>“ Type: <b>Freshmen</b>. Fill out all the necessary information then submit once done.<br>
6. Wait for your application result. <br>
7. Once successful, confirm your slot, then download and print the <b>Notice of Admission (NOA)</b>. Failure to confirm your slot 5(?) days after your application result has been posted will mean forfeiture of application.<br>
<br>
<b>REQUIREMENTS TO BE SUBMITTED IN SCHOOL (SENIOR HIGH SCHOOL GRADUATES):</b><br>
1. Accomplished application form with 1x1 picture and signature<br>
2. Notice of Admission (NOA)<br>
3. Original copy of Grade 12 Report Card<br>
4. Original copy of Good Moral Certificate<br>
<br>
<b>REQUIREMENTS TO BE SUBMITTED IN SCHOOL (ALS PASSERS):</b><br>
1. Accomplished application form with 1x1 picture and signature<br>
2. Notice of Admission (NOA)<br>
3. Original copy of Rating (COR) with eligibility to enroll in College<br>`,

        Transferee: `1. Go to the sign up link <a href="/SignUp" target="_blank"><b> "Click here to sign up"</b></a>.<br>
2. Fill up and have your email verified<br>
3. Check your registered email for your temporary login credentials.<br>
4. Sign in using the provided temporary account. Then, update your password promptly.<br>
5. Click “<b>Sign in</b>“, then select “<b>Application Form</b>“ Type: <b>Transferee</b>. Fill out all the necessary information then submit once done.<br>
6. Wait for your application result. <br>
<br>
<b>REQUIRED DOCUMENTS TO BE SUBMITTED IN SCHOOL:</b><br>
1. Accomplished application form with 1x1 picture and signature<br>
2. Notice of Admission (NOA)<br>
3. Original copy of Transcript of Records<br>
4. Honorable Dismissal<br>
5. Certificate of Good Moral Character<br>
6. NBI or Police Clearance<br>`,
        Shiftee: `1. Ask permission to your department head about shifting programs 15 days prior to enrollment period. <br>
2. Once permitted, Go to the sign up link <a href="/SignUp" target="_blank"><b> "Click here to sign up"</b></a>.<br>
3. Fill up and have your email verified<br>
4. Check your registered email for your temporary login credentials.<br>
5. Sign in using the provided temporary account. Then, update your password promptly.<br>
6. Click “<b>Sign in</b>“, then select “<b>Application Form</b>“ Type: <b>Shifter</b>. Fill out all the necessary information then submit once done.<br>
7. Wait for your shifting request result. <br>
<br>
<b>REQUIRED DOCUMENTS TO BE SUBMITTED IN SCHOOL:</b><br>
1. Accomplished Shifting Form with 1x1 picture and signature<br>
2. <br>
<br>
<b>REMINDER:</b><br>
1. It is not guaranteed that you can shift to IT/CS <b>unless the reason is valid</b>.<br>
2. Your strand in senior high school must be aligned to IT/CS.<br>
<b>Accepted SHS strands:</b><br>
&#8226; TVI-ICT<br>
&#8226; TVL<br>
&#8226; STEM<br>`,
        Regular:  `1. Fill up and submit registration form at <a href="/CreateAcc" target="_blank" >signup link</a>.<br>
2. Check your registered email for your temporary login credentials. <br>
3. Sign in using the provided temporary account. Then, update your password promptly.<br>
4. Click “<b>Enroll Now</b>” and check your Society Fee payment status.<br>
5. If paid, fill out the Google Form link provided. Then, submit a screenshot for proof of attendance.<br>
6. Submit soft copy of COG (make sure it is clear and legible). Fill out digital checklist and submit.<br>
7. Adviser will send an advise and the lists of courses you are eligible to take.<br>
8. Fill out the pre-enrollment form and submit.<br>
9. Check your enrollment status.<br>`,
        Irregular: `1. Fill up and submit registration form at <a href="/CreateAcc" target="_blank" >signup link</a>.<br>
2. Check your registered email for your temporary login credentials. <br>
3. Sign in using the provided temporary account. Then, update your password promptly.<br>
4. Click “<b>Enroll Now</b>” and check your Society Fee payment status.<br>
5. If paid, fill out the Google Form link provided. Then, submit a screenshot for proof of attendance.<br>
6. Submit soft copy of COG (make sure it is clear and legible). Fill out digital checklist and submit.<br>
7. Adviser will send an advise and the lists of courses you are eligible to take.<br>
8. Fill out the pre-enrollment form and submit.<br>
9. Check your enrollment status.<br>`
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
                    

                    {/* Old Stduent Section */}
                    <div data-aos="fade-up" className={styles.PageTitle2}>Enrollment Procedures For Old Students</div>

<div onClick={() => handleContainerClick("Regular")} className={styles.studentContainer}>
    <img src="/src/assets/arrow-icon.svg" alt="Arrow Icon" />
        Regular Student
</div>
<div onClick={() => handleContainerClick("Irregular")} className={styles.studentContainer}>
    <img src="/src/assets/arrow-icon.svg" alt="Arrow Icon" />
    Irregular Student
</div>

</div>

{selectedType && (
    <div data-aos="zoom-out" data-aos-duration="500" className={styles.popup}>
        <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
                <button onClick={closePopup} className={styles.closeButton}>✖</button>
                <h2>
                    {(selectedType === 'Regular' || selectedType === 'Irregular') 
                        ? 'Enrollment Procedures' 
                        : 'Application Procedures'}
                </h2>
            </div>
            <div data-aos="fade-up" className={styles.studentType}>
                <span>{selectedType}</span>
            </div>
            <div
                className={styles.popupText}
                dangerouslySetInnerHTML={{ __html: enrollmentProcess[selectedType] }}
            />
        </div>
    </div>
)}

  

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
