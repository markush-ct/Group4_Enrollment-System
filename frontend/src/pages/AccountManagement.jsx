import React, { useEffect, useMemo, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '/src/components/AdminDashHeader.jsx';
import styles from '/src/styles/AccountRequest.module.css';
import { data, useNavigate } from 'react-router-dom';

function AccountManagement() {
  const [SideBar, setSideBar] = useState(false);
  const [accName, setAccName] = useState("");
  const [accountRequests, setAccountRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
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


  useEffect(() => {
    if (filterType === "All") {
      setFilteredRequests(accountRequests);
    } else if (filterType === "Society Officer") {
      setFilteredRequests(
        accountRequests.filter(
          (acc) =>
            [
              "President",
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
              "4th Year Chairperson",
            ].includes(acc.socOfficer.position)
        )
      );
    } else if (["Freshman", "Regular", "Irregular", "Transferee", "Shiftee"].includes(filterType)) {
      setFilteredRequests(
        accountRequests.filter((acc) => acc.student.studentType === filterType)
      );
    } else {
      setFilteredRequests(
        accountRequests.filter((acc) => acc.account.role === filterType)
      );
    }
  }, [filterType, accountRequests]);


  // Request
  const handleActivate = async (acc) => {
    console.log('Request received in handleActivate:', acc.account);

    setLoading(true);

    if (!acc.account.email || !acc.account.name || !acc.account.role) {
      setErrorPrompt(true);
      setErrorMsg('Email, name, and role are required.');
      setLoading(false); // Ensure loading is stopped
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/activateAccount', {
        email: acc.account.email,
        name: acc.account.name,
        role: acc.account.role
      });

      if (res.data.message === "Account status activated") {
        setApprovalPrompt(true);
        setApprovalMsg(`Account activation email sent to ${acc.account.email}`);
        setErrorPrompt(false);
        setPopUpVisible(false);
        setLoading(false);
      } else {
        setErrorPrompt(true);
        setErrorMsg(`Failed to send approval email:  ${res.data.message}`);
        setLoading(false);
      }

    } catch (err) {
      console.error('Error:', err);
      setErrorPrompt(true);
      setErrorMsg(`Failed to send approval email:  ${err.response?.data?.message || err.message}`);
      setLoading(false);
    }
  };

  const handleTerminate = async (acc) => {
    console.log('Request received in handleTerminate:', acc.account);

    setLoading(true);

    if (!acc.account.email || !acc.account.name || !acc.account.role) {
      setErrorPrompt(true);
      setErrorMsg('Email, name, and role are required.');
      setLoading(false); // Ensure loading is stopped
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/terminateAccount', {
        email: acc.account.email,
        name: acc.account.name,
        role: acc.account.role
      });

      if (res.data.message === "Account status terminated") {
        setRejectionPrompt(true);
        setRejectionMsg(`Account termination email sent to ${acc.account.email}`);
        setErrorPrompt(false);
        setPopUpVisible(false);
      } else {
        setErrorPrompt(true);
        setErrorMsg(`Failed to terminate account: ${res.data.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setErrorPrompt(true);
      setErrorMsg(`Failed to terminate account: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };


  const closePrompt = () => {
    setApprovalPrompt(false);
    setRejectionPrompt(false);
    window.location.reload();
  };


  //show popup
  const handleRowClick = (index) => {
    setSelectedRequest(index);
    setPopUpVisible(true);
  };

  //close popup
  const closePopup = () => {
    setPopUpVisible(false);
    setSelectedRequest(null);
  };

  //edit employee values
  const [editEmp, setEditEmp] = useState({
    email: filteredRequests[selectedRequest]?.account.email,
    job: filteredRequests[selectedRequest]?.account.role,
    status: filteredRequests[selectedRequest]?.employee.empStatus,
  });

  const handleEmpChange = (e) => {
    const { name, value } = e.target;
    setEditEmp((prev) => ({ ...prev, [name]: value }));

    console.log(editEmp);
  };

  const submitEmpChange = async (request) => {
    console.log("Request object:", request);  
    
    try {
      const res = await axios.post('http://localhost:8080/editEmpAccount', {
        email: request?.account?.email,  
        job: editEmp.job || request?.account?.role,  
        status: editEmp.status || request?.employee?.empStatus, 
      });
      
      if (res.data.message === "Employee updated successfully") {
        setPopUpVisible(false);
        alert(res.data.message);        
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("Error: " + error);
    }
  };


  //edit society officer values
  const [editSocOff, setEditSocOff] = useState({
    email: filteredRequests[selectedRequest]?.account.email,
    position: filteredRequests[selectedRequest]?.socOfficer.position,
    status: filteredRequests[selectedRequest]?.socOfficer.status,
  });

  const handleEditSocOffChange = (e) => {
    const { name, value } = e.target;
    setEditSocOff((prev) => ({ ...prev, [name]: value }));

  };

  const submitSocOffChange = async (request) => {
    console.log("Request object:", request);  
    
    try {
      const res = await axios.post('http://localhost:8080/editSocOfficerAccount', {
        email: request?.account?.email, 
        position: editSocOff.position || request?.socOfficer?.position,  
        status: editSocOff.status || request?.socOfficer?.status, 
      });
      
      if (res.data.message === "Society officer updated successfully") {
        setPopUpVisible(false);        
        alert(res.data.message);        
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("Error: " + error);
    }
  };


  //edit freshman, transferee or shiftee values
  const [editNewStd, setEditNewStd] = useState({
    email: filteredRequests[selectedRequest]?.account.email,
    studentID: filteredRequests[selectedRequest]?.student.cvsuStudentID,
    studentType: filteredRequests[selectedRequest]?.student.studentType
  });

  const handleEditNewStdChange = (e) => {
    const { name, value } = e.target;
    setEditNewStd((prev) => ({ ...prev, [name]: value }));

  };

  const submitNewStdChange = async (request) => {

    
    try {
      const res = await axios.post('http://localhost:8080/editNewStudent', {
        email: request?.account?.email, 
        studentID: editNewStd.studentID || request?.student?.cvsuStudentID,
        studentType: editNewStd.studentType || request?.student?.studentType,
      });
      
      if (res.data.message === "Student updated successfully") {
        setPopUpVisible(false);
        setEditNewStd({ 
          email: "", 
          studentID: "", 
          studentType: ""
        });
        alert(res.data.message);        
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("Error: " + error);
    }
  };

  //edit regular or irregular values
  const [editOldStd, setEditOldStd] = useState({
    email: filteredRequests[selectedRequest]?.account.email,
    status: filteredRequests[selectedRequest]?.student.studentStatus,
    studentType: filteredRequests[selectedRequest]?.student.studentType
  });

  const handleEditOldStdChange = (e) => {
    const { name, value } = e.target;
    setEditOldStd((prev) => ({ ...prev, [name]: value }));

  };

  const submitOldStdChange = async (request) => {
    
    try {
      const res = await axios.post('http://localhost:8080/editOldStudent', {
        email: request?.account?.email, 
        status: editOldStd.status || request?.student?.studentStatus,
        studentType: editOldStd.studentType || request?.student?.studentType,
      });
      
      if (res.data.message === "Student updated successfully") {
        setPopUpVisible(false);
        alert(res.data.message);        
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("Error: " + error);
    }
  };

  // FETCH ACCOUNTS
  useEffect(() => {
    axios
      .get("http://localhost:8080/getAccounts")
      .then((res) => {
        setAccountRequests(res.data.accountResults);
      })
      .catch((err) => {
        console.warn("Error fetching account requests, using example data:", err);
        setFilteredRequests(accountRequests);
      });
  }, [accountRequests, editEmp, editSocOff, editNewStd, editOldStd]);


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
          Account Management
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
                <th>Account Status</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((acc, index) => (
                  <tr key={index} onClick={() => handleRowClick(index)}>
                    <td data-label="Name">{acc.account.name}</td>
                    <td data-label="Email">{acc.account.email}</td>
                    <td data-label="Account Type">{acc.account.role === "Student" ? acc.student.studentType
                      : acc.account.role === "Society Officer" ? acc.socOfficer.position
                        : acc.account.role}</td>
                    <td data-label="Email">{acc.account.accStatus}</td>
                    <td>
                      <button
                        className={styles.approveButton}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering row click
                          handleRowClick(index);
                        }}
                      >
                        {loading ? "Loading..." : "Edit"}
                      </button>

                      {acc.account.accStatus === "Active" ? (
                        <button
                          className={styles.rejectButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTerminate(acc); // Pass the entire request object
                          }}
                        >{loading ? 'Loading...' : 'Terminate'}
                        </button>
                      ) : (
                        <button
                          className={styles.approveButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivate(acc); // Pass the entire request object
                          }}
                        >
                          {loading ? 'Loading...' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.noData}>
                    No accounts found.
                  </td>
                </tr>
              )}
            </tbody>


          </table>
        </div>
      </div>

      {/* PopUp */}
      {popUpVisible && (
        <div data-aos="zoom-out" data-aos-duration="500" className={`${styles.popup} ${popUpVisible ? styles.visible : ""}`}>
          <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
              <button onClick={closePopup} className={styles.closeButton}>✖</button>
              <h2>Account Management</h2>
            </div>
            <div data-aos="fade-up" className={styles.studentType}>
              <span>DETAILS</span>
            </div>
            {(["Freshman", "Shiftee", "Transferee"].includes(filteredRequests[selectedRequest]?.student.studentType)) && (
              <div className={styles.popupText}>
                <p><strong>Student Type:</strong> {filteredRequests[selectedRequest]?.student.studentType}</p>
                <p><strong>Name:</strong> {filteredRequests[selectedRequest]?.account.name}</p>
                <p><strong>Email:</strong> {filteredRequests[selectedRequest]?.account.email}</p>
                <p><strong>Preferred Program:</strong> {filteredRequests[selectedRequest]?.student.programID === 1 ? "BSCS" : "BSIT"}</p>

                <p><strong>Student ID:</strong>
                  <input 
                    type="tel"
                    name='studentID'
                    value={filteredRequests[selectedRequest]?.student.cvsuStudentID !== null ? filteredRequests[selectedRequest]?.student.cvsuStudentID
                      : editNewStd.studentID
                    }
                    onChange={handleEditNewStdChange}
                    readOnly={filteredRequests[selectedRequest]?.student.cvsuStudentID !== null}
                    required 
                  />
                </p>
                <p><strong>Change to:&nbsp;&nbsp;</strong>
                  <select name="studentType" value={editNewStd.studentType} onChange={handleEditNewStdChange} id="" required>
                  <option value="">Select student type</option>
                    <option value="Regular">Regular</option>
                    <option value="Irregular">Irregular</option>
                  </select>
                </p>

                <button style={{textAlign: 'center', width: '100%'}} onClick={() => submitNewStdChange(filteredRequests[selectedRequest])} className={styles.approveButton}>
                  Make Changes
                </button>
              </div>
            )}

            {(["Enrollment Officer", "Adviser", "DCS Head", "School Head"].includes(filteredRequests[selectedRequest]?.account.role)) && (
              <div className={styles.popupText}>
                <p><strong>Student Type:</strong> {filteredRequests[selectedRequest]?.account.role}</p>
                <p><strong>Name:</strong> {filteredRequests[selectedRequest]?.account.name}</p>
                <p><strong>Email:</strong> {filteredRequests[selectedRequest]?.account.email}</p>
                <p><strong>Program:</strong> {filteredRequests[selectedRequest]?.employee.programID === 1 ? "BSCS" 
                : "BSIT"}</p>
                <p><strong>Change status:&nbsp;&nbsp;</strong>
                  <select name="status" value={editEmp.status} onChange={handleEmpChange} required>
                    <option value={filteredRequests[selectedRequest]?.employee.empStatus}>{filteredRequests[selectedRequest]?.employee.empStatus}</option>
                    <option value="Employed">Employed</option>
                    <option value="Resigned">Resigned</option>
                  </select>
                </p>

                <p><strong>Change position:&nbsp;&nbsp;</strong>
                  <select name="job" value={editEmp.job} onChange={handleEmpChange} required>
                    <option value={filteredRequests[selectedRequest]?.account.role}>{filteredRequests[selectedRequest]?.account.role}</option>
                    <option value="Adviser">Adviser</option>
                    <option value="DCS Head">DCS Head</option>
                    <option value="School Head">School Head</option>
                    <option value="Enrollment Officer">Enrollment Officer</option>
                  </select>
                </p>

                <button style={{textAlign: 'center', width: '100%'}} onClick={() => submitEmpChange(filteredRequests[selectedRequest])} className={styles.approveButton}>
                  Make Changes
                </button>
              </div>
            )}


            {[
              "President",
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
              "4th Year Chairperson",
            ].includes(filteredRequests[selectedRequest]?.socOfficer.position) && (
                <div className={styles.popupText}>
                  <p><strong>Student Type:</strong> {filteredRequests[selectedRequest]?.account.role}</p>
                <p><strong>Name:</strong> {filteredRequests[selectedRequest]?.account.name}</p>
                <p><strong>Email:</strong> {filteredRequests[selectedRequest]?.account.email}</p>
                <p><strong>Program:</strong> {filteredRequests[selectedRequest]?.socOfficer.programID === 1 ? "BSCS" : "BSIT"}</p>

                          
                {filteredRequests[selectedRequest]?.socOfficer.programID === 1 ? (
                  <p><strong>Change Position:&nbsp;&nbsp;</strong>
                  <select name="position" value={editSocOff.position} onChange={handleEditSocOffChange} id="" required>
                    <option value={filteredRequests[selectedRequest]?.socOfficer.position}>{filteredRequests[selectedRequest]?.socOfficer.position}</option>
                    <option value="President">President</option>
                    <option value="Vice President">Vice President</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Assistant Secretary">
                      Assistant Secretary
                    </option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Auditor">Auditor</option>
                    <option value="P.R.O.">P.R.O.</option>
                    <option value="Assistant P.R.O.">Assistant P.R.O.</option>
                    <option value="1st Year Chairperson">
                      1st Year Chairperson
                    </option>
                    <option value="2nd Year Chairperson">
                      2nd Year Chairperson
                    </option>
                    <option value="3rd Year Chairperson">
                      3rd Year Chairperson
                    </option>
                    <option value="4th Year Chairperson">
                      4th Year Chairperson
                    </option>
                  </select>
                </p>
                )
                : (
                  <p><strong>Change Position:&nbsp;&nbsp;</strong>
                  <select name="position" value={editSocOff.position} onChange={handleEditSocOffChange} id="" required>
                    <option value={filteredRequests[selectedRequest]?.socOfficer.position}>{filteredRequests[selectedRequest]?.socOfficer.position}</option>
                    <option value="President">President</option>
                    <option value="Vice President">Vice President</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Assistant Secretary">
                      Assistant Secretary
                    </option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Assistant Treasurer">
                      Assistant Treasurer
                    </option>
                    <option value="Business Manager">Business Manager</option>
                    <option value="Auditor">Auditor</option>
                    <option value="P.R.O.">P.R.O.</option>
                    <option value="GAD Representative">
                      GAD Representative
                    </option>
                    <option value="1st Year Senator">1st Year Senator</option>
                    <option value="2nd Year Senator">2nd Year Senator</option>
                    <option value="3rd Year Senator">3rd Year Senator</option>
                    <option value="4th Year Senator">4th Year Senator</option>
                  </select>
                </p>
                )}


                <p><strong>Change Status:&nbsp;&nbsp;</strong>
                  <select name="status" onChange={handleEditSocOffChange} id="" required>
                    <option value={filteredRequests[selectedRequest]?.socOfficer.status} >{filteredRequests[selectedRequest]?.socOfficer.status}</option>
                    <option value="Elected">Elected</option>
                    <option value="Resigned">Resigned</option>
                  </select>
                </p>

                <button style={{textAlign: 'center', width: '100%'}} onClick={() => submitSocOffChange(filteredRequests[selectedRequest])} className={styles.approveButton}>
                  Make Changes
                </button>
                </div>
              )}

            {["Regular", "Irregular"].includes(filteredRequests[selectedRequest]?.student.studentType) && (
              <div className={styles.popupText}>
                <p><strong>Student Type:</strong> {filteredRequests[selectedRequest]?.student.studentType}</p>
                <p><strong>Student ID:</strong> {filteredRequests[selectedRequest]?.student.cvsuStudentID}</p>
                <p><strong>Name:</strong> {filteredRequests[selectedRequest]?.account.name}</p>
                <p><strong>Email:</strong> {filteredRequests[selectedRequest]?.account.email}</p>
                <p><strong>Program:</strong> {filteredRequests[selectedRequest]?.student.programID === 1 ? "BSCS" : "BSIT"}</p>
                
                <p><strong>Change student type:&nbsp;&nbsp;</strong>
                  <select name="studentType" onChange={handleEditOldStdChange} value={editOldStd.studentType} id="" required>
                    <option value={filteredRequests[selectedRequest]?.student.studentType}>{filteredRequests[selectedRequest]?.student.studentType}</option>
                    <option value="Regular">Regular</option>
                    <option value="Irregular">Irregular</option>
                  </select>
                </p>

                <p><strong>Change status:&nbsp;&nbsp;</strong>
                  <select name="status" value={editOldStd.status} onChange={handleEditOldStdChange} id="" required>
                    <option value={filteredRequests[selectedRequest]?.student.studentStatus} >{filteredRequests[selectedRequest]?.student.studentStatus}</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Dropped">Dropped</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Withdrawn">Withdrawn</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                </p>

                <button style={{textAlign: 'center', width: '100%'}} onClick={() => submitOldStdChange(filteredRequests[selectedRequest])} className={styles.approveButton}>
                  Make Changes
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </>
  );
}

export default AccountManagement;
