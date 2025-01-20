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

function EnrollmentOfficerDashboard() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
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

  const [CSisEnrollment, setCSIsEnrollment] = useState(false);
  const [ITisEnrollment, setITIsEnrollment] = useState(false);
  const [CSenrollment, setCSEnrollment] = useState([]);
  const [ITenrollment, setITEnrollment] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/CSEnrollmentPeriod`)
      .then((res) => {
        const { csEnrollmentRes } = res.data;

        if (res.data.message === "Data fetched") {
          setCSIsEnrollment(true);
          setCSEnrollment(csEnrollmentRes);
        } else {
          setCSIsEnrollment(false);
          setCSEnrollment([]);
        }
      })
      .catch((err) => {
        alert("Error: " + err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${backendUrl}/ITEnrollmentPeriod`)
      .then((res) => {
        const { itEnrollmentRes } = res.data;

        if (res.data.message === "Data fetched") {
          setITIsEnrollment(true);
          setITEnrollment(itEnrollmentRes);
        } else {
          setITIsEnrollment(false);
          setITEnrollment([]);
        }
      })
      .catch((err) => {
        alert("Error: " + err);
      });
  }, []);

  const [accReqNotif, setAccReqNotif] = useState(0);
  useEffect(() => {
    const fetchAccReqNotif = async () => {
      try {
        const accReqRes = await axios.get(`${backendUrl}/accReqNotif`);
        setAccReqNotif(
          accReqRes.data.studentCount +
            accReqRes.data.empCount +
            accReqRes.data.societyCount
        );
      } catch (err) {
        console.error("Error getting account request notifications:", err);
      }
    };

    fetchAccReqNotif();
  }, []);

  const [enrolledStudents, setEnrolledStudents] = useState(0);
  useEffect(() => {
    axios
      .get(`${backendUrl}/getEnrolledStdCount`)
      .then((res) => {
        if (res.data.message === "Rows fetched") {
          setEnrolledStudents(res.data.enrolledCount);
        } else if (res.data.message === "No rows fetched") {
          setEnrolledStudents(0);
        }
      })
      .catch((err) => {
        alert("Error: " + err);
      });
  }, [enrolledStudents]);

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.contentSection}>
        <div className={styles.gridContainer}>
          <div className={styles.container2}>
            {/* STATS */}
            <div className={styles.Stats}>
              <div className={styles.nameCard}>
                <div className={styles.nameSection} data-testid="name-section">
                  <p>Hi,</p>
                  <h3>{accName}!</h3>
                </div>
                <div className={styles.logos} data-testid="logo">
                  <img
                    src={acsIcon}
                    alt="Logo 1"
                    className={styles.logo}
                  />
                  <img
                    src={itsIcon}
                    alt="Logo 2"
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
                data-testid="account-request-card"
              >
                <h3>Account Request</h3>
                <p>{accReqNotif}</p>
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

          {CSisEnrollment && (
            <div className={styles.container3}>
              <div className={styles.row1}>
                <div className={styles.headerContainer}>
                  <h2 className={styles.announcementHeader}>
                    {CSenrollment.Status === "Pending"
                      ? "CS Enrollment Period"
                      : CSenrollment.Status === "Ongoing"
                      ? "CS Enrollment is Ongoing"
                      : ""}
                  </h2>
                </div>

                <div className={styles.announcementList}>
                  <div className={styles.announcementCard}>
                    <div className={styles.announcementText}>
                      <p>
                        {new Date(CSenrollment.Start).toLocaleString("en-US", {
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
                        {new Date(CSenrollment.End).toLocaleString("en-US", {
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

          {ITisEnrollment && (
            <div className={styles.container3}>
              <div className={styles.row1}>
                <div className={styles.headerContainer}>
                  <h2 className={styles.announcementHeader}>
                    {ITenrollment.Status === "Pending"
                      ? "IT Enrollment Period"
                      : ITenrollment.Status === "Ongoing"
                      ? "IT Enrollment is Ongoing"
                      : ""}
                  </h2>
                </div>

                <div className={styles.announcementList}>
                  <div className={styles.announcementCard}>
                    <div className={styles.announcementText}>
                      <p>
                        {new Date(ITenrollment.Start).toLocaleString("en-US", {
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
                        {new Date(ITenrollment.End).toLocaleString("en-US", {
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
          <div className={styles.container4}>
            <div className={styles.DonutContainer}>
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

export default EnrollmentOfficerDashboard;
