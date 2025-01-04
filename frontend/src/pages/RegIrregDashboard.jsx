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

  //Enrollment Progress
  const [socFeeProg, setSocFeeProg] = useState(false);
  const [reqsProg, setReqsProg] = useState(false);
  const [adviseProg, setAdviseProg] = useState(false);
  const [preEnrollProg, setPreEnrollProg] = useState(false);
  const [enrollProg, setEnrollProg] = useState(false);
  const [progressWidth, setProgressWidth] = useState("0%");

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8080/socFeeProgress"),
      axios.get("http://localhost:8080/reqsProgress"),
      axios.get("http://localhost:8080/adviseProgress"),
      axios.get("http://localhost:8080/preEnrollProgress"),
      axios.get("http://localhost:8080/enrollStatusProgress"),
    ])
      .then((res) => {
        setSocFeeProg(res[0].data.message === "Success");
        setReqsProg(res[1].data.message === "Success");
        setAdviseProg(res[2].data.message === "Success");
        setPreEnrollProg(res[3].data.message === "Success");
        setEnrollProg(res[4].data.message === "Success");
      });
  }, []);

  useEffect(() => {
    // Calculate progress percentage
    const completedSteps = [socFeeProg, reqsProg, adviseProg, preEnrollProg, enrollProg].filter(Boolean).length;
    const percentage = (completedSteps / 5) * 100;
    setProgressWidth(`${percentage}%`);
  }, [socFeeProg, reqsProg, adviseProg, preEnrollProg, enrollProg]);


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
          
  
       {isEnrollment === true ? (
        <div className={styles.enrollmentProgress}>
        <h2>Enrollment Progress</h2>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: progressWidth }}></div>
          <span>{progressWidth}</span>
        </div>
        <ul className={styles.progressSteps}>
          <li>{socFeeProg ? "✔" : "❌"} Step 1: Society Fee Payment</li>
          <li>{reqsProg ? "✔" : "❌"} Step 2: COG and Checklist</li>
          <li>{adviseProg ? "✔" : "❌"} Step 3: Advising</li>
          <li>{preEnrollProg ? "✔" : "❌"} Step 4: Pre-Enrollment</li>
          <li>{enrollProg ? "✔" : "❌"} Step 5: Enrollment</li>
        </ul>
      </div>
       ) : ('')}
          
  
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
