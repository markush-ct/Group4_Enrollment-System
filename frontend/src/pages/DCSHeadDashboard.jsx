import { useState, useEffect, useMemo } from "react";
import styles from "/src/styles/DCSHeadDash.module.css";
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
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);



function DCSHeadDashboard() {
  const [SideBar, setSideBar] = useState(false);
  const [CScount, setCScount] = useState(0);
  const [ITcount, setITcount] = useState(0);
  const [reqCount, setReqCount] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [accName, setAccName] = useState("");
  const [program, setProgram] = useState("");


  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
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

  useEffect(() => {
    axios.get("http://localhost:8080/DCSHeadProgram")
    .then((res) => {
      console.log(res.data.program);
      setProgram(res.data.program);
    })
    .catch((err) => {
      console.error("Error getting program:", err);
    });
  }, []);

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

  useEffect(() => {
    axios.get("http://localhost:8080/getTotalShiftingReq")
      .then((res) => {
        setReqCount(res.data.shiftingReqCount);
      })
      .catch((err) => {
        alert("Error: " + err);
        console.error("ERROR FETCHING DATA: " + err);
      });
  });


const [isEnrollment, setIsEnrollment] = useState(false);
const [enrollment, setEnrollment] = useState([]);

useEffect(() => {
  axios.get("http://localhost:8080/dcsViewEnrollment")
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
      <div className={styles.contentSection}>
        <div className={styles.gridContainer}>


          <div className={styles.container2}>
            {/* STATS */}
            <div className={styles.Stats}>
              <div className={styles.nameCard}>
                <div className={styles.nameSection}>
                  <p>HI</p>
                  <h3>{accName}</h3>
                </div>
                <div className={styles.logos}>
                  <img src={program === 1 ? "/src/assets/ACS-ICON.png" 
                            : program === 2 ? "/src/assets/ITS-ICON.png"
                            : ""
                          } alt="society logo" className={styles.logo} />
                </div>
              </div>


              <div className={styles.blueCard}>
                <h3>Total Enrolled</h3>
                <p>{ITcount + CScount}</p>
              </div>
              <div className={styles.blueCard}>
                <h3>Shifting Request</h3>
                <p>{reqCount}</p>
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


          {isEnrollment && (
                                <div className={styles.container3}>
                                  <div className={styles.row1}>
                                    <div className={styles.headerContainer}>
                                      <h2 className={styles.announcementHeader}>{enrollment.Status === "Pending" ? "CS Enrollment Period"
                                        : enrollment.Status === "Ongoing" ? "CS Enrollment is On Going"
                                          : ""}</h2>
                                    </div>
                    
                                    <div className={styles.announcementList}>
                                      <div className={styles.announcementCard}>
                                        <div className={styles.announcementText}>
                                          <p>
                                            {new Date(enrollment.Start).toLocaleString('en-US', {
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
                                            {new Date(enrollment.End).toLocaleString('en-US', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                              hour: 'numeric',
                                              minute: 'numeric',
                                              hour12: true,
                                            })}
                                          </p>
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
                <h3>DCS Population Per Course</h3>
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

export default DCSHeadDashboard;