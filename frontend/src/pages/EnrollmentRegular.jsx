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
  const [Advisingstatus, setAdvisingStatus] = useState("Approved"); //value ng advising
  const [Enrollmentstatus, setEnrollmentStatus] = useState("Enrolled"); //value ng enrollmentstatus
  const [dropdowns, setDropdowns] = useState([{ id: Date.now(), selected: "" }]); //mock subjects
  const [successPrompt, setSuccessPrompt] = useState(false);
  const [errorPrompt, setErrorPrompt] = useState(false); //errors
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [accName, setAccName] = useState("");


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

  const [isEnrollment, setIsEnrollment] = useState(false);
  const [enrollment, setEnrollment] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/getEnrollment")
      .then((res) => {
        const { enrollmentPeriod } = res.data;

        if (res.data.message === "Enrollment fetched successfully") {
          if (enrollmentPeriod.Status === "Pending" || enrollmentPeriod.Status === "Ongoing") {
            setIsEnrollment(true);
            setEnrollment(enrollmentPeriod);
          } else {
            setIsEnrollment(false);
          }
        } else {
          setIsEnrollment(false);
        }
      })
      .catch((err) => {
        setErrorMsg("Error: " + err);
        setIsEnrollment(false);
      })
  }, []);

  {/* FOR ANIMATION */ }
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // INITIALIZER
  const studentProgram = "CS";

  const steps = [
    "Society Fee Status",
    "Requirements Submission",
    "Advising",
    "Pre-Enrollment Form",
    "Enrollment Status",
  ];

  const [digitalChecklist, setDigitalChecklist] = useState({
    CS: {
      "1st Year": {
        "First Semester": [
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
        ],
        "Second Semester": [
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
        ],
      },
    },
    IT: {
      "1st Year": {
        "First Semester": [
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
        ],
        "Second Semester": [
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
        ],
      },

    },
  });

  // Subjects list
  const subjects = [
    { code: "COSC 101", title: "CS Elective", units: 3 },
    { code: "DCIT 65", title: "SE1", units: 3 },
    { code: "COSC 75", title: "SE2", units: 3 },
  ];

  // AADD
  const handleAdd = () => {
    setDropdowns([...dropdowns, { id: Date.now(), selected: "" }]);
  };

  // REMOVE
  const handleRemove = (id) => {
    setDropdowns(dropdowns.filter((dropdown) => dropdown.id !== id));
  };

  const handleSelectionChange = (id, value) => {
    setDropdowns(
      dropdowns.map((dropdown) =>
        dropdown.id === id ? { ...dropdown, selected: value } : dropdown
      )
    );
  };

  const handleSubmit = () => {
    const addedSubjects = dropdowns
      .filter((dropdown) => dropdown.selected) // Filter for selected dropdowns
      .map((dropdown) => {
        const subject = subjects.find((s) => s.code === dropdown.selected);
        return subject
          ? { code: subject.code, title: subject.title, units: subject.units }
          : null;
      })
      .filter(Boolean); // Remove null values

    // Calculate the total units of selected subjects
    const totalUnits = addedSubjects.reduce((acc, subject) => acc + subject.units, 0);

    if (totalUnits > 23) {
      setErrorPrompt(true);
      setErrorMsg(`Maximum units exceeded. You have selected ${totalUnits} units, but the limit is 23 units.`);

    }

    if (addedSubjects.length > 0) {
      setSelectedSubjects(addedSubjects); // Save the added subjects
      setSuccessPrompt(true); // Show the success prompt
    } else {
      setErrorPrompt(true);
      setErrorMsg("You need to add atleast 1 subject");
    }
  };

  const [SocFeestatus, setSocFeeStatus] = useState(''); 

  useEffect(() => {
    axios.get("http://localhost:8080/getStudentSocFeeStatus")
    .then((res) => {
      console.log(res.data.records.SocFeePayment);
      setSocFeeStatus(res.data.records.SocFeePayment);
    })
    .catch((err) => {
      alert("Error: " + err);
    });
  }, []);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [cogChecklist, setCogChecklist] = useState({
    cog: '',
  });
  const [isReqsSubmitted, setIsReqsSubmitted] = useState(false);
  const [checklistData, setChecklistData] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8080/getCourseChecklist'),
      axios.get('http://localhost:8080/getSubmittedCOG'),
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
          }else{
            setUploadedImage(null);
          }
        } else{
          setUploadedImage(null);
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
        if (res.data.message === 'Requirements submitted') {
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

  const handleNext = () => setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prevStep) => Math.max(prevStep - 1, 0));

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
        Submit
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
                Advisingstatus === "Approved"
                  ? "src/assets/paid-icon.png"
                  : SocFeestatus === "Pending"
                    ? "src/assets/pending-icon.png"
                    : "src/assets/unpaid-icon.png"
              }
              alt="Fee Status Icon"
              className={styles.uploadIcon}
            />
            <h3>Advising Status: <span>{Advisingstatus}</span></h3>
            <p>Kindly check your gmail for my course recommendations blah blah</p>

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
            <div className={styles.formContainer}>
              {dropdowns.map((dropdown, index) => (
                <div key={dropdown.id} className={styles.dropdownContainer}>
                  <select
                    id={`subjectDropdown-${dropdown.id}`}
                    className={styles.subjectDropdown}
                    value={dropdown.selected}
                    onChange={(e) => handleSelectionChange(dropdown.id, e.target.value)}
                  >
                    <option value="">Select a Subject</option>
                    {subjects.map((subject, i) => (
                      <option key={i} value={subject.code}>
                        {subject.code} - {subject.title} {subject.units} units
                      </option>
                    ))}
                  </select>
                  {index === dropdowns.length - 1 ? (
                    <button
                      className={`${styles.btn} ${styles.addBtn}`}
                      onClick={handleAdd}
                    >
                      ADD
                    </button>
                  ) : (
                    <button
                      className={`${styles.btn} ${styles.removeBtn}`}
                      onClick={() => handleRemove(dropdown.id)}
                    >
                      REMOVE
                    </button>
                  )}
                </div>

              ))}

              {/* Submit Button */}
              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
              >
                <span>SUBMIT</span>
              </button>
            </div>
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
