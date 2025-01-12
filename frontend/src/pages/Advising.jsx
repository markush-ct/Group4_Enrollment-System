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
  const [courses, setCourses] = useState([]);
  const [rows, setRows] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [totalUnits, setTotalUnits] = useState(0);

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
      .get("http://localhost:8080/getReqsForAdviser")
      .then((res) => {
        setAccountRequests(res.data.students);
        setFilteredRequests(res.data.students);
      })
      .catch((err) => {
        console.warn("Error fetching account requests, using example data:", err);
        setFilteredRequests(accountRequests);
      });
  }, []);



  // Request
  const handleApprove = async (request) => {
    
    setLoading(true);
  
    if (!request?.StudentID) {
      setErrorPrompt(true);
      setErrorMsg('StudentID is required.');
      return;
    }
  
    try {
      // Prepare the data to save
      const selectedCourses = rows.map((row) => row.selectedCourse);
      console.log("Selected Courses: ", selectedCourses);
      console.log("Selected Courses: ", rows);
      const adviseMessage = document.querySelector('input[name="adviseMsg"]').value;
  
      const res = await axios.post('http://localhost:8080/sendEmailAdvise', {
        studentID: request.StudentID,
        courses: selectedCourses,
        adviseMessage,
      });
  
      if (res.data.message === "Courses saved and email sent successfully.") {
        setApprovalPrompt(true);
        setApprovalMsg(`Courses successfully saved for Student ID: ${request.CvSUStudentID}`);
        setPopUpVisible(false);
        setLoading(false);
      } else {
        setErrorPrompt(true);
        setErrorMsg(res.data.message);
        setLoading(false);
      }
    } catch (err) {
      setErrorPrompt(true);
      setErrorMsg(`Failed to verify requirements: ${err.response?.data?.message || err.message}`);
      setLoading(false);
    } finally {
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
      axios.post(`http://localhost:8080/getCOGForAdviser`, {studentID: request.StudentID}),
      axios.post(`http://localhost:8080/getChecklistForAdviser`, {studentID: request.StudentID}),
      axios.post(`http://localhost:8080/getCoursesForAdviser`, {studentID: request.StudentID}),
    ])
    .then((res) => {
      if(res[0].data.message === "Success" && res[1].data.message === "Success" && res[2].data.message === "Success"){
        setCOG(`http://localhost:8080/${res[0].data.cogPath}`);
        setChecklist(res[1].data.checklistData);
        setCourses(res[2].data.courses);
      } else{
        setCOG(null);
        setChecklist([]);
        alert("Failed to fetch COG and Checklist data.");
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
    <div className={styles.popupContent}>
                <div className={styles.popupHeader}>
                  <button onClick={closePopup} className={styles.closeButton}>
                    ✖
                  </button>
                  <h3>Send Schedule for face to face advising</h3>
                </div>
    
                {/* Date Input and Send Button */}
                <div data-aos="fade-up" className={styles.studentType}>
                  <h5>Date of Advising</h5>
    
                  <input
                    type="datetime-local"
                    id="examDatetime"
                    name="examDatetime"
                     value=""
                    onChange=""
                    className={styles.popupPromptInput}
                    required
                  />
                </div>
    
               
    
                {/* Buttons */}
                <div className={styles.buttonContainer}>
                  <button
                    className={styles.OKButton}
                    onClick={() => handleApprove(selectedRequest)}
                  >
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          )}


    </>
  );
}

export default Requirements;
