import React from "react";
import { Link } from "react-router-dom";
import AdminDashSideBar from "/src/components/AdminDashSideBar";
import style from "/src/styles/AdminDashHeader.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import menu from '/src/assets/menu-button.png';

function AdminDashHeader() {
  const backendUrl = 'https://group4-enrollment-system-server.onrender.com';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [accName, setAccName] = useState("");
  const [accRole, setAccRole] = useState("");
  const [pfp, setPFP] = useState("");

  axios.defaults.withCredentials = true;
  //RETURNING ACCOUNT NAME IF LOGGED IN
  useEffect(() => {
    axios
      .get(`${backendUrl}/session`)
      .then((res) => {
        if (res.data.valid) {
          setAccName(res.data.name);
          setAccRole(res.data.role);
        } else {
          navigate("/LoginPage");
        }
      })
      //RETURNING ERROR IF NOT
      .catch((err) => {
        console.error("Error validating user session:", err);
      });

    axios
      .get(`${backendUrl}/getPFP`)
      .then((res) => {
        setPFP(`${backendUrl}/${res.data.uploadPFP}`);
      })
      .catch((err) => {
        alert("Error: " + err);
      });
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className={style.nav}>
        <header className={style.header} data-testid="mock-header">
          <div className={style.navLeft}>
            {/* MENU */}
            <button className={style.menuBtn} onClick={toggleSidebar}>
              <img
                className={style.menuIcon}
                src={menu}
                alt="Menu"
              />
            </button>
          </div>

          {/* Search and Profile Section */}
          <div className={style.searchProfile}>
            <div className={style.profile}>
              <Link to="/AccountSettings">
                <img src={pfp} alt="Profile" className={style.profileImage} />
              </Link>
              <div className={style.accountName}>
                <p>{accName}</p> {/* CHANGE IT TO ACCNAME */}
                <span className={style.accountType}>{accRole}</span>{" "}
                {/* CHANGE IT TO ROLE */}
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* SIDEBAR */}
      <AdminDashSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}

export default AdminDashHeader;
