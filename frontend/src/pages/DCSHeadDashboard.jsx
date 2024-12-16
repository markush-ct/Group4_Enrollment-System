import { useState, useEffect, useMemo } from "react";
import styles from "/src/styles/DCSHeadDash.module.css";
import axios from "axios";
import Header from "/src/components/AdminDashHeader.jsx";
import { Doughnut } from "react-chartjs-2";



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
  const [announcementText, setAnnouncementText] = useState(""); // Announcement 
  const [announcements, setAnnouncements] = useState([]); // List of announcements
  

  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [SideBar]);



 


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
  useEffect (() => {
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
  useEffect (() => {
    axios.get("http://localhost:8080/getIT")
    .then((res) => {
      setITcount(res.data.ITcount);
    })
    .catch((err) => {
      alert("Error: " + err);
      console.error("ERROR FETCHING DATA: " + err);
    });
  }, []);



  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.contentSection}>
        <div className={styles.gridContainer}>


        <div className={styles.container1}>
  <div className={styles.GreetingContainer}>
    <div className={styles.HiContainer}>
      <h2 className={styles.GreetingTitle}>Hi DCS HEAD</h2>
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

      <div className={styles.row2}>Row 2 Content</div>
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

export default DCSHeadDashboard;