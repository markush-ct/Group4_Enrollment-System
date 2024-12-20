import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import styles from '/src/styles/DownloadForm.module.css';

const DownloadShiftingForm = () => {
    const { id } = useParams(); // Fetch ID from URL
    const [formData, setFormData] = useState({});
    const [studentData, setStudentData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const printRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/get-shifteeForm/${id}`);
                setFormData(response.data);
                setLoading(false);

                const response1 = await axios.get(`http://localhost:8080/get-shiftee/${id}`);
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

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
                  <h2>OFFICE OF THE CAMPUS REGISTRAR</h2>
                </div>
        
        
                <div className={styles.NoContainer}>
                  
                </div>
              </div>
        


        
        <p className={styles.header}>LETTER OF INTENT</p>

        <div className={styles.infoGrid}>
              <div className={styles.contentt2}>
                  <p>The Campus Administrator</p>
                  <p>This University</p>
                </div>
                </div>

                <div className={styles.infoGrid}>
              <div className={styles.contentt2}>
                  <p>Sir/Madam</p>
                </div>
                </div>
        
                <div className={styles.contentt2}>
        <p className={styles.contentt2}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;I wish to ask permission to shift to <strong>{studentData.ProgramID === 1 ? "BS COMPUTER SCIENCE" 
        : studentData.ProgramID === 2 ? "BS INFORMATION TECHNOLOGY" : "Unknown"}</strong> program 
        from {studentData.PrevProgram} during the {studentData.Semester === "First Semester" 
        ? "1st" : studentData.Semester === "Second Semester" ? "2nd" : "Unknown"} of AY
         {formData.AcadYear} due to the following reasons:         </p>
         

         <p className={styles.contentt2}>{formData.Reasons}</p>

         <p className={styles.contentt2}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Hoping for your favorable action.</p>


        </div>

        <div className={styles.infoGrid5}>

      <div className={styles.contentt2}>
        
        </div>
        <div className={styles.contentt2}>
      <p>Very truly yours,</p><br></br>
      <p><span
          style={{
            display: "inline-block",
            borderBottom: "1px solid black",
            width: "80%",
            marginLeft: "10px",
            marginRight: "0px",
          }}
        ></span>
        <br />
        (Signature over printed name)
      </p>
      <p style={{ textAlign: "left" }}>
        Date: <span
          style={{
            display: "inline-block",
            borderBottom: "1px solid black",
            width: "70%",
            marginLeft: "10px",
          }}
        ></span>
      </p>
    </div>

        </div>


    <div className={styles.infoGrid5}>

      <div className={styles.contentt2}>
        <p>Noted:</p>
        
        <span
          style={{
            display: "inline-block",
            borderBottom: "1px solid black",
            width: "80%",
            marginTop: "5px",
          }}
        ></span>
        <p>
          Name and Signature of Registration Adviser<br />
          (From Previous Program)
        </p>
        <p>Date: 
          <span
            style={{
              display: "inline-block",
              borderBottom: "1px solid black",
              width: "80%",
              marginLeft: "10px",
            }}
          ></span>
        </p>
        </div>
        <div className={styles.contentt2}>
        <p>.</p>
        <span
          style={{
            display: "inline-block",
            borderBottom: "1px solid black",
            width: "80%",
            marginTop: "5px",
          }}
        ></span>
        <p>
          Name & Signature of Campus Registrar<br />
          College of <span
          style={{
            display: "inline-block",
            borderBottom: "1px solid black",
            width: "50%",
            marginTop: "5px",
          }}
        ></span>
        </p>
        <p>Date: 
          <span
            style={{
              display: "inline-block",
              borderBottom: "1px solid black",
              width: "70%",
              marginLeft: "10px",
            }}
          ></span>
        </p>
        </div>

        </div>

        <div className={styles.infoGrid5}>

      <div className={styles.contentt2}>
        <p>Recommending Approval</p>
        
        <span
          style={{
            display: "inline-block",
            borderBottom: "1px solid black",
            width: "250px",
            marginTop: "5px",
          }}
        ></span>

        <p>
          Name and Signature of Department Chairperson<br />
          (From New Program)
        </p>
        </div>
        <div className={styles.contentt2}>
        <p>.</p>
        <span
          style={{
            display: "inline-block",
            borderBottom: "1px solid black",
            width: "80%",
            marginTop: "5px",
          }}
        ></span>
        <p>
          Name & Signature of Campus Registrar<br />
          College of <span
          style={{
            display: "inline-block",
            borderBottom: "1px solid black",
            width: "50%",
            marginTop: "5px",
          }}
        ></span>
        </p>
        <p>Date: 
          <span
            style={{
              display: "inline-block",
              borderBottom: "1px solid black",
              width: "70%",
              marginLeft: "10px",
            }}
          ></span>
        </p>
        </div>

        </div>

        <div className={styles.infoGrid5}>

      <div className={styles.contentt2}>
        <p>Approved:</p>
        
        <span
          style={{
            display: "inline-block",
            borderBottom: "1px solid black",
            width: "80%",
            marginTop: "5px",
          }}
        ></span>
        <p>
          Campus Administrator
        </p>
        
        </div>
        <div className={styles.contentt2}>
        <p>.</p>
        
        <p>Date: 
          <span
            style={{
              display: "inline-block",
              borderBottom: "1px solid black",
              width: "70%",
              marginLeft: "10px",
            }}
          ></span>
        </p>
        </div>

        </div>




      </div>
   




       <button onClick={handlePrint} className={styles.printButton}>
            <span>Print / Download</span>
          </button>
        </div>
   
    );
};

export default DownloadShiftingForm;
