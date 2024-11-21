import { useEffect, useState } from 'react';
import styles from '/src/styles/SignUp.module.css';
import Header from '/src/components/Header.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

function SignUp() {
    const [signUpPrompt, setsignUpPrompt] = useState(false); //success
    const [signUpMsg, setsignUpMsg] = useState("");
    const [errorPrompt, setErrorPrompt] = useState(false); //errors
    const [errorMsg, setErrorMsg] = useState("");
    const [programs, setPrograms] = useState('');
    const [error, setError] = useState('');
    const [values, setValues] = useState({
        applicantCategory: "Freshman", // default value
        firstname: '',
        middlename: '',
        lastname: '',
        lastschoolattended: '',
        email: '',
        contactnum: '',
        year: '',
        preferredProgram: '',
        studentID: '',
        prevProgram: '',
    });

    useEffect(() => {
        axios.get('http://localhost:8080/programs')
            .then(res => {
                setPrograms(res.data);
            })
            .catch(err => {
                setError('Error: ' + err);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8080/SignUp', values)
            .then((res) => {

                if (res.data.message === "Sign up successful. Wait for your temporary account to be sent through your email.") {
                    setsignUpMsg(res.data.message);
                    setsignUpPrompt(true);
                    setValues({
                        applicantCategory: "Freshman", // default value
                        firstname: '',
                        middlename: '',
                        lastname: '',
                        lastschoolattended: '',
                        email: '',
                        contactnum: '',
                        year: '',
                        preferredProgram: '',
                        studentID: '',
                        prevProgram: '',
                    })
                } else{
                    setsignUpPrompt(false);
                    setErrorPrompt(true);
                    setErrorMsg(res.data.message);
                }
            })
            .catch((err) => {
                alert("Error: " + err);
            })
    }

    const [SideBar, setSideBar] = useState(false);
    SideBar ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const handleApplicantCategoryChange = (category) => {
        setValues({ ...values, applicantCategory: category });
    };

    return (
        <>
            <Header SideBar={SideBar} setSideBar={setSideBar} />

            {/* Parallax Section 1 */}
            <div className={`${styles.parallaxSection} ${styles.parallax1}`}>
                <h2>CAVITE STATE UNIVERSITY</h2>
                <h1>DEPARTMENT OF COMPUTER STUDIES</h1>
            </div>

            {/* SIGN UP PROMPT */}
            {/* SUCCESS PROMPT */}
            {signUpPrompt && (
                <div data-aos="zoom-out" data-aos-duration="500" className={styles.popup}>
                    <div className={styles.popupContent}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setsignUpPrompt(false)}
                        >
                            &times;
                        </button>
                        <div className={styles.popupHeader}>
                            <h2>Success</h2>
                        </div>
                        <div className={styles.Message}>
                            <span>Applied Successly</span>
                        </div>
                        <p className={styles.popupText}>{signUpMsg}</p>
                    </div>
                </div>
            )}

            {/* ERROR PROMPT */}
            {errorPrompt && (
                <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupError}>
                    <div className={styles.popupContentError}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setErrorPrompt(false)}
                        >
                            &times;
                        </button>
                        <div className={styles.popupHeaderError}>
                            <h2>Error</h2>
                        </div>
                        <div className={styles.MessageError} style={{ color: '#900' }}>
                            <span>Error Occurred</span>
                        </div>
                        <p className={styles.popupTextError}>{errorMsg}</p>
                    </div>
                </div>
            )}

            {/* Application Section */}
            <div data-aos="fade-up" className={styles.contentSection}>
                <div data-aos="fade-up" className={styles.PageTitle}>Applicant Sign Up</div>
                <form onSubmit={handleSubmit}>
                    {/* Applicant Type */}
                    <div data-aos="fade-up" className={styles.radioGroup}>
                        <label>Applicant Type <span className={styles.required}>*</span></label>
                        <label>
                            <input
                                type="radio"
                                name="applicantCategory"
                                value="Freshman"
                                checked={values.applicantCategory === "Freshman"}
                                onChange={() => handleApplicantCategoryChange("Freshman")}
                            />
                            Freshman
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="applicantCategory"
                                value="Transferee"
                                checked={values.applicantCategory === "Transferee"}
                                onChange={() => handleApplicantCategoryChange("Transferee")}
                            />
                            Transferee
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="applicantCategory"
                                value="Shiftee"
                                checked={values.applicantCategory === "Shiftee"}
                                onChange={() => handleApplicantCategoryChange("Shiftee")}
                            />
                            Shiftee
                        </label>
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}

                    {/* Conditional Fields Based on Applicant Type */}
                    {values.applicantCategory === "Freshman" && (
                        <div data-aos="fade-up" className={styles.formGroup}>
                            <label>Given Name <span className={styles.required}>*</span></label>
                            <input type="text" name='firstname' value={values.firstname} onChange={(e) => setValues({ ...values, firstname: e.target.value })} required />

                            <label>Middle Name</label>
                            <input type="text" placeholder="if applicable" name='middlename' value={values.middlename} onChange={(e) => setValues({ ...values, middlename: e.target.value })} />

                            <label>Last Name <span className={styles.required}>*</span></label>
                            <input type="text" name='lastname' value={values.lastname} onChange={(e) => setValues({ ...values, lastname: e.target.value })} required />

                            <label>Name of Senior High School <span className={styles.required}>*</span></label>
                            <input type="text" name='lastschoolattended' value={values.lastschoolattended} onChange={(e) => setValues({ ...values, lastschoolattended: e.target.value })} required />

                            <label>Email <span className={styles.required}>*</span></label>
                            <input type="email" name='email' value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} required />

                            <label>Contact Number <span className={styles.required}>*</span></label>
                            <input type="text" name='contactnum' value={values.contactnum} onChange={(e) => setValues({ ...values, contactnum: e.target.value })} required />

                            <label>Academic Preference <span className={styles.required}>*</span></label>
                            <select name='preferredProgram' value={values.preferredProgram} onChange={(e) => setValues({ ...values, preferredProgram: e.target.value })} required >
                                <option value="" selected disabled>Select your preferred program</option>
                                {programs.length > 0 ? (
                                    programs.map((row) => (
                                        <option key={row.programID} value={row.programID}>{row.programName}</option>
                                    ))
                                ) : ''}
                            </select>
                        </div>
                    )}

                    {values.applicantCategory === "Transferee" && (
                        <div data-aos="fade-up" className={styles.formGroup}>
                            <label>Given Name <span className={styles.required}>*</span></label>
                            <input type="text" name='firstname' value={values.firstname} onChange={(e) => setValues({ ...values, firstname: e.target.value })} required />

                            <label>Middle Name</label>
                            <input type="text" placeholder="if applicable" name='middlename' value={values.middlename} onChange={(e) => setValues({ ...values, middlename: e.target.value })} />

                            <label>Last Name <span className={styles.required}>*</span></label>
                            <input type="text" name='lastname' value={values.lastname} onChange={(e) => setValues({ ...values, lastname: e.target.value })} required />

                            <label>Name of Last School Attended <span className={styles.required}>*</span></label>
                            <input type="text" name='lastschoolattended' value={values.lastschoolattended} onChange={(e) => setValues({ ...values, lastschoolattended: e.target.value })} required />

                            <label>Email <span className={styles.required}>*</span></label>
                            <input type="email" name='email' value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} required />

                            <label>Contact Number <span className={styles.required}>*</span></label>
                            <input type="text" name='contactnum' value={values.contactnum} onChange={(e) => setValues({ ...values, contactnum: e.target.value })} required />

                            <label>Academic Preference <span className={styles.required}>*</span></label>
                            <select name='preferredProgram' value={values.preferredProgram} onChange={(e) => setValues({ ...values, preferredProgram: e.target.value })} required >
                                <option value="" selected disabled>Select academic preference</option>
                                {programs.length > 0 ? (
                                    programs.map((row) => (
                                        <option key={row.programID} value={row.programID}>{row.programName}</option>
                                    ))
                                ) : ''}
                            </select>
                        </div>
                    )}

                    {values.applicantCategory === "Shiftee" && (
                        <div data-aos="fade-up" className={styles.formGroup}>
                            <label>Given Name <span className={styles.required}>*</span></label>
                            <input type="text" name='firstname' value={values.firstname} onChange={(e) => setValues({ ...values, firstname: e.target.value })} required />

                            <label>Middle Name</label>
                            <input type="text" placeholder="if applicable" name='middlename' value={values.middlename} onChange={(e) => setValues({ ...values, middlename: e.target.value })} />

                            <label>Last Name <span className={styles.required}>*</span></label>
                            <input type="text" name='lastname' value={values.lastname} onChange={(e) => setValues({ ...values, lastname: e.target.value })} required />

                            <label>Student ID <span className={styles.required}>*</span></label>
                            <input type="text" value={values.studentID} onChange={(e) => setValues({ ...values, studentID: e.target.value })} required />

                            <label>Previous Program <span className={styles.required}>*</span></label>
                            <select name="prevProgram" value={values.prevProgram} onChange={(e) => setValues({ ...values, prevProgram: e.target.value })} required >
                                <option value="" selected disabled>Select your previous program</option>
                                <option value="Bachelor of Secondary Education">Bachelor of Secondary Education</option>
                                <option value="Bachelor of Science in Business Management">Bachelor of Science in Business Management</option>
                                <option value="Bachelor of Science in Criminology">Bachelor of Science in Criminology</option>
                                <option value="Bachelor of Science in Hospitality Management">Bachelor of Science in Hospitality Management</option>
                                <option value="Bachelor of Science in Psychology">Bachelor of Science in Psychology</option>
                            </select>

                            <label>Year <span className={styles.required}>*</span></label>
                            <select name="year" value={values.year} onChange={(e) => setValues({ ...values, year: e.target.value })} required>
                                <option value="" selected disabled>Select your current year</option>
                                <option value="First Year">First Year</option>
                                <option value="Second Year">Second Year</option>
                                <option value="Third Year">Third Year</option>
                                <option value="Mid-Year">Mid-Year</option>
                                <option value="Fourth Year">Fourth Year</option>
                            </select>

                            <label>CvSU Email <span className={styles.required}>*</span></label>
                            <input type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} required />

                            <label>Academic Preference <span className={styles.required}>*</span></label>
                            <select name='preferredProgram' onChange={(e) => setValues({ ...values, preferredProgram: e.target.value })} value={values.preferredProgram} required>
                                <option value="" selected disabled>Select academic preference</option>
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
