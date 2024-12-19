import { useEffect, useState } from "react";
import { Stepper, Step, StepLabel } from "@mui/material";
import styles from "/src/styles/Enrollment.module.css";
import Header from "/src/components/StudentDashHeader.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ShifteeForm() {
  const [SideBar, setSideBar] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [accName, setAccName] = useState("");

  const [successPrompt, setSuccessPrompt] = useState(false);
  const [errorPrompt, setErrorPrompt] = useState(false); //errors
  const [errorMsg, setErrorMsg] = useState("");

  const [studentID, setStudentID] = useState(""); //Will store student ID to use as a reference for download page of admission form
  const [formValues, setFormValues] = useState({
    shiftingStatus: '',
    prevProgram: '',
    prevProgramAdviser: '',
    studentID: '',
    currentAcadYear: '',
    semester: '',
    reasons: '',
    dateSubmitted: '',
    submissionDate: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    axios.get("http://localhost:8080/getShifteeInfo")
      .then((res) => {
        if (res.data.message === "Fetched records successfully") {
          console.log(res.data);
          setFormValues({
            shiftingStatus: res.data.shiftingStatus || '',
            prevProgram: res.data.prevProgram || '',
            prevProgramAdviser: res.data.prevProgramAdviser || '',
            studentID: res.data.studentID || '',
            currentAcadYear: res.data.currentAcadYear || '',
            semester: res.data.semester || '',
            reasons: res.data.reasons || '',
            dateSubmitted: res.data.dateSubmitted,
            submissionDate: res.data.submissionDate,
          });

          setStudentID(res.data.studentID);
        } else {
          setErrorMsg(res.data.message);
          setErrorPrompt(true);
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert("Error: " + err);
      })
  }, []);

  const autoSave = async () => {
    try {
      const res1 = await axios.post("http://localhost:8080/saveShiftingInfo", formValues)
      if (res1.data.message === "Record updated successfully") {
        console.log(res1.data);
        setErrorMsg("");
        setErrorPrompt(false);
      } else {
        setErrorMsg(res1.data.message);
        setErrorPrompt(true);
        return;
      }

      const res2 = await axios.post("http://localhost:8080/saveShifteeInfo", formValues)
      if (res2.data.message === "Record updated successfully") {
        console.log(res2.data);
        setErrorMsg("");
        setErrorPrompt(false);
      } else {
        setErrorMsg(res2.data.message);
        setErrorPrompt(true);
      }
    } catch (err) {
      setErrorMsg("Error: " + err.message);
      setErrorPrompt(true);
    }
  }

  //AUTOSAVE INPUT IN TEXTFIELDS AFTER 1 SECOND OF CHANGES
  useEffect(() => {
    const timer = setTimeout(() => {
      autoSave();
    }, 1000);

    return () => clearTimeout(timer);
  }, [formValues]);


  {/* FOR ANIMATION */ }
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

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

  // INITIALIZER


  const steps = [
    "Shifting Information",
    "Shifting Status",
  ];


  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [SideBar]);

  const handleNext = () => setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prevStep) => Math.max(prevStep - 1, 0));

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formValues.shiftingStatus || !formValues.prevProgram || !formValues.prevProgramAdviser || !formValues.studentID || !formValues.currentAcadYear || !formValues.semester || !formValues.reasons) {
      setErrorMsg("Fill all fields");
      setErrorPrompt(true);
      return;
    }

    // Update the dateSubmitted here
    const currentDate = new Date().toISOString();  // or use .toLocaleDateString() based on your preference

    axios.post("http://localhost:8080/submitShiftingForm", { ...formValues, dateSubmitted: currentDate })
      .then((res) => {
        if (res.data.message === "Form submitted successfully") {
          setStudentID(res.data.studentID);
          setErrorMsg("");
          setErrorPrompt(false);
          setSuccessPrompt(true);
          setActiveStep(2);
          console.log(res.data);

          // Update the formValues state immediately with the new date
          setFormValues((prevValues) => ({
            ...prevValues,
            dateSubmitted: currentDate, // Set the new date here
          }));

          // Delay the reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
        } else {
          setErrorMsg(res.data.message);
          setErrorPrompt(true);
        }
      })
      .catch((err) => {
        setErrorMsg("Error: " + err);
        setErrorPrompt(true);
      })
  }

  const handleDownloadForm = () => {
    const url = `/download-shiftingform/${studentID}`;
    window.open(url, "_blank");
  };

  const renderContent = () => {
    switch (steps[activeStep]) {
      case "Shifting Information":
        return (
          <div className={styles.content}>
            <h3 className={styles.stepTitle}>
              Shifting Information
            </h3>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="prevProgram">Previous Program:</label>
                <input
                  id="prevProgram"
                  name="prevProgram"
                  value={formValues.prevProgram}
                  onChange={handleInputChange}
                  type="text"
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="prevProgramAdviser">Previous Program Adviser:</label>
                <input
                  id="prevProgramAdviser"
                  name="prevProgramAdviser"
                  value={formValues.prevProgramAdviser}
                  onChange={handleInputChange}
                  type="text"
                  disabled={formValues.shiftingStatus !== "Pending"}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="studentID">Student ID:</label>
                <input
                  id="studentID"
                  name="studentID"
                  value={formValues.studentID}
                  onChange={handleInputChange}
                  type="text"
                  disabled
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="semester">Current Semester:</label>
                  <select
                    name="semester"
                    id="semester"
                    value={formValues.semester}
                    onChange={handleInputChange}
                    disabled={formValues.shiftingStatus !== "Pending"}
                    required>
                    <option value="" disabled>
                      Select Semester
                    </option>
                    <option value="First Semester">1st Semester</option>
                    <option value="Second Semester">2nd Semester</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="currentAcadYear">Current Academic Year:</label>
                  <input
                    id="currentAcadYear"
                    name="currentAcadYear"
                    value={formValues.currentAcadYear}
                    onChange={handleInputChange}
                    type="text"
                    disabled={formValues.shiftingStatus !== "Pending"}
                    required
                  />
                </div>
              </div>



              <div className={styles.formGroup}>
                <label htmlFor="reasons">Reasons:</label>
                <textarea
                  id="reasons"
                  name="reasons"
                  value={formValues.reasons}
                  onChange={handleInputChange}
                  placeholder="e.g.&#10;1.&#10;2.&#10;3."
                  disabled={formValues.shiftingStatus !== "Pending"}
                  required
                ></textarea>
              </div>
              <button type="submit" onClick={handleSubmitForm} className={styles.submitButton}>
                <span>Submit</span>
              </button>
            </form>
          </div>
        );

      case "Shifting Status": {
        const formattedDate = formValues.dateSubmitted === "0000-00-00" || !formValues.dateSubmitted
          ? "Not yet submitted"
          : new Date(formValues.dateSubmitted).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

        const formattedDate1 = formValues.submissionDate === "0000-00-00" || !formValues.submissionDate
          ? "No schedule available"
          : new Date(formValues.submissionDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

        return (
          <div className={styles.Contentt}>
            <img
              src={
                formValues.shiftingStatus === "Approved" ?
                  "src/assets/check-icon.png"
                  : formValues.shiftingStatus === "Submitted" ?
                    "src/assets/pending-icon.png"
                    : formValues.shiftingStatus === "Rejected" ?
                      "src/assets/rejected-icon.png"
                      : "src/assets/pending-icon.png"
              }
              alt="Fee Status Icon"
              className={styles.uploadIcon}
            />
            <h3>
              Shifting Status: <span>{formValues.shiftingStatus}</span>
            </h3>
            <p>
              Kindly go to the Registrar’s Office to claim your Certificate of
              Registration.
            </p>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="dateSubmitted">Submitted on:</label>
                <input
                  id="dateSubmitted"
                  name="dateSubmitted"
                  value={formattedDate}
                  type="text"
                  readOnly
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="requirementsSchedule">Requirements Submission Schedule:</label>
                <input
                  id="requirementsSchedule"
                  name="requirementsSchedule"
                  value={formattedDate1}
                  type="text"
                  readOnly
                />
              </div>
              <div className={styles.formGroup}>
                <button
                  type="button"
                  className={styles.submitButton}
                  onClick={handleDownloadForm}
                  disabled={formValues.shiftingStatus !== "Approved"}
                ><span>
                    Download Shiftee Form</span>
                </button>
              </div>
            </form>
          </div>
        );
      }
      default:
        return <p>Select a step to view content.</p>;
    }

  };

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.contentSection}>
        <div className={styles.PageTitle}>Shiftee</div>

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
    </>
  );
}

export default ShifteeForm;
