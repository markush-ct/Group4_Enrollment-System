import React, { useEffect, useMemo, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '/src/components/AdminDashHeader.jsx';
import styles from '/src/styles/AccountRequest.module.css';
import { data, useNavigate } from 'react-router-dom';
import checkmark from "/src/assets/checkmark.png";
import errormark from "/src/assets/errormark.png";

function StudentInformation() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    const [SideBar, setSideBar] = useState(false);
    const [accName, setAccName] = useState("");
    const [accountRequests, setAccountRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [filterType, setFilterType] = useState("All");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [popUpVisible, setPopUpVisible] = useState(false);
    const [popUpAdd, setPopUpAdd] = useState(false);
    const [approvalPrompt, setApprovalPrompt] = useState(false);
    const [approvalMsg, setApprovalMsg] = useState('');
    const [rejectionPrompt, setRejectionPrompt] = useState(false);
    const [rejectionMsg, setRejectionMsg] = useState('');
    const [errorPrompt, setErrorPrompt] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    axios.defaults.withCredentials = true;
    const navigate = useNavigate();
    //RETURNING ACCOUNT NAME IF LOGGED IN
    useEffect(() => {
        axios
            .get(`${backendUrl}/session`)
            .then((res) => {
                if (res.data.valid) {
                    setAccName(res.data.name);
                } else {
                    navigate("/LoginPage");
                }
            })
            //RETURNING ERROR IF NOT
            .catch((err) => {
                console.error("Error validating user session:", err);
            });
    }, []);


    const [values, setValues] = useState({
        studentID: '',
        firstname: '',
        middlename: '',
        lastname: '',
        dob: '',
        year: '',
        section: '',
        semester: '',
        program: '',
        studentType: '',
        email: '',
    });

    const handleValuesChange = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleAddStudent = (e) => {
        e.preventDefault();
        console.log(values);

        axios.post(`${backendUrl}/addStudent/studentInfo`, values)
            .then((res) => {
                if (res.data.message === "Success") {
                    setApprovalPrompt(true);
                    setApprovalMsg('Student added successfully.');
                    setValues({
                        studentID: '',
                        firstname: '',
                        middlename: '',
                        lastname: '',
                        dob: '',
                        year: '',
                        section: '',
                        semester: '',
                        program: '',
                        studentType: '',
                        email: '',
                    });
                } else {
                    setErrorMsg(res.data.message);
                    setErrorPrompt(true);
                }
            })
            .catch((err) => {
                console.error("Error: " + err);
            })
    };


    useEffect(() => {
        document.body.style.overflow = SideBar ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [SideBar]);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);


    const closePrompt = () => {
        setApprovalPrompt(false);
        setRejectionPrompt(false);
        window.location.reload();
    };


    //show popup
    const handleAddAcc = () => {
        setPopUpAdd(true);
    };

    const [enrollmentStatus, setEnrollmentStatus] = useState('');

    // show add
    const handleRowClick = (index) => {
        setSelectedRequest(index);
        setPopUpVisible(true);

        console.log(index.StudentID);

        axios.post(`${backendUrl}/getEnrollStatus/studentInfo`, { studentID: index.StudentID })
            .then((res) => {
                if (res.data.message === "Success") {
                    setEnrollmentStatus(res.data.enrollStatus);
                } else {
                    setEnrollmentStatus(res.data.enrollStatus);
                }
            })
            .catch((err) => {
                setErrorMsg('An error occurred. Please try again.');
                setErrorPrompt(true);
                console.error("Error: " + err);
            })
    };

    //close popup
    const closePopup = () => {
        setPopUpVisible(false);
        setSelectedRequest(null);
    };

    //close popup
    const closePopupAdd = () => {
        setPopUpAdd(false);
        setValues({
            studentID: '',
            firstname: '',
            middlename: '',
            lastname: '',
            dob: '',
            year: '',
            section: '',
            semester: '',
            program: '',
            studentType: '',
            email: '',
        })
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const query = searchQuery.toLowerCase();
            setFilteredRequests(
                accountRequests.filter((request) =>
                    request.Firstname?.toLowerCase().includes(query) ||
                    request.Lastname?.toLowerCase().includes(query) ||
                    request.StudentType?.toLowerCase().includes(query) ||
                    request.CvSUStudentID?.toString().includes(query)
                )
            );
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, accountRequests]);


    // FETCH ACCOUNTS
    useEffect(() => {
        axios
            .get(`${backendUrl}/getAllStudent`)
            .then((res) => {
                setAccountRequests(res.data.studentRes);
                setFilteredRequests(res.data.studentRes);
            })
            .catch((err) => {
                console.warn("Error fetching account requests, using example data:", err);
                setFilteredRequests([]);
            });
    }, []);




    return (
        <>
            <Header SideBar={SideBar} setSideBar={setSideBar} />
            {/* PROMPTS */}
            {/* APPROVAL PROMPT */}
            {approvalPrompt && (
                <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupPrompt} style={{zIndex: '100000'}}>
                    <div className={styles.popupPromptContent}>
                        <button
                            className={styles.popupPromptcloseButton}
                            onClick={() => setApprovalPrompt(false)}
                        >
                            &times;
                        </button>
                        <div className={styles.popupPromptHeader}>
                            <h2>Approval Success</h2>
                        </div>
                        <div className={styles.popupPromptMessage}>
                            <img
                                src={checkmark}
                                alt="Success Icon"
                                className={styles.popupPromptmessageImage}
                            />
                        </div>
                        <p className={styles.popupPromptText}>{approvalMsg}</p>
                        <div className={styles.buttonContainer}>
                            <button
                                className={styles.OKButton}
                                onClick={closePrompt}
                            >
                                <span>OK</span>
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* REJECTION PROMPT */}
            {rejectionPrompt && (
                <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupPrompt}>
                    <div className={styles.popupPromptContent}>
                        <button
                            className={styles.popupPromptcloseButton}
                            onClick={closePrompt}
                        >
                            &times;
                        </button>
                        <div className={styles.popupPromptHeader}>
                            <h2>Rejection Success</h2>
                        </div>
                        <div className={styles.popupPromptMessage}>
                            <img
                                src={checkmark}
                                alt="Success Icon"
                                className={styles.popupPromptmessageImage}
                            />
                        </div>
                        <p className={styles.popupPromptText}>{rejectionMsg}</p>
                    </div>
                </div>
            )}

            {/* ERROR PROMPT */}
            {errorPrompt && (
                <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupPromptError} style={{zIndex: '10000'}}>
                    <div className={styles.popupPromptContentError}>
                        <button
                            className={styles.popupPromptcloseButton}
                            onClick={() => setErrorPrompt(false)}
                        >
                            &times;
                        </button>
                        <div className={styles.popupPromptHeaderError}>
                            <h2>Error</h2>
                        </div>
                        <div className={styles.popupPromptMessageError}>
                            <img
                                src={errormark}
                                alt="Error Icon"
                                className={styles.popupPromptmessageImage}
                            />
                        </div>
                        <p className={styles.popupPromptTextError}>{errorMsg}</p>
                    </div>
                </div>
            )}


            <div className={styles.contentSection}>
                <div className={styles.PageTitle} data-aos="fade-up">
                    Student Information
                </div>

                <div className={styles.buttonFilterContainer} data-aos="fade-up">

                    <div className={styles.searchBar} data-aos="fade-up">

                        <input
                            type="text"
                            id="search"
                            placeholder="Search by name or student ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <button
                        className={styles.addButton1}
                        onClick={handleAddAcc}
                    >
                        <span>Add Student</span>
                    </button>
                </div>





                {/* Table */}
                <div className={styles.tableContainer} data-aos="fade-up">
                    <table className={styles.requestsTable}>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Student Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((row, index) => (
                                    <tr key={index} onClick={() => handleRowClick(row)}>
                                        <td>{row.CvSUStudentID}</td>
                                        <td>{row.Firstname}</td>
                                        <td>{row.Email}</td>
                                        <td>{row.StudentType}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className={styles.noData}>
                                        No accounts found.
                                    </td>
                                </tr>
                            )}

                        </tbody>


                    </table>
                </div>
            </div>


            {/* PopUp */}
            {popUpAdd && (
                <div data-aos="zoom-out" data-aos-duration="500" className={`${styles.popup} ${popUpVisible ? styles.visible : ""}`}>
                    <div className={styles.popupContent}>

                        {/* Popup Header */}
                        <div className={styles.popupHeader}>
                            <button onClick={closePopupAdd} className={styles.closeButton}>✖</button>
                            <h2>Add Student</h2>
                        </div>
                        <div data-aos="fade-up" className={styles.studentType}>
                            <span>DETAILS</span>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={handleAddStudent} className={styles.formGroup}>
                            <input
                                type="tel"
                                name="studentID"
                                value={setValues.studentID}
                                onChange={handleValuesChange}
                                placeholder="Student ID"
                                required
                            />

<input
                                type="email"
                                name="email"
                                value={setValues.email}
                                onChange={handleValuesChange}
                                placeholder="Email"
                                required
                            />

                            <input
                                type="text"
                                name="firstname"
                                value={setValues.firstname}
                                onChange={handleValuesChange}
                                placeholder="Firstname"
                                required
                            />

                            <input
                                type="text"
                                name="middlename"
                                value={setValues.middlename}
                                onChange={handleValuesChange}
                                placeholder="Middlename (only if applicable)"
                            />

                            <input
                                type="text"
                                name="lastname"
                                value={setValues.lastname}
                                onChange={handleValuesChange}
                                placeholder="Lastname"
                                required
                            />

                            <p style={{ color: "#3d8c4b" }}><strong>Date of Birth:</strong></p>
                            <input
                                type="date"
                                name="dob"
                                value={setValues.dob}
                                onChange={handleValuesChange}
                                required
                            />

                            <select
                                name="studentType"
                                value={setValues.studentType}
                                onChange={handleValuesChange}
                                required
                            >
                                <option value="">Select Student Type</option>
                                <option value="Regular">Regular</option>
                                <option value="Irregular">Irregular</option>
                            </select>

                            <select
                                name="program"
                                value={setValues.program}
                                onChange={handleValuesChange}
                                required
                            >
                                <option value="">Select Program</option>
                                <option value="1">BSCS</option>
                                <option value="2">BSIT</option>
                            </select>

                            <select
                                name="year"
                                value={setValues.year}
                                onChange={handleValuesChange}
                                required
                            >
                                <option value="">Select Year</option>
                                <option value="First Year">First Year</option>
                                <option value="Second Year">Second Year</option>
                                <option value="Third Year">Third Year</option>
                                <option value="Mid-Year">Mid-Year</option>
                                <option value="Fourth Year">Fourth Year</option>
                            </select>

                            <input
                                type="text"
                                name="section"
                                value={setValues.section}
                                onChange={handleValuesChange}
                                placeholder="Section"
                                required
                            />


                            <select
                                name="semester"
                                value={setValues.semester}
                                onChange={handleValuesChange}
                                required
                            >
                                <option value="">Select Semester</option>
                                <option value="First Semester">First Semester</option>
                                <option value="Second Semester">Second Semester</option>
                            </select>

                            {/* Submit Button */}
                            <div className={styles.buttonContainer}>
                                <input type="submit" className={styles.submitBtn} value="Add Student" />
                            </div>
                        </form>
                    </div>
                </div>
            )}




            {/* PopUp */}
            {popUpVisible && (
                <div data-aos="zoom-out" data-aos-duration="500" className={`${styles.popup} ${popUpVisible ? styles.visible : ""}`}>
                    <div className={styles.popupContent}>
                        <div className={styles.popupHeader}>
                            <button onClick={closePopup} className={styles.closeButton}>✖</button>
                            <h2>Student Information</h2>
                        </div>
                        <div data-aos="fade-up" className={styles.studentType}>
                            <span>DETAILS</span>
                        </div>

                        <div className={styles.popupText}>
                            <p><strong>Sign Up Status:&nbsp; &nbsp;</strong>{selectedRequest.RegStatus}</p>
                            <p><strong>Enrollment Status:&nbsp; &nbsp;</strong>{enrollmentStatus}</p>
                            <p><strong>Student ID:&nbsp; &nbsp;</strong>{selectedRequest.CvSUStudentID}</p>
                            <p><strong>Name:&nbsp; &nbsp;</strong>{selectedRequest.Lastname}, {selectedRequest.Firstname} {selectedRequest.Middlename}</p>
                            <p><strong>Student Type:&nbsp; &nbsp;</strong>{selectedRequest.StudentType}</p>
                            <p><strong>Year-Section:&nbsp; &nbsp;</strong>{selectedRequest.ProgramID === 1 ? "BSCS" : "BSIT"}  {selectedRequest.Year === "First Year" ? 1
                                : selectedRequest.Year === "Second Year" ? 2
                                    : selectedRequest.Year === "Third Year" ? 3
                                        : selectedRequest.Year === "Fourth Year" ? 4
                                            : "Mid-Year"} - {selectedRequest.Section}</p>
                            <p><strong>Semester:&nbsp; &nbsp;</strong>{selectedRequest.Semester}</p>
                            <p><strong>Status:&nbsp; &nbsp;</strong>{selectedRequest.StdStatus}</p>
                            <p><strong>Email:&nbsp; &nbsp;</strong>{selectedRequest.Email}</p>
                            <p><strong>Gender:&nbsp; &nbsp;</strong>{selectedRequest.Gender === 'F' ? 'Female' : selectedRequest.Gender === 'M' ? 'Male' : ''}</p>
                            <p>
                                <strong>Date of Birth:&nbsp;&nbsp;</strong>
                                {new Date(selectedRequest.DOB).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p><strong>Contact No.:&nbsp; &nbsp;</strong>{selectedRequest.PhoneNo}</p>
                        </div>

                    </div>
                </div>
            )}

        </>
    );
}

export default StudentInformation;
