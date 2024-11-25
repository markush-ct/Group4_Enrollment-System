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

                    <div className={style.navRight}>
                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search here"
                            className={style.searchBar}
                        />
                    </div>
                </header>
            </div>

            {/* SIDEBAR */}
            <AdminDashSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
    );
}

export default AdminDashHeader;
