import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '/src/components/AdminDashHeader.jsx';
import styles from '/src/styles/AccountRequest.module.css';
import { useNavigate } from 'react-router-dom';
import checkmark from "/src/assets/checkmark.png";
import errormark from "/src/assets/errormark.png";

function Requirements() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
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
  const [courses, setCourses] = useState([]);
  const [rows, setRows] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [totalUnits, setTotalUnits] = useState(0);
  const [advisingStatus, setAdvisingStatus] = useState('');
  const [adviceSched, setAdviceSched] = useState('');
  const [schedAdvising, setSchedAdvising] = useState('');

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
      .get(`${backendUrl}/getReqsForAdviser`)
      .then((res) => {
        setAccountRequests(res.data.students);
        setFilteredRequests(res.data.students);
      })
      .catch((err) => {
        console.warn("Error fetching account requests, using example data:", err);
        setFilteredRequests(accountRequests);
      });
  }, []);



  // send sched
  const handleSetSched = async (request) => {

    setLoading(true);

    if (!schedAdvising || schedAdvising === '') {
      setErrorPrompt(true);
      setErrorMsg('Advising schedule is required');
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/sendAdvisingSched`, {
        sched: schedAdvising,
        studentID: request.StudentID
      })

      if(res.data.message === "Success"){
        setApprovalPrompt(true);
        setApprovalMsg(`Schedule sent to Student: ${request.CvSUStudentID}`);
        setPopUpVisible(false);
        setLoading(false);
      } else {
        setErrorPrompt(true);
        setErrorMsg(`Failed to send advising schedule to Student: ${request.CvSUStudentID}`);
        setLoading(false);
      }
    } catch (err) {
      console.error(`Error: ${err.response?.data?.message || err.message}`)
      setErrorPrompt(true);
      setErrorMsg(`An error occurred. Please try again.`);
      setLoading(false);      
    }
  };

  const handleFinishAdvising = async(request) => {
    setLoading(true);

    console.log(request.StudentID);

    try {
      const res = await axios.post(`${backendUrl}/setAdvisingStatus`, {
        studentID: request.StudentID
      })

      if(res.data.message === "Success"){
        setApprovalPrompt(true);
        setApprovalMsg(`Successfully updated advising status for Student: ${request.CvSUStudentID}`);
        setPopUpVisible(false);
        setLoading(false);
      } else {
        setErrorPrompt(true);
        setErrorMsg(`Failed to update advising status for Student: ${request.CvSUStudentID}`);
        setLoading(false);
      }
    } catch (err) {
      console.error(`Error: ${err.response?.data?.message || err.message}`)
      setErrorPrompt(true);
      setErrorMsg(`An error occurred. Please try again.`);
      setLoading(false);      
    }
  }


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
      axios.post(`${backendUrl}/getCOGForAdviser`, { studentID: request.StudentID }),
      axios.post(`${backendUrl}/getChecklistForAdviser`, { studentID: request.StudentID }),
      axios.post(`${backendUrl}/getCoursesForAdviser`, { studentID: request.StudentID }),
      axios.post(`${backendUrl}/getAdviceStatus/advising`, { studentID: request.StudentID }),
    ])
      .then((res) => {
        if (res[0].data.message === "Success" && res[1].data.message === "Success" && res[2].data.message === "Success") {
          setCOG(`${backendUrl}/${res[0].data.cogPath}`);
          setChecklist(res[1].data.checklistData);
          setCourses(res[2].data.courses);
        } else {
          setCOG(null);
          setChecklist([]);
          alert("Failed to fetch COG and Checklist data.");
          setCourses([]);
        }


        if (res[3].data.message === "Not yet scheduled") {
          setAdvisingStatus("Not yet scheduled");
        } else if (res[3].data.message === "Pending") {
          setAdvisingStatus("Pending");
          setAdviceSched(res[3].data.sched);
        } else {
          console.error(res[3].data.message);
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

  // Add a new row
  const handleAddRow = () => {
    setRows((prevRows) => [...prevRows, { selectedCourse: "" }]);
  };

  // Delete a row
  const handleDeleteRow = (index) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  // Handle course selection
  const handleCourseChange = (index, courseID) => {
    const updatedRows = [...rows];
    updatedRows[index].selectedCourse = courseID; // Ensure this is the CourseChecklistID
    setRows(updatedRows);
  };

  const calculateTotalUnits = () => {
    const total = rows.reduce((acc, row) => {
      const selectedCourse = courses.find(
        (course) => course.CourseChecklistID === Number(row.selectedCourse)
      );
      if (selectedCourse) {
        acc += selectedCourse.CreditUnitLec + selectedCourse.CreditUnitLab;
      }
      return acc;
    }, 0);
    setTotalUnits(total);
  };

  // UseEffect to recalculate total units when rows or eligibleCourses change
  useEffect(() => {
    calculateTotalUnits();
  }, [rows, courses]);


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
        <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupPromptError} style={{zIndex: '100000'}}>
          <div className={styles.popupPromptContentError}>
          <div className={styles.popupPromptHeaderError}>
              <h2>Error</h2>
            </div>
            <button
              className={styles.popupPromptcloseButton}
              onClick={() => setErrorPrompt(false)}
            >
              &times;
            </button>
            
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
          Advising
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
                    No submissions found.
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

          {advisingStatus === "Not yet scheduled" ? (
            <div className={styles.popupContentNew}>
              {/* Popup Header */}
              <div className={styles.popupHeader}>
                            <button onClick={closePopup} className={styles.closeButton}>✖</button>
                            <h2>Advising</h2>
                         
                
              </div>

              <div className={styles.popupTextReq}>
                
                    <p><strong>Name:</strong> {selectedRequest.Firstname} {selectedRequest.Lastname}</p>
                    <p><strong>Student ID:</strong> {selectedRequest.CvSUStudentID}</p>
                    <p><strong>Semester:</strong> {selectedRequest.Semester}</p>
                    <p><strong>Student Type:</strong> {selectedRequest.StudentType}</p>
                    
                  </div>

              {/* Year and Semester Table */}
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

              <br />
              <br />

              <div className={styles.popupHeader}>
                <h2>Set advising schedule</h2>
              </div>
              
              <div className={styles.studentType}>
                <h5>Date of Advising</h5>
                <input
                  type="datetime-local"
                  name='schedAdvising'
                  onChange={(e) => setSchedAdvising(e.target.value)}
                  className={styles.popupPromptInput}
                  required
                />
              </div>

              {/* Button */}
              <div className={styles.buttonContainer}>
                <button
                  className={styles.OKButton}
                  onClick={() => handleSetSched(selectedRequest)}
                >
                  <span>Send</span>
                </button>
              </div>
            </div>
          ) : advisingStatus === "Pending" ? (
            <div data-aos="zoom-out"
            data-aos-duration="500" className={styles.popupPromptContent}>

           

              <div className={styles.popupHeader}>
                <button onClick={closePopup} className={styles.closeButton}>
                  ✖
                </button>
                <h2>Set Advising Status</h2>
              </div>


              <div data-aos="fade-up" className={styles.studentType}>
                <h5>Date of Advising</h5>
                </div>
                <div data-aos="fade-up" className={styles.popupTextReq}>
                <p>{new Date(adviceSched).toLocaleString('en-US', {
                    weekday: 'long', // Optional: Adds the weekday
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true, // 12-hour format
                  })}</p>
              </div>


              <div className={styles.buttonContainer}>
                <button
                  className={styles.OKButton}
                  onClick={() => handleFinishAdvising(selectedRequest)}
                >
                  <span>Finish Advising</span>
                </button>
              </div>
            </div>
          ) : null}


        </div>
      )}


    </>
  );
}

export default Requirements;
