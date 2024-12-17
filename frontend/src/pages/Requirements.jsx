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
      .get("http://localhost:8080/getAccountReq")
      .then((res) => {
        setAccountRequests(res.data.accReq);
        setFilteredRequests(res.data.accReq);
      })
      .catch((err) => {
        console.warn("Error fetching account requests, using example data:", err);
        setFilteredRequests(accountRequests);
      });
  }, []);


  useEffect(() => {
    if (filterType === "All") {
      setFilteredRequests(accountRequests);
    } else if (filterType === "Society Officer") {
      setFilteredRequests(
        accountRequests.filter(
          (request) =>
            ["President",
              "Vice President",
              "Secretary",
              "Assistant Secretary",
              "Treasurer",
              "Assistant Treasurer",
              "Business Manager",
              "Auditor",
              "P.R.O.",
              "Assistant P.R.O.",
              "GAD Representative",
              "1st Year Senator",
              "2nd Year Senator",
              "3rd Year Senator",
              "4th Year Senator",
              "1st Year Chairperson",
              "2nd Year Chairperson",
              "3rd Year Chairperson",
              "4th Year Chairperson"].includes(request.AccountType)
        )
      );
    }
    else {
      setFilteredRequests(
        accountRequests.filter((request) => request.AccountType === filterType)
      );
    }
  }, [filterType, accountRequests]);


  // Request
const handleApprove = async (request) => {
  console.log('Request received in handleApprove:', request);

  setLoading(true);

  if (!request?.Email || !request?.Name || !request?.AccountType) {
      setErrorPrompt(true);
      setErrorMsg('Email, name, and account type are required.');
      return;
  }

  try {
      await axios.post('http://localhost:8080/sendApprovalEmail', {
          email: request.Email,
          name: request.Name,
          accountType: request.AccountType,
      });

      setApprovalPrompt(true);
      setApprovalMsg(`Approval email sent to ${request.Email}`);
      setErrorPrompt(false);
      setPopUpVisible(false);
      setLoading(false);
      
  } catch (err) {
      console.error('Error:', err);
      setErrorPrompt(true);
      setErrorMsg(`Failed to send approval email:  ${err.response?.data?.message || err.message}`);
      setLoading(false);
  }
};

const handleReject = async (request) => {
  console.log('Request received in handleReject:', request);

  setLoading(true);

  if (!request?.Email || !request?.Name || !request?.AccountType) {
      setErrorPrompt(true);
      setErrorMsg('Email and name are required.');
      return;
  }

  try {
      await axios.post('http://localhost:8080/sendEmailRejection', {
          email: request.Email,
          name: request.Name,
          accountType: request.AccountType
      });

      setRejectionPrompt(true);
      setRejectionMsg(`Rejection email sent to ${request.Email}`);
      setErrorPrompt(false);
      setPopUpVisible(false);
      setLoading(false);
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
    setSelectedRequest(null);
  };



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
          Requirements Submission
        </div>

        {/* Dropdown  */}
        <div className={styles.filterSection} data-aos="fade-up">
          <label htmlFor="filter" className={styles.filterLabel}>Filter by Type:</label>
          <select
            id="filter"
            className={styles.filterDropdown}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All</option>
            <option value="1-1">1-1</option>
            <option value="1-2">1-2</option>
            <option value="1-3">1-3</option>
            <option value="2-1">2-1</option>
            <option value="2-1">2-1</option>
            <option value="1-1">1-1</option>
            <option value="1-1">1-1</option>
            <option value="1-1">1-1</option>
            <option value="1-1">1-1</option>
            <option value="1-1">1-1</option>
          </select>
        </div>

        {/* Table */}
        <div className={styles.tableContainer} data-aos="fade-up">
          <table className={styles.requestsTable}>
            <thead>
              <tr>
              <th>Student ID</th>
                <th>Name</th>
                <th>Year - Section</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id} onClick={() => handleRowClick(request)}>
                    <td data-label="Student ID">{request.Name}</td>
                    <td data-label="Name">{request.Email}</td>
                    <td data-label="Year and Section">{request.AccountType}</td>
                    <td>
                      <button
                        className={styles.approveButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Request passed to handleApprove:', request);
                          handleApprove(request); // Pass the entire request object
                        }}
                      >
                        {loading ? 'Loading...' : 'Approve'}
                      </button>

                      <button
                        className={styles.rejectButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Request passed to handleReject:', request);
                          handleReject(request); // Pass the entire request object
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
    className={`${styles.popup} ${popUpVisible ? styles.visible : ""}`}
  >
    <div className={styles.popupContentReq}>
      {/* Popup Header */}
      <div className={styles.popupHeader}>
                    <button onClick={closePopup} className={styles.closeButton}>✖</button>
                    <h2>Requirement</h2>
                  </div>
                  <div data-aos="fade-up" className={styles.studentType}>
                    <span>DETAILS</span>
                  </div>
      

        {/* Submission Details */}
       <div className={styles.popupTextReq}>
      
          <p><strong>Name:</strong> Kai Sotto</p>
          <p><strong>Student ID:</strong> K4848158</p>
          <p><strong>Previous Year:</strong> 2nd Year</p>
          <p><strong>Student Type:</strong> Regular</p>
        </div>



{/* Details Section */}
<div data-aos="fade-up" className={styles.detailsSection}>
        {/* Document Image */}
        <div className={styles.documentImage}>
          <img
            src="/src/assets/exampleCOG.png"
            alt="Document"
            className={styles.imageStyle}
          />
        </div>
        </div>

      {/* Checklist Table */}
      <div className={styles.checklistSection}>
        <h3 className={styles.semesterTitle}>1st Year - First Semester</h3>
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
            <tr>
              <td>CS</td>
              <td>WALANG MATUTULOG</td>
              <td>3</td>
              <td>1.25</td>
              <td>LEBRON</td>
              
              
            </tr>
            <tr>
              <td>CS</td>
              <td>WALANG MATUTULOG</td>
              <td>3</td>
              <td>1.25</td>
              <td>LEBRON</td>
              
            </tr>
          </tbody>
        </table>

        <h3 className={styles.semesterTitle}>1st Year - Second Semester</h3>
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
            <tr>
              <td>CS</td>
              <td>WALANG MATUTULOG</td>
              <td>3</td>
              <td>1.25</td>
              <td>LEBRON</td>
            </tr>
            <tr>
              <td>CS</td>
              <td>WALANG MATUTULOG</td>
              <td>3</td>
              <td>1.25</td>
              <td>LEBRON</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}


    </>
  );
}

export default Requirements;
