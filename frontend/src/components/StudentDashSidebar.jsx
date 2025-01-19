import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "/src/styles/AdminDashHeader.module.css";
import closeIcon from "/src/assets/close-button.png";
import form from "/src/assets/form-icon.png";
import dashboardIcon from "/src/assets/dashboardicon.png";
import preEnrollmentIcon from "/src/assets/applicationreq-icon.png";
import applicantsicon from "/src/assets/applicantsicon.png";
import settingsIcon from "/src/assets/settingsicon.png";
import logoutIcon from "/src/assets/logouticon.png";
import axios from "axios";
import logoutFunction from "/src/components/logoutFunction.jsx";
import cvsulogo from "/src/assets/cvsu-logo.png";

function StudentDashSideBar({ isOpen, toggleSidebar }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  const navigate = useNavigate();
  const location = useLocation();
  const [navBtn, setNavBtn] = useState([]);

  axios.defaults.withCredentials = true;

  // Load Student Navigation Menu
  useEffect(() => {
    axios
      .get(`${backendUrl}`)
      .then((res) => {
        if (res.data.valid && res.data.role === "Regular") {
          setNavBtn([
            {
              name: "Dashboard",
              icon: dashboardIcon,
              path: "/RegIrregDashboard",
            },
            {
              name: "Enrollment",
              icon: preEnrollmentIcon,
              path: "/EnrollmentRegular",
            },
            {
              name: "Checklist",
              icon: applicantsicon,
              path: "/StudentChecklist",
            },
          ]);
        } else if (res.data.valid && res.data.role === "Irregular") {
          setNavBtn([
            {
              name: "Dashboard",
              icon: dashboardIcon,
              path: "/RegIrregDashboard",
            },
            {
              name: "Enrollment",
              icon: preEnrollmentIcon,
              path: "/EnrollmentIrregular",
            },
            {
              name: "Checklist",
              icon: applicantsicon,
              path: "/StudentChecklist",
            },
          ]);
        } else if (res.data.valid && res.data.role === "Freshman") {
          setNavBtn([
            {
              name: "Admission Form",
              icon: form,
              path: "/FreshmenAdmissionForm",
            },
          ]);
        } else if (res.data.valid && res.data.role === "Shiftee") {
          setNavBtn([
            { name: "Shiftee Form", icon: form, path: "/ShifteeForm" },
          ]);
        } else if (res.data.valid && res.data.role === "Transferee") {
          setNavBtn([
            {
              name: "Admission Form",
              icon: form,
              path: "/TransfereeAdmissionForm",
            },
          ]);
        } else {
          navigate("/LoginPage");
        }
      })
      .catch((err) => {
        console.error("Error fetching student data:", err.message);
      });
  }, [navigate]);

  // Helper function to check active path
  const isActive = (path) => location.pathname === path;

  // Logout Handler
  const handleLogout = () => {
    logoutFunction(navigate);
  };

  return (
    <div className={`${style.sidebar} ${isOpen ? style.open : ""}`}>
      <div className={style.logoAndMenu}>
        <div className={style.TopSection}>
          <img src={cvsulogo} alt="CVSU Logo" />
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
              </li>
            ))}
          </ul>

          {/* Log Out and Settings */}
          <ul className={style.menuItemsBot}>
            <li
              className={`${style.menuItem} ${
                isActive("/settings") ? style.active : ""
              }`}
            >
              <img
                src={settingsIcon}
                alt="Account Settings"
                className={style.icon}
              />
              <Link to="/AccountSettingsStudent">Account Settings</Link>
            </li>
            <li className={`${style.menuItem}`}>
              <img src={logoutIcon} alt="Log Out" className={style.icon} />
              <button onClick={handleLogout}>Log Out</button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Close Sidebar Button */}
      <button onClick={toggleSidebar} className={style.closeBtn}>
        <img src={closeIcon} alt="Close Sidebar" className={style.closeIcon} />
      </button>
    </div>
  );
}

export default StudentDashSideBar;
