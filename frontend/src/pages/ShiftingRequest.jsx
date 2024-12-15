import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '/src/components/AdminDashHeader.jsx';
import styles from '/src/styles/AccountRequest.module.css';
import { useNavigate } from 'react-router-dom';
import { use } from 'chai';

function ShiftingRequest() {
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
  const [submissionDate, setSubmissionDate] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

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

  // FETCH SHIFTING REQUESTS
  useEffect(() => {
    axios
      .get("http://localhost:8080/shiftingRequests")
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
        accountRequests.filter((request) => request.PrevProgram === filterType)
      );
    }
  }, [filterType, accountRequests]);



  const handleApprove = async (request) => {
    if (!request || !request.Email) {
      console.error("Invalid request or Email missing:", request);
      setErrorPrompt(true);
      setErrorMsg("Invalid request data.");
      return;
    }

    console.log('Request received in handleApprove:', request);
    console.log('Submission Date:', submissionDate);
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:8080/approveShiftingReq', {
        email: request.Email,
        name: request.Firstname + " " + request.Lastname,
        studentID: request.CvSUStudentID,
        submissionDate: submissionDate, // Ensure this is passed correctly
      });
  
      if (response.data.message === "Shifting Request approval sent") {
        setApprovalPrompt(true);
        setApprovalMsg(`Approval email sent to ${request.Email}`);
        setErrorPrompt(false);
        setPopUpVisible(false);
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
      const response = await axios.post('http://localhost:8080/rejectShiftingReq', {
          email: request.Email,
          name: request.Firstname + " " + request.Lastname,
          studentID: request.CvSUStudentID,
          rejectionReason: rejectionReason,
      });

      if (response.data.message === "Shifting Request rejection sent") {
        setRejectionPrompt(true);
        setRejectionMsg(`Rejection email sent to ${request.Email}`);
        setErrorPrompt(false);
        setPopUpVisible(false);
        setLoading(false);
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

const closePrompt = () => {
  setApprovalPrompt(false);
  setRejectionPrompt(false);
  window.location.reload();
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
                <h3>Send Schedule for Requirements Submission</h3>
            </div>

            {/* Date Input and Send Button */}
            <div data-aos="fade-up" className={styles.studentType}>
              <h5>Date of Submission</h5>
          
                <input
                    type="date"
                    id="submissionDate"
                    name='submissionDate'                    
                    value={submissionDate}
                    onChange={(e) => setSubmissionDate(e.target.value)}
                    className={styles.popupPromptInput}
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


      <div className={styles.contentSection}>
        <div className={styles.PageTitle} data-aos="fade-up">
          Shifting Requests
        </div>

        {/* Dropdown  */}
        <div className={styles.filterSection} data-aos="fade-up">
          <label htmlFor="filter" className={styles.filterLabel}>Filter by Program:</label>
          <select
            id="filter"
            className={styles.filterDropdown}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Bachelor of Secondary Education">Bachelor of Secondary Education</option>
            <option value="Bachelor of Science in Business Management">Bachelor of Science in Business Management</option>
            <option value="Bachelor of Science in Criminology">Bachelor of Science in Criminology</option>
            <option value="Bachelor of Science in Hospitality Management">Bachelor of Science in Hospitality Management</option>
            <option value="Bachelor of Science in Psychology">Bachelor of Science in Psychology</option>
           
          </select>
        </div>

        {/* Table */}
        <div className={styles.tableContainer} data-aos="fade-up">
          <table className={styles.requestsTable}>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Previous Program</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {filteredRequests && filteredRequests.length > 0 ? (
    filteredRequests.map((request) => (
      <tr key={request.CvSUStudentID} onClick={() => handleRowClick(request)}>
        <td>{request.CvSUStudentID}</td>
        <td>{request.Firstname} {request.Lastname}</td>
        <td>{request.PrevProgram}</td>
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
                                    setRejectionPrompt(true)
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
        No shifting requests found.
      </td>
    </tr>
  )}
</tbody>



          </table>
        </div>
      </div>

      {/* PopUp */}
      {popUpVisible && selectedRequest && (
        <div data-aos="zoom-out" data-aos-duration="500" className={`${styles.popup} ${popUpVisible ? styles.visible : ""}`}>
          <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
              <button onClick={closePopup} className={styles.closeButton}>✖</button>
              <h2>Shifting  Request</h2>
            </div>
            <div data-aos="fade-up" className={styles.studentType}>
              <span>DETAILS</span>
            </div>
           
              <div className={styles.popupText}>
              <p><strong>Student ID:</strong> {selectedRequest.CvSUStudentID}</p>
                <p><strong>Email:</strong> {selectedRequest.Email}</p>
                <p><strong>First Name:</strong> {selectedRequest.Firstname}</p>
                <p><strong>Middle Name:</strong> {selectedRequest.Middlename}</p>
                <p><strong>Last Name:</strong> {selectedRequest.Lastname}</p>
                <p><strong>Previous Program:</strong> {selectedRequest.PrevProgram}</p>
                <p><strong>Current Academic Year:</strong> {selectedRequest.AcadYear}</p>
                <p><strong>Reasons:</strong> {selectedRequest.Reasons}</p>
                <p><strong>Submitted on: </strong> 
                {selectedRequest.Date === "0000-00-00" || !selectedRequest.Date ? 
                          "" : 
                          new Date(selectedRequest.Date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })
                        }
                </p>
              </div>
      

    
          </div>
        </div>
      )}

    </>
  );
}

export default ShiftingRequest;