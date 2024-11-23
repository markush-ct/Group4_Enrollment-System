import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '/src/components/AdminDashHeader.jsx';
import styles from '/src/styles/AccountRequest.module.css';

function AccountRequest() {
  const [SideBar, setSideBar] = useState(false);
  const [accountRequests, setAccountRequests] = useState([
    
    { id: 1, name: "Neil Yvan", email: "123adads@gmail.com", type: "Freshman", address: "Detachment", phone: "1985151" },
    { id: 2, name: "Gerlyn ", email: "123adads@gmail.com", type: "Society Officer", address: "Detachment", phone: "1985151" },
    { id: 3, name: "Donna", email: "123adads@gmail.com", type: "DCS Head", address: "Detachment", phone: "1985151" },
    
  ]);
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

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/account-requests") 
      .then((res) => {
        setAccountRequests(res.data);
        setFilteredRequests(res.data); 
      })
      .catch((err) => {
        console.warn("Error fetching account requests, using example data:", err);
        setFilteredRequests(accountRequests); 
      });
  }, []);


  useEffect(() => {
    if (filterType === "All") {
      setFilteredRequests(accountRequests);
    } else {
      setFilteredRequests(
        accountRequests.filter((request) => request.type === filterType)
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
            <option value="Society Officer">Society Officer</option>
            <option value="DCS Head">DCS Head</option>
            <option value="Adviser">Adviser</option>
            <option value="School Head">School Head</option>
            <option value="Enrollment Officer">Enrollment Officer</option>
            <option value="Regular">Regular</option>
            <option value="Irregular">Irregular</option>
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
                    <td>{request.name}</td>
                    <td>{request.email}</td>
                    <td>{request.type}</td>
                    <td>
                      <button className={styles.approveButton} onClick={(e) => { e.stopPropagation(); handleApprove(request.id); }}>
                        Approve
                      </button>
                      <button className={styles.rejectButton} onClick={(e) => { e.stopPropagation(); handleReject(request.id); }}>
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
  <div className={`${styles.popup} ${popUpVisible ? styles.visible : ""}`}>
    <div className={styles.popupContent}>
      <div className={styles.popupHeader}>
        <button onClick={closePopup} className={styles.closeButton}>✖</button>
        <h2>Request Details</h2>
      </div>
      <p><strong>Name:</strong> {selectedRequest.name}</p>
      <p><strong>Email:</strong> {selectedRequest.email}</p>
      <p><strong>Account Type:</strong> {selectedRequest.type}</p>
      <p><strong>Address:</strong> {selectedRequest.address}</p>
      <p><strong>Phone:</strong> {selectedRequest.phone}</p>

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
