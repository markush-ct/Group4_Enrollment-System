import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '/src/components/AdminDashHeader.jsx';
import styles from '/src/styles/AccountRequest.module.css';
import { useNavigate } from 'react-router-dom';

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
  const [preEnrollmentValues, setPreEnrollmentValues] = useState([]);
  const [rows, setRows] = useState([]);
  const [rows1, setRows1] = useState([]);
  const [draggedCourse, setDraggedCourse] = useState(null); //draglord function design

  const [searchQuery, setSearchQuery] = useState("");
  const [eligibleCourses, setEligibleCourses] = useState([]);
  const [totalUnits, setTotalUnits] = useState(0);
  const [preEnrollSched, setPreEnrollSched] = useState([]);
  const [filterType1, setFilterType1] = useState("");
  const [eligibleCourses1, setEligibleCourses1] = useState([]);

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
      .get("http://localhost:8080/getPreEnrollForAdviser")
      .then((res) => {
        setAccountRequests(res.data.students);
        setFilteredRequests(res.data.students);
      })
      .catch((err) => {
        console.warn("Error fetching account requests, using example data:", err);
        setFilteredRequests(accountRequests);
      });
  }, []);



  const handleSubmit = async (request) => {
    const addedSubjects = rows
      .filter((row) => row.selectedCourse) // Only include rows with a selected course
      .map((row) => {
        console.log("Selected course ID: ", row.selectedCourse); // Log selected course ID
        const subject = eligibleCourses.find(
          (s) => s.CourseChecklistID === Number(row.selectedCourse) // Convert string to number
        );
        console.log("Matched subject: ", subject); // Log the matched subject
        return subject
          ? {
            code: subject.CourseCode,
            title: subject.CourseTitle,
            units: subject.CreditUnitLec + subject.CreditUnitLab,
          }
          : null;
      })
      .filter(Boolean); // Remove null values

      if (addedSubjects.length === 0) {
        setErrorPrompt(true);
        setErrorMsg("You need to add at least 1 subject");
        return; // Stop the submission process
      }

      
      try {
        // Prepare the data to save
        const selectedCourses = rows.map((row) => row.selectedCourse);

        const res = await axios.post('http://localhost:8080/submitPreEnrollment', {
          courses: selectedCourses,
          studentID: request.StudentID
        });

        if (res.data.message === "Pre enrollment submitted.") {
          setApprovalPrompt(true);
          setApprovalMsg("Pre-enrollment submitted");
        } else {
          setApprovalPrompt(false);
          setErrorPrompt(true);
          setErrorMsg('Failed to submit pre enrollment. Please try again.');
        }
      } catch (err) {
        setApprovalPrompt(false);
        setErrorPrompt(true);
        setErrorMsg(`Failed to submit pre enrollment: ${err.response?.data?.message || err.message}`);
      }
  };


  const handleSubmit1 = async(request) => {

    const selectedCoursesAndSections = rows1.map(row => ({
      courseID: row.selectedCourse,
      schedID: row.selectedSectionID
    }));
    console.log("values", selectedCoursesAndSections);

    try {
      const res = await axios.post('http://localhost:8080/submitIrregPreEnrollment', {
        values: selectedCoursesAndSections,
        studentID: request.StudentID
      });

      if(res.data.message === "Pre enrollment submitted."){          
          setApprovalPrompt(true);
          setApprovalMsg("Pre-enrollment submitted");
      } else {
        setApprovalPrompt(false);
        setErrorPrompt(true);
        setErrorMsg(res.data.message);
      }
    } catch (err) {
      setApprovalPrompt(false);
        setErrorPrompt(true);
        setErrorMsg(`FFailed to submit pre enrollment: ${err.response?.data?.message || err.message}`);
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

    console.log(request.StudentID);
    console.log(request.StudentType);

    if(request.StudentType === "Regular"){
      axios.post('http://localhost:8080/getEligibleCourse', {studentID: request.StudentID})
      .then((res) => {
        if(res.data.message === "Success"){
          setEligibleCourses(res.data.courses);        
        }
      })
      .catch((err) => {
        console.error("Error: " + err);
        setErrorMsg("An error occurred. Please reload the page and try again.");
        setErrorPrompt(true);
      })
    } else if(request.StudentType === "Irregular"){
      Promise.all([
        axios.post('http://localhost:8080/classSchedIrreg/preEnroll', {studentID: request.StudentID}),
        axios.post('http://localhost:8080/getEligibleCourse', {studentID: request.StudentID}),
      ])
      .then((res) => {
        if(res[0].data.message === "Success"){
          setEligibleCourses1(res[0].data.schedData);        
          setPreEnrollSched(res[0].data.schedData);
        }

        if (res[1].data.message === "Success") {
          setEligibleCourses1(res[1].data.courses);
        }
      })
      .catch((err) => {
        console.error("Error: " + err);
        setErrorMsg("An error occurred. Please reload the page and try again.");
        setErrorPrompt(true);
      })
    }
  };


  //close popup
  const closePopup = () => {
    setPopUpVisible(false);
    setSelectedRequest(null);
  };
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const query = searchQuery.toLowerCase();
      setFilteredRequests(
        accountRequests.filter((request) =>
          request.Firstname.toLowerCase().includes(query) ||
          request.Lastname.toLowerCase().includes(query) ||
          request.CvSUStudentID.toString().includes(query) ||
          `${request.Year === "First Year" ? 1
            : request.Year === "Second Year" ? 2
              : request.Year === "Third Year" ? 3
                : request.Year === "Fourth Year" ? 4
                  : "N/A"
            } - ${request.Section}`.includes(query) ||
          `${request.Year === "First Year" ? 1
            : request.Year === "Second Year" ? 2
              : request.Year === "Third Year" ? 3
                : request.Year === "Fourth Year" ? 4
                  : "N/A"
            }-${request.Section}`.includes(query)
        )
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, accountRequests]);

  const handleAddRow = () => {
    setRows((prevRows) => [...prevRows, { selectedCourse: "" }]);
  };

  const handleDeleteRow = (index) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };



  const handleCourseChange = (index, courseID) => {
    const updatedRows = [...rows];
    updatedRows[index].selectedCourse = courseID;
    setRows(updatedRows);
  };

  // Add a new row
  const handleAddRow1 = () => {
    setRows1((prevRows) => [...prevRows, { selectedCourse: "" }]);
  };

  // Delete a row
  const handleDeleteRow1 = (index) => {
    setRows1((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  // Handle course selection
  const handleCourseChange1 = (index, courseID) => {
    console.log(index);

    setRows1(prevRows => {
      const updatedRows = [...prevRows];
      updatedRows[index] = { 
        ...updatedRows[index], 
        selectedCourse: courseID, 
        selectedSectionID: null, // Reset selected section when course changes
        sections: [] // Empty sections initially
      };
      return updatedRows;
    });
  
    // Fetch new sections based on the selected course
    axios.post('http://localhost:8080/schedOnCourseChange', { courseID: courseID, studentID: selectedRequest.StudentID })
      .then((res) => {
        if (res.data.message === "Success") {
          const sections = res.data.schedInfo; // Assuming the sections are returned here
          
          setRows1(prevRows => {
            const updatedRows = [...prevRows];
            updatedRows[index] = {
              ...updatedRows[index],
              sections: sections, // Update sections here
            };
            return updatedRows;
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching sections:", err);
      });
  };
  const handleSectionChange = (index, selectedSectionID) => {
    setRows1(prevRows => {
      const updatedRows = [...prevRows];
      updatedRows[index] = {
        ...updatedRows[index],
        selectedSectionID: selectedSectionID, // Store just the section ID if needed
      };
      return updatedRows;
    });
  };

  const calculateTotalUnits = () => {
    const total = rows.reduce((acc, row) => {
      const selectedCourse = eligibleCourses.find(
        (course) => course.CourseChecklistID === Number(row.selectedCourse)
      );
      if (selectedCourse) {
        acc += selectedCourse.CreditUnitLec + selectedCourse.CreditUnitLab;
      }
      return acc;
    }, 0);
    setTotalUnits(total);
  };

  useEffect(() => {
    calculateTotalUnits();
  }, [rows, eligibleCourses]);

  const calculateTotalUnits1 = () => {
    const total = rows1.reduce((acc, row) => {
      const selectedCourse1 = eligibleCourses1.find(
        (course) => course.CourseChecklistID === Number(row.selectedCourse)
      );
      if (selectedCourse1) {
        acc += selectedCourse1.CreditUnitLec + selectedCourse1.CreditUnitLab;
      }
      return acc;
    }, 0);
    setTotalUnits(total);
  };

  useEffect(() => {
    calculateTotalUnits1();
  }, [rows1, eligibleCourses1]);
  


  function formatTime(time) {
    const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const formattedTime = `${currentDate}T${time}`; // Combine current date with the time

    const validDate = new Date(formattedTime); // Create a valid Date object
    return validDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format the time
  }

  const handleDragStart = (course) => {
    setDraggedCourse(course);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow the drop
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedCourse) {
      console.log("Dropped course:", draggedCourse);
      // You can handle drop logic here, like adding the course to a schedule
    }
    setDraggedCourse(null); // Reset after drop
  };

  const filteredRequests1 = filterType1
    ? preEnrollSched.filter(
      (sched) => `${sched.CourseChecklistID}` === filterType1
    )
    : preEnrollSched;
  


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
        <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupPromptError} style={{zIndex: "100000"}}>
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
          Pre-Enrollment
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
          className={`${styles.popup2} ${popUpVisible ? styles.visible : ""}`}
        >
          <div className={styles.popupContentPre}>
            {/* Popup Header */}
            <div className={styles.popupHeader}>
              <button onClick={closePopup} className={styles.closeButton}>✖</button>
              <h2>Pre-Enrollment Form</h2>
            </div>
            <div data-aos="fade-up" className={styles.studentType}>
              <span>DETAILS</span>
            </div>


            {/* Submission Details */}
            <div className={styles.popupTextReq}>

              <p><strong>Name:</strong> {selectedRequest.Firstname} {selectedRequest.Lastname}</p>
              <p><strong>Student ID:</strong> {selectedRequest.CvSUStudentID}</p>
              <p><strong>Student Type:</strong> {selectedRequest.StudentType}</p>

            </div>
                      

            {selectedRequest.StudentType === "Regular" ? (
              <div className={styles.formContainer}>
                              <div className={styles.buttonSection} >
                                <button
                                  className={`${styles.btn} ${styles.addBtn}`}
                                  onClick={handleAddRow}
                                >
                                  <span>ADD</span>
                                </button>
                              </div>
                                                    
                              <table className={styles.checkTable}>
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>Course</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {rows.map((row, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>
                                        <select
                                          value={row.selectedCourse}
                                          onChange={(e) => handleCourseChange(index, e.target.value)}
                                        >
                                          <option value="" disabled>
                                            -- Select a Course --
                                          </option>
                                          {eligibleCourses.map((course) => (
                                            <option
                                              key={course.CourseChecklistID}
                                              value={course.CourseChecklistID}
                                            >
                                              {course.CourseCode} - {course.CourseTitle} ({course.CreditUnitLab + course.CreditUnitLec} units)
                                            </option>
                                          ))}
                                        </select>
                                      </td>
                                      <td>
                                        <button onClick={() => handleDeleteRow(index)} className={`${styles.btn} ${styles.removeBtn}`}><span>Delete</span></button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className={styles.popupTextReq}>
              
                              <p><strong>Total Units: </strong><span>{totalUnits}</span></p> {/* Display updated total units */}
                              </div>
              
                              {/* Submit Button */}
                              <div className={styles.buttonContainer}>
                              <button className={styles.submitBtn} onClick={() => handleSubmit(selectedRequest)}>
                                <span>SUBMIT</span>
                              </button>
                            </div>
                            </div>
            ) : selectedRequest.StudentType === "Irregular" ? (
              <div className={styles.Contentt}>
                      <h3 style={{color: 'black'}}>Class Schedule</h3>
                          <div className={styles.filterSection} data-aos="fade-up">
                            <label htmlFor="filter" className={styles.filterLabel}>Filter by Course:</label>
                            <select
                              id="filter"
                              className={styles.filterDropdown}
                              value={filterType1}
                              onChange={(e) => setFilterType1(e.target.value)} // Updates filterType
                            >
                              <option value="">All Courses</option> {/* Option to reset filter */}
                {eligibleCourses1.map((course) => (
                  <option
                    key={course.CourseChecklistID}
                    value={course.CourseChecklistID}
                  >
                    {course.CourseCode} {/* Display Course Code */}
                  </option>
                ))}
              </select>
                          </div>
              
                    <div
                      className={styles.tableContainer}
                      data-aos="fade-up"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >       
                    <table className={styles.checklistTable}>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Section</th>
              <th>Day</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests1.length > 0 ? (
              filteredRequests1.map((acc, index) => (
                <tr
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(acc)}
                  className={styles.checklistTable}
                >
                  <td data-label="Course Code">{acc.CourseCode}</td>
                  <td data-label="Course Title">{acc.CourseTitle}</td>
                  <td data-label="Section">
                    {acc.YearLevel === "First Year"
                      ? 1
                      : acc.YearLevel === "Second Year"
                      ? 2
                      : acc.YearLevel === "Third Year"
                      ? 3
                      : acc.YearLevel === "Fourth Year"
                      ? 4
                      : "Mid-Year"}{" "}
                    - {acc.Section}
                  </td>
                  <td data-label="Day">{acc.Day}</td>
                  <td data-label="Time">
                    {formatTime(acc.StartTime)} to {formatTime(acc.EndTime)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={styles.noData}>
                  No courses available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
                      </div>
              <br />
              <br />
              
                          <h3 style={{color: "black"}}>Pre-Enrollment Form</h3>
              
                          <div className={styles.formContainer}>
                <div className={styles.buttonSection} >
                  <button
                    className={`${styles.btn} ${styles.addBtn}`}
                    onClick={handleAddRow1}
                  >
                    <span>ADD</span>
                  </button>
                </div>




                <table className={styles.checkTable}>
  <thead>
    <tr>
      <th>#</th>
      <th>Course</th>
      <th>Section</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {rows1.map((row, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>
          <select
            value={row.selectedCourse} // Ensure selectedCourse is the value here
            onChange={(e) => handleCourseChange1(index, e.target.value)}
          >
            <option value="" disabled>
              -- Select a Course --
            </option>
            {eligibleCourses1.map((course) => (
              <option
                key={course.CourseChecklistID}
                value={course.CourseChecklistID}
              >
                {course.CourseCode} - {course.CourseTitle} ({course.CreditUnitLab + course.CreditUnitLec} units)
              </option>
            ))}
          </select>
        </td>
        <td>
        <select 
  value={row.selectedSectionID || ""} // Set the selected section value based on the section ID
  onChange={(e) => handleSectionChange(index, e.target.value)} // Pass the ClassSchedID
>
  <option value="" disabled>-- Select Section --</option>
  {row.sections?.length > 0 ? (
    row.sections.map((section, idx) => (
      <option key={idx} value={section.ClassSchedID}>
        {section.YearLevel === "First Year" ? 1
        : section.YearLevel === "Second Year" ? 2
        : section.YearLevel === "Third Year" ? 3
        : section.YearLevel === "Fourth Year" ? 4
        : "Mid-Year"} - {section.Section}
      </option>
    ))
  ) : (
    <option value="" disabled>No sections available</option>
  )}
</select>


        </td>
        <td>
          <button onClick={() => handleDeleteRow1(index)} className={`${styles.btn} ${styles.removeBtn}`}>
            <span>Delete</span>
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


                <p>Total Units: <span>{totalUnits}</span></p> {/* Display updated total units */}

                {/* Submit Button */}
                <button className={styles.submitBtn} onClick={() => handleSubmit1(selectedRequest)}>
                  <span>SUBMIT</span>
                </button>
              </div>
              
                        </div>

            ) : ("")}            

          </div>
        </div>

      )}


    </>
  );
}

export default Requirements;
