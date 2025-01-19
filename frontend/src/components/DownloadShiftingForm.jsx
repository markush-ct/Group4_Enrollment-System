import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import styles from '/src/styles/DownloadForm.module.css';
import cvsulogo from '/src/assets/cvsu-logo.png';

const DownloadShiftingForm = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    const { id } = useParams(); // Fetch ID from URL
    const [formData, setFormData] = useState({});
    const [studentData, setStudentData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const printRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${backendUrl}/get-shifteeForm/${id}`);
                setFormData(response.data);
                setLoading(false);

                const response1 = await axios.get(`${backendUrl}/get-shiftee/${id}`);
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
        <div className={styles.contentSection}>
            <div className={styles.container} ref={printRef}>
        
              <div className={styles.headerContainer}>
        
                <div className={styles.logoContainer}>
                  <img
                    src={cvsulogo}
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
              <div className={styles.contentt2} style={{marginTop: "10px"}}>
                  <p>Sir/Madam</p>
                </div>
                </div>
        
                <div className={styles.contentt2}>
        <p className={styles.contentt2}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;I wish to ask permission to shift to{" "}
          <strong>
            <u>
              {studentData.ProgramID === 1 ? "Bachelor of Science in Computer Science" 
              : studentData.ProgramID === 2 ? "Bachelor of Science in Information Technology" 
              : "Unknown"}
            </u>
          </strong> program 
        from <u>{studentData.PrevProgram}</u> during the{" "}
        {studentData.Semester === "First Semester" ? "1st" 
        : studentData.Semester === "Second Semester" ? "2nd" 
        : "Unknown"} semester of AY {" "}
         {formData.AcadYear} due to the following reasons:         </p>
         
         <p className={styles.contentt2}>
         {formData.Reasons.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ))}
         </p>

         <p className={styles.contentt2_1}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Hoping for your favorable action.</p>


        </div>

        <div className={styles.infoGrid5}>

      <div className={styles.contentt2}>
        
        </div>
        <div className={styles.contentt2}>
      <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Very truly yours,</p><br></br>
      <p className={styles.shifteeName}><span
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
        (Signature over printed name)
      </p>
      <p style={{ textAlign: "right", marginTop: "10px" }}>
        Date: <span
          style={{
            display: "inline-block",
            borderBottom: "1px solid black",
            width: "70%",
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
        <div className={styles.contentt2} style={{ textAlign: "right" }}>
        <p>&nbsp;</p>
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
        <p style={{ textAlign: "right" }}>Date: 
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
        <div className={styles.contentt2} style={{ textAlign: "right" }}>
        <p>&nbsp;</p>
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
        
        <p style={{ textAlign: "right" }}>Date: 
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
