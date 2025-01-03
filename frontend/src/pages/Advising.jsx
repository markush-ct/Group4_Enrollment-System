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


  useEffect(() => {
    if (filterType === "All") {
      setFilteredRequests(accountRequests);
    } else if (filterType === "Society Officer") {
      setFilteredRequests(
        accountRequests.filter(
          (request) =>
            ["President",
              "Vice President",
              "Secretary",
              "Assistant Secretary",
              "Treasurer",
              "Assistant Treasurer",
              "Business Manager",
              "Auditor",
              "P.R.O.",
              "Assistant P.R.O.",
              "GAD Representative",
              "1st Year Senator",
              "2nd Year Senator",
              "3rd Year Senator",
              "4th Year Senator",
              "1st Year Chairperson",
              "2nd Year Chairperson",
              "3rd Year Chairperson",
              "4th Year Chairperson"].includes(request.AccountType)
        )
      );
    }
    else {
      setFilteredRequests(
        accountRequests.filter((request) => request.AccountType === filterType)
      );
    }
  }, [filterType, accountRequests]);


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
      } else {
        setErrorPrompt(true);
        setErrorMsg('Failed to save courses. Please try again.');
      }
    } catch (err) {
      setErrorPrompt(true);
      setErrorMsg(`Failed to verify requirements: ${err.response?.data?.message || err.message}`);
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

        {/* Dropdown  */}
        <div className={styles.filterSection} data-aos="fade-up">
          <label htmlFor="filter" className={styles.filterLabel}>Filter by Type:</label>
          <select
            id="filter"
            className={styles.filterDropdown}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All</option>
            <option value="1-1">1-1</option>
            <option value="1-2">1-2</option>
            <option value="1-3">1-3</option>
            <option value="2-1">2-1</option>
            <option value="2-1">2-1</option>
            <option value="1-1">1-1</option>
            <option value="1-1">1-1</option>
            <option value="1-1">1-1</option>
            <option value="1-1">1-1</option>
            <option value="1-1">1-1</option>
          </select>
        </div>

        {/* Table */}
        <div className={styles.tableContainer} data-aos="fade-up">
          <table className={styles.requestsTable}>
            <thead>
              <tr>
              <th>Student ID</th>
                <th>Name</th>
                <th>Year - Section</th>
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
    <div className={styles.popupContentReq}>
      {/* Popup Header */}
      <div className={styles.popupHeader}>
                    <button onClick={closePopup} className={styles.closeButton}>✖</button>
                    <h2>Requirement</h2>
                  </div>
                  <div data-aos="fade-up" className={styles.studentType}>
                    <span>DETAILS</span>
                  </div>
      

        {/* Submission Details */}
       <div className={styles.popupTextReq}>
      
          <p><strong>Name:</strong> {selectedRequest.Firstname} {selectedRequest.Lastname}</p>
          <p><strong>Student ID:</strong> {selectedRequest.StudentID}</p>
          <p><strong>Student Type:</strong> {selectedRequest.StudentType}</p>
          
        </div>



{/* Details Section */}
<div data-aos="fade-up" className={styles.detailsSection}>
        {/* Document Image */}
        <div className={styles.documentImage}>
          <img
            src={cog}
            alt="Document"
            className={styles.imageStyle}
          />
        </div>
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
                    <h5>ADVISING</h5>
                  </div>
                  
                  <div className={styles.formContainer}>
             <div className={styles.formGroup}>
                <label htmlFor='adviseMsg'>Advise Message:</label>
                <input type="textarea" name='adviseMsg' />
              </div>
              </div>


            <div className={styles.formContainer}>
            {rows.map((row, index) => (
              <div key={index} className={styles.dropdownContainer}>
                <span>{index + 1}.</span>
                <select
                  id={`courseDropdown-${index}`}
                  className={styles.subjectDropdown}
                  value={row.selectedCourse}
                  onChange={(e) => handleCourseChange(index, e.target.value)}
                >
                  <option value="" disabled>Select a Course</option>
                  {courses.map((course) => (
                    <option key={course.CourseChecklistID} value={course.CourseChecklistID}>
                      {course.CourseCode} - {course.CourseTitle}
                    </option>
                  ))}
                </select>
                {index === rows.length - 1 ? (
                  <button
                    className={`${styles.btn} ${styles.addBtn}`}
                    onClick={handleAddRow}
                  >
                    <span>ADD</span>
                  </button>
                ) : (
                  <button
                    className={`${styles.btn} ${styles.removeBtn}`}
                    onClick={() => handleDeleteRow(index)}
                  >
                <span>REMOVE</span>
                  </button>
                )}
    </div>
  ))}

 <div className={styles.buttonSection} >
  <button className={styles.submitBtn} onClick={() => handleApprove(selectedRequest)}>
    <span>SEND</span>
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
