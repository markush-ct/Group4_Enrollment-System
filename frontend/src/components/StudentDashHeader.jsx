import React from "react";
import { Link } from "react-router-dom";
import StudentDashSideBar from "/src/components/StudentDashSidebar.jsx";
import style from "/src/styles/StudentDashHeader.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const [accName, setAccName] = useState("");
  const [accRole, setAccRole] = useState("");
  const [pfp, setPFP] = useState("");

  axios.defaults.withCredentials = true;
  //RETURNING ACCOUNT NAME IF LOGGED IN
  useEffect(() => {
    axios
      .get("http://localhost:8080")
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
      .get("http://localhost:8080/getPFP")
      .then((res) => {
        setPFP(`http://localhost:8080/${res.data.uploadPFP}`);
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
        <header className={style.header} data-testid="mock-header" >
          <div className={style.navLeft}>
            {/* MENU */}
            <button className={style.menuBtn} onClick={toggleSidebar}>
              <img
                className={style.menuIcon}
                src="/src/assets/menu-button.png"
                alt="Menu"
              />
            </button>
          </div>

          {/* Search and Profile Section */}
          <div className={style.searchProfile}>
            <div className={style.profile}>
              <Link to="/AccountSettingsStudent">
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
      <StudentDashSideBar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
    </>
  );
}

export default StudentDashHeader;
