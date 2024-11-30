import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "/src/styles/StudentDash.module.css";
import Header from "/src/components/StudentDashHeader.jsx";


axios.defaults.withCredentials = true;

function RegIrregDashboard() {
  const [SideBar, setSideBar] = useState(false);
  const [accName, setAccName] = useState("");


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
}, []);
//Reuse in other pages that requires logging in

  return (
    <>

      <Header SideBar={SideBar} setSideBar={setSideBar} />
  
      {/* Content Section */}
      <div className={styles.contentSection}>
        <div className={`${styles.row} container`}>
 
          <div className={styles.welcomeSection}>
            <div className={styles.profilePic}>
              <img src="\src\assets\sampleicon.jpg" alt="Student" />
            </div>
            <h3>Welcome, {accName || "Student"}!</h3>
          </div>
  

          <div className={styles.societySection}>
            <div className={styles.profilePic}>
              <img src="\src\assets\ACS-logo.svg" alt="Society Logo" />
            </div>
            <h3>Alliance of Computer Scientist</h3>
          </div>
        </div>
  
 
        <div className={styles.dashboardGrid}>
 
          <div className={styles.announcements}>
            <h2>📢 Important Announcements</h2>
            <ul>
              <li>
                Enrollment for 1st Semester closes on March 21, 2028.
              </li>
              <li>Midterm exams are scheduled for December 15–20, 2024.</li>
            </ul>
          </div>
  
       
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
  <a href="/class-schedule" className={styles.link}>
    View Class Schedule
  </a>
</div>

        </div>
      </div>

  

    </>
  );
}

export default RegIrregDashboard;
