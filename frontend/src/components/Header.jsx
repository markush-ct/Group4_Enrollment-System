import { Link } from 'react-router-dom'; // FOR LINKING PAGE
import SidebarMenu from '/src/components/SidebarMenu'
import style from '/src/styles/Header.module.css';

function Header({SideBar, setSideBar}) {

    function toggleSideBar(){
        if (SideBar) {
            setSideBar(false);
        } else {
            setSideBar(true);
        }
    }
    return (
        <>
            <div className={style.nav}>
                <header className={style.header}>
                    <div className={style.navLeft}>
                        <img className={style.cvsuLogo} src="/src/assets/cvsu-logo.png" alt="cvsu logo" />
                        <div className={style.institution}>
                            <h2 className={style.schoolName}>CAVITE STATE UNIVERSITY</h2>
                            <h2 className={style.schoolName}>BACOOR CAMPUS</h2>
                            <p className={style.department}>DEPARTMENT OF COMPUTER STUDIES</p>
                        </div>

                        <button className={style.menuBtn}>
                            <img className={style.menuIcon} src="/src/assets/icons8-menu-30.png" alt="" onClick={toggleSideBar} />
                        </button>
                    </div>

                    <div className={style.navRight}>
                        <ul className={style.nav_ul}>
                            <li className={style.abt_nav}>About&#x25BE;
                                <div className={style.abt_dropdown_div}>
                                    <ul className={style.dd_about}>
                                        <li><Link to="/CvsuHistory">History of CvSU</Link></li>
                                        <li><Link to="/MissionVision">Mission, Vision, and Core Values</Link></li>
                                        <li><Link to="/DcsPage">Department of Computer Studies</Link></li>
                                        <li><Link to="/SocOff">Computer Studies Society Officers</Link></li>
                                    </ul>
                                </div>
                            </li>

                            <li className={style.admissions_nav}>Admissions&#x25BE;
                                <div className={style.admissions_dropdown_div}>
                                    <ul className={style.dd_admissions}>
                                        <li><Link to="/Apply">Apply</Link></li>
                                        <li><a href="">Enrollment FAQs</a></li>
                                        <li><a href="">Undergraduate Programs</a></li>
                                    </ul>
                                </div>

                            </li>
                            <li><a href="">Admin Portal</a></li>
                            <li><a href="">Student Portal</a></li>
                        </ul>

                    </div>
                </header>
            </div>

            <SidebarMenu SideBar={SideBar} setSideBar={setSideBar}/>
        </>


    )
}

export default Header