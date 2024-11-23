import { Link } from 'react-router-dom'; 
import style from '/src/styles/AdminDashHeader.module.css'; 
import dashboardIcon from '/src/assets//dashboardicon.png';
import accountRequestsIcon from '/src/assets//accrequest-icon.png';
import preEnrollmentIcon from '/src/assets//applicationreq-icon.png';
import societyFeeIcon from '/src/assets//socfee-icon.png';
import requirementsIcon from '/src/assets//reqsubmit-icon.png';
import settingsIcon from '/src/assets//settingsicon.png';
import logoutIcon from '/src/assets//logouticon.png';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoutFunction from '/src/components/logoutFunction.jsx';

function AdminDashSideBar({ isOpen, toggleSidebar}) {
    const navigate = useNavigate();
    const [navBtn, setNavBtn] = useState([]);

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get("http://localhost:8080")
          .then((res) => {
            const role = res.data.role;

            if (res.data.valid) {
                const menuItems = {
                    "Enrollment Officer":[
                        { name: 'Dashboard', icon: dashboardIcon, path: '/EnrollmentOfficerDashboard' },
                        { name: 'Account Requests', icon: accountRequestsIcon, path: '/AccountRequest' },
                        { name: 'Pre-enrollment', icon: preEnrollmentIcon, path: '/pre-enrollment' },
                        { name: 'Account Settings', icon: settingsIcon, path: '/settings' },
                        { name: 'Log Out', icon: logoutIcon, path: 'logout' }
                    ],
                    "Society Officer":[
                        { name: 'Dashboard', icon: dashboardIcon, path: '/dashboard' },
                        { name: 'Society Fee', icon: societyFeeIcon, path: '/society-fee' },
                        { name: 'Requirements Submission', icon: requirementsIcon, path: '/requirements-submission' },
                        { name: 'Account Settings', icon: settingsIcon, path: '/settings' },
                        { name: 'Log Out', icon: logoutIcon, path: 'logout' }
                    ],
                    "Adviser":[
                        { name: 'Dashboard', icon: dashboardIcon, path: '/dashboard' },
                        { name: 'Advising', icon: societyFeeIcon, path: '/advising' },
                        { name: 'Requirements Submission', icon: requirementsIcon, path: '/requirements-submission' },
                        { name: 'Account Settings', icon: settingsIcon, path: '/settings' },
                        { name: 'Log Out', icon: logoutIcon, path: 'logout' }
                    ],
                    "DCS Head":[
                        { name: 'Dashboard', icon: dashboardIcon, path: '/dashboard' },
                        { name: 'Society Fee', icon: societyFeeIcon, path: '/society-fee' },
                        { name: 'Requirements Submission', icon: requirementsIcon, path: '/requirements-submission' },
                        { name: 'Account Settings', icon: settingsIcon, path: '/settings' },
                        { name: 'Log Out', icon: logoutIcon, path: 'logout' }
                    ],
                    "School Head":[
                        { name: 'Dashboard', icon: dashboardIcon, path: '/dashboard' },
                        { name: 'Society Fee', icon: societyFeeIcon, path: '/society-fee' },
                        { name: 'Requirements Submission', icon: requirementsIcon, path: '/requirements-submission' },
                        { name: 'Account Settings', icon: settingsIcon, path: '/settings' },
                        { name: 'Log Out', icon: logoutIcon, path: 'logout' } //dito
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

    return (
        <div className={`${style.sidebar} ${isOpen ? style.open : ''}`}>
            <div className={style.logoAndMenu}>
                <div className={style.TopSection}>
                    <img src="/src/assets/cvsu-logo.png" alt="cvsu logo" />
                    <h2>CAVITE STATE UNIVERSITY BACOOR CITY CAMPUS</h2>
                    
                </div>
                <div className={style.TopSection2}>
                    <p>DEPARTMENT OF COMPUTER STUDIES</p>
                </div>

                {/* Sidebar Navigation */}
                <nav className={style.nav}>
                    <ul className={style.menuItems1}>
                        {navBtn.map((item, index) => (
                            <li key={index} className={style.menuItem}>
                                <img src={item.icon} alt={item.name} className={style.icon} />
                                {item.name === "Log Out" ? (
                                    <button onClick={handleLogout}>{item.name}</button>
                                ) : (<Link to={item.path}>{item.name}</Link>)}                                
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/*CLO SE SIDEBAR */}
            <button onClick={toggleSidebar} className={style.closeBtn}>X</button>
        </div>
    );
}

export default AdminDashSideBar;
