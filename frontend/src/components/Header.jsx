import { useState } from 'react'
import SidebarMenu from './SidebarMenu'
import '/src/styles/header.css'

function Header() {
    const [SideBar, setSideBar] = useState(false);

    function toggleSideBar(){
        setSideBar(true);
    }
    return (
        <>
        <SidebarMenu SideBar={SideBar} setSideBar={setSideBar}/>
            <div id="nav">
                <header id='header'>
                    <div className="navLeft">
                        <img className='cvsuLogo' src="/src/assets/cvsu-logo.png" alt="cvsu logo" />
                        <div className="institution">
                            <h2 className="schoolName">CAVITE STATE UNIVERSITY - BACOOR CITY CAMPUS</h2>
                            <p className="department">DEPARTMENT OF COMPUTER STUDIES</p>
                        </div>

                        <button id='menuBtn'>
                            <img className='menuIcon' src="/src/assets/icons8-menu-30.png" alt="" onClick={toggleSideBar} />
                        </button>
                    </div>

                    <div className="navRight">
                        <ul className='nav-ul'>
                            <li className='abt-nav'>About&#x25BE;
                                <div id="abt-dropdown-div">
                                    <ul id="dd-about">
                                        <li><a href="">History of CvSU</a></li>
                                        <li><a href="">Mission, Vision, and Core Values</a></li>
                                        <li><a href="">Department of Computer Studies</a></li>
                                        <li><a href="">Computer Studies Society Officers</a></li>
                                    </ul>
                                </div>
                            </li>

                            <li className='admissions-nav'>Admissions&#x25BE;
                                <div id="admissions-dropdown-div">
                                    <ul id="dd-admissions">
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
                </header>
            </div>
        </>


    )
}

export default Header