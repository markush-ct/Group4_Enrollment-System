import '/src/styles/header.css'

function Header() {
    return (
        <div id="nav">
            <header id='header'>
                <div className="navLeft">
                    <img src="" alt="" />
                    <div className="institution">
                        <h2 className="schoolName">CAVITE STATE UNIVERSITY - BACOOR CITY CAMPUS</h2>
                        <p className="department">DEPARTMENT OF COMPUTER STUDIES</p>
                    </div>
                </div>

                <div className="navRight">
                    <ul className='nav-ul'>
                        <li className='abt-nav'><a href="">About&#x25BE;</a>
                            <div id="abt-dropdown-div">
                                <ul id="dd-about">
                                    <li><a href="">History of CvSU</a></li>
                                    <li><a href="">Mission, Vision, and Core Values</a></li>
                                    <li><a href="">Department of Computer Studies</a></li>
                                    <li><a href="">Computer Studies Society Officers</a></li>
                                </ul>
                            </div>
                        </li>

                        <li className='admissions-nav'><a href="">Admissions&#x25BE;</a>
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
    )
}

export default Header