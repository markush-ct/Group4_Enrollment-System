import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '/src/components/AdminDashHeader.jsx';
import styles from '/src/styles/AccountRequest.module.css';
import { useNavigate } from 'react-router-dom';


function SocFee() {
  const [SideBar, setSideBar] = useState(false);
  const [accName, setAccName] = useState("");
  const [accountRequests, setAccountRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [approvalPrompt, setApprovalPrompt] = useState(false);
  const [approvalMsg, setApprovalMsg] = useState('');
  const [rejectionPrompt, setRejectionPrompt] = useState(false);
  const [rejectionMsg, setRejectionMsg] = useState('');
  const [errorPrompt, setErrorPrompt] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
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

  // FETCH ALL SOCIETY FEES
  useEffect(() => {
    axios
        .get("http://localhost:8080/getSocFee")
        .then((res) => {
            setAccountRequests(res.data.records);
            setFilteredRequests(res.data.records);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching records:", err);
            setAccountRequests([]);
            setFilteredRequests([]);
        });
}, []);

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
  

  const handleApproveSocFee = async (request) => {
    console.log('Request received in handleApprove:', request);
  
    setLoading(true);
  
    try {
        const res = await axios.post('http://localhost:8080/verifyPaidSocFee', {
            studentID: request.StudentID,
            cvsuStudentID: request.CvSUStudentID
        });
        if(res.data.message === "Society Fee changed to PAID"){
          window.location.reload();
          setLoading(false);
        } else{
          setErrorPrompt(true);
          setErrorMsg(`Failed to send rejection email: ${res.data.message}`);
          setLoading(false);
        }
    } catch (err) {
        console.error('Error:', err);
        setErrorPrompt(true);
        setErrorMsg(`Failed to send rejection email: ${err.response?.data?.message || err.message}`);
        setLoading(false);
    }
  };

  const handleRejectSocFee = async (request) => {
    console.log('Request received in handleApprove:', request);
  
    setLoading(true);
  
    try {
        const res = await axios.post('http://localhost:8080/verifyUnpaidSocFee', {
            studentID: request.StudentID,
            cvsuStudentID: request.CvSUStudentID
        });
        if(res.data.message === "Society Fee changed to UNPAID"){
          window.location.reload();
          setLoading(false);
        } else{
          setErrorPrompt(true);
          setErrorMsg(`Failed to send rejection email: ${res.data.message}`);
          setLoading(false);
        }
    } catch (err) {
        console.error('Error:', err);
        setErrorPrompt(true);
        setErrorMsg(`Failed to send rejection email: ${err.response?.data?.message || err.message}`);
        setLoading(false);
    }
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
          Society Fee Status
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

        <div className={styles.tableContainer} data-aos="fade-up">
          <table className={styles.requestsTable}>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Year - Section</th>
                <th>Status</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <tr key={request.StudentID}>
              <td>{request.CvSUStudentID}</td>
              <td>{request.Firstname} {request.Lastname}</td>
              <td>{`${request.Year === "First Year" ? 1
                : request.Year === "Second Year" ? 2
                : request.Year === "Third Year" ? 3
                : request.Year === "Fourth Year" ? 4
                : "N/A"
              } - ${request.Section}`}</td>
              <td>{request.SocFeePayment}</td>
              <td>{request.StudentType}</td>
              <td>
                <button
                  className={styles.approveButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApproveSocFee(request);
                  }}
                >
                  &#10004;
                </button>
                <button
                  className={styles.rejectButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRejectSocFee(request);
                  }}
                >
                  {loading ? 'Loading...' : 'X'}
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className={styles.noData}>
              No Society Fee found.
            </td>
          </tr>
        )}
      </tbody>
          </table>
        </div>
      </div>

      

    </>
  );
}

export default SocFee;