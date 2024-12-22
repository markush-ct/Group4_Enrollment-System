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



function EnrollmentOfficerDashboard() {
  const [SideBar, setSideBar] = useState(false);
  const [CScount, setCScount] = useState(0);
  const [ITcount, setITcount] = useState(0);
  const [reqCount, setReqCount] = useState(0);
  const [announcements, setAnnouncements] = useState([]); // LIST ANNOUNCEMENT
  const [accName, setAccName] = useState("");


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
  })


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
                  <img src="/src/assets/ACS-ICON.png" alt="Logo 1" className={styles.logo} />
                  <img src="/src/assets/ITS-ICON.png" alt="Logo 2" className={styles.logo} />
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
                <p>70</p>
              </div>
              <div className={styles.CsStats}>
                <h3>Computer Science</h3>
                <p>35</p>
              </div>
              <div className={styles.ItStats}>
                <h3>Information Technology</h3>
                <p>35</p>
              </div>
            </div>
          </div>


          <div className={styles.container3}>
            <div className={styles.row1}>
              <div className={styles.headerContainer}>
                <h2 className={styles.announcementHeader}>View Announcements</h2>

              </div>
              <div className={styles.announcementList}>
                {announcements.slice(0, 3).map((announcement, index) => (
                  <div key={index} className={styles.announcementItem}>
                    {announcement}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.row2}>
              <div className={styles.headerContainer}>
                <h2 className={styles.announcementHeader}>Class Schedules</h2>

              </div>
            </div>
          </div>


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

export default EnrollmentOfficerDashboard;