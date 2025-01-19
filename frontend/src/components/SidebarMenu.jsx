import React from 'react'; 
import { Link } from 'react-router-dom';
import { useState } from 'react';
import style from "/src/styles/header.module.css";
import cvsuLogo from '/src/assets/cvsu-logo.png';

function SidebarMenu({ SideBar, setSideBar }) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    const [about, setAbout] = useState(false);
    const [admissions, setAdmissions] = useState(false);

    function displayAboutDropDown() {
        if (about) {
            setAbout(false);
        } else {
            setAbout(true);
            setAdmissions(false);
        }
    }

    function displayAdmissionsDropDown() {
        if (admissions) {
            setAdmissions(false);
        } else {
            setAdmissions(true);
            setAbout(false);
        }
    }

    function close() {
        if (SideBar) {
            setSideBar(false);
            setAbout(false);
            setAdmissions(false);
        } else {
            setSideBar(true);
        }
    }


    return (
        <div className={style.sideBarContainer} style={{left: SideBar ? '0' : '-100%'}}>
            <div className={style.sbTop}>
                <img className={style.sb_cvsuLogo} src={cvsuLogo} alt="cvsu logo" />
                <div className={style.sbInstitution}>
                    <h2 className={style.sbSchoolName}>CAVITE STATE UNIVERSITY BACOOR CITY CAMPUS</h2>
                    <p className={style.sbDepartment}>DEPARTMENT OF COMPUTER STUDIES</p>
                </div>

                <button id='closeSB' className={style.closeSB} onClick={close}>x</button>
            </div>

            <div className={style.sbBot}>
                <ul className={style.sb_nav_ul}>
                    <li className={style.sb_abt_nav} onClick={displayAboutDropDown}>About&#x25BE;
                        <div className={style.sb_abt_dropdown_div} style={{display: about ? 'flex' : 'none'}} >
                            <ul className={style.sb_dd_about}>
                                <li><Link to="/CvsuHistory">History of CvSU</Link></li>
                                <li><Link to="/MissionVision">Mission, Vision, and Core Values</Link></li>
                                <li><Link to="/DcsPage">Department of Computer Studies</Link></li>
                                <li><Link to="/SocOff">Computer Studies Society Officers</Link></li>
                            </ul>
                        </div>
                    </li>

                    <li className={style.sb_admissions_nav} onClick={displayAdmissionsDropDown}>Admissions&#x25BE;
                        <div className={style.sb_admissions_dropdown_div} style={{display: admissions ? 'flex' : 'none'}} >
                            <ul className={style.sb_dd_admissions}>
                                <li><Link to="/Apply">Apply</Link></li>
                                <li><Link to="/FAQS">Enrollment FAQs</Link></li>
                                <li><Link to="/Undergrad">Undergraduate Programs</Link></li>
                            </ul>
                        </div>

                    </li>
                    <li><Link to="/MainPage#contact">Contact</Link></li>
                    <li><Link to="/LoginPage">Sign In</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default SidebarMenu