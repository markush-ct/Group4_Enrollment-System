import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "/src/styles/AdminDashHeader.module.css";
import closeIcon from "/src/assets/close-button.png";
import dashboardIcon from "/src/assets/dashboardicon.png";
import accountRequestsIcon from "/src/assets/accrequest-icon.png";
import preEnrollmentIcon from "/src/assets/applicationreq-icon.png";
import settingsIcon from "/src/assets/settingsicon.png";
import logoutIcon from "/src/assets/logouticon.png";
import axios from "axios";
import logoutFunction from "/src/components/logoutFunction.jsx";

function StudentDashSideBar({ isOpen, toggleSidebar }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [navBtn, setNavBtn] = useState([]);

    axios.defaults.withCredentials = true;

    // Load Student Navigation Menu
    useEffect(() => {
        axios.get("http://localhost:8080")
            .then((res) => {
                if (res.data.valid && res.data.role === "Regular" || res.data.role === "Irregular") {
                    setNavBtn([
                        { name: "Dashboard", icon: dashboardIcon, path: "/RegIrregDashboard" },
                        { name: "Enrollment Announcement", icon: preEnrollmentIcon, path: "/enrollment-announcement" },
                        { name: "Class Schedule", icon: accountRequestsIcon, path: "/ClassSchedule" },
                    ]);
                } else if(res.data.valid && res.data.role === "Freshman"){
                    setNavBtn([
                        { name: "Dashboard", icon: dashboardIcon, path: "/FreshmanDashboard" }
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
                    <img src="/src/assets/cvsu-logo.png" alt="CVSU Logo" />
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
                                className={`${style.menuItem} ${isActive(item.path) ? style.active : ""}`}
                            >
                                <img src={item.icon} alt={item.name} className={style.icon} />
                                <Link to={item.path}>{item.name}</Link>
                            </li>
                        ))}
                    </ul>

                    {/* Log Out and Settings */}
                    <ul className={style.menuItemsBot}>
                        <li className={`${style.menuItem} ${isActive("/settings") ? style.active : ""}`}>
                            <img src={settingsIcon} alt="Account Settings" className={style.icon} />
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
