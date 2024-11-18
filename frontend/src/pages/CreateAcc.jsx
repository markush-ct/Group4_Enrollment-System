import { useState, useEffect } from 'react';
import styles from '/src/styles/CreateAcc.module.css';
import Header from '/src/components/Header.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';

function CreateAcc() {
    const [SideBar, setSideBar] = useState(false);
    const [applicantCategory, setApplicantCategory] = useState("Regular/Irregular");
    const [jobRole, setJobRole] = useState('');
    const [department, setDepartment] = useState('');

    
    useEffect(() => {
        document.body.style.overflow = SideBar ? 'hidden' : 'auto';
    }, [SideBar]);

    
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    
    
    //for department option
    const handleDepartmentChange = (e) => {
        setDepartment(e.target.value);
    };

    //for job role extension
    const handleJobRoleChange = (e) => {
        setJobRole(e.target.value);
        setDepartment(''); 
    };

    return (
        <>
            <Header SideBar={SideBar} setSideBar={setSideBar} />

            {/* Parallax Section */}
            <div className={`${styles.parallaxSection} ${styles.parallax1}`}>
                <h2>CAVITE STATE UNIVERSITY</h2>
                <h1>DEPARTMENT OF COMPUTER STUDIES</h1>
            </div>

            {/* Create Account Form */}
            <div data-aos="fade-up" className={styles.contentSection}>
                <div className={styles.PageTitle} data-aos="fade-up">Create Account</div>
                <form>
                    {/* Account Type */}
                    <div data-aos="fade-up" className={styles.radioGroup}>
                        <label>Account Type <span className={styles.required}>*</span></label>
                        <label>
                            <input
                                type="radio"
                                name="applicantCategory"
                                value="Regular/Irregular"
                                checked={applicantCategory === "Regular/Irregular"}
                                onChange={() => setApplicantCategory("Regular/Irregular")}
                            />
                            Regular/Irregular
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="applicantCategory"
                                value="Society Officer"
                                checked={applicantCategory === "Society Officer"}
                                onChange={() => setApplicantCategory("Society Officer")}
                            />
                            Society Officer
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="applicantCategory"
                                value="Employee"
                                checked={applicantCategory === "Employee"}
                                onChange={() => setApplicantCategory("Employee")}
                            />
                            Employee
                        </label>
                    </div>

                    {/* CONDITION FOR ACCOUNT TYPE */}
                    {applicantCategory === "Regular/Irregular" && (
                        <div data-aos="fade-up" className={styles.formGroup}>
                            <label>Given Name <span className={styles.required}>*</span></label>
                            <input type="text" placeholder="Given Name" required />

                            <label>Middle Name</label>
                            <input type="text" placeholder="Middle Name" />

                            <label>Last Name <span className={styles.required}>*</span></label>
                            <input type="text" placeholder="Last Name" required />

                            <label>Student ID <span className={styles.required}>*</span></label>
                            <input type="text" placeholder="Student ID" required />

                            <label>CvSU Email <span className={styles.required}>*</span></label>
                            <input type="email" placeholder="CvSU Email" required />

                            <label>Phone Number <span className={styles.required}>*</span></label>
                            <input type="text" placeholder="Phone Number" required />
                        </div>
                    )}

                    {applicantCategory === "Society Officer" && (
                        <div data-aos="fade-up" className={styles.formGroup}>
                            <label>Given Name <span className={styles.required}>*</span></label>
                            <input type="text" placeholder="Given Name" required />

                            <label>Middle Name</label>
                            <input type="text" placeholder="Middle Name" />

                            <label>Last Name <span className={styles.required}>*</span></label>
                            <input type="text" placeholder="Last Name" required />

                            <label>Student ID <span className={styles.required}>*</span></label>
                            <input type="text" placeholder="Student ID" required />

                            <label>CvSU Email <span className={styles.required}>*</span></label>
                            <input type="email" placeholder="CvSU Email" required />

                            <label>Phone Number <span className={styles.required}>*</span></label>
                            <input type="text" placeholder="Phone Number" required />

                            <label>Department <span className={styles.required}>*</span></label>
                            <select required>
                                <option value="" disabled>Select Department</option>
                                <option value="Bachelor of Science in Computer Science">Bachelor of Science in Computer Science</option>
                                <option value="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</option>
                            </select>

                            <label>Position <span className={styles.required}>*</span></label>
                            <select required>
                                <option value="" disabled>Select Position</option>
                                <option value="President">President</option>
                                <option value="Vice President">Vice President</option>
                            </select>
                        </div>
                    )}

                    {applicantCategory === "Employee" && (
                        <div data-aos="fade-up" className={styles.formGroup}>
                            <label>Given Name <span className={styles.required}>*</span></label>
                            <input type="text" placeholder="Given Name" required />

                            <label>Middle Name</label>
                            <input type="text" placeholder="Middle Name" />

                            <label>Last Name <span className={styles.required}>*</span></label>
                            <input type="text" placeholder="Last Name" required />

                            <label>Employee ID <span className={styles.required}>*</span></label>
                            <input type="text" placeholder="Employee ID" required />

                            <label>CvSU Email <span className={styles.required}>*</span></label>
                            <input type="email" placeholder="CvSU Email" required />

                            <label>Phone Number <span className={styles.required}>*</span></label>
                            <input type="text" placeholder="Phone Number" required />

                            <label>Job/Role <span className={styles.required}>*</span></label>
                            <select value={jobRole} onChange={handleJobRoleChange} required>
                                <option value="" disabled>Select Job/Role</option>
                                <option value="Enrollment Officer">Enrollment Officer</option>
                                <option value="Adviser">Adviser</option>
                                <option value="DCS Head">DCS Head</option>
                                <option value="School Head">School Head</option>
                            </select>

                        

                            {(jobRole === 'Adviser' || jobRole === 'DCS Head') && (
                                <>
                                    <label>Department <span className={styles.required}>*</span></label>
                                    <select value={department} onChange={handleDepartmentChange} required>
                                        <option value="" disabled>Select Department</option>
                                        <option value="Bachelor of Science in Computer Science">Bachelor of Science in Computer Science</option>
                                <option value="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</option>
                                        
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
