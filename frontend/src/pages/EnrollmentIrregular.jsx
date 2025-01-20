import { useEffect, useState } from "react";
import { Stepper, Step, StepLabel } from "@mui/material";
import styles from "/src/styles/Enrollment.module.css";
import Header from "/src/components/StudentDashHeader.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import uploadImageIcon from "/src/assets/upload-image-icon.png";
import warningIcon from "/src/assets/warning-icon.png";
import paidIcon from "/src/assets/paid-icon.png";
import pendingIcon from "/src/assets/pending-icon.png";
import unpaidIcon from "/src/assets/unpaid-icon.png";
import admissionIcon from "/src/assets/admission-icon.png";
import checkmark from "/src/assets/checkmark.png";
import errormark from "/src/assets/errormark.png";

function EnrollmentIrregular() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  const [SideBar, setSideBar] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [Enrollmentstatus, setEnrollmentStatus] = useState("Enrolled"); //value ng enrollmentstatus
  const [successPrompt, setSuccessPrompt] = useState(false);
  const [errorPrompt, setErrorPrompt] = useState(false); //errors
  const [errorMsg, setErrorMsg] = useState("");
  const [accName, setAccName] = useState("");

  const [isPreEnrollmentSubmitted, setIsPreEnrollmentSubmitted] = useState();
  const [preEnrollmentValues, setPreEnrollmentValues] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [draggedCourse, setDraggedCourse] = useState(null); //draglord function design

  
  // In your state, make sure rows is initialized with this structure
  const [rows, setRows] = useState([]);

  const [advisingSched, setAdvisingSched] = useState('');

  //Enrollment Progress
  const [socFeeProg, setSocFeeProg] = useState(false);
  const [reqsProg, setReqsProg] = useState(false);
  const [adviseProg, setAdviseProg] = useState(false);
  const [preEnrollProg, setPreEnrollProg] = useState(false);
  const [enrollProg, setEnrollProg] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`${backendUrl}/socFeeProgress`),
      axios.get(`${backendUrl}/reqsProgress`),
      axios.get(`${backendUrl}/adviseProgress`),
      axios.get(`${backendUrl}/preEnrollProgress`),
      axios.get(`${backendUrl}/enrollStatusProgress`),
    ])
      .then((res) => {
        setSocFeeProg(res[0].data.message === "Success");
        setReqsProg(res[1].data.message === "Success");
        setAdviseProg(res[2].data.message === "Success");
        setPreEnrollProg(res[3].data.message === "Success");
        setEnrollProg(res[4].data.message === "Success");
      });
  }, []);

  useEffect(() => {
    // Calculate progress percentage
    const completedSteps = [socFeeProg, reqsProg, adviseProg, preEnrollProg, enrollProg].filter(Boolean).length;
    if (completedSteps === 1) {
      setActiveStep(1);
    } else if (completedSteps === 2) {
      setActiveStep(2);
    } else if (completedSteps === 3) {
      setActiveStep(3);
    } else if (completedSteps === 4) {
      setActiveStep(4);
    } else if (completedSteps === 5) {
      setActiveStep(4);
    }
    else {
      setActiveStep(0);
    }
  }, [socFeeProg, reqsProg, adviseProg, preEnrollProg, enrollProg]);

  //Reuse in other pages that requires logging in
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
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
  //Reuse in other pages that requires logging in


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



  {/* FOR ANIMATION */ }
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);


  const steps = [
    "Society Fee Status",
    "Requirements Submission",
    "Advising",
    "Pre-Enrollment Form",
    "Enrollment Status",
  ];




  const [isEnrollment, setIsEnrollment] = useState(false);
  const [enrollment, setEnrollment] = useState([]);
  const [SocFeestatus, setSocFeeStatus] = useState('');
  const [reqStatus, setReqStatus] = useState('');
  const [advisingStatus, setAdvisingStatus] = useState('');
  const [preEnrollmentStatus, setPreEnrollmentStatus] = useState('');
  const [stdEnrollStatus, setStdEnrollStatus] = useState('');

  useEffect(() => {
    axios.get(`${backendUrl}/getEnrollment`)
      .then((res) => {
        const { enrollmentPeriod } = res.data;

        if (res.data.message === "Enrollment fetched successfully") {
          if (enrollmentPeriod.Status === "Pending" || enrollmentPeriod.Status === "Ongoing") {
            setIsEnrollment(true);
            setEnrollment(enrollmentPeriod);

            axios.get(`${backendUrl}/getStudentSocFeeStatus`)
              .then((res) => {
                setSocFeeStatus(res.data.records.SocFeePayment);
              })
              .catch((err) => {
                alert("Error: " + err);
              });


              axios.get(`${backendUrl}/getStdEnrollmentStatus`)
              .then((res) => {
                if(res.data.message === "Success"){
                  setStdEnrollStatus(res.data.enrollStatus);
                } else if (res.data.message === "Student is not yet enrolled"){
                  setStdEnrollStatus('Pending');
                } else {
                  setStdEnrollStatus(res.data.message);
                }              
              })
              .catch((err) => {
                alert("Error: " + err);
              });

          } else {
            setIsEnrollment(false);
            setSocFeeStatus('');
          }
        } else {
          setIsEnrollment(false);
          setSocFeeStatus('');
        }
      })
      .catch((err) => {
        setErrorMsg("Error: " + err);
        setIsEnrollment(false);
        setSocFeeStatus('');
      })
  }, []);


  const [uploadedImage, setUploadedImage] = useState(null);
  const [cogChecklist, setCogChecklist] = useState({
    cog: '',
    cogURL: '',
  });
  const [isReqsSubmitted, setIsReqsSubmitted] = useState(false);
  const [checklistData, setChecklistData] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get(`${backendUrl}/getCourseChecklist`),
      axios.get(`${backendUrl}/getSubmittedCOG`),
      axios.get(`${backendUrl}/getAdvisingResult`),
      axios.get(`${backendUrl}/getChecklistStatus`),
      axios.get(`${backendUrl}/getPreEnrollmentStatus`),
      axios.get(`${backendUrl}/getPreEnrollmentValues`),
    ])
      .then((response) => {
        if (response[0].data.message === 'Success') {
          setChecklistData(response[0].data.checklistData);
        } else {
          console.log(response[0].data.message);
        }

        if (response[1].data.message === 'Success') {
          if (response[1].data.cogPath !== null) {
            setUploadedImage(`${backendUrl}/${response[1].data.cogPath}`);
            setCogChecklist({
              cog: response[1].data.cogPath,
              cogURL: response[1].data.cogPath,
            })
          } else {
            setCogChecklist({
              cog: '',
              cogURL: '',
            });
          }
        } else {
          setUploadedImage(null);
        }

        if (response[2].data.message === 'Advising is approved. Proceed to pre-enrollment.') {
          setAdvisingStatus(response[2].data.advisingStatus);
          setAdvisingSched(response[2].data.sched);
        } else if (response[2].data.message === 'Cannot proceed to pre-enrollment. Advising is not yet finished.') {
          setAdvisingSched(response[2].data.sched);
          setAdvisingStatus('Pending');
        } else if (response[2].data.message === 'Cannot proceed to pre-enrollment. Advising is not yet approved.') {
          setAdvisingStatus('Not yet in advising step');
        }

        if (response[3].data.message === 'Requirements verified.') {
          setReqStatus(response[3].data.checklistStatus);
        } else if (response[3].data.message === "Some requirements were rejected.") {
          setReqStatus('Rejected');
        } else {
          setReqStatus('Pending');
        }

        if (response[4].data.message === 'Pre-enrollment is approved') {
          setPreEnrollmentStatus(response[4].data.status);

        } else {
          setPreEnrollmentStatus('Pending');
        }

        if (response[5].data.message !== "No record found") {
          const preEnrollmentData = response[5].data.data;
          setPreEnrollmentValues(preEnrollmentData);
          setIsPreEnrollmentSubmitted(true);
        } else {
          setPreEnrollmentValues([]);
          setIsPreEnrollmentSubmitted(false);
        }

      })
      .catch((err) => {
        alert('An error occurred while fetching data.');
        console.error(err);
        setUploadedImage(null);
      });
  }, [uploadedImage, advisingSched, advisingStatus, reqStatus, preEnrollmentStatus, isPreEnrollmentSubmitted]);

  // Group data by YearLevel and Semester
  const groupedByYearAndSemester = checklistData.reduce((acc, course) => {
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

  // Handle form submission by passing the parameters
  const submitRequirements = (checklistData) => {
    setIsReqsSubmitted(false);

    const formData = new FormData();

    // Append the COG image file
    if (uploadedImage) {
      const fileInput = document.getElementById('cog'); // Get the file input element
      formData.append('cog', fileInput.files[0]); // Append the file directly
    }
    formData.append('cogURL', cogChecklist.cogURL);

    const checklistEntries = checklistData.flatMap((course) => {
      const courseChecklistID = course.courseDetails.courseID;
      const semTaken = document.getElementById(`semTaken-${courseChecklistID}`).value;
      const finalGrade = document.getElementById(`finalGrade-${courseChecklistID}`).value;
      const instructor = document.getElementById(`instructor-${courseChecklistID}`).value;

      if (semTaken.trim() && finalGrade.trim() && instructor.trim()) {
        return [{
          CourseChecklistID: courseChecklistID,
          semTaken: semTaken.trim(),
          finalGrade: finalGrade.trim(),
          instructor: instructor.trim(),
        }];
      }

      return [];
    });

    // Append checklist data to formData
    formData.append('checklist', JSON.stringify(checklistEntries));

    // Send the data to the backend
    axios
      .post(`${backendUrl}/submitCOGChecklist`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.data.message === 'Checklist submitted successfully.') {
          setIsReqsSubmitted(true);
          alert('Requirements successfully submitted');
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert('Error: ' + err);
        setIsReqsSubmitted(false);
      });
  };


  const handleCOGChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the image
      setUploadedImage(imageUrl); // Update the state to display the image
    }
  };


  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [SideBar]);

  const handleNext = () => {
    if (SocFeestatus !== "Paid" && activeStep === 0) {
      setActiveStep(0);
    } else if (reqStatus !== "Verified" && activeStep === 1) {
      setActiveStep(1);
    } else if (advisingStatus !== "Approved" && activeStep === 2) {
      setActiveStep(2);
    } else if (preEnrollmentStatus !== "Approved" && activeStep === 3) {
      setActiveStep(3);
    } else {
      setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1))
    }
  };
  const handleBack = () => setActiveStep((prevStep) => Math.max(prevStep - 1, 0));

  const totalPreEnrollUnits = preEnrollmentValues.reduce((acc, row) => acc + (row.CreditUnitLec + row.CreditUnitLab), 0);


  const [enrolledStdData, SetEnrolledStdData] = useState([]);
  useEffect(() => {
    axios.get(`${backendUrl}/getEnrolledStdInfo`)
      .then((res) => {
        if (res.data.message === "Success") {
          console.log(res.data.studentData);
          SetEnrolledStdData(res.data.studentData);
        }
      })
      .catch((err) => {
        setErrorMsg("Error: " + err);
        setErrorPrompt(true);
      })
  }, []);



  const renderContent = () => {
    switch (steps[activeStep]) {
      case "Requirements Submission":
        return (
          <div className={styles.Contentt}>

            <div className={styles.uploadContainer}>
              <p className={styles.uploadTitle}>{uploadedImage !== null ? "Soft copy of COG" : "Upload a clear and legible picture of your COG"}</p>

              <div className={styles.uploadBox}>
                <img
                  src={uploadedImage || uploadImageIcon}
                  alt="Upload Icon"
                  style={{
                    width: uploadedImage !== null ? '100%' : '100px',
                    margin: uploadedImage !== null ? '0px' : '50px 0px'
                  }}
                />
              </div>
              <button className={styles.nextButton} onClick={() => document.getElementById('cog').click()}>
                <span>Browse File</span>
              </button>
              <input
                id="cog"
                name="cog"
                className={styles.fileInput}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleCOGChange}
              />
            </div>

            <h3>Digital Checklist</h3>


            <div className={styles.Contentt}>
              {reqStatus === "Rejected" && (
                <>
                  <img
                    src={warningIcon}
                    alt="Warning Icon"
                    className={styles.uploadIcon}
                  />
                  <h4 style={{ color: "red", marginBottom: "10px", fontSize: "1.5rem" }}> Attention Required</h4>
                  <h4 style={{ color: "red", marginBottom: "10px", fontSize: "1rem" }}>
                    Some of your submitted requirements were <strong>rejected</strong>. Please review the details below and correct the issues.
                  </h4>
                </>
              )}
            </div>


            {Object.keys(groupedByYearAndSemester).map((yearLevel) => (
              <div className={styles.Contentt} key={yearLevel}>
                <h4>{yearLevel}</h4>
                {Object.keys(groupedByYearAndSemester[yearLevel]).map((semester) => (
                  <div className={styles.Contentt} key={semester}>
                    <h5>{semester || ''}</h5>
                    <table className={styles.checklistTable}>
                      <thead>
                        <tr>
                          <th rowSpan="2">Checklist ID</th>
                          <th colSpan="2">COURSE</th>
                          <th rowSpan="2">SY TAKEN</th>
                          <th rowSpan="2">FINAL GRADE</th>
                          <th rowSpan="2">INSTRUCTOR</th>
                        </tr>
                        <tr>
                          <th>CODE</th>
                          <th>TITLE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedByYearAndSemester[yearLevel][semester].map((course, index) => (
                          <tr key={index} value={course.courseDetails.courseID}>
                            <td>{course.courseDetails.courseID}</td>
                            <td>{course.courseDetails.code}</td>
                            <td>{course.courseDetails.title}</td>
                            <td>
                              <input
                                value={course.syTaken || ''}
                                id={`semTaken-${course.courseDetails.courseID}`}
                                type="text"
                                placeholder="YYYY - YYYY"
                                onChange={(e) =>
                                  setChecklistData((prevData) =>
                                    prevData.map((item) =>
                                      item.courseDetails.courseID === course.courseDetails.courseID
                                        ? { ...item, syTaken: e.target.value }
                                        : item
                                    )
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={course.finalGrade || ''}
                                id={`finalGrade-${course.courseDetails.courseID}`}
                                type="text"
                                placeholder="1.00"
                                onChange={(e) =>
                                  setChecklistData((prevData) =>
                                    prevData.map((item) =>
                                      item.courseDetails.courseID === course.courseDetails.courseID
                                        ? { ...item, finalGrade: e.target.value }
                                        : item
                                    )
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={course.instructor || ''}
                                id={`instructor-${course.courseDetails.courseID}`}
                                type="text"
                                placeholder="Instructor Name"
                                onChange={(e) =>
                                  setChecklistData((prevData) =>
                                    prevData.map((item) =>
                                      item.courseDetails.courseID === course.courseDetails.courseID
                                        ? { ...item, instructor: e.target.value }
                                        : item
                                    )
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ))}

            <button className={styles.nextButton} onClick={() => submitRequirements(checklistData)}>
              <span>Submit</span>
            </button>
          </div>
        );
      case "Society Fee Status":
        return (
          <div className={styles.Contentt}>
            <img
              src={
                SocFeestatus === "Paid"
                  ? paidIcon
                  : SocFeestatus === "Pending"
                    ? pendingIcon
                    : unpaidIcon
              }
              alt="Fee Status Icon"
              className={styles.uploadIcon}
            />
            <h3>Society Fee Status: <span>{SocFeestatus}</span></h3>

          </div>
        );

      case "Advising":
        return (
          <div className={styles.Contentt}>
            <img
              src={
                advisingStatus === "Approved"
                  ? paidIcon
                  : advisingStatus === "Pending"
                    ? pendingIcon
                    : unpaidIcon
              }
              alt="Fee Status Icon"
              className={styles.uploadIcon}
            />
            {advisingStatus === 'Approved' ? (
              <>
                <h3>Advising Sched: <span>
                  {new Date(advisingSched).toLocaleString('en-US', {
                    weekday: 'long', // Optional: Adds the weekday
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true, // 12-hour format
                  })}
                </span></h3>
                <h3>Advising Status: <span>{advisingStatus}</span></h3>
                <p>Advising step completed. Please double-check the Pre-Enrollment form filled out by your adviser.</p>
              </>
            ) : advisingStatus === "Pending" ? (
              <>
                <h3>Advising Sched: <span>
                  {new Date(advisingSched).toLocaleString('en-US', {
                    weekday: 'long', // Optional: Adds the weekday
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true, // 12-hour format
                  })}
                </span></h3>
                <h3>Advising Status: <span>{advisingStatus}</span></h3>
                <p>Please be present at the faculty office according to the scheduled advising time.</p>
              </>
            ) : (
              <>                
                <h3>Advising Status: <span>Advising step has not been initiated yet.</span></h3>
              </>
            )}

          </div>)
      case "Pre-Enrollment Form":
        return (
          <div className={styles.Contentt}>

      <div
        className={styles.tableContainer}
        data-aos="fade-up"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >       
        </div>


            <img
              src={admissionIcon}
              alt="Form Icon"
              className={styles.uploadIcon}
            />
            <h3>Pre-Enrollment Form</h3>
            <p></p>

            {Array.isArray(preEnrollmentValues) && preEnrollmentValues.length > 0 ? (
              <div className={styles.formContainer}>

                {preEnrollmentValues.map((row) => (

                  <div className={styles.popupPromptTextPre} key={row.CourseChecklistID}>
                    <p><span style={{ fontWeight: "bold", color: "#3d8c4b" }}>{row.CourseCode}</span> - {row.CourseTitle} <span style={{ fontWeight: "bold", color: "#AA0000" }}>{row.CreditUnitLec + row.CreditUnitLab} units</span></p>
                  </div>
                ))}
                <br></br>
                <p style={{ textAlign: "center" }}><span style={{ fontWeight: "bold", color: "#3d8c4b", backgroundColor: "transparent", }}> Total Units: </span>{totalPreEnrollUnits}</p>


                <br />
                <p style={{ textAlign: "center", fontSize: "1.25rem", fontWeight: "bold", color: "#3d8c4b", backgroundColor: "transparent", }}>
                  {preEnrollmentStatus === "Approved" ? (
                    "Pre-enrollment is approved. You may now proceed."
                  ) : (
                    "Wait for your pre enrollment to be approved"
                  )}
                </p>
              </div>
            ) : (
            <p>Your pre-enrollment application is currently under review. Please check back later for updates.</p>
            )}

          </div>
        );


      case "Enrollment Status":
        return (
          <div className={styles.Contentt}>
            <img
              src={
                stdEnrollStatus === "Enrolled"
                  ? paidIcon
                  : stdEnrollStatus === "Pending"
                    ? pendingIcon
                    : stdEnrollStatus === "Not Enrolled"
                      ? unpaidIcon
                      : pendingIcon
              }
              alt="Fee Status Icon"
              className={styles.uploadIcon}
            />

            <h3>Enrollment Status: <span>{stdEnrollStatus}</span></h3>

            <p>{stdEnrollStatus === "Enrolled" ? "Kindly go to Registrar’s Office to claim your Certificate of Registration"
              : stdEnrollStatus === "Pending" ? "Your enrollment is currently under review. Please wait for further updates regarding your status."
                : stdEnrollStatus === "Not Enrolled" ? "It seems you are not enrolled. Please contact the Registrar’s Office for assistance."
                  : "Your enrollment is currently under review. Please wait for further updates regarding your status."}</p>


            {stdEnrollStatus === "Enrolled" && enrolledStdData && (
              <div>
                <h3>Details</h3>
                <p>Student ID: <span>{enrolledStdData.CvSUStudentID}</span></p>
                <p>Student Type: <span>{enrolledStdData.StudentType}</span></p>
                <p>Program Year-Section: <span>{enrolledStdData.ProgramID === 1 ? "BSCS" : "BSIT"} {enrolledStdData.Year === "First Year" ? 1
                  : enrolledStdData.Year === "Second Year" ? 2
                    : enrolledStdData.Year === "Third Year" ? 3
                      : enrolledStdData.Year === "Fourth Year" ? 4
                        : "Mid-Year"}
                  {enrolledStdData.Section !== null ? ` - ${enrolledStdData.Section}` : ""}</span></p>
              </div>
            )}

          </div>)
      default:
        return <p>Select a step to view content.</p>;
    }

  };

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      {enrollment.Status === "Ongoing" ? (
        <div className={styles.contentSection}>
          <div className={styles.PageTitle}>Enrollment</div>

          {/* STEPPER */}
          <div data-aos="fade-up" className={styles.container}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                '& .MuiStepIcon-root': {
                  color: 'gray',
                },
                '& .MuiStepIcon-root.Mui-active': {
                  color: '#d0943d',
                },
                '& .MuiStepIcon-root.Mui-completed': {
                  color: '#3d8c4b',
                },
                '& .MuiStepLabel-label': {
                  color: 'rgba(0, 0, 0, 0.6)',
                  display: { xs: 'none', sm: 'block' },
                },
                '& .MuiStepLabel-label.Mui-active': {
                  color: '#d0943d',
                  fontWeight: 'bold',
                  display: { xs: 'none', sm: 'block' },
                },
                '& .MuiStepLabel-label.Mui-completed': {
                  color: '#3d8c4b',
                  fontWeight: 'bold',
                  display: { xs: 'none', sm: 'block' },
                },
              }}
            >
              {steps.map((label, index) => (
                <Step key={index} onClick={() => setActiveStep(index)} style={{ cursor: 'pointer' }}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>





            {/* Content */}
            <div className={styles.superContainer}>
              {renderContent()}
            </div>

            <div className={styles.buttons}>
              <button
                onClick={handleBack}
                disabled={activeStep === 0}
                className={`${styles.button} ${styles.backButton}`}
                aria-label="Go to the previous step"
              >
                <span>Back</span>
              </button>
              <button
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
                className={`${styles.button} ${styles.nextButton}`}
                aria-label="Go to the next step"
              ><span>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
              </button>
            </div>
          </div>


          {/* SUCCESS PROMPT */}
          {successPrompt && (
            <div data-aos="zoom-out" data-aos-duration="500" className={styles.popup}>
              <div className={styles.popupContent}>
                <button
                  className={styles.closeButton}
                  onClick={() => setSuccessPrompt(false)}
                >
                  &times;
                </button>
                <div className={styles.popupHeader}>
                  <h2>Success</h2>
                </div>
                <div className={styles.Message}>
                  <img src={checkmark} alt="SUccess Icon" className={styles.messageImage} />

                </div>
                <p className={styles.popupText}>Submit Successful</p>

              </div>
            </div>
          )}

          {/* ERROR PROMPT */}
          {errorPrompt && (
            <div data-aos="zoom-out" data-aos-duration="500" className={styles.popup}>
              <div className={styles.popupContent}>
                <button
                  className={styles.closeButton}
                  onClick={() => setErrorPrompt(false)}
                >
                  &times;
                </button>
                <div className={styles.popupHeader}>
                  <h2>Error</h2>
                </div>
                <div className={styles.Message}>
                  <img src={errormark} alt="Error Icon" className={styles.messageImage} />

                </div>
                <p className={styles.popupText}>{errorMsg}</p>

              </div>
            </div>
          )}



        </div>
      ) : (
        <div className={styles.contentSection}>
          <div className={styles.PageTitle}>Enrollment is currently closed.</div>
        </div>
      )}
    </>
  );
}

export default EnrollmentIrregular;
