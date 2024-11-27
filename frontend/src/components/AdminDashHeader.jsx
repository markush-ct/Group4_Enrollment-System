import { Link } from 'react-router-dom';
import AdminDashSideBar from '/src/components/AdminDashSideBar';
import style from '/src/styles/AdminDashHeader.module.css';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashHeader() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();
    const [accName, setAccName] = useState('');
    const [accRole, setAccRole] = useState('');

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
  }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    return (
        <>
            <div className={style.nav}>
                <header className={style.header}>
                    <div className={style.navLeft}>
                        {/* MENU */}
                        <button className={style.menuBtn} onClick={toggleSidebar}>
                            <img className={style.menuIcon} src="/src/assets/menu-button.png" alt="Menu" />
                        </button>

                        {/* HEADER */}
                        <Link to="/MainPage">
                            <img className={style.cvsuLogo} src="/src/assets/cvsu-logo.png" alt="CvSU logo" />
                        </Link>
                        <div className={style.accName}>
                            <h2>{accName}</h2>
                        </div>
                    </div>

                     {/* Search and Profile Section */}
      <div className={style.searchProfile}>
        <input
          type="text"
          placeholder="Search here"
          className={style.searchBar}
        />
        <div className={style.profile}>
        <Link to="/AccountSettings"><img
          src='\src\assets\sampleicon.jpg'
            alt="Profile"
            className={style.profileImage}
          /></Link>
          <div className={style.accountName}>
            <p>{accName}</p>  {/* CHANGE IT TO ACCNAME */}
            <span className={style.accountType}>{accRole}</span>   {/* CHANGE IT TO ROLE */}
  
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
