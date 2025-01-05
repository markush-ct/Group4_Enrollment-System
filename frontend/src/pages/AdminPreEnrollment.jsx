import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '/src/components/AdminDashHeader.jsx';
import styles from '/src/styles/AccountRequest.module.css';
import { useNavigate } from 'react-router-dom';

function Requirements() {
  const [SideBar, setSideBar] = useState(false);
  const [accName, setAccName] = useState("");
  const [accountRequests, setAccountRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState(accountRequests);
  const [filterType, setFilterType] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [approvalPrompt, setApprovalPrompt] = useState(false);
  const [approvalMsg, setApprovalMsg] = useState('');
  const [rejectionPrompt, setRejectionPrompt] = useState(false);
  const [rejectionMsg, setRejectionMsg] = useState('');
  const [errorPrompt, setErrorPrompt] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [preEnrollmentValues, setPreEnrollmentValues] = useState([]);
  const [rows, setRows] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

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

  // FETCH ACCOUNT REQUESTS
  useEffect(() => {
    axios
      .get("http://localhost:8080/getPreEnrollForAdviser")
      .then((res) => {
        setAccountRequests(res.data.students);
        setFilteredRequests(res.data.students);
      })
      .catch((err) => {
        console.warn("Error fetching account requests, using example data:", err);
        setFilteredRequests(accountRequests);
      });
  }, []);



  const handleApprove = async (preEnrollmentValues) => {
    try {
      console.log("Approving the following values:", preEnrollmentValues);
  
      // Send the data to the backend API
      const response = await axios.post("http://localhost:8080/adviserApprovePreEnrollment", {
        preEnrollmentValues, // Pass the array to the backend
      });
  
      // Check the response from the backend
      if (response.data.message === "Success") {
        setApprovalPrompt(true);
        setApprovalMsg(`Pre-enrollment Approved Successfully.`);
        setPopUpVisible(false);
      } else {
        setErrorPrompt(true);
        setErrorMsg('Failed approve pre-enrollment. Please try again.');
      }
    } catch (err) {
      setErrorPrompt(true);
      setErrorMsg(`Failed to approve pre-enrollment: ${err.response?.data?.message || err.message}`);
    }
  };
  
  const handleReject = async (preEnrollmentValues) => {
    try {
      const response = await axios.post("http://localhost:8080/adviserRejectPreEnrollment", {
        preEnrollmentValues,
      });
  
      if (response.data.message === "Success") {
        setApprovalPrompt(true);
        setApprovalMsg(`Pre-enrollment Rejected Successfully.`);
        setPopUpVisible(false);
      } else {
        setErrorPrompt(true);
        setErrorMsg('Failed reject pre-enrollment. Please try again.');
      }
    } catch (err) {
      setErrorPrompt(true);
      setErrorMsg(`Failed to reject pre-enrollment: ${err.response?.data?.message || err.message}`);
    }
  };


  const closePrompt = () => {
    setApprovalPrompt(false);
    setRejectionPrompt(false);
    window.location.reload();
  };


  //show popup
  const handleRowClick = (request) => {
    setSelectedRequest(request);
    setPopUpVisible(true);

    try {
      axios.post(`http://localhost:8080/getPreEnrollmentValuesForAdmin`, { studentID: request.StudentID })
        .then((res) => {
          if (res.data.message === "Waiting for pre-enrollment approval") {
            setPreEnrollmentValues(res.data.data)
          } else {
            setPreEnrollmentValues([]);
          }
        })
    } catch (err) {
      alert("Error: " + err);
      setPreEnrollmentValues([]);
    }
  };


  //close popup
  const closePopup = () => {
    setPopUpVisible(false);
    setSelectedRequest(null);
  };

  const totalPreEnrollUnits = preEnrollmentValues.reduce((acc, row) => acc + (row.CreditUnitLec + row.CreditUnitLab), 0);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
        const query = searchQuery.toLowerCase();
        setFilteredRequests(
            accountRequests.filter((request) =>
                request.Firstname.toLowerCase().includes(query) ||
                request.Lastname.toLowerCase().includes(query) ||
                request.CvSUStudentID.toString().includes(query) ||
                request.SocFeePayment.toLowerCase().includes(query) ||
                `${request.Year === "First Year" ? 1
                  : request.Year === "Second Year" ? 2
                  : request.Year === "Third Year" ? 3
                  : request.Year === "Fourth Year" ? 4
                  : "N/A"
                } - ${request.Section.toLowerCase()}`.includes(query) ||
                request.SocFeePayment.toLowerCase().includes(query) ||
                `${request.Year === "First Year" ? 1
                  : request.Year === "Second Year" ? 2
                  : request.Year === "Third Year" ? 3
                  : request.Year === "Fourth Year" ? 4
                  : "N/A"
                }-${request.Section.toLowerCase()}`.includes(query)
            )
        );
    }, 300);
  
    return () => clearTimeout(timeoutId);
  }, [searchQuery, accountRequests]);


  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      {/* PROMPTS */}
      {/* APPROVAL PROMPT */}
      {approvalPrompt && (
        <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupPrompt}>
          <div className={styles.popupPromptContent}>
            <button
              className={styles.popupPromptcloseButton}
              onClick={() => setApprovalPrompt(false)}
            >
              &times;
            </button>
            <div className={styles.popupPromptHeader}>
              <h2>Approval Success</h2>
            </div>
            <div className={styles.popupPromptMessage}>
              <img
                src="/src/assets/checkmark.png"
                alt="Success Icon"
                className={styles.popupPromptmessageImage}
              />
            </div>
            <p className={styles.popupPromptText}>{approvalMsg}</p>
            <div className={styles.buttonContainer}>
              <button
                className={styles.OKButton}
                onClick={closePrompt}
              >
                <span>OK</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* REJECTION PROMPT */}
      {rejectionPrompt && (
        <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupPrompt}>
          <div className={styles.popupPromptContent}>
            <button
              className={styles.popupPromptcloseButton}
              onClick={closePrompt}
            >
              &times;
            </button>
            <div className={styles.popupPromptHeader}>
              <h2>Rejection Success</h2>
            </div>
            <div className={styles.popupPromptMessage}>
              <img
                src="/src/assets/checkmark.png"
                alt="Success Icon"
                className={styles.popupPromptmessageImage}
              />
            </div>
            <p className={styles.popupPromptText}>{rejectionMsg}</p>
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


      <div className={styles.contentSection}>
        <div className={styles.PageTitle} data-aos="fade-up">
          Pre-Enrollment
        </div>

                <div className={styles.searchBar} data-aos="fade-up">
                          
                          <input
                            type="text"
                            id="search"
                            placeholder="Search by name or student ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                          />
                        </div>

        {/* Table */}
        <div className={styles.tableContainer} data-aos="fade-up">
          <table className={styles.requestsTable}>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Year - Section</th>
                <th>Student Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id} onClick={() => handleRowClick(request)}>
                    <td data-label="Student ID">{request.CvSUStudentID}</td>
                    <td data-label="Student ID">{request.Firstname} {request.Lastname}</td>
                    <td data-label="Year and Section">{request.Year === "First Year" ? 1
                      : request.Year === "Second Year" ? 2
                        : request.Year === "Third Year" ? 3
                          : 4} - {request.Section}</td>
                    <td data-label="Student ID">{request.StudentType}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.noData}>
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>


          </table>
        </div>
      </div>



      {/* PopUp */}
      {popUpVisible && selectedRequest && (
        <div
          data-aos="zoom-out"
          data-aos-duration="500"
          className={`${styles.popup2} ${popUpVisible ? styles.visible : ""}`}
        >
          <div className={styles.popupContentPre}>
            {/* Popup Header */}
            <div className={styles.popupHeader}>
              <button onClick={closePopup} className={styles.closeButton}>✖</button>
              <h2>Pre-Enrollment Form</h2>
            </div>
            <div data-aos="fade-up" className={styles.studentType}>
              <span>DETAILS</span>
            </div>


            {/* Submission Details */}
            <div className={styles.popupTextReq}>

              <p><strong>Name:</strong> {selectedRequest.Firstname} {selectedRequest.Lastname}</p>
              <p><strong>Student ID:</strong> {selectedRequest.CvSUStudentID}</p>
              <p><strong>Student Type:</strong> {selectedRequest.StudentType}</p>

            </div>



            {/* Details Section */}
            <div data-aos="fade-up" className={styles.detailsSection}>
            </div>


            {Array.isArray(preEnrollmentValues) && preEnrollmentValues.length > 0 ? (
              <div className={styles.formContainer}>                

                {preEnrollmentValues.map((row) => (

                  <div className={styles.popupPromptTextPre} key={row.CourseChecklistID}>
                    <p><span style={{ fontWeight: "bold", color: "#3d8c4b" }}>{row.CourseCode}</span> - {row.CourseTitle} <span style={{ fontWeight: "bold", color: "#AA0000" }}>{row.CreditUnitLec + row.CreditUnitLab} units</span></p>
                  </div>
                ))}
                <br></br>
                <p style={{ textAlign: "center" }}><span style={{ fontWeight: "bold", color: "#3d8c4b" }}> Total Units: </span>{totalPreEnrollUnits}</p>


                <br />
                <div className={styles.buttonSection}>
                <button className={`${styles.btn} ${styles.addBtn}`} onClick={() => handleApprove(preEnrollmentValues)}><span>Approve</span></button>

                <button className={`${styles.btn} ${styles.removeBtn}`} onClick={() => handleReject(preEnrollmentValues)}><span>Reject</span></button>
              </div>
              </div>
            ) : ("")}

          </div>
        </div>

      )}


    </>
  );
}

export default Requirements;
