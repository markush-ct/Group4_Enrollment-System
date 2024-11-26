import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '/src/components/AdminDashHeader.jsx';
import styles from '/src/styles/AccountRequest.module.css';

function AccountRequest() {
  const [SideBar, setSideBar] = useState(false);
  const [accountRequests, setAccountRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState(accountRequests);
  const [filterType, setFilterType] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [popUpVisible, setPopUpVisible] = useState(false);

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

  //request
  const handleApprove = (id) => {
    const updatedRequests = accountRequests.map((request) =>
      request.id === id ? { ...request, status: "Approved" } : request
    );
    setAccountRequests(updatedRequests);
    setFilteredRequests(updatedRequests);
  };

  const handleReject = (id) => {

    const updatedRequests = accountRequests.filter((request) => request.id !== id);
    setAccountRequests(updatedRequests);
    setFilteredRequests(updatedRequests);
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
      <div className={styles.contentSection}>
        <div className={styles.PageTitle} data-aos="fade-up">
          Account Requests
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
            <option value="Freshman">Freshman</option>
            <option value="Regular">Regular</option>
            <option value="Irregular">Irregular</option>
            <option value="Shiftee">Shiftee</option>
            <option value="Transferee">Transferee</option>
            <option value="Society Officer">Society Officer</option>
            <option value="DCS Head">DCS Head</option>
            <option value="Adviser">Adviser</option>
            <option value="School Head">School Head</option>
            <option value="Enrollment Officer">Enrollment Officer</option>
          </select>
        </div>

        {/* Table */}
        <div className={styles.tableContainer} data-aos="fade-up">
          <table className={styles.requestsTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Account Type</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id} onClick={() => handleRowClick(request)}>
                    <td data-label="Name">{request.Name}</td>
                    <td data-label="Email">{request.Email}</td>
                    <td data-label="Account Type">{request.AccountType}</td>
                    <td>
                      <button
                        className={styles.approveButton}
                        onClick={(e) => { e.stopPropagation(); handleApprove(request.id); }}
                      >
                        Approve
                      </button>
                      <button
                        className={styles.rejectButton}
                        onClick={(e) => { e.stopPropagation(); handleReject(request.id); }}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.noData}>
                    No account requests found.
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
              <h2>Request Account</h2>
            </div>
            <div data-aos="fade-up" className={styles.studentType}>
              <span>DETAILS</span>
            </div>
            {(selectedRequest.AccountType === "Freshman" || selectedRequest.AccountType === "Transferee") && (
              <div className={styles.popupText}>
                <p><strong>Account Type:</strong> {selectedRequest.AccountType}</p>
                <p><strong>Name:</strong> {selectedRequest.Name}</p>
                <p><strong>Email:</strong> {selectedRequest.Email}</p>
                <p><strong>Phone:</strong> {selectedRequest.PhoneNo}</p>
              </div>
            )}

            {(selectedRequest.AccountType === "Regular" || selectedRequest.AccountType === "Irregular") && (
              <div className={styles.popupText}>
                <p><strong>Account Type:</strong> {selectedRequest.AccountType}</p>
                <p><strong>Student ID:</strong> {selectedRequest.ID}</p>
                <p><strong>Program:</strong> {selectedRequest.ProgramID === 1 ? 'Bachelor of Science in Computer Science' : 'Bachelor of Science in Information Technology'}</p>
                <p><strong>Name:</strong> {selectedRequest.Name}</p>
                <p><strong>Email:</strong> {selectedRequest.Email}</p>
                <p><strong>Phone:</strong> {selectedRequest.PhoneNo}</p>
              </div>
            )}

            {selectedRequest.AccountType === "Shiftee" && (
              <div className={styles.popupText}>
                <p><strong>Account Type:</strong> {selectedRequest.AccountType}</p>
                <p><strong>Student ID:</strong> {selectedRequest.ID}</p>
                <p><strong>Name:</strong> {selectedRequest.Name}</p>
                <p><strong>Email:</strong> {selectedRequest.Email}</p>
                <p><strong>Phone:</strong> {selectedRequest.PhoneNo}</p>
              </div>
            )}

            {["President",
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
              "4th Year Chairperson"].includes(selectedRequest.AccountType) && (
              <div className={styles.popupText}>
                <p><strong>Account Type:</strong> Society Officer</p>
                <p><strong>Position:</strong> {selectedRequest.AccountType}</p>
                <p><strong>Student ID:</strong> {selectedRequest.ID}</p>
                <p><strong>Program:</strong> {selectedRequest.ProgramID === 1 ? 'Bachelor of Science in Computer Science' : 'Bachelor of Science in Information Technology'}</p>
                <p><strong>Name:</strong> {selectedRequest.Name}</p>
                <p><strong>Email:</strong> {selectedRequest.Email}</p>
                <p><strong>Phone:</strong> {selectedRequest.PhoneNo}</p>
              </div>
            )}

      {["Adviser", "Enrollment Officer", "School Head"].includes(selectedRequest.AccountType) && (
              <div className={styles.popupText}>
                <p><strong>Account Type:</strong> {selectedRequest.AccountType}</p>
                <p><strong>Employee ID:</strong> {selectedRequest.ID}</p>
                <p><strong>Name:</strong> {selectedRequest.Name}</p>
                <p><strong>Email:</strong> {selectedRequest.Email}</p>
                <p><strong>Phone:</strong> {selectedRequest.PhoneNo}</p>
              </div>
            )}

{selectedRequest.AccountType === "DCS Head" && (
              <div className={styles.popupText}>
                <p><strong>Account Type:</strong> {selectedRequest.AccountType}</p>
                <p><strong>Employee ID:</strong> {selectedRequest.ID}</p>
                <p><strong>Program:</strong> {selectedRequest.ProgramID === 1 ? 'Bachelor of Science in Computer Science' : 'Bachelor of Science in Information Technology'}</p>
                <p><strong>Name:</strong> {selectedRequest.Name}</p>
                <p><strong>Email:</strong> {selectedRequest.Email}</p>
                <p><strong>Phone:</strong> {selectedRequest.PhoneNo}</p>
              </div>
            )}


            {/* Approve and Reject Buttons */}
            <div className={styles.popupButtons}>
              <button
                className={styles.approveButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(selectedRequest.id); // Pass selectedRequest.id
                  closePopup(); // Close the popup after action
                }}
              >
                Approve
              </button>
              <button
                className={styles.rejectButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject(selectedRequest.id); // Pass selectedRequest.id
                  closePopup(); // Close the popup after action
                }}
              >
                Reject
              </button>

            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default AccountRequest;
