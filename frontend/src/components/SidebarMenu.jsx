import { useRef, useState } from "react"

function SidebarMenu({ SideBar, setSideBar }) {

    const [about, setAbout] = useState(false);
    const [admissions, setAdmissions] = useState(false);

    function displayAboutDropDown() {
        if (about) {
            setAbout(false);
        } else {
            setAbout(true);
        }
    }

    function displayAdmissionsDropDown() {
        if (admissions) {
            setAdmissions(false);
        } else {
            setAdmissions(true);
        }
    }

    function close() {
        if (SideBar) {
            setSideBar(false);
        } else {
            setSideBar(true);
        }
    }


    return (
        <div className={`sideBarContainer ${SideBar ? 'toggleSideBar' : ''}`}>
            <div className="sbTop">
                <img className='sb-cvsuLogo' src="/src/assets/cvsu-logo.png" alt="cvsu logo" />
                <div className="sbInstitution">
                    <h2 className="sbSchoolName">CAVITE STATE UNIVERSITY BACOOR CITY CAMPUS</h2>
                    <p className="sbDepartment">DEPARTMENT OF COMPUTER STUDIES</p>
                </div>

                <button id='closeSB' onClick={close}>x</button>
            </div>

            <div className="sbBot">
                <ul className='sb-nav-ul'>
                    <li className='sb-abt-nav' onClick={displayAboutDropDown}>About&#x25BE;
                        <div className={`sb-abt-dropdown-div ${about ? 'displayDropdown' : ''}`}>
                            <ul id="sb-dd-about">
                                <li><a href="">History of CvSU</a></li>
                                <li><a href="">Mission, Vision, and Core Values</a></li>
                                <li><a href="">Department of Computer Studies</a></li>
                                <li><a href="">Computer Studies Society Officers</a></li>
                            </ul>
                        </div>
                    </li>

                    <li className='sb-admissions-nav' onClick={displayAdmissionsDropDown}>Admissions&#x25BE;
                        <div className={`sb-admissions-dropdown-div ${admissions ? 'displayDropdown' : ''}`}>
                            <ul id="sb-dd-admissions">
                                <li><a href="">Apply</a></li>
                                <li><a href="">Enrollment FAQs</a></li>
                                <li><a href="">Undergraduate Programs</a></li>
                            </ul>
                        </div>

                    </li>
                    <li><a href="">Admin Portal</a></li>
                    <li><a href="">Student Portal</a></li>
                </ul>
            </div>
        </div>
    )
}

export default SidebarMenu