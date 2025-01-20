import React from "react";
import { useState, useEffect, useMemo } from "react";
import styles from "/src/styles/DCSHeadDash.module.css";
import axios from "axios";
import Header from "/src/components/AdminDashHeader.jsx";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import acsIcon from '/src/assets/ACS-ICON.png';
import itsIcon from "/src/assets/ITS-ICON.png";

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
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function DCSHeadDashboard() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
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
      .get(`${backendUrl}/session`)
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
      labels: [
        "Alliance of Computer Science",
        "Information Technology Society",
      ],
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
    axios
      .get(`${backendUrl}/DCSHeadProgram`)
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
    axios
      .get(`${backendUrl}/getCS`)
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
    axios
      .get(`${backendUrl}/getIT`)
      .then((res) => {
        setITcount(res.data.ITcount);
      })
      .catch((err) => {
        alert("Error: " + err);
        console.error("ERROR FETCHING DATA: " + err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${backendUrl}/getTotalShiftingReq`)
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
  const [enrollProgram, setEnrollProgram] = useState();

  useEffect(() => {
    axios
      .get(`${backendUrl}/dcsViewEnrollment`)
      .then((res) => {
        const { enrollmentPeriod } = res.data;

        if (res.data.message === "Enrollment fetched successfully") {
          if (
            enrollmentPeriod.Status === "Pending" ||
            enrollmentPeriod.Status === "Ongoing"
          ) {
            setIsEnrollment(true);
            setEnrollment(enrollmentPeriod);
            setEnrollProgram(enrollment.ProgramID === 1 ? "CS" : "IT");
          } else {
            setIsEnrollment(false);
          }
        } else {
          setIsEnrollment(false);
        }
      })
      .catch((err) => {
        alert("Error: ", err);
        setIsEnrollment(false);
      });
  }, [isEnrollment, enrollment]);

  const [enrolledStudents, setEnrolledStudents] = useState(0);
  useEffect(() => {
    axios.get(`${backendUrl}/getEnrolledStdCount`)
    .then((res) => {
      if(res.data.message === "Rows fetched"){
        setEnrolledStudents(res.data.enrolledCount);
      } else if(res.data.message === "No rows fetched"){
        setEnrolledStudents(0);
      }
    })
    .catch((err) => {
      alert("Error: " + err);
    })
  },[enrolledStudents]);

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.contentSection} data-testid="content-section">
        <div className={styles.gridContainer} data-testid="grid-container">
          <div className={styles.container2} data-testid="container-2">
            {/* STATS */}
            <div className={styles.Stats} data-testid="stats-section">
              <div className={styles.nameCard} data-testid="name-card">
                <div className={styles.nameSection} data-testid="name-section">
                  <p>Hi,</p>
                  <h3>{accName}!</h3>
                </div>
                <div className={styles.logos} data-testid="logo">
                  <img
                    src={
                      program === 1
                        ? acsIcon
                        : program === 2
                        ? itsIcon
                        : ""
                    }
                    alt="society logo"
                    className={styles.logo}
                  />
                </div>
              </div>

              <div
                className={styles.blueCard}
                data-testid="total-enrolled-card"
              >
                <h3>Total Enrolled</h3>
                <p>{enrolledStudents}</p>
              </div>
              <div
                className={styles.blueCard}
                data-testid="shifting-request-card"
              >
                <h3>Shifting Request</h3>
                <p>{reqCount}</p>
              </div>
            </div>
          </div>

          <div className={styles.container2}>
            {/* STATS */}
            <div className={styles.Stats}>
              <div className={styles.DCScount} data-testid="total-dcs-students">
                <h3>Total DCS Students</h3>
                <p>{ITcount + CScount}</p>
              </div>
              <div className={styles.CsStats} data-testid="cs-stats">
                <h3>Computer Science</h3>
                <p>{CScount}</p>
              </div>
              <div className={styles.ItStats} data-testid="it-stats">
                <h3>Information Technology</h3>
                <p>{ITcount}</p>
              </div>
            </div>
          </div>

          {isEnrollment && (
            <div
              className={styles.container3}
              data-testid="enrollment-container"
            >
              <div className={styles.row1} data-testid="row1">
                <div
                  className={styles.headerContainer}
                  data-testid="header-container"
                >
                  <h2
                    className={styles.announcementHeader}
                    data-testid="announcement-header"
                  >
                    {enrollment.Status === "Pending"
                      ? enrollProgram + " Enrollment Period"
                      : enrollment.Status === "Ongoing"
                      ? enrollProgram + " Enrollment is Ongoing"
                      : ""}
                  
                  </h2>
                </div>

                <div
                  className={styles.announcementList}
                  data-testid="announcement-list"
                >
                  <div
                    className={styles.announcementCard}
                    data-testid="announcement-card"
                  >
                    <div
                      className={styles.announcementText}
                      data-testid="announcement-text"
                    >
                      <p>
                        {new Date(enrollment.Start).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </p>
                      <p>to</p>
                      <p>
                        {new Date(enrollment.End).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
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
          <div className={styles.container4} data-testid="donut-container">
            <div
              className={styles.DonutContainer}
              data-testid="donut-container-wrapper"
            >
              <div className={styles.DonutText} data-testid="donut-text">
                <h3>DCS Population Per Program</h3>
              </div>
              <div className={styles.Donut} data-testid="donut-chart">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DCSHeadDashboard;
