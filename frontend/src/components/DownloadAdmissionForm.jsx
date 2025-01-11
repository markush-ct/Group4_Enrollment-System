import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import styles from '/src/styles/DownloadForm.module.css';

const DownloadAdmissionForm = () => {
  const { id } = useParams(); // Fetch ID from URL
  const [formData, setFormData] = useState({});
  const [studentData, setStudentData] = useState({});
  const [print, setPrint] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef();

  const [datetimeGenerated, setDatetimeGenerated] = useState("");
  useEffect(() => {
    const today = new Date();
    const date = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const time = today.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    setDatetimeGenerated(`${date} ${time}`);
  }, [datetimeGenerated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/get-form/${id}`);
        setFormData(response.data);
        setLoading(false);

        const response1 = await axios.get(`http://localhost:8080/get-student/${id}`);
        setStudentData(response1.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching form data:", error);
        setError("Error fetching form data.");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePrint = useReactToPrint({
    contentRef: printRef, // Use contentRef instead of content
    documentTitle: "form-details",
  });
  
  return (
    <div className={styles.contentSection}>
    <div className={styles.container} ref={printRef}>

      <div className={styles.headerContainer}>

        <div className={styles.logoContainer}>
          <img
            src="/src/assets/cvsu-logo.png"
            alt="CvSU Logo"
            className={styles.logo}
          />
        </div>


        <div className={styles.header}>
          <p>Republic of the Philippines</p>
          <h1>CAVITE STATE UNIVERSITY</h1>
          <h2>APPLICATION FORM FOR ADMISSION</h2>
        </div>


        <div className={styles.pictureContainer}>
          
          <img className={styles.idPictureBox} src={`http://localhost:8080/${formData.IDPicture}`} alt="" />
        </div>
      </div>

    
      <div className={styles.infoGrid0}>
      <div className={styles.contentt}>
          <p>Generated: <span>{datetimeGenerated}</span></p>
        </div>
        </div>

      <div className={styles.infoGrid0}>
      <div className={styles.contentt}>
          <p>Admission Information - <span>{formData.ExamControlNo} {formData.ApplyingFor}</span></p>
          <p>Campus - <span>{formData.Branch}</span></p>
        </div>
        </div>
      <div className={styles.infoGrid}>
      <div className={styles.contentt}>
        <p>Entry: <span>New</span></p>
        <p>Strand: <span>{formData.SHSStrand}</span></p>
        <p>LRN: <span>{formData.LRN}</span></p>
        <p>Preffered Course: <span>{studentData.ProgramID === 1 ? "BSCS" : studentData.ProgramID === 2 ? "BSIT" : "Unknown"}</span></p>
        </div>
        <div className={styles.contentt}>
        <p>Type: <span>{studentData.StudentType === "Freshman" ? "K-12 SHS Graduate/Graduating" : "Transferee"}</span></p>

        </div>
        <div className={styles.contentt}>
          <p>Applicant Type: <span>{formData.Nationality}</span></p>
        </div>
        <div className={styles.contentt}>
        <p>Final Average: <span>{formData.FinalAverage}</span></p>

        </div>
        </div>

        <div className={styles.infoGrid3}>
        <div className={styles.contentt}>
        <p>1st Quarter: <span>{formData.FirstQuarterAve}</span></p>
        </div>
        <div className={styles.contentt}>
        <p>2nd Quarter: <span>{formData.SecondQuarterAve}</span></p>
        </div>
        <div className={styles.contentt}>
        <p>3rd Quarter: <span>{formData.ThirdQuarterAve}</span></p>
        </div>
        <div className={styles.contentt}>
        <p>4th Quarter: <span>{formData.FourthQuarterAve === 0 ? '' : formData.FourthQuarterAve}</span></p>
        </div>

        </div>
        



      <div className={styles.sectionTitle}>Personal Information</div>
      <div className={styles.infoGrid2}>
      <div className={styles.contentt}>
          <p>Name: <span>{`${studentData.Lastname?.toUpperCase()}, ${studentData.Firstname?.toUpperCase()} ${studentData.Middlename?.toUpperCase()}`}</span></p>
          <p>Address: <span>{studentData.Address}</span></p>
          <p>Email: <span>{studentData.Email}</span></p>
          <p>Birthdate: <span>{new Date(studentData.DOB).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
          <p>PWD: <span>{formData.PWD}</span></p>
        </div>
       
        <div className={styles.contentt}>
          <p>Sex: <span>{studentData.Gender === 'F' ? "Female" : studentData.Gender === 'M' ? "Male" : ""}</span></p>
          <p>Mobile: <span>{studentData.PhoneNo}</span></p>
          <p>Civil Status: <span>{formData.CivilStatus}</span></p>
          <p>Nationality: <span>{formData.Nationality}</span></p>
          <p>Indigenous: <span>{formData.Indigenous}</span></p>
        </div>
        
      </div>


    <div className={styles.sectionTitle}>Family Background</div>
      <div className={styles.infoGrid}>
      <div className={styles.contentt}>
          <p>Father: <span>{formData.FatherName}</span></p>
          <p>Mother: <span>{formData.MotherName}</span></p>
          <p>Guardian: <span>{formData.MotherName}</span></p>
        </div>
       
        <div className={styles.contentt}>
          <p>Contact: <span>{formData.FatherContactNo}</span></p>
          <p>Contact: <span>{formData.MotherContactNo}</span></p>
          <p>Contact: <span>{formData.GuardianContactNo}</span></p>
        </div>
        <div className={styles.contentt}>
          <p>Occupation: <span>{formData.FatherOccupation}</span></p>
          <p>Occupation: <span>{formData.MotherOccupation}</span></p>
          <p>Occupation: <span>{formData.GuardianOccupation}</span></p>
        </div>

        
        
      </div>

    <div className={styles.sectionTitle}>Educational Background</div>
      <div className={styles.infoGrid3}>
      <div className={styles.contentt}>
          <p>Elementary</p>
          <p><span>{formData.ElemSchoolName}</span></p>
          <p>High School</p>
          <p><span>{formData.HighSchoolName}</span></p>
          <p>Senior High School</p>
          <p><span>{formData.SHSchoolName}</span></p>
        </div>
       
        <div className={styles.contentt}>
        <p>Address</p>
          <p><span>{formData.ElemSchoolAddress}</span></p>
          <p>Address</p>
          <p><span>{formData.HighSchoolAddress}</span></p>
          <p>Address</p>
          <p><span>{formData.SHSchoolAddress}</span></p>
        </div>
        <div className={styles.contentt}>
        <p>Year</p>
          <p><span>{formData.ElemYearGraduated}</span></p>
          <p>Year</p>
          <p><span>{formData.HighSchoolYearGraduated}</span></p>
          <p>Year</p>
          <p><span>{formData.SHYearGraduated}</span></p>
        </div>
        <div className={styles.contentt}>
        <p>Type</p>
          <p><span>{formData.ElemSchoolType}</span></p>
          <p>Type</p>
          <p><span>{formData.HighSchoolType}</span></p>
          <p>Type</p>
          <p><span>{formData.SHSchoolType}</span></p>
        </div>

      
      </div>


      <div className={styles.sectionTitle}>Medical History Information</div>
      <div className={styles.infoGrid2}>
      <div className={styles.contentt}>
          <p>Medications: <span>{formData.Medication}</span></p>
          <p>Medical Condtion/s: <span>{formData.MedicalHistory}</span></p><br></br>
          </div>
          </div>
          <div className={styles.infoGrid2}>
          <div className={styles.hereby}>
          <p><strong>I hereby certify that all the information 
            stated above are true and correct</strong> as to the best 
            of my knowledge. I hereby give consent for my
             personal data included in my offer to be processed 
             for the purposes of admission and enrollment in accordance
              with Republic Act 10173 - Data Privacy Act of 2012.: <span></span></p>
              <br></br>

              <p><span
                        style={{
                          display: "inline-block",
                          borderBottom: "1px solid black",
                          width: "80%",
                          marginLeft: "10px",
                          marginRight: "0px",
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}
                      >{studentData.Lastname}, {studentData.Firstname} {studentData.Middlename}</span>
                      <br />
                      <p style={{textAlign: "center",}}>
                      Signature over printed name</p>
                    </p>
        </div>

        {studentData.StudentType === "Freshman" ? (
          <div className={styles.contentt3box}>
          <p className={styles.contentt3}>
          To be filled up by the OSAS/Guidance Staff
        </p>
        <p className={styles.contentt3}>
          SUBMITTED REQUIREMENTS
        </p>
        <p className={styles.contentt4}><span
              style={{
                display: "inline-block",
                borderBottom: "1px solid black",
                width: "10px",
                marginLeft: "2px",
                marginRight: "2px",
              }}
            ></span>2 copies of 1x1 ID Picture with name tag</p>
        <p className={styles.contentt4}><span
              style={{
                display: "inline-block",
                borderBottom: "1px solid black",
                width: "10px",
                marginLeft: "2px",
                marginRight: "2px",
              }}
            ></span>Short ordinary folder</p>
        <p className={styles.contentt4}>
         <strong>New Student (SHS, ALS)</strong>
          <br />
          <span
              style={{
                display: "inline-block",
                borderBottom: "1px solid black",
                width: "10px",
                marginLeft: "2px",
                marginRight: "2px",
              }}
            ></span>Certified True Copy of G12 report/Certificate of ALS Rating
        </p>
        <p className={styles.contentt4}><strong>Assessed by:</strong><span
              style={{
                display: "inline-block",
                borderBottom: "1px solid black",
                width: "100px",
                marginLeft: "2px",
                marginRight: "2px",
              }}
            ></span></p>
        <p className={styles.contentt4}><strong>Control No.:</strong><span
              style={{
                display: "inline-block",
                borderBottom: "1px solid black",
                width: "100px",
                marginLeft: "2px",
                marginRight: "2px",
              }}
            ></span></p>
  
  
        
      </div>
        ) : (
          <div className={styles.contentt3box}>
                              <p className={styles.contentt3}>
                                To be filled up by the OSAS/Guidance Staff
                              </p>
                              <p className={styles.contentt3}>SUBMITTED REQUIREMENTS</p>
                              <p className={styles.contentt4}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    borderBottom: "1px solid black",
                                    width: "10px",
                                    marginLeft: "2px",
                                    marginRight: "2px",
                                  }}
                                ></span>
                                2 copies of 1x1 ID Picture with name tag
                              </p>
                              <p className={styles.contentt4}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    borderBottom: "1px solid black",
                                    width: "10px",
                                    marginLeft: "2px",
                                    marginRight: "2px",
                                  }}
                                ></span>
                                Short ordinary folder
                              </p>
                              <p className={styles.contentt4}>
                                <strong>Transferee</strong>
                                <br />
                                <span
                                  style={{
                                    display: "inline-block",
                                    borderBottom: "1px solid black",
                                    width: "10px",
                                    marginLeft: "2px",
                                    marginRight: "2px",
                                  }}
                                ></span>
                                Certified True Copy of Transcript of Records/Certificate
                                of Grades
                              </p>
                              <p className={styles.contentt4}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    borderBottom: "1px solid black",
                                    width: "10px",
                                    marginLeft: "2px",
                                    marginRight: "2px",
                                  }}
                                ></span>
                                Certified True Copy of Transfer Credentials/Honorable
                                Dismissal
                              </p>
                              <p className={styles.contentt4}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    borderBottom: "1px solid black",
                                    width: "10px",
                                    marginLeft: "2px",
                                    marginRight: "2px",
                                  }}
                                ></span>
                                Certified True Copy of Good Moral Certificate
                              </p>
                              <p className={styles.contentt4}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    borderBottom: "1px solid black",
                                    width: "10px",
                                    marginLeft: "2px",
                                    marginRight: "2px",
                                  }}
                                ></span>
                                Photocopy NBI Clearance
                              </p>
                              <p className={styles.contentt4}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    borderBottom: "1px solid black",
                                    width: "10px",
                                    marginLeft: "2px",
                                    marginRight: "2px",
                                  }}
                                ></span>
                                Photocopy Accomplished Interview Slip
                              </p>
                              <p className={styles.contentt4}>
                                <strong>Assessed by:</strong>
                                <span
                                  style={{
                                    display: "inline-block",
                                    borderBottom: "1px solid black",
                                    width: "100px",
                                    marginLeft: "2px",
                                    marginRight: "2px",
                                  }}
                                ></span>
                              </p>
                              <p className={styles.contentt4}>
                                <strong>
                                  Control No.: {formData.ExamControlNo}
                                </strong>
                              </p>
                            </div>
        )}

       
      
        
        
  
      
    </div>
      
    </div>


    <button onClick={handlePrint} className={styles.printButton}>
      <span>Print / Download</span>
    </button>
  </div>
);
};

export default DownloadAdmissionForm;
