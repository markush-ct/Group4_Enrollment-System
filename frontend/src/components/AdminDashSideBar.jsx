import { Link, useLocation } from 'react-router-dom'; 
import style from '/src/styles/AdminDashHeader.module.css'; 
import closeIcon from '/src/assets/close-button.png';
import dashboardIcon from '/src/assets/dashboardicon.png';
import accountRequestsIcon from '/src/assets/accrequest-icon.png';
import preEnrollmentIcon from '/src/assets/applicationreq-icon.png';
import societyFeeIcon from '/src/assets/socfee-icon.png';
import requirementsIcon from '/src/assets/reqsubmit-icon.png';
import settingsIcon from '/src/assets/settingsicon.png';
import logoutIcon from '/src/assets/logouticon.png';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoutFunction from '/src/components/logoutFunction.jsx';

function AdminDashSideBar({ isOpen, toggleSidebar }) {
    const navigate = useNavigate();
    const location = useLocation(); // to track current URL
    const [navBtn, setNavBtn] = useState([]);

    axios.defaults.withCredentials = true;
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
        axios.get("http://localhost:8080")
          .then((res) => {
            const role = res.data.role;

            if (res.data.valid) {
                const menuItems = {
                    "Enrollment Officer": [
                        { name: 'Dashboard', icon: dashboardIcon, path: '/EnrollmentOfficerDashboard' },
                        { name: 'Account Requests', icon: accountRequestsIcon, path: '/AccountRequest' },
                        { name: 'Pre-enrollment', icon: preEnrollmentIcon, path: '/AdminPreEnrollment' },
                    ],
                    "Society Officer": [
                        { name: 'Dashboard', icon: dashboardIcon, path: '/dashboard' },
                        { name: 'Society Fee', icon: societyFeeIcon, path: '/society-fee' },
                        { name: 'Requirements Submission', icon: requirementsIcon, path: '/requirements-submission' },
                    ],
                    "Adviser": [
                        { name: 'Dashboard', icon: dashboardIcon, path: '/dashboard' },
                        { name: 'Advising', icon: societyFeeIcon, path: '/advising' },
                        { name: 'Requirements Submission', icon: requirementsIcon, path: '/requirements-submission' },
                    ],
                    "DCS Head": [
                        { name: 'Dashboard', icon: dashboardIcon, path: '/dashboard' },
                        { name: 'Society Fee', icon: societyFeeIcon, path: '/society-fee' },
                        { name: 'Requirements Submission', icon: requirementsIcon, path: '/requirements-submission' },
                    ],
                    "School Head": [
                        { name: 'Dashboard', icon: dashboardIcon, path: '/dashboard' },
                        { name: 'Society Fee', icon: societyFeeIcon, path: '/society-fee' },
                        { name: 'Requirements Submission', icon: requirementsIcon, path: '/requirements-submission' },
                    ]
                };

                setNavBtn(menuItems[role] || []);
            } else {
                navigate("/LoginPage");
            }
          })
          .catch((err) => {
            console.error("Error validating user session:", err);
          });
    }, [navigate]);

    const handleLogout = () => {
        logoutFunction(navigate);
    };

    const isActive = (path) => location.pathname === path; // Helper function to check if the current path is active

    return (
        <div className={`${style.sidebar} ${isOpen ? style.open : ''}`}>
            <div className={style.logoAndMenu}>
                <div className={style.TopSection}>
                    <img src="/src/assets/cvsu-logo.png" alt="cvsu logo" />
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
                            <li key={index} className={`${style.menuItem} ${isActive(item.path) ? style.active : ''}`}>
                                <img src={item.icon} alt={item.name} className={style.icon} />
                                <Link to={item.path}>{item.name}</Link>
                            </li>
                        ))}
                    </ul>

                    {/* Log Out and Settings */}
                    <ul className={style.menuItemsBot}>
                        <li className={`${style.menuItem} ${isActive('/AccountSettings') ? style.active : ''}`}>
                            <img src={settingsIcon} alt="Account Settings" className={style.icon} />
                            <Link to="/AccountSettings">Account Settings</Link>
                        </li>
                        <li className={`${style.menuItem} ${isActive('/logout') ? style.active : ''}`}
                        onClick={handleLogout}>
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
