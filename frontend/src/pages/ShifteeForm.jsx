import { useEffect, useState } from "react";
import { Stepper, Step, StepLabel } from "@mui/material";
import styles from "/src/styles/Enrollment.module.css";
import Header from "/src/components/StudentDashHeader.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';

function ShifteeForm() {
  const [SideBar, setSideBar] = useState(false);
  const [activeStep, setActiveStep] = useState(0); 
  
  const [SocFeestatus, setSocFeeStatus] = useState("Unpaid"); //value ng socfee
 
  const [Shiftingstatus, setShiftingStatus] = useState("Accepted"); //value ng enrollmentstatus
  const [successPrompt, setSuccessPrompt] = useState(false);
  const [errorPrompt, setErrorPrompt] = useState(false); //errors
  const [errorMsg, setErrorMsg] = useState(""); 
 

  {/* FOR ANIMATION */ }
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

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
              <label htmlFor="previousProgram">Previous Program:</label>
              <input
                id="previousProgram"
                name="previousProgram"
                value=""
        
                type="text"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="previousAdviser">Previous Program Adviser:</label>
              <input
                id="previousAdviser"
                name="previousAdviser"
                value=""
  
                type="text"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="studentId">Student ID:</label>
              <input
                id="studentId"
                name="studentId"
                value=""
      
                type="text"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="academicYear">Current Academic Year:</label>
              <input
                id="academicYear"
                name="academicYear"
                value=""
       
                type="text"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="reasons">Reasons:</label>
              <textarea
                id="reasons"
                name="reasons"
                value=""
           
                required
              ></textarea>
            </div>
            <button type="submit" className={styles.submitButton}>
              <span>Submit</span>
            </button>
          </form>
          </div>
          );
        
      case  "Shifting Status":
              return (
                <div className={styles.Contentt}>
                <img
                src={
                  Shiftingstatus === "Accepted"
                    ? "src/assets/paid-icon.png"
                    : SocFeestatus === "Pending"
                    ? "src/assets/paid-icon.png"
                    : "src/assets/paid-icon.png"
                }
                alt="Fee Status Icon"
                className={styles.uploadIcon}
              />
                <h3>
                  Shifting Status: <span>{Shiftingstatus}</span>
                </h3>
                <p>
                  Kindly go to the Registrar’s Office to claim your Certificate of
                  Registration.
                </p>
                <form className={styles.form}>
                <div className={styles.formGroup}>
        <label htmlFor="submissionDate">Submitted on:</label>
        <input
          id="submissionDate"
          name="submissionDate"
          value="Not yet submitted"
          type="text"
          readOnly
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="requirementsSchedule">Requirements Submission Schedule:</label>
        <input
          id="requirementsSchedule"
          name="requirementsSchedule"
          value="No schedule available"
          type="text"
          readOnly
        />
      </div>
    </form>
    </div>
              );
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
