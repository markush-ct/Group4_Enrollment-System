import { useEffect, useState } from "react";
import { Stepper, Step, StepLabel } from "@mui/material";
import styles from "/src/styles/Enrollment.module.css";
import Header from "/src/components/StudentDashHeader.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EnrollmentRegular() {
  const [SideBar, setSideBar] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [Enrollmentstatus, setEnrollmentStatus] = useState("Enrolled"); //value ng enrollmentstatus
  const [successPrompt, setSuccessPrompt] = useState(false);
  const [errorPrompt, setErrorPrompt] = useState(false); //errors
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [accName, setAccName] = useState("");
  const [rows, setRows] = useState([]);
  const [eligibleCourses, setEligibleCourses] = useState([]);
  const [totalUnits, setTotalUnits] = useState(0);
  const [isPreEnrollmentSubmitted, setIsPreEnrollmentSubmitted] = useState();
  const [preEnrollmentValues, setPreEnrollmentValues] = useState([]);

  //Enrollment Progress
  const [socFeeProg, setSocFeeProg] = useState(false);
  const [reqsProg, setReqsProg] = useState(false);
  const [adviseProg, setAdviseProg] = useState(false);
  const [preEnrollProg, setPreEnrollProg] = useState(false);
  const [enrollProg, setEnrollProg] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8080/socFeeProgress"),
      axios.get("http://localhost:8080/reqsProgress"),
      axios.get("http://localhost:8080/adviseProgress"),
      axios.get("http://localhost:8080/preEnrollProgress"),
      axios.get("http://localhost:8080/enrollStatusProgress"),
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
    if(completedSteps === 1){
      setActiveStep(1);
    } else if(completedSteps === 2){
      setActiveStep(2);
    } else if(completedSteps === 3){
      setActiveStep(3);
    } else if(completedSteps === 4){
      setActiveStep(4);
    } else{
      setActiveStep(0);
    }
  }, [socFeeProg, reqsProg, adviseProg, preEnrollProg, enrollProg]);

  //Reuse in other pages that requires logging in
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
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
  //Reuse in other pages that requires logging in


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
  updatedRows[index].selectedCourse = courseID;
  setRows(updatedRows);
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

// UseEffect to recalculate total units when rows or eligibleCourses change
useEffect(() => {
  calculateTotalUnits();
}, [rows, eligibleCourses]);
  

const handleSubmit = async () => {
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

  // Calculate the total units of selected subjects
  const totalUnits = addedSubjects.reduce((acc, subject) => acc + subject.units, 0);

  if (totalUnits > 23) {
    setErrorPrompt(true);
    setErrorMsg(`Maximum units exceeded. You have selected ${totalUnits} units, but the limit is 23 units.`);
    return;
  } else if(totalUnits < 10){
    setErrorPrompt(true);
    setErrorMsg(`Minimum units not reached. You have selected ${totalUnits} units, but the minimum requirement is 10 units.`);
    return;
  } else {
    try {
      // Prepare the data to save
      const selectedCourses = rows.map((row) => row.selectedCourse);
      console.log("Selected Courses: ", selectedCourses);
      console.log("Selected Courses: ", rows);
  
      const res = await axios.post('http://localhost:8080/submitPreEnrollment', {
        courses: selectedCourses,
      });
  
      if (res.data.message === "Pre enrollment submitted.") {
        setSuccessPrompt(true);
        setSelectedSubjects(addedSubjects); 
        setIsPreEnrollmentSubmitted(true);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
      } else {
        setIsPreEnrollmentSubmitted(false);
        setSuccessPrompt(false);
        setErrorPrompt(true);
        setErrorMsg('Failed to submit pre enrollment. Please try again.');
      }
    } catch (err) {
      setSuccessPrompt(false);
      setIsPreEnrollmentSubmitted(false);
      setErrorPrompt(true);
      setErrorMsg(`FFailed to submit pre enrollment: ${err.response?.data?.message || err.message}`);
    }
  }
};

  

  const [isEnrollment, setIsEnrollment] = useState(false);
  const [enrollment, setEnrollment] = useState([]);
  const [SocFeestatus, setSocFeeStatus] = useState(''); 
  const [reqStatus, setReqStatus] = useState('');
  const [advisingStatus, setAdvisingStatus] = useState('');
  const [preEnrollmentStatus, setPreEnrollmentStatus] = useState('');

  useEffect(() => {
    axios.get("http://localhost:8080/getEnrollment")
      .then((res) => {
        const { enrollmentPeriod } = res.data;

        if (res.data.message === "Enrollment fetched successfully") {
          if (enrollmentPeriod.Status === "Pending" || enrollmentPeriod.Status === "Ongoing") {
            setIsEnrollment(true);
            setEnrollment(enrollmentPeriod);

            axios.get("http://localhost:8080/getStudentSocFeeStatus")
            .then((res) => {
              console.log(res.data.records.SocFeePayment);
              setSocFeeStatus(res.data.records.SocFeePayment);
            })
            .catch((err) => {
              alert("Error: sa socfee" + err);
            });

            axios.get("http://localhost:8080/getEligibleCourse")
            .then((res) => {
              if(res.data.message === "Success") {
                console.log(res.data.courses);
                setEligibleCourses(res.data.courses);
              } else{
                console.log(res.data.message)
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
      axios.get('http://localhost:8080/getCourseChecklist'),
      axios.get('http://localhost:8080/getSubmittedCOG'),
      axios.get('http://localhost:8080/getAdvisingResult'),
      axios.get('http://localhost:8080/getChecklistStatus'),
      axios.get('http://localhost:8080/getPreEnrollmentStatus'),
      axios.get('http://localhost:8080/getPreEnrollmentValues'),
    ])
      .then((response) => {
        if (response[0].data.message === 'Success') {
          setChecklistData(response[0].data.checklistData);
        } else {
          alert(response[0].data.message);
        }

        if(response[1].data.message === 'Success') {
          if(response[1].data.cogPath !== null){
            setUploadedImage(`http://localhost:8080/${response[1].data.cogPath}`);
            setCogChecklist({
              cog: response[1].data.cogPath,
              cogURL: response[1].data.cogPath,
            })
          }else{
            setCogChecklist({
              cog: '',
    cogURL: '',
            });
            setUploadedImage(null);
          }
        } else{
          setUploadedImage(null);
        }

        if(response[2].data.message === 'Advising is approved. Proceed to pre-enrollment.') {
          setAdvisingStatus(response[2].data.advisingStatus);
        } else {
          setAdvisingStatus('Pending');
        }

        if(response[3].data.message === 'Requirements verified.') {
          setReqStatus(response[3].data.checklistStatus);
        } else {
          setReqStatus('Pending');
        }

        if (response[4].data.message === 'Pre-enrollment is approved') {
          setPreEnrollmentStatus(response[4].data.status);                        
          
        } else {
          setPreEnrollmentStatus('Pending');
        }

        if(response[5].data.message !== "No record found"){
          console.log("sadsadsadasd ", response[5].data.data);
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
  }, []);

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
      .post('http://localhost:8080/submitCOGChecklist', formData, {
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
    if(SocFeestatus !== "Paid" && activeStep === 0){
      setActiveStep(0);
    } else if(reqStatus !== "Verified" && activeStep === 1){
      setActiveStep(1);
    } else if(advisingStatus !== "Approved" && activeStep === 2){
      setActiveStep(2);
    } else if(preEnrollmentStatus !== "Approved" && activeStep === 3){
      setActiveStep(3);
    } else{
      setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1))
    }
  };
  const handleBack = () => setActiveStep((prevStep) => Math.max(prevStep - 1, 0));

  const totalPreEnrollUnits = preEnrollmentValues.reduce((acc, row) => acc + (row.CreditUnitLec + row.CreditUnitLab), 0);

  const renderContent = () => {
    switch (steps[activeStep]) {
      case "Requirements Submission":
        return (
          <div className={styles.Contentt}>

              <div className={styles.uploadContainer}>
              <p className={styles.uploadTitle}>{uploadedImage !== null ? "Soft copy of COG" : "Upload a clear and legible picture of your COG"}</p>
              
              <div className={styles.uploadBox}>
                <img
                  src={uploadedImage || "src/assets/upload-image-icon.png"}
                  alt="Upload Icon"
                  style={{ width: uploadedImage !== null ? '100%' : '100px',
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
            {Object.keys(groupedByYearAndSemester).map((yearLevel) => (
        <div className={styles.Contentt} key={yearLevel}>
          <h4>{yearLevel}</h4>
          {Object.keys(groupedByYearAndSemester[yearLevel]).map((semester) => (
            <div className={styles.Contentt} key={semester}>
              <h5>{semester || ''}</h5>
              <table className={styles.checklistTable}>
                <thead>
                  <tr>
                    <th colSpan="2">COURSE</th>
                    <th rowSpan="2">PRE-REQUISITE</th>
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
                      <td>{course.courseDetails.code}</td>
                      <td>{course.courseDetails.title}</td>
                      <td>{course.courseDetails.preReq || ''}</td>
                      <td>
                        <input
                          value={course.syTaken}
                          id={`semTaken-${course.courseDetails.courseID}`}
                          type="text"
                          placeholder="YYYY - YYYY"
                        />
                      </td>
                      <td>
                        <input
                          value={course.finalGrade}
                          id={`finalGrade-${course.courseDetails.courseID}`}
                          type="text"
                          placeholder="1.00"
                        />
                      </td>
                      <td>
                        <input
                          value={course.instructor}
                          id={`instructor-${course.courseDetails.courseID}`}
                          type="text"
                          
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
                  ? "src/assets/paid-icon.png"
                  : SocFeestatus === "Pending"
                    ? "src/assets/pending-icon.png"
                    : "src/assets/unpaid-icon.png"
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
                  ? "src/assets/paid-icon.png"
                  : advisingStatus === "Pending"
                    ? "src/assets/pending-icon.png"
                    : "src/assets/unpaid-icon.png"
              }
              alt="Fee Status Icon"
              className={styles.uploadIcon}
            />
            <h3>Advising Status: <span>{advisingStatus}</span></h3>
            <p>Please check your Gmail for advice on eligible courses you can take.</p>

          </div>)
      case "Pre-Enrollment Form":
        return (
          <div className={styles.Contentt}>
            <img
              src="src/assets/admission-icon.png"
              alt="Form Icon"
              className={styles.uploadIcon}
            />
            <h3>Pre-Enrollment Form</h3>
            <p></p>

          {Array.isArray(preEnrollmentValues) && preEnrollmentValues.length > 0 ? (
            <div className={styles.formContainer}>

              {preEnrollmentValues.map((row) => (
                
                <div key={row.CourseChecklistID}>
                  <p>{row.CourseCode} - {row.CourseTitle} ({row.CreditUnitLec + row.CreditUnitLab} units)</p>                  
                </div>
              ))}
              <p>Total Units: <span>{totalPreEnrollUnits}</span></p>

            <br />
            <p>
              {preEnrollmentStatus === "Approved" ? (
                "Pre-enrollment is approved. You may now proceed."
              ) : (
                "Wait for your pre enrollment to be approved"
              )}
              </p>      
          </div>
          ) : (
            <div className={styles.formContainer}>
    <button onClick={handleAddRow} className={`${styles.btn} ${styles.addBtn}`}>
      Add Row
    </button>
    <table border="1">
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
              <button
                onClick={() => handleDeleteRow(index)}
                className={`${styles.btn} ${styles.removeBtn}`}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <p>Total Units: <span>{totalUnits}</span></p> {/* Display updated total units */}

    {/* Submit Button */}
    <button className={styles.submitBtn} onClick={handleSubmit}>
      <span>SUBMIT</span>
    </button>
  </div>
          )}
      
          </div>
        );


      case "Enrollment Status":
        return (
          <div className={styles.Contentt}>
            <img
              src={
                Enrollmentstatus === "Enrolled"
                  ? "src/assets/paid-icon.png"
                  : SocFeestatus === "Pending"
                    ? "src/assets/pending-icon.png"
                    : "src/assets/unpaid-icon.png"
              }
              alt="Fee Status Icon"
              className={styles.uploadIcon}
            />
            <h3>Enrollment Status: <span>{Enrollmentstatus}</span></h3>
            <p>Kindly go to Registrar’s Office to claim your Certificate of Registration</p>

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
                  <img src="/src/assets/checkmark.png" alt="SUccess Icon" className={styles.messageImage} />

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
                  <img src="/src/assets/errormark.png" alt="Error Icon" className={styles.messageImage} />

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

export default EnrollmentRegular;
