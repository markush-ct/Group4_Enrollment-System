import { useState, useEffect } from 'react';
import styles from '/src/styles/CreateAcc.module.css';
import Header from '/src/components/Header.jsx';
import AOS from 'aos';
import axios from 'axios';
import 'aos/dist/aos.css';

function CreateAcc() {
    const [signUpPrompt, setsignUpPrompt] = useState(false); //success
    const [signUpMsg, setsignUpMsg] = useState("");
    const [errorPrompt, setErrorPrompt] = useState(false); //errors
    const [errorMsg, setErrorMsg] = useState("");
    const [SideBar, setSideBar] = useState(false);
    const [programs, setPrograms] = useState('');
    const [values, setValues] = useState({
        applicantCategory: "Regular/Irregular", // default value
        firstname: '',
        middlename: '',
        lastname: '',
        studentID: '',
        employeeID: '',
        email: '',
        contactnum: '',
        program: '',
        regIrreg: '',
        position: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8080/CreateAcc', values)
            .then((res) => {
                if (res.data.message === "Sign up successful. Wait for your temporary account to be sent through your email.") {
                    setsignUpPrompt(true);
                    setsignUpMsg(res.data.message);
                    setValues({
                        applicantCategory: "Regular/Irregular", // default value
                        firstname: '',
                        middlename: '',
                        lastname: '',
                        studentID: '',
                        employeeID: '',
                        email: '',
                        contactnum: '',
                        program: '',
                        regIrreg: '',
                        position: ''
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

    useEffect(() => {
        document.body.style.overflow = SideBar ? 'hidden' : 'auto';
    }, [SideBar]);


    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8080/programs')
            .then(res => {
                setPrograms(res.data);
            })
            .catch(err => {
                setError('Error: ' + err);
            });
    }, []);

    const handleApplicantCategoryChange = (category) => {
        setValues({ ...values, applicantCategory: category });
    };

    return (
        <>
            <Header SideBar={SideBar} setSideBar={setSideBar} />

            {/* Parallax Section */}
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
                            <span>Account Created</span>
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

            {/* Create Account Form */}
            <div data-aos="fade-up" className={styles.contentSection}>
                <div className={styles.PageTitle} data-aos="fade-up">Create Account</div>
                <form onSubmit={handleSubmit}>
                    {/* Account Type */}
                    <div data-aos="fade-up" className={styles.radioGroup}>
                        <label>Account Type <span className={styles.required}>*</span></label>
                        <label>
                            <input
                                type="radio"
                                name="applicantCategory"
                                value="Regular/Irregular"
                                checked={values.applicantCategory === "Regular/Irregular"}
                                onChange={() => handleApplicantCategoryChange("Regular/Irregular")}
                            />
                            Regular/Irregular
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="applicantCategory"
                                value="Society Officer"
                                checked={values.applicantCategory === "Society Officer"}
                                onChange={() => handleApplicantCategoryChange("Society Officer")}
                            />
                            Society Officer
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="applicantCategory"
                                value="Employee"
                                checked={values.applicantCategory === "Employee"}
                                onChange={() => handleApplicantCategoryChange("Employee")}
                            />
                            Employee
                        </label>
                    </div>

                    {/* CONDITION FOR ACCOUNT TYPE */}
                    {values.applicantCategory === "Regular/Irregular" && (
                        <div data-aos="fade-up" className={styles.formGroup}>
                            <label>Given Name <span className={styles.required}>*</span></label>
                            <input type="text" name='firstname' value={values.firstname} onChange={(e) => setValues({ ...values, firstname: e.target.value })} required />

                            <label>Middle Name</label>
                            <input type="text" placeholder="if applicable" name='middlename' value={values.middlename} onChange={(e) => setValues({ ...values, middlename: e.target.value })} />

                            <label>Last Name <span className={styles.required}>*</span></label>
                            <input type="text" name='lastname' value={values.lastname} onChange={(e) => setValues({ ...values, lastname: e.target.value })} required />

                            <label>Student ID <span className={styles.required}>*</span></label>
                            <input type="text" name='studentID' value={values.studentID} onChange={(e) => setValues({ ...values, studentID: e.target.value })} required />

                            <label>CvSU Email <span className={styles.required}>*</span></label>
                            <input type="email" name='email' value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} required />

                            <label>Phone Number <span className={styles.required}>*</span></label>
                            <input type="text" name='contactnum' value={values.contactnum} onChange={(e) => setValues({ ...values, contactnum: e.target.value })} required />

                            <label>Program <span className={styles.required}>*</span></label>
                            <select name='program' value={values.program} onChange={(e) => setValues({ ...values, program: e.target.value })} required >
                                <option value="" selected disabled>Select your program</option>
                                {programs.length > 0 ? (
                                    programs.map((row) => (
                                        <option key={row.programID} value={row.programID}>{row.programName}</option>
                                    ))
                                ) : ''}
                            </select>

                            <label>Regular or Irregular <span className={styles.required}>*</span></label>
                            <select name='regIrreg' value={values.regIrreg} onChange={(e) => setValues({ ...values, regIrreg: e.target.value })} required >
                                <option value="" selected disabled>Select here</option>
                                <option value="Regular">Regular</option>
                                <option value="Irregular">Irregular</option>
                            </select>
                        </div>
                    )}

                    {values.applicantCategory === "Society Officer" && (
                        <div data-aos="fade-up" className={styles.formGroup}>
                            <label>Given Name <span className={styles.required}>*</span></label>
                            <input type="text" name='firstname' value={values.firstname} onChange={(e) => setValues({ ...values, firstname: e.target.value })} required />

                            <label>Middle Name</label>
                            <input type="text" placeholder="if applicable" name='middlename' value={values.middlename} onChange={(e) => setValues({ ...values, middlename: e.target.value })} />

                            <label>Last Name <span className={styles.required}>*</span></label>
                            <input type="text" name='lastname' value={values.lastname} onChange={(e) => setValues({ ...values, lastname: e.target.value })} required />

                            <label>Personal Email <span className={styles.required}>*</span></label>
                            <input type="email" name='email' value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} required />

                            <label>Phone Number <span className={styles.required}>*</span></label>
                            <input type="text" name='contactnum' value={values.contactnum} onChange={(e) => setValues({ ...values, contactnum: e.target.value })} required />

                            <label>Program <span className={styles.required}>*</span></label>
                            <select name='program' value={values.program} onChange={(e) => setValues({ ...values, program: e.target.value })} required >
                                <option value="" selected disabled>Select your program</option>
                                {programs.length > 0 ? (
                                    programs.map((row) => (
                                        <option key={row.programID} value={row.programID}>{row.programName}</option>
                                    ))
                                ) : ''}
                            </select>

                            {/* POSITION PER PROGRAM */}
                            {values.program === "2" && (
                                <>
                                    <label>Position <span className={styles.required}>*</span></label>
                                    <select name="position" value={values.position} onChange={(e) => setValues({ ...values, position: e.target.value })} required>
                                        <option value="" disabled>Select Position</option>
                                        <option value="President">President</option>
                                        <option value="Vice President">Vice President</option>
                                        <option value="Secretary">Secretary</option>
                                        <option value="Assistant Secretary">Assistant Secretary</option>
                                        <option value="Treasurer">Treasurer</option>
                                        <option value="Assistant Treasurer">Assistant Treasurer</option>
                                        <option value="Business Manager">Business Manager</option>
                                        <option value="Auditor">Auditor</option>
                                        <option value="P.R.O.">P.R.O.</option>
                                        <option value="GAD Representative">GAD Representative</option>
                                        <option value="1st Year Senator">1st Year Senator</option>
                                        <option value="2nd Year Senator">2nd Year Senator</option>
                                        <option value="3rd Year Senator">3rd Year Senator</option>
                                        <option value="4th Year Senator">4th Year Senator</option>
                                    </select>
                                </>
                            )}

                            {values.program === "1" && (
                                <>
                                    <label>Position <span className={styles.required}>*</span></label>
                                    <select name="position" value={values.position} onChange={(e) => setValues({ ...values, position: e.target.value })} required>
                                        <option value="" disabled>Select Position</option>
                                        <option value="President">President</option>
                                        <option value="Vice President">Vice President</option>
                                        <option value="Secretary">Secretary</option>
                                        <option value="Assistant Secretary">Assistant Secretary</option>
                                        <option value="Treasurer">Treasurer</option>
                                        <option value="Auditor">Auditor</option>
                                        <option value="P.R.O.">P.R.O.</option>
                                        <option value="Assistant P.R.O.">Assistant P.R.O.</option>
                                        <option value="1st Year Chairperson">1st Year Chairperson</option>
                                        <option value="2nd Year Chairperson">2nd Year Chairperson</option>
                                        <option value="3rd Year Chairperson">3rd Year Chairperson</option>
                                        <option value="4th Year Chairperson">4th Year Chairperson</option>
                                    </select>
                                </>
                            )}
                        </div>
                    )}

                    {values.applicantCategory === "Employee" && (
                        <div data-aos="fade-up" className={styles.formGroup}>
                            <label>Given Name <span className={styles.required}>*</span></label>
                            <input type="text" name='firstname' value={values.firstname} onChange={(e) => setValues({ ...values, firstname: e.target.value })} required />

                            <label>Middle Name</label>
                            <input type="text" placeholder="if applicable" name='middlename' value={values.middlename} onChange={(e) => setValues({ ...values, middlename: e.target.value })} />

                            <label>Last Name <span className={styles.required}>*</span></label>
                            <input type="text" name='lastname' value={values.lastname} onChange={(e) => setValues({ ...values, lastname: e.target.value })} required />

                            <label>Employee ID <span className={styles.required}>*</span></label>
                            <input type="text" name='employeeID' value={values.employeeID} onChange={(e) => setValues({ ...values, employeeID: e.target.value })} required />

                            <label>CvSU Email <span className={styles.required}>*</span></label>
                            <input type="email" name='email' value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} required />

                            <label>Phone Number <span className={styles.required}>*</span></label>
                            <input type="text" name='contactnum' value={values.contactnum} onChange={(e) => setValues({ ...values, contactnum: e.target.value })} required />

                            <label>Job/Role <span className={styles.required}>*</span></label>
                            <select name='position' value={values.position} onChange={(e) => setValues({ ...values, position: e.target.value })} required>
                                <option value="" disabled>Select Job/Role</option>
                                <option value="Enrollment Officer">Enrollment Officer</option>
                                <option value="Adviser">Adviser</option>
                                <option value="DCS Head">DCS Head</option>
                                <option value="School Head">School Head</option>
                            </select>


                            {(values.position === 'DCS Head') && (
                                <>
                                    <label>Program <span className={styles.required}>*</span></label>
                                    <select name='program' value={values.program} onChange={(e) => setValues({ ...values, program: e.target.value })} required >
                                        <option value="" selected disabled>Select your program</option>
                                        {programs.length > 0 ? (
                                            programs.map((row) => (
                                                <option key={row.programID} value={row.programID}>{row.programName}</option>
                                            ))
                                        ) : ''}
                                    </select>
                                </>
                            )}
                        </div>
                    )}

                    {/* Register Button */}
                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.registerButton}>
                            <span>Register</span>
                        </button>
                    </div>
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

export default CreateAcc;
