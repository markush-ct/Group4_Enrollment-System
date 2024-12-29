import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "/src/styles/StudentDash.module.css";
import Header from "/src/components/StudentDashHeader.jsx";


function RegIrregDashboard() {
  const [SideBar, setSideBar] = useState(false);
  const [accName, setAccName] = useState("");
  const [program, setProgram] = useState("");
  const [pfp, setPFP] = useState("");
  //TODO: CONDITION SA FRONTEND. IF PROGRAM === 1, ACS LOGO AND TEXT LALABAS. IF PROGRAM === 2, ITS LOGO AND TEXT LALABAS SA DASHBOARD
  useEffect(() => {
    axios.get("http://localhost:8080/getStudentProgram")
    .then((res) => {
      if(res.data.program === 1){
        setProgram("BSCS");
      } else if(res.data.program === 2){
        setProgram("BSIT");
      }
    })
    .catch((err) => {
      alert("Error fetching program: " + err);
    })
  }, [])


  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [SideBar]);


//Reuse in other pages that requires logging in
const navigate = useNavigate();
axios.defaults.withCredentials = true;
//RETURNING ACCOUNT NAME IF LOGGED IN
useEffect(() => {
  axios
    .get("http://localhost:8080")
    .then((res) => {
      if (res.data.valid) {
        setAccName(res.data.name);
      } else {
        navigate("/LoginPage");
      }
    })
    //RETURNING ERROR IF NOT
    .catch((err) => {
      console.error("Error validating user session:", err);
    });


    axios.get('http://localhost:8080/getPFP')
      .then((res) => {
        setPFP(`http://localhost:8080/${res.data.pfpURL}`);
      })
      .catch((err) => {
        alert("Error: " + err);
      })
}, []);
//Reuse in other pages that requires logging in

const [isEnrollment, setIsEnrollment] = useState(false);
const [enrollment, setEnrollment] = useState([]);

useEffect(() => {
  axios.get("http://localhost:8080/getEnrollment")
  .then((res) => {
    const {enrollmentPeriod} = res.data;

    if(res.data.message === "Enrollment fetched successfully"){
      if(enrollmentPeriod.Status === "Pending" || enrollmentPeriod.Status === "Ongoing"){
        setIsEnrollment(true);
        setEnrollment(enrollmentPeriod);
      } else {
        setIsEnrollment(false);
      }
    } else{
      setIsEnrollment(false);
    }
  })
  .catch((err) => {
    alert("Error: ", err);
    setIsEnrollment(false);
  })
}, [isEnrollment, enrollment]);

  return (
    <>

      <Header SideBar={SideBar} setSideBar={setSideBar} />
  
      {/* Content Section */}
      <div className={styles.contentSection}>
        <div className={`${styles.row} container`}>
 
          <div className={styles.welcomeSection}>
            <div className={styles.profilePic}>
              <img src={pfp} alt="Student" />
            </div>
            <h3>Welcome, {accName || "Student"}!</h3>
          </div>
  

          {program === "BSCS" ? (
  <div className={styles.societySection}>
    <div className={styles.profilePic}>
      <img src="\src\assets\ACS-logo.svg" alt="Society Logo" />
    </div>
    <h3>Alliance of Computer Scientist</h3>
  </div>
) : (
  <div className={styles.societySection}>
    <div className={styles.profilePic}>
      <img src="\src\assets\ITS-logo.svg" alt="Society Logo" />
    </div>
    <h3>Information Technology Society</h3>
  </div>
)}

</div>

  
 
        <div className={styles.dashboardGrid}>

          {isEnrollment === true ? (
            <div className={styles.announcements}>
            <h2>📢 {enrollment.Status === "Ongoing" ? "Enrollment is On Going" : "Enrollment Period"}</h2>
            <ul>
              <li>
                Enrollment starts on <strong>{new Date(enrollment.Start).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                        })}</strong>
                <br />
                Ends on <strong>{new Date(enrollment.End).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                        })}</strong>
              </li>
            </ul>
          </div>
          ): (
            <div className={styles.announcements}>
            <h2>📢 Enrollment Period</h2>
            <ul>
              <li>
                Enrollment period ended
              </li>
            </ul>
          </div>
          )}
          
  
       
          <div className={styles.enrollmentProgress}>
            <h2>Enrollment Progress</h2>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: "50%" }}></div>
              <span>50%</span>
            </div>
            <ul className={styles.progressSteps}>
              <li>✔ Step 1: Society Fee Payment</li>
              <li>✔ Step 2: Submit Attendance Proof</li>
              <li>✔ Step 3: Submit Certificate of Grades</li>
              <li>❌ Step 4: Fill out and Submit Digital Checklist</li>
              <li>❌ Step 5: Fill out the Pre-enrollment Form and Submit</li>
            </ul>
          </div>
  
          <div className={styles.linksSection}>
  <img src="\src\assets\calendar-icon.png" alt="Calendar" />
  <Link to="/ClassSchedule">View Schedule</Link>
</div>

        </div>
      </div>

  

    </>
  );
}

export default RegIrregDashboard;
