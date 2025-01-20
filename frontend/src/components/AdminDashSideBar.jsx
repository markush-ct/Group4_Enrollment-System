import React from "react";
import { Link, useLocation } from "react-router-dom";
import style from "/src/styles/AdminDashHeader.module.css";
import closeIcon from "/src/assets/close-button.png";
import dashboardIcon from "/src/assets/dashboardicon.png";
import accountRequestsIcon from "/src/assets/accrequest-icon.png";
import preEnrollmentIcon from "/src/assets/applicationreq-icon.png";
import societyFeeIcon from "/src/assets/socfee-icon.png";
import requirementsIcon from "/src/assets/reqsubmit-icon.png";
import advisingIcon from "/src/assets/advising-icon.png";
import accManagementIcon from "/src/assets/account-management-icon.png";
import schedIcon from "/src/assets/sched-icon.png";
import settingsIcon from "/src/assets/settingsicon.png";
import logoutIcon from "/src/assets/logouticon.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoutFunction from "/src/components/logoutFunction.jsx";
import studentIcon from '/src/assets/student_info_icon.png'
import cvsulogo from '/src/assets/cvsu-logo.png';

function AdminDashSideBar({ isOpen, toggleSidebar }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  const [accName, setAccName] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // to track current URL
  const [navBtn, setNavBtn] = useState([]);

  axios.defaults.withCredentials = true;
  //RETURNING ACCOUNT NAME IF LOGGED IN
  useEffect(() => {
    axios
      .get(`https://group4-enrollment-system-server.onrender.com/session`)
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

  const [accReqNotif, setAccReqNotif] = useState(0);
  const [freshmenAdmissionNotif, setFreshmenAdmissionNotif] = useState(0);
  const [transfereeAdmissionNotif, setTransfereeAdmissionNotif] = useState(0);
  const [shiftingNotif, setShiftingNotif] = useState(0);

  useEffect(() => {
    const fetchAccReqNotif = async () => {
      try {
        const accReqRes = await axios.get(`${backendUrl}/accReqNotif`);
        setAccReqNotif(
          accReqRes.data.studentCount +
            accReqRes.data.empCount +
            accReqRes.data.societyCount
        );
      } catch (err) {
        console.error("Error getting account request notifications:", err);
      }
    };

    fetchAccReqNotif();
  }, []);

  useEffect(() => {
    const fetchAdmissionNotif = async () => {
      try {
        const admissionReqRes = await axios.get(
          `${backendUrl}/admissionNotif`
        );
        // console.log("Fetched admission notifications:", admissionReqRes.data);
        setFreshmenAdmissionNotif(admissionReqRes.data.freshmenCount);
        setTransfereeAdmissionNotif(admissionReqRes.data.transfereeCount);
      } catch (err) {
        console.error("Error getting admission notifications:", err);
      }
    };

    fetchAdmissionNotif();
  }, []);

  useEffect(() => {
    const fetchShiftingNotif = async () => {
      try {
        const accReqRes = await axios.get(
          `${backendUrl}/getShiftingRequestsNotif`
        );
        setShiftingNotif(accReqRes.data.studentCount);
      } catch (err) {
        console.error("Error getting account request notifications:", err);
      }
    };

    fetchShiftingNotif();
  }, []);

  useEffect(() => {
    axios
      .get(`${backendUrl}/session`)
      .then((res) => {
        const role = res.data.role;

        if (res.data.valid) {
          const menuItems = {
            "Enrollment Officer": [
              {
                name: "Dashboard",
                icon: dashboardIcon,
                path: "/EnrollmentOfficerDashboard",
              },
              {
                name: "Student Information",
                icon: studentIcon,
                path: "/StudentInformation",
              },
              {
                name: "Account Request",
                icon: accountRequestsIcon,
                path: "/AccountRequest",
                notification:
                  accReqNotif > 0 ? (
                    <div className={style.sidebarNotif}>{accReqNotif}</div>
                  ) : null,
              },
              {
                name: "Enrollment",
                icon: preEnrollmentIcon,
                path: "/AdminEnrollment",
              },
              {
                name: "Account Management",
                icon: accManagementIcon,
                path: "/AccountManagement",
              },              
            ],
            "Society Officer": [
              {
                name: "Dashboard",
                icon: dashboardIcon,
                path: "/SocOfficerDashboard",
              },
              {
                name: "Schedule Management",
                icon: schedIcon,
                path: "/SchedManagement",
              },
              { name: "Society Fee", icon: societyFeeIcon, path: "/SocFee" },
              {
                name: "Requirements",
                icon: requirementsIcon,
                path: "/Requirements",
              },
            ],
            Adviser: [
              {
                name: "Dashboard",
                icon: dashboardIcon,
                path: "/AdviserDashboard",
              },
              { name: "Advising", icon: advisingIcon, path: "/Advising" },
              {
                name: "Pre-Enrollment",
                icon: preEnrollmentIcon,
                path: "/AdminPreEnrollment",
              },
            ],
            "DCS Head": [
              {
                name: "Dashboard",
                icon: dashboardIcon,
                path: "/DCSHeadDashboard",
              },
              {
                name: "Shifting Request",
                icon: accountRequestsIcon,
                path: "/ShiftingRequest",
                notification:
                  shiftingNotif > 0 ? (
                    <div className={style.sidebarNotif}>{shiftingNotif}</div>
                  ) : null,
              },
            ],
            "School Head": [
              {
                name: "Dashboard",
                icon: dashboardIcon,
                path: "/SchoolHeadDashboard",
              },
              {
                name: "Freshman Admission",
                icon: accountRequestsIcon,
                path: "/FreshmenAdmissionRequest",
                notification:
                  freshmenAdmissionNotif > 0 ? (
                    <div className={style.sidebarNotif}>
                      {freshmenAdmissionNotif}
                    </div>
                  ) : null,
              },
              {
                name: "Transferee Admission",
                icon: accountRequestsIcon,
                path: "/TransfereeAdmissionRequest",
                notification:
                  transfereeAdmissionNotif > 0 ? (
                    <div className={style.sidebarNotif}>
                      {transfereeAdmissionNotif}
                    </div>
                  ) : null,
              },
            ],
          };

          setNavBtn(menuItems[role] || []);
        } else {
          navigate("/LoginPage");
        }
      })
      .catch((err) => {
        console.error("Error validating user session:", err);
      });
  }, [navigate, accReqNotif, freshmenAdmissionNotif, transfereeAdmissionNotif]);

  const handleLogout = () => {
    logoutFunction(navigate);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`${style.sidebar} ${isOpen ? style.open : ""}`}>
      <div className={style.logoAndMenu}>
        <div className={style.TopSection}>
          <img src={cvsulogo} alt="cvsu logo" />
          <h2>CAVITE STATE UNIVERSITY - BACOOR CITY CAMPUS</h2>
        </div>
        <div className={style.TopSection2}>
          <p>DEPARTMENT OF COMPUTER STUDIES</p>
        </div>

        {/* Sidebar Navigation */}
        <nav className={style.nav}>
          {/* Main Menu Items */}
          <ul className={style.menuItemsTop}>
            {navBtn.map((item, index) => (
              <li
                key={index}
                className={`${style.menuItem} ${
                  isActive(item.path) ? style.active : ""
                }`}
              >
                <img src={item.icon} alt={item.name} className={style.icon} />
                <Link to={item.path}>{item.name}</Link>
                {item.notification}
              </li>
            ))}
          </ul>

          {/* Log Out and Settings */}
          <ul className={style.menuItemsBot}>
            <li
              className={`${style.menuItem} ${
                isActive("/AccountSettings") ? style.active : ""
              }`}
            >
              <img
                src={settingsIcon}
                alt="Account Settings"
                className={style.icon}
              />
              <Link to="/AccountSettings">Account Settings</Link>
            </li>
            <li
              className={`${style.menuItem} ${
                isActive("/logout") ? style.active : ""
              }`}
              onClick={handleLogout}
            >
              <img src={logoutIcon} alt="Log Out" className={style.icon} />
              Log Out
            </li>
          </ul>
        </nav>
      </div>

      {/* Close Sidebar Button with Icon */}
      <button onClick={toggleSidebar} className={style.closeBtn}>
        <img src={closeIcon} alt="Close Sidebar" className={style.closeIcon} />
      </button>
    </div>
  );
}

export default AdminDashSideBar;
