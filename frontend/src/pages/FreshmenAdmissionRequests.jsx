import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '/src/components/AdminDashHeader.jsx';
import styles from '/src/styles/FreshmenAdmissionRequests.module.css';
import { useNavigate } from 'react-router-dom';


function FreshmenAdmissionRequest() {
  const [SideBar, setSideBar] = useState(false);
  const [accName, setAccName] = useState("");
  const [accountRequests, setAccountRequests] = useState([]);
  const [accountRequests1, setAccountRequests1] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState(accountRequests);
  const [filteredRequests1, setFilteredRequests1] = useState(filteredRequests);
  const [filterType, setFilterType] = useState("All");
  const [filterType1, setFilterType1] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [approvalPrompt, setApprovalPrompt] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [approvalMsg, setApprovalMsg] = useState('');
  const [rejectionPrompt, setRejectionPrompt] = useState(false);
  const [rejectionMsg, setRejectionMsg] = useState('');
  const [errorPrompt, setErrorPrompt] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [submissionDate, setSubmissionDate] = useState('');
  const [examDatetime, setExamDatetime] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeView, setActiveView] = useState('Request');

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
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

  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [SideBar]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // FETCH ADMISSION REQUEST
  useEffect(() => {
    axios
      .get("http://localhost:8080/getFreshmenAdmissionReq")
      .then((res) => {
        setAccountRequests(res.data.records);
        setFilteredRequests(res.data.records);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Error fetching account requests, using example data:", err);
        setFilteredRequests(accountRequests);
        setAccountRequests([]); // Ensure state is not undefined
        setFilteredRequests([]);
      });
  }, []);


  useEffect(() => { // dropwdonw function
    if (!accountRequests || accountRequests.length === 0) {
      setFilteredRequests([]);
      return;
    }

    if (filterType === "All") {

      setFilteredRequests(accountRequests);
    } else {
      setFilteredRequests(
        accountRequests.filter((request) => request.SHSStrand === filterType)
      );
    }
  }, [filterType, accountRequests]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/getFreshmenConfirmedSlots")
      .then((res) => {
        setAccountRequests1(res.data.admissionRes);
        setFilteredRequests1(res.data.admissionRes);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Error fetching account requests, using example data:", err);
        setFilteredRequests1(accountRequests1);
        setAccountRequests1([]); // Ensure state is not undefined
        setFilteredRequests1([]);
      });
  }, []);


  useEffect(() => { // dropwdonw function
    if (!accountRequests1 || accountRequests1.length === 0) {
      setFilteredRequests1([]);
      return;
    }

    if (filterType1 === "All") {

      setFilteredRequests1(accountRequests1);
    } else {
      setFilteredRequests1(
        accountRequests1.filter((request) => request.SHSStrand === filterType1)
      );
    }
  }, [filterType1, accountRequests1]);


  const handleApprove = async (request) => {
    if (!request || !request.Email) {
      console.error("Invalid request or Email missing:", request);
      setErrorPrompt(true);
      setErrorMsg("Invalid request data.");
      return;
    }

    console.log('Request received in handleApprove:', request);
    console.log('Submission Date:', submissionDate);
    console.log('Exam Date:', examDatetime);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/approveFreshmenAdmissionReq', {
        email: request.Email,
        name: request.Firstname + " " + request.Lastname,
        studentID: request.StudentID,
        submissionDate: submissionDate,
        examDatetime: examDatetime,
      });

      if (response.data.message === "Admission Approval sent") {
        setApprovalPrompt(true);
        setApprovalMsg(`Approval email sent to ${request.Email}`);
        setErrorPrompt(false);
        setPopUpVisible(false);
        // Delay the reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      } else {
        console.error(response.data.message);
        setErrorPrompt(true);
        setErrorMsg('Failed to send approval email');
      }
    } catch (err) {
      console.error('Error:', err);
      setErrorPrompt(true);
      setErrorMsg(`Failed to send approval email: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (request) => {
    if (!request || !request.Email) {
      console.error("Invalid request or Email missing:", request);
      setErrorPrompt(true);
      setErrorMsg("Invalid request data.");
      return;
    }

    console.log('Request received in handleReject:', request);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/rejectFreshmenAdmissionReq', {
        email: request.Email,
        name: request.Firstname + " " + request.Lastname,
        studentID: request.StudentID,
        rejectionReason: rejectionReason,
      });

      if (response.data.message === "Admission request rejection sent") {
        setRejectionPrompt(true);
        setRejectionMsg(`Rejection email sent to ${request.Email}`);
        setErrorPrompt(false);
        setPopUpVisible(false);
        setLoading(false);
        // Delay the reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      } else {
        console.error(response.data.message);
        setErrorPrompt(true);
        setErrorMsg('Failed to send rejection email');

      }
    } catch (err) {
      console.error('Error:', err);
      setErrorPrompt(true);
      setErrorMsg(`Failed to send rejection email: ${err.response?.data?.message || err.message}`);
      setLoading(false);
    }
  };


  //show popup
  const handleRowClick = (request) => {
    setSelectedRequest(request);
    setPopUpVisible(true);
  };

  //close popup
  const closePopup = () => {
    setPopUpVisible(false);
    setApprovalPrompt(false)
    setRejectionPrompt(false);
    setSelectedRequest(null);
  };

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />

      {/* PROMPTS */}
      {approvalPrompt && (
        <div data-aos="zoom-out" data-aos-duration="500" className={`${styles.popup} ${popUpVisible ? styles.visible : ""}`}>
          <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
              <button onClick={closePopup} className={styles.closeButton}>✖</button>
              <h3>Send Schedule for Exam and Requirements Submission</h3>
            </div>

        
            {/* Date Input and Send Button */}
            <div data-aos="fade-up" className={styles.studentType}>
              <h5>Date of Examination</h5>

              <input
                type="datetime-local"
                id="examDatetime"
                name='examDatetime'
                value={examDatetime}
                onChange={(e) => setExamDatetime(e.target.value)}
                className={styles.popupPromptInput}
                required
              />
            </div>

            <div data-aos="fade-up" className={styles.studentType}>
              <h5>Date of Submission</h5>

              <input
                type="date"
                id="submissionDate"
                name='submissionDate'
                value={submissionDate}
                onChange={(e) => setSubmissionDate(e.target.value)}
                className={styles.popupPromptInput}
                required
              />
            </div>


            {/* Buttons */}
            <div className={styles.buttonContainer}>
              <button
                className={styles.OKButton}
                onClick={() => handleApprove(selectedRequest)}
              >
                <span>Send</span>
              </button>

            </div>
          </div>
        </div>
      )}


      {/* REJECTION PROMPT */}
      {rejectionPrompt && (

        <div data-aos="zoom-out" data-aos-duration="500" className={`${styles.popup} ${popUpVisible ? styles.visible : ""}`}>
          <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
              <button onClick={closePopup} className={styles.closeButton}>✖</button>
              <h3>Send Reason for Shifting Request Rejection</h3>
            </div>

            {/* Date Input and Send Button */}
            <div data-aos="fade-up" className={styles.studentType}>
              <h5>Reason</h5>

              <input
                type="textarea"
                id="rejectionReason"
                name='rejectionReason'
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className={styles.popupPromptInput}
              />
            </div>

            {/* Buttons */}
            <div className={styles.buttonContainer}>
              <button
                className={styles.OKButton}
                onClick={() => handleReject(selectedRequest)}
              >
                <span>Send</span>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ERROR PROMPT */}
      {errorPrompt && (
        <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupPromptError}>
          <div className={styles.popupPromptContentError}>
            <button
              className={styles.popupPromptcloseButton}
              onClick={() => setErrorPrompt(false)}
            >
              &times;
            </button>
            <div className={styles.popupPromptHeaderError}>
              <h2>Error</h2>
            </div>
            <div className={styles.popupPromptMessageError}>
              <img
                src="/src/assets/errormark.png"
                alt="Error Icon"
                className={styles.popupPromptmessageImage}
              />
            </div>
            <p className={styles.popupPromptTextError}>{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Admission requests */}
     {/* Toggle Button and Page Title */}
     <div className={styles.contentSection}>

    <div className={styles.PageTitle} data-aos="fade-up">
      {activeView === 'Request' ? 'Admission Requests' : 'Confirmed Slots'}
      <button
      className={styles.toggleButton}
      onClick={() =>
        setActiveView((prev) => (prev === 'Request' ? 'Confirm' : 'Request'))
      }
    >
      <img
        src={'/src/assets/switch-icon.png'}
        alt={activeView === 'Request' ? 'Confirm Slot' : 'Request'}
        className={styles.iconImage}
      />
    </button>
    </div>
    




        {/* Conditional Rendering */}
        {activeView === 'Request' ? (
          <>
            {/* Admission Requests Section */}
            <div className={styles.filterSection} data-aos="fade-up">
              <label htmlFor="filter" className={styles.filterLabel}>
                Filter by Strand:
              </label>
              <select
                id="filter"
                className={styles.filterDropdown}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All</option>
                <option value="STEM">STEM</option>
                <option value="ICT">ICT</option>
              </select>
            </div>

            <div className={styles.tableContainer} data-aos="fade-up">
              <table className={styles.requestsTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Strand</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests && filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <tr key={request.StudentID} onClick={() => handleRowClick(request)}>
                        <td>{request.Firstname} {request.Lastname}</td>
                        <td>{request.Email}</td>
                        <td>{request.SHSStrand}</td>
                        <td>
                          <button
                            className={styles.approveButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRequest(request);
                              setApprovalPrompt(true);
                            }}
                          >
                            Approve
                          </button>
                          <button
                            className={styles.rejectButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRequest(request);
                              setRejectionPrompt(true);
                            }}
                          >
                            {loading ? 'Loading...' : 'Reject'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className={styles.noData}>
                        No freshmen admission requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            {/* Confirmed Slots Section */}
            <div className={styles.filterSection} data-aos="fade-up">
              <label htmlFor="filter" className={styles.filterLabel}>
                Filter by Strand:
              </label>
              <select
                id="filter"
                className={styles.filterDropdown}
                value={filterType1}
                onChange={(e) => setFilterType1(e.target.value)}
              >
                <option value="All">All</option>
                <option value="STEM">STEM</option>
                <option value="ICT">ICT</option>
              </select>
            </div>

            <div className={styles.tableContainer} data-aos="fade-up">
              <table className={styles.requestsTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Control Number</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests1 && filteredRequests1.length > 0 ? (
                    filteredRequests1.map((request) => (
                      <tr key={request.StudentID} onClick={() => handleRowClick(request)}>
                        <td>{request.Firstname} {request.Lastname}</td>
                        <td>{request.Email}</td>
                        <td>{request.ExamControlNo}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className={styles.noData}>
                        No confirmed slots.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
        </div>

      {/* PopUp */}
      {popUpVisible && selectedRequest && (
        <div data-aos="zoom-out" data-aos-duration="500" className={`${styles.popup} ${popUpVisible ? styles.visible : ""}`}>
          <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
              <button onClick={closePopup} className={styles.closeButton}>✖</button>
              <h2>Admission Form</h2>
            </div>
            <div data-aos="fade-up" className={styles.studentType}>
              <span>DETAILS</span>
            </div>

            <div className={styles.popupText}>
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
                        
                        <img className={styles.idPictureBox} src={`http://localhost:8080/${selectedRequest.IDPicture}`} alt="" />
                      </div>
                    </div>
              
              
                    <div className={styles.infoGrid}>
                    <div className={styles.contentt}>
                        <p>Generated: <span>Date and Time</span></p>
                        <p>Admission Information - <span>{selectedRequest.ExamControlNo} 1st semester 2022-2023</span></p>
                        <p>Campus - <span>{selectedRequest.Branch}</span></p>
                      </div>
                      </div>
                    <div className={styles.infoGrid}>
                    <div className={styles.contentt}>
                      <p>Entry: <span>New</span></p>
                      <p>Strand: <span>{selectedRequest.SHSStrand}</span></p>
                      <p>LRN: <span>{selectedRequest.LRN}</span></p>
                      <p>Preffered Course: <span>{selectedRequest.ProgramID === 1 ? "BSCS" : selectedRequest.ProgramID === 2 ? "BSIT" : "Unknown"}</span></p>
                      </div>
                      <div className={styles.contentt}>
                      <p>Type: <span>K12 SHS Graduate</span></p>
              
                      </div>
                      <div className={styles.contentt}>
                        <p>Applicant Type: <span>{selectedRequest.Nationality}</span></p>
                      </div>
                      <div className={styles.contentt}>
                      <p>Final Average: <span>{selectedRequest.FinalAverage}</span></p>
              
                      </div>
                      </div>
              
                      <div className={styles.infoGrid3}>
                      <div className={styles.contentt}>
                      <p>1st Quarter: <span>{selectedRequest.FirstQuarterAve}</span></p>
                      </div>
                      <div className={styles.contentt}>
                      <p>2nd Quarter: <span>{selectedRequest.SecondQuarterAve}</span></p>
                      </div>
                      <div className={styles.contentt}>
                      <p>3rd Quarter: <span>{selectedRequest.ThirdQuarterAve}</span></p>
                      </div>
                      <div className={styles.contentt}>
                      <p>4th Quarter: <span>{selectedRequest.FourthQuarterAve === 0 ? '' : selectedRequest.FourthQuarterAve}</span></p>
                      </div>
              
                      </div>
                      
              
              
              
                    <div className={styles.sectionTitle}>Personal Information</div>
                    <div className={styles.infoGrid2}>
                    <div className={styles.contentt}>
                        <p>Name: <span>{`${selectedRequest.Lastname?.toUpperCase()}, ${selectedRequest.Firstname?.toUpperCase()} ${selectedRequest.Middlename?.toUpperCase()}`}</span></p>
                        <p>Address: <span>{selectedRequest.Address}</span></p>
                        <p>Email: <span>{selectedRequest.Email}</span></p>
                        <p>Birthdate: <span>{new Date(selectedRequest.DOB).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                        <p>PWD: <span>{selectedRequest.PWD}</span></p>
                      </div>
                     
                      <div className={styles.contentt}>
                        <p>Sex: <span>{selectedRequest.Gender === 'F' ? "Female" : selectedRequest.Gender === 'M' ? "Male" : ""}</span></p>
                        <p>Mobile: <span>{selectedRequest.PhoneNo}</span></p>
                        <p>Civil Status: <span>{selectedRequest.CivilStatus}</span></p>
                        <p>Nationality: <span>{selectedRequest.Nationality}</span></p>
                        <p>Indigenous: <span>{selectedRequest.Indigenous}</span></p>
                      </div>
                      
                    </div>
              
              
                  <div className={styles.sectionTitle}>Family Background</div>
                    <div className={styles.infoGrid}>
                    <div className={styles.contentt}>
                        <p>Father: <span>{selectedRequest.FatherName}</span></p>
                        <p>Mother: <span>{selectedRequest.MotherName}</span></p>
                        <p>Guardian: <span>{selectedRequest.MotherName}</span></p>
                      </div>
                     
                      <div className={styles.contentt}>
                        <p>Contact: <span>{selectedRequest.FatherContactNo}</span></p>
                        <p>Contact: <span>{selectedRequest.MotherContactNo}</span></p>
                        <p>Contact: <span>{selectedRequest.GuardianContactNo}</span></p>
                      </div>
                      <div className={styles.contentt}>
                        <p>Occupation: <span>{selectedRequest.FatherOccupation}</span></p>
                        <p>Occupation: <span>{selectedRequest.MotherOccupation}</span></p>
                        <p>Occupation: <span>{selectedRequest.GuardianOccupation}</span></p>
                      </div>
              
                      
                      
                    </div>
              
                  <div className={styles.sectionTitle}>Educational Background</div>
                    <div className={styles.infoGrid3}>
                    <div className={styles.contentt}>
                        <p>Elementary</p>
                        <p><span>{selectedRequest.ElemSchoolName}</span></p>
                        <p>High School</p>
                        <p><span>{selectedRequest.HighSchoolName}</span></p>
                        <p>Senior High School</p>
                        <p><span>{selectedRequest.SHSchoolName}</span></p>
                      </div>
                     
                      <div className={styles.contentt}>
                      <p>Address</p>
                        <p><span>{selectedRequest.ElemSchoolAddress}</span></p>
                        <p>Address</p>
                        <p><span>{selectedRequest.HighSchoolAddress}</span></p>
                        <p>Address</p>
                        <p><span>{selectedRequest.SHSchoolAddress}</span></p>
                      </div>
                      <div className={styles.contentt}>
                      <p>Year</p>
                        <p><span>{selectedRequest.ElemYearGraduated}</span></p>
                        <p>Year</p>
                        <p><span>{selectedRequest.HighSchoolYearGraduated}</span></p>
                        <p>Year</p>
                        <p><span>{selectedRequest.SHYearGraduated}</span></p>
                      </div>
                      <div className={styles.contentt}>
                      <p>Type</p>
                        <p><span>{selectedRequest.ElemSchoolType}</span></p>
                        <p>Type</p>
                        <p><span>{selectedRequest.HighSchoolType}</span></p>
                        <p>Type</p>
                        <p><span>{selectedRequest.SHSchoolType}</span></p>
                      </div>
              
                    
                    </div>
              
              
                    <div className={styles.sectionTitle}>Medical History Information</div>
                          <div className={styles.infoGrid2}>
                          <div className={styles.contentt}>
                              <p>Medications: <span>{selectedRequest.Medication}</span></p>
                              <p>Medical Condtion/s: <span>{selectedRequest.MedicalHistory}</span></p><br></br>
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
                                          >{selectedRequest.Lastname}, {selectedRequest.Firstname} {selectedRequest.Middlename}</span>
                                          <br />
                                          <p style={{textAlign: "center",}}>
                                          Signature over printed name</p>
                                        </p>
                            </div>
                     
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
                    
                      
                      
                
                    
                  </div>
                    
                  </div>
            </div>

          </div>
        </div>
      )}

    </>
  );
}

export default FreshmenAdmissionRequest;