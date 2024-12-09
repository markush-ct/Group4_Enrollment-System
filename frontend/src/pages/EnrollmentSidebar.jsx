import { useEffect, useState } from "react";
import { Stepper, Step, StepLabel } from "@mui/material";
import styles from "/src/styles/Enrollment.module.css";
import Header from "/src/components/StudentDashHeader.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';

function EnrollmentSidebar() {
  const [SideBar, setSideBar] = useState(false);
  const [activeStep, setActiveStep] = useState(0); 
  const [uploadedImage, setUploadedImage] = useState(null);
  const [SocFeestatus, setSocFeeStatus] = useState("Unpaid"); //value ng socfee
  const [Advisingstatus, setAdvisingStatus] = useState("Approved"); //value ng advising
  const [Enrollmentstatus, setEnrollmentStatus] = useState("Enrolled"); //value ng enrollmentstatus

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
      <p className={styles.uploadTitle}>Upload your COG</p>
      <div className={styles.uploadBox}>
        <img
          src='src/assets/upload-image-icon.png' 
          alt="Upload Icon"
          className={styles.uploadIcon}
        />
      </div>
      <button className={styles.nextButton}><span>Browse File</span></button>
    </div>


            <h3>Digital Checklist</h3>
            {Object.keys(digitalChecklist[studentProgram]).map((year) => (
              <div className={styles.Contentt} key={year}>
                <h4>{year}</h4>
                {Object.keys(digitalChecklist[studentProgram][year]).map((semester) => (
                  <div className={styles.Contentt} key={semester}>
                    <h5>{semester}</h5>
                    <table className={styles.checklistTable}>
                      <thead>
                        <tr>
                          <th>COURSE CODE</th>
                          <th>COURSE TITLE</th>
                          <th>UNITS</th>
                          <th>FINAL GRADE</th>
                          <th>INSTRUCTOR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {digitalChecklist[studentProgram][year][semester].map((item, index) => (
                          <tr key={index}>
                            <td>{item.code}</td>
                            <td>{item.courseTitle}</td>
                            <td>{item.units}</td>
                            <td>
                              <input
                                type="text"
                                value={item.grade}
                                onChange={(e) =>
                                  updateChecklistField(studentProgram, year, semester, index, "grade", e.target.value)
                                }
                                className={styles.tableInput}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.instructor}
                                onChange={(e) =>
                                  updateChecklistField(studentProgram, year, semester, index, "instructor", e.target.value)
                                }
                                className={styles.tableInput}
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
        return  (
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
        return <p>Pre-Enrollment Form content goes here.</p>;
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
              <Step key={index}>
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
      </div>
    </>
  );
}

export default EnrollmentSidebar;
