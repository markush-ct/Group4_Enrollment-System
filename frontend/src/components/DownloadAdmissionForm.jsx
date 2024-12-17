import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import styles from '/src/styles/DownloadForm.module.css';

const DownloadAdmissionForm = () => {
  const { id } = useParams(); // Fetch ID from URL
  const [formData, setFormData] = useState({
    StudentID: "",
    Branch: "",
    ApplyingFor: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/get-form/${id}`);
        setFormData(response.data);
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
  
  
  const handleClick = () => {
    console.log("Button clicked!");
    handlePrint();
  };
  
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
          <div className={styles.idPictureBox}>1x1 ID Picture</div>
        </div>
      </div>


      <div className={styles.infoGrid}>
        <div>
          <p>Generated: <span>Date and Time</span></p>
          <p>Admission Information - <span>132564 1st semester 2022-2023</span></p>
          <p>Campus - <span>CvSU - Bacoor</span></p>
        </div>
        </div>
      <div className={styles.infoGrid}>
        <div>
        <p>Entry: <span>New</span></p>
        <p>Strand: <span>STEM</span></p>
        <p>LRN: <span>123546</span></p>
        <p>Preffered Course: <span>BSCS</span></p>
        </div>
        <div>
        <p>Type: <span>K12 SHS Graduate</span></p>

        </div>
        <div>
          <p>Applicant Type: <span>Filipino</span></p>
        </div>
        <div>
        <p>1st Quarter: <span>100</span></p>
        <p>2nd Quarter: <span>100</span></p>

        </div>
        <div>
        <p>3rd Quarter: <span>100</span></p>
        <p>4th Quarter: <span>100</span></p>

        </div><div>
        <p>Final Average: <span>100</span></p>

        </div>
      </div>


      <div className={styles.sectionTitle}>Personal Information</div>
      <div className={styles.infoGrid}>
        <div>
          <p>Name: <span>Kai Sotto</span></p>
          <p>Address: <span>Las Piñas City</span></p>
          <p>Email: <span>kaisotto@gmail.com</span></p>
          <p>Birthdate: <span>March 21, 2003</span></p>
          <p>PWD: <span>No</span></p>
        </div>
       
        <div>
          <p>Sex: <span>G po</span></p>
          <p>Mobile: <span>0000000215</span></p>
          <p>Civil Status: <span>Taken</span></p>
          <p>Nationality: <span>Filipino</span></p>
          <p>Indigenous: <span>No</span></p>
        </div>
        
      </div>


    <div className={styles.sectionTitle}>Family Background</div>
      <div className={styles.infoGrid}>
        <div>
          <p>Father: <span>LeBron Jamees</span></p>
          <p>Mother: <span>Savannah James</span></p>
          <p>Guardian: <span>Angel</span></p>
        </div>
       
        <div>
          <p>Contact: <span>12115</span></p>
          <p>Contact: <span>12115</span></p>
          <p>Contact: <span>12115</span></p>
        </div>
        <div>
          <p>Occupation: <span>NBA player</span></p>
          <p>Occupation: <span>Model</span></p>
          <p>Occupation: <span>Guardian</span></p>
        </div>

        
        
      </div>

    <div className={styles.sectionTitle}>Educational Background</div>
      <div className={styles.infoGrid}>
        <div>
          <p>Elementary</p>
          <p><span>GAES</span></p>
          <p>High School</p>
          <p><span>GANHS</span></p>
          <p>Senior High School</p>
          <p><span>AMACC</span></p>
        </div>
       
        <div>
        <p>Address</p>
          <p><span>Las Piñas</span></p>
          <p>Address</p>
          <p><span>Las Piñas</span></p>
          <p>Address</p>
          <p><span>Las Piñas</span></p>
        </div>
        <div>
        <p>Type</p>
          <p><span>Public</span></p>
          <p>Type</p>
          <p><span>Public</span></p>
          <p>Type</p>
          <p><span>Private</span></p>
        </div>

        
        
      </div>
      <div className={styles.sectionTitle}>Medical History Information</div>
      <div className={styles.infoGrid}>
        <div>
          <p>Medications: <span>None</span></p>
          <p>Medical Condtion/s: <span>None</span></p><br></br>
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
