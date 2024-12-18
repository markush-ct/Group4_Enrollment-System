import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import styles from '/src/styles/DownloadForm.module.css';

const DownloadAdmissionForm = () => {
  const { id } = useParams(); // Fetch ID from URL
  const [formData, setFormData] = useState({});
  const [studentData, setStudentData] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef();

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
    <div className={styles.contentSection} ref={printRef}>
    <div className={styles.container}>

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


      <div className={styles.infoGrid}>
        <div>
          <p>Generated: <span>Date and Time</span></p>
          <p>Admission Information - <span>{formData.ExamControlNo} 1st semester 2022-2023</span></p>
          <p>Campus - <span>{formData.Branch}</span></p>
        </div>
        </div>
      <div className={styles.infoGrid}>
        <div>
        <p>Entry: <span>New</span></p>
        <p>Strand: <span>{formData.SHSStrand}</span></p>
        <p>LRN: <span>{formData.LRN}</span></p>
        <p>Preffered Course: <span>{studentData.ProgramID === 1 ? "BSCS" : studentData.ProgramID === 2 ? "BSIT" : "Unknown"}</span></p>
        </div>
        <div>
        <p>Type: <span>K12 SHS Graduate</span></p>

        </div>
        <div>
          <p>Applicant Type: <span>{formData.Nationality}</span></p>
        </div>
        <div>
        <p>1st Quarter: <span>{formData.FirstQuarterAve}</span></p>
        <p>2nd Quarter: <span>{formData.SecondQuarterAve}</span></p>

        </div>
        <div>
        <p>3rd Quarter: <span>{formData.ThirdQuarterAve}</span></p>
        <p>4th Quarter: <span>{formData.FourthQuarterAve === 0 ? '' : formData.FourthQuarterAve}</span></p>

        </div><div>
        <p>Final Average: <span>{formData.FinalAverage}</span></p>

        </div>
      </div>


      <div className={styles.sectionTitle}>Personal Information</div>
      <div className={styles.infoGrid}>
        <div>
          <p>Name: <span>{`${studentData.Lastname?.toUpperCase()}, ${studentData.Firstname?.toUpperCase()} ${studentData.Middlename?.toUpperCase()}`}</span></p>
          <p>Address: <span>{studentData.Address}</span></p>
          <p>Email: <span>{studentData.Email}</span></p>
          <p>Birthdate: <span>{new Date(studentData.DOB).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
          <p>PWD: <span>{formData.PWD}</span></p>
        </div>
       
        <div>
          <p>Sex: <span>{studentData.Gender === 'F' ? "Female" : studentData.Gender === 'M' ? "Male" : ""}</span></p>
          <p>Mobile: <span>{studentData.PhoneNo}</span></p>
          <p>Civil Status: <span>{formData.CivilStatus}</span></p>
          <p>Nationality: <span>{formData.Nationality}</span></p>
          <p>Indigenous: <span>{formData.Indigenous}</span></p>
        </div>
        
      </div>


    <div className={styles.sectionTitle}>Family Background</div>
      <div className={styles.infoGrid}>
        <div>
          <p>Father: <span>{formData.FatherName}</span></p>
          <p>Mother: <span>{formData.MotherName}</span></p>
          <p>Guardian: <span>{formData.MotherName}</span></p>
        </div>
       
        <div>
          <p>Contact: <span>{formData.FatherContactNo}</span></p>
          <p>Contact: <span>{formData.MotherContactNo}</span></p>
          <p>Contact: <span>{formData.GuardianContactNo}</span></p>
        </div>
        <div>
          <p>Occupation: <span>{formData.FatherOccupation}</span></p>
          <p>Occupation: <span>{formData.MotherOccupation}</span></p>
          <p>Occupation: <span>{formData.GuardianOccupation}</span></p>
        </div>

        
        
      </div>

    <div className={styles.sectionTitle}>Educational Background</div>
      <div className={styles.infoGrid}>
        <div>
          <p>Elementary</p>
          <p><span>{formData.ElemSchoolName}</span></p>
          <p>High School</p>
          <p><span>{formData.HighSchoolName}</span></p>
          <p>Senior High School</p>
          <p><span>{formData.SHSchoolName}</span></p>
        </div>
       
        <div>
        <p>Address</p>
          <p><span>{formData.ElemSchoolAddress}</span></p>
          <p>Address</p>
          <p><span>{formData.HighSchoolAddress}</span></p>
          <p>Address</p>
          <p><span>{formData.SHSchoolAddress}</span></p>
        </div>
        <div>
        <p>Type</p>
          <p><span>{formData.ElemSchoolType}</span></p>
          <p>Type</p>
          <p><span>{formData.HighSchoolType}</span></p>
          <p>Type</p>
          <p><span>{formData.SHSchoolType}</span></p>
        </div>

        
        
      </div>
      <div className={styles.sectionTitle}>Medical History Information</div>
      <div className={styles.infoGrid}>
        <div>
          <p>Medications: <span>{formData.Medication}</span></p>
          <p>Medical Condtion/s: <span>{formData.MedicalHistory}</span></p><br></br>
          <p>I hereby.........: <span></span></p>
        </div>
       
      
        
        
  
      
    </div>
      
    </div>


    <button onClick={handlePrint} className={styles.printButton}>
      <span>Print / Download</span>
    </button>
  </div>
);
};

export default DownloadAdmissionForm;
