import { useState, useEffect, useMemo } from "react";
import styles from "/src/styles/SocOFFDash.module.css";
import axios from "axios";
import Header from "/src/components/AdminDashHeader.jsx";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { use } from "chai";
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);



function SocOfficerDashboard() {
  const [SideBar, setSideBar] = useState(false);
  const [CScount, setCScount] = useState(0);
  const [ITcount, setITcount] = useState(0);
  const [accName, setAccName] = useState("");
  const [program, setProgram] = useState("");
  const [pfp, setPFP] = useState("");
  const [isEnrollment, setIsEnrollment] = useState();
  const [enrollmentPeriod, setEnrollmentPeriod] = useState({
    start: "",
    end: "",
    status: "",
  });


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

  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [SideBar]);


  const handleEnrollmentChange = (e) => {
    const { name, value } = e.target;
    setEnrollmentPeriod({ ...enrollmentPeriod, [name]: value });
  };

  const handlePostAnnouncement = () => {
    axios
      .post("http://localhost:8080/postEnrollmentPeriod", enrollmentPeriod)
      .then((res) => {
        if (res.data.message === "Enrollment period posted successfully.") {
          alert("Announcement posted successfully");
          window.location.reload();
          setIsEnrollment(true);
        } else {
          alert("Error posting" + res.data.message);
        }
      })
      .catch((err) => {
        console.error("Error posting announcement:", err);
      });
  };

  useEffect(() => {
    axios.get("http://localhost:8080/viewEnrollmentPeriod")
      .then((res) => {
        const { enrollmentPeriod } = res.data;
        if (enrollmentPeriod) {
          if (enrollmentPeriod.Status === "Pending" || enrollmentPeriod.Status === "Ongoing") {
            setIsEnrollment(true);
            setEnrollmentPeriod({
              start: enrollmentPeriod.Start,
              end: enrollmentPeriod.End,
              status: enrollmentPeriod.Status,
            });
          } else if (enrollmentPeriod.Status === "Finished") {
            setIsEnrollment(false);
          }
        }
      })
      .catch((err) => {
        console.error("Error getting enrollment period:", err);
        setIsEnrollment(false); // Set default state in case of error
      });
  }, []);

  


  useEffect(() => {
    axios.get("http://localhost:8080/socOfficerProgram")
      .then((res) => {
        console.log(res.data.program);
        setProgram(res.data.program);
      })
      .catch((err) => {
        console.error("Error getting program:", err);
      });
  }, []);


  // BILOG NA ANO
  const doughnutData = useMemo(
    () => ({
      labels: ["Alliance of Computer Science", "Information Technology Society"],
      datasets: [
        {
          label: "DCS CHARTS",
          data: [CScount, ITcount],
          backgroundColor: ["#d9534f", "#5cb85c"],
          hoverBackgroundColor: ["#c9302c", "#4cae4c"],
          borderWidth: 2,
        },
      ],
    }),
    [CScount, ITcount]
  );

  const doughnutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
      },
    }),
    []
  );

  //GET NUMBER OF REGULAR STUDENTS ENROLLED IN BSCS
  useEffect(() => {
    axios.get("http://localhost:8080/getCS")
      .then((res) => {
        setCScount(res.data.CScount);
      })
      .catch((err) => {
        alert("Error: " + err);
        console.error("ERROR FETCHING DATA: " + err);
      });
  }, []);

  //GET NUMBER OF REGULAR STUDENTS ENROLLED IN BSIT
  useEffect(() => {
    axios.get("http://localhost:8080/getIT")
      .then((res) => {
        setITcount(res.data.ITcount);
      })
      .catch((err) => {
        alert("Error: " + err);
        console.error("ERROR FETCHING DATA: " + err);
      });
  }, []);


  //set enrollment period to ongoing
  const handleStartEnrollment = () => {
    axios.post("http://localhost:8080/startEnrollment")
    .then((res) => {
      if(res.data.message === "Enrollment is now ongoing"){
        alert(res.data.message);
      }
      window.location.reload();
    })
    .catch((err) => {
      alert("Error: " + err.message);
    })
  }

  //set enrollment period to finished
  const handleFinishEnrollment = () => {
    axios.post("http://localhost:8080/finishEnrollment")
    .then((res) => {
      if(res.data.message === "Enrollment ended"){
        alert(res.data.message);
      }
      window.location.reload();
    })
    .catch((err) => {
      alert("Error: " + err.message);
    })
  }

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.contentSection}>
        <div className={styles.gridContainer}>


          <div className={styles.container1}>
          <div className={styles.GreetingContainer}>
  <div className={styles.nameCard}>
    <div className={styles.profilePic}>
      <img src={pfp} alt="Profile" className={styles.profileImage} />
    </div>
    <div className={styles.greetingText}>
      <p>HI</p>
      <h3>{accName}</h3>
    </div>
  </div>

  <div className={styles.logoCard} 
  style={{ backgroundColor: program === 1 ? '#9b1f1f' : program === 2 ? '#3d8c4b' : 'transparent' }}
>
  <div className={styles.logos}>
    <img 
      src={program === 1 ? "/src/assets/ACS-ICON.png" : program === 2 ? "/src/assets/ITS-ICON.png" : ""}
      alt="society logo" 
      className={styles.logo} 
    />
  </div>
  {program === 1 ? (
    <h3 style={{ color: 'white' }}>Alliance of Computer Scientist</h3>
  ) : program === 2 ? (
    <h3 style={{ color: 'white' }}>Information Technology Society</h3>
  ) : null}
</div>




             



            </div>
          </div>






          <div className={styles.container2}>
            {/* STATS */}
            <div className={styles.Stats}>
              <div className={styles.DCScount}>
                <h3>Total DCS Students</h3>
                <p>{ITcount + CScount}</p>
              </div>
              <div className={styles.CsStats}>
                <h3>Computer Science</h3>
                <p>{CScount}</p>
              </div>
              <div className={styles.ItStats}>
                <h3>Information Technology</h3>
                <p>{ITcount}</p>
              </div>
            </div>
          </div>

           {/* Announcement Section */}
           {!isEnrollment && (
                <div className={styles.announcementContainer}>
                  <div className={styles.announcementHeader}>
                    <h2 className={styles.announcementTitle}>Schedule Enrollment for {program === 1 ? "BSCS"
                      : program === 2 ? "BSIT"
                        : ""}</h2>
                  </div>

                  {/* Announcement Input */}

                  <div className={styles.enrollmentPeriod}>
                    <div className={styles.enrollmentPeriodDiv}>
                      <label htmlFor="">Start</label>
                      <input name="start" className={styles.announcementInput} type="datetime-local" value={enrollmentPeriod.start} onChange={handleEnrollmentChange} placeholder="Start" required />
                    </div>

                    <p style={{ margin: "10px", backgroundColor: "transparent", fontWeight: "bold" }}>TO</p>

                    <div className={styles.enrollmentPeriodDiv}>
                      <label htmlFor="">End</label>
                      <input name="end" className={styles.announcementInput} value={enrollmentPeriod.end} type="datetime-local" placeholder="End" onChange={handleEnrollmentChange} required />
                    </div>

                  </div>

                  {/* Post Button */}
                  <button className={styles.postButton} onClick={handlePostAnnouncement}>
                    <span>POST</span>
                  </button>
                </div>
              )}


          {isEnrollment && (
            <div className={styles.container3}>
              <div className={styles.row1}>
                <div className={styles.headerContainer}>
                  <h2 className={styles.announcementHeader}>{enrollmentPeriod.status === "Pending" ? "Enrollment Period"
                    : enrollmentPeriod.status === "Ongoing" ? "Enrollment is On Going"
                      : ""}</h2>
                </div>

                <div className={styles.announcementList}>
                  <div className={styles.announcementCard}>
                    <div className={styles.announcementText}>
                      <p>
                        {new Date(enrollmentPeriod.start).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                        })}
                      </p>
                      <p>to</p>
                      <p>
                        {new Date(enrollmentPeriod.end).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                        })}
                      </p>
                    </div>

                    <div className={styles.enrollmentControl}>
                      <button onClick={handleStartEnrollment} className={styles.editButton} style={enrollmentPeriod.status === "Pending" ? { display: "flex" } : { display: "none" }}>Start</button>
                      <button onClick={handleFinishEnrollment} className={styles.deleteButton}>End</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}







          {/* DONUT  */}
          <div className={styles.container4}>
            <div className={styles.DonutContainer}>
              <div className={styles.DonutText}>
                <h3>DCS Students Per Course</h3>
              </div>
              <div className={styles.Donut}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default SocOfficerDashboard;