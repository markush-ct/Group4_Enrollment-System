import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '/src/components/AdminDashHeader.jsx';
import styles from '/src/styles/AccountRequest.module.css';
import { useNavigate } from 'react-router-dom';

function Requirements() {
    const [SideBar, setSideBar] = useState(false);
    const [accName, setAccName] = useState("");
    const [accountRequests, setAccountRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState(accountRequests);
    const [filterType, setFilterType] = useState("All");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [popUpVisible, setPopUpVisible] = useState(false);
    const [approvalPrompt, setApprovalPrompt] = useState(false);
    const [approvalMsg, setApprovalMsg] = useState('');
    const [rejectionPrompt, setRejectionPrompt] = useState(false);
    const [rejectionMsg, setRejectionMsg] = useState('');
    const [errorPrompt, setErrorPrompt] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [cog, setCOG] = useState(null);
    const [checklist, setChecklist] = useState([]);
    const [studentInfo, setStudentInfo] = useState([]);
    const [courses, setCourses] = useState([]);
    const [rows, setRows] = useState([]);
    const [preEnrollmentValues, setPreEnrollmentValues] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");

    axios.defaults.withCredentials = true;
    const navigate = useNavigate();
    //RETURNING ACCOUNT NAME IF LOGGED IN
    useEffect(() => {
        axios
            .get("http://localhost:8080")
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

    // FETCH ACCOUNT REQUESTS
    useEffect(() => {
        axios
            .get("http://localhost:8080/getPreEnrollForEnrollmentOff")
            .then((res) => {
                setAccountRequests(res.data.students);
                setFilteredRequests(res.data.students);
            })
            .catch((err) => {
                console.warn("Error fetching account requests, using example data:", err);
                setFilteredRequests(accountRequests);
            });
    }, []);


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const query = searchQuery.toLowerCase();
            setFilteredRequests(
                accountRequests.filter((request) =>
                    request.Firstname.toLowerCase().includes(query) ||
                    request.Lastname.toLowerCase().includes(query) ||
                    request.CvSUStudentID.toString().includes(query) ||
                    request.SocFeePayment.toLowerCase().includes(query) ||
                    `${request.Year === "First Year" ? 1
                        : request.Year === "Second Year" ? 2
                            : request.Year === "Third Year" ? 3
                                : request.Year === "Fourth Year" ? 4
                                    : "N/A"
                        } - ${request.Section.toLowerCase()}`.includes(query) ||
                    request.SocFeePayment.toLowerCase().includes(query) ||
                    `${request.Year === "First Year" ? 1
                        : request.Year === "Second Year" ? 2
                            : request.Year === "Third Year" ? 3
                                : request.Year === "Fourth Year" ? 4
                                    : "N/A"
                        }-${request.Section.toLowerCase()}`.includes(query)
                )
            );
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, accountRequests]);


    const [updateStudent, setUpdateStudent] = useState({
        studentType: '',
        year: '',
        section: '',
        semester: '',
    });

    const handleUpdateStdChange = (e) => {
        const { name, value } = e.target;
        setUpdateStudent((prev) => ({ ...prev, [name]: value }));

    };


    // Request
    const handleApprove = async (request) => {
        setLoading(true);

        if (!request?.StudentID || !updateStudent?.studentType || !updateStudent?.year || !updateStudent?.section || !updateStudent?.semester) {
            setErrorPrompt(true);
            setErrorMsg('Please fill out all fields.');
            return;
        }

        try {
            const res = await axios.post("http://localhost:8080/setEnrollmentStatus", {
                studentID: request.StudentID,
                studentType: updateStudent.studentType,
                year: updateStudent.year,
                section: updateStudent.section,
                semester: updateStudent.semester,
            });

            if (res.data.message === "Success") {
                setApprovalPrompt(true);
                setApprovalMsg('Student successfully enrolled.');
                setPopUpVisible(false);
                setLoading(false);

                setUpdateStudent({
                    studentType: '',
                    year: '',
                    section: '',
                    semester: '',
                });
            } else {
                setErrorPrompt(true);
                setErrorMsg(res.data.message);
                setLoading(false);
            }
        } catch (error) {
            setErrorPrompt(true);
            setErrorMsg('Failed to enroll student.', error.message);
            setLoading(false);
        }
    };


    const closePrompt = () => {
        setApprovalPrompt(false);
        setRejectionPrompt(false);
        window.location.reload();
    };


    //show popup
    const handleRowClick = (request) => {
        setSelectedRequest(request);
        setPopUpVisible(true);

        Promise.all([
            axios.post(`http://localhost:8080/getChecklistForEnrollmentOff`, { studentID: request.StudentID }),
            axios.post(`http://localhost:8080/getPreEnrollmentValuesForAdmin`, { studentID: request.StudentID })
        ])
            .then((res) => {
                if (res[0].data.message === "Success" && res[1].data.message === "Pre-enrollment is approved") {
                    setPreEnrollmentValues(res[1].data.data)
                    setChecklist(res[0].data.checklistData);
                    setStudentInfo(res[0].data.studentData);
                    setCourses(res[1].data.courses);
                    console.log(res[0].data.studentData);
                } else {
                    setCOG(null);
                    setChecklist([]);
                    setStudentInfo([]);
                    alert("Failed to fetch COG and Checklist data.", res[0].data.message, "sajkdhjashdjsad", res[1].data.message);
                    
                    setCourses([]);
                }
            })
            .catch((err) => {
                alert("Error: " + err);
                setCOG(null);
                setChecklist([]);
                setCourses([]);
            });
    };

    const groupedByYearAndSemester = checklist.reduce((acc, course) => {
        const { yearLevel, semester } = course;

        // Initialize year level object if it doesn't exist
        if (!acc[yearLevel]) {
            acc[yearLevel] = {};
        }

        // Initialize semester array if it doesn't exist for the year level
        if (!acc[yearLevel][semester]) {
            acc[yearLevel][semester] = [];
        }

        // Add the course to the corresponding year level and semester
        acc[yearLevel][semester].push(course);
        return acc;
    }, {});

    //close popup
    const closePopup = () => {
        setPopUpVisible(false);
        setSelectedRequest(null);
    };

    const totalPreEnrollUnits = preEnrollmentValues.reduce((acc, row) => acc + (row.CreditUnitLec + row.CreditUnitLab), 0);

    function formatTime(time) {
        const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const formattedTime = `${currentDate}T${time}`; // Combine current date with the time
    
        const validDate = new Date(formattedTime); // Create a valid Date object
        return validDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format the time
      }

    return (
        <>
            <Header SideBar={SideBar} setSideBar={setSideBar} />
            {/* PROMPTS */}
            {/* APPROVAL PROMPT */}
            {approvalPrompt && (
                <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupPrompt}>
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
                                src="/src/assets/checkmark.png"
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
                                src="/src/assets/checkmark.png"
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
                <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupPromptError}>
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
                                src="/src/assets/errormark.png"
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
                    Enrollment
                </div>

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

                {/* Table */}
                <div className={styles.tableContainer} data-aos="fade-up">
                    <table className={styles.requestsTable}>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Year - Section</th>
                                <th>Student Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((request) => (
                                    <tr key={request.id} onClick={() => handleRowClick(request)}>
                                        <td data-label="Student ID">{request.CvSUStudentID}</td>
                                        <td data-label="Student ID">{request.Firstname} {request.Lastname}</td>
                                        <td data-label="Year and Section">{request.Year === "First Year" ? 1
                                            : request.Year === "Second Year" ? 2
                                                : request.Year === "Third Year" ? 3
                                                    : 4} - {request.Section}</td>
                                        <td data-label="Student ID">{request.StudentType}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className={styles.noData}>
                                        No enrollees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>


                    </table>
                </div>
            </div>



            {/* PopUp */}
            {popUpVisible && selectedRequest && (
                <div
                    data-aos="zoom-out"
                    data-aos-duration="500"
                    className={`${styles.popup} ${popUpVisible ? styles.visible : ""}`}
                >
                    <div className={styles.popupContentReq}>
                        {/* Popup Header */}
                        <div className={styles.popupHeader}>
                            <button onClick={closePopup} className={styles.closeButton}>✖</button>
                            <h2>Requirements</h2>
                        </div>
                        <div data-aos="fade-up" className={styles.studentType}>
                            <span>DETAILS</span>
                        </div>


                        {/* Submission Details */}

    <div className={styles.popupTextReq}>
        <p><strong>Name:</strong> {selectedRequest.Firstname} {selectedRequest.Lastname}</p>
        <p><strong>Student ID:</strong> {selectedRequest.CvSUStudentID}</p>
        <p><strong>Program ID:</strong> {studentInfo.ProgramID === 1 ? "BSCS" : "BSIT"}</p>
        <p><strong>Year - Section:</strong> {studentInfo.Year === "First Year" ? 1
        : studentInfo.Year === "Second Year" ? 2
        : studentInfo.Year === "Third Year" ? 3
        : studentInfo.Year === "Fourth Year" ? 4
        : "Mid-Year"} - {studentInfo.Section}</p>
        <p><strong>Semester:</strong> {selectedRequest.Semester}</p>
        <p><strong>Student Type:</strong> {selectedRequest.StudentType}</p>
    </div>




                        <div className={styles.advising}>
                            <h5>CHECKLIST</h5>
                        </div>

                        {/* Details Section */}
                        <div data-aos="fade-up" className={styles.detailsSection}>
                        </div>

                        {/* Checklist Table */}
                        {Object.keys(groupedByYearAndSemester).map((yearLevel) => (
                            <div className={styles.Contentt} key={yearLevel}>
                                <h4>{yearLevel}</h4>
                                {Object.keys(groupedByYearAndSemester[yearLevel]).map((semester) => (
                                    <div className={styles.Contentt} key={semester}>
                                        <h5>{semester || ""}</h5>
                                        <table className={styles.checklistTable}>
                                            <thead>
                                                <tr>
                                                    <th colSpan="2">COURSE</th>
                                                    <th colSpan="2">CREDIT UNIT</th>
                                                    <th colSpan="2">CONTACT HRS.</th>
                                                    <th rowSpan="2">PRE-REQUISITE</th>
                                                    <th rowSpan="2">SY TAKEN</th>
                                                    <th rowSpan="2">FINAL GRADE</th>
                                                    <th rowSpan="2">INSTRUCTOR</th>
                                                </tr>
                                                <tr>
                                                    <th>CODE</th>
                                                    <th>TITLE</th>
                                                    <th>Lec</th>
                                                    <th>Lab</th>
                                                    <th>Lec</th>
                                                    <th>Lab</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {groupedByYearAndSemester[yearLevel][semester].map((course, index) => (
                                                    <tr key={index}>
                                                        <td>{course.courseDetails.code}</td>
                                                        <td>{course.courseDetails.title}</td>
                                                        <td>{course.courseDetails.creditLec === 0 ? '' : course.courseDetails.creditLec}</td>
                                                        <td>{course.courseDetails.creditLab === 0 ? '' : course.courseDetails.creditLab}</td>
                                                        <td>{course.courseDetails.contactHrsLec === 0 ? '' : course.courseDetails.contactHrsLec}</td>
                                                        <td>{course.courseDetails.contactHrsLab === 0 ? '' : course.courseDetails.contactHrsLab}</td>
                                                        <td>{course.courseDetails.preReq || ''}</td>
                                                        <td>{course.syTaken}</td>
                                                        <td>{course.finalGrade}</td>
                                                        <td>{course.instructor}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        ))}


                        <div className={styles.advising}>
                            <h5>PRE-ENROLLMENT</h5>
                        </div>

                        <div className={styles.formContainer}>

                            {selectedRequest.StudentType === "Regular" ? (
                                    <div className={styles.formContainer}>
    
                                        {preEnrollmentValues.map((row) => (
    
                                            <div key={row.CourseChecklistID}>
                                                <p>{row.CourseCode} - {row.CourseTitle} ({row.CreditUnitLec + row.CreditUnitLab} units)</p>
                                            </div>
                                        ))}
                                        <p>Total Units: <span>{totalPreEnrollUnits}</span></p>
    
    
                                    </div>

                            ) : (
                                <div className={styles.formContainer}>
    
                                        {preEnrollmentValues.map((row) => (
    
                                            <div key={row.CourseChecklistID}>
                                                <p>{row.CourseCode} - {row.CourseTitle} ({row.CreditUnitLec + row.CreditUnitLab} units) {row.YearLevel === "First Year" ? 1
                                                : row.YearLevel === "Second Year" ? 2
                                                : row.YearLevel === "Third Year" ? 3
                                                : row.YearLevel === "Fourth Year" ? 4
                                                : "Mid-Year"} - {row.Section} {row.Day} {formatTime(row.StartTime)} to {formatTime(row.EndTime)}</p>
                                            </div>
                                        ))}
                                        <p>Total Units: <span>{totalPreEnrollUnits}</span></p>
    
    
                                    </div>
                            )}
                            

                            <div className={styles.formContainer}>
                                <div className={styles.advising}>
                                    <h5>UPDATE DETAILS</h5>
                                </div>

                                <div>

                                    <select value={updateStudent.studentType} name="studentType" id="" onChange={handleUpdateStdChange} required>
                                        <option value="">Select student type</option>
                                        <option value="Regular">Regular</option>
                                        <option value="Irregular">Irregular</option>
                                    </select>
                                    <br />

                                    <select value={updateStudent.year} name="year" id="" onChange={handleUpdateStdChange} required>
                                        <option value="">Select year</option>
                                        <option value="First Year">First Year</option>
                                        <option value="Second Year">Second Year</option>
                                        <option value="Third Year">Third Year</option>
                                        <option value="Mid-Year">Mid-Year</option>
                                        <option value="Fourth Year">Fourth Year</option>
                                    </select>

                                    <input value={updateStudent.section} name='section' type="tel" placeholder='Section (e.g. 3)' onChange={handleUpdateStdChange} required />

                                    <select value={updateStudent.semester} name="semester" id="" onChange={handleUpdateStdChange} required>
                                        <option value="">Select semester</option>
                                        <option value="First Semester">First Semester</option>
                                        <option value="Second Semester">Second Semester</option>
                                    </select>

                                </div>
                            </div>


                            <div className={styles.buttonSection} >
                                <button className={styles.submitBtn} onClick={() => handleApprove(selectedRequest)} disabled={loading}>
                                    <span>{loading ? "Loading..." : "Enroll"}</span>
                                </button>
                            </div>
                        </div>


                    </div>
                </div>

            )}


        </>
    );
}

export default Requirements;
