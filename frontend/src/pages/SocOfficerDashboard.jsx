import React from "react";
import { useState, useEffect, useMemo } from "react";
import styles from "/src/styles/SocOffDash.module.css";
import axios from "axios";
import Header from "/src/components/AdminDashHeader.jsx";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import checkmark from '/src/assets/checkmark.png';
import errormark from '/src/assets/errormark.png';
import acsIcon from '/src/assets/ACS-ICON.png';
import itsIcon from '/src/assets/ITS-ICON.png';

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
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function SocOfficerDashboard() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  const [SideBar, setSideBar] = useState(false);
  const [CScount, setCScount] = useState(0);
  const [ITcount, setITcount] = useState(0);
  const [accName, setAccName] = useState("");
  const [program, setProgram] = useState("");
  const [pfp, setPFP] = useState("");
  const [isEnrollment, setIsEnrollment] = useState();

  const [successPrompt, setsuccessPrompt] = useState(false); //success
  const [successMsg, setsuccessMsg] = useState("");
  const [errorPrompt, setErrorPrompt] = useState(false); //errors
  const [errorMsg, setErrorMsg] = useState("");

  const [enrollmentPeriod, setEnrollmentPeriod] = useState({
    start: "",
    end: "",
    status: "",
  });

  //Reuse in other pages that requires logging in
  const navigate = useNavigate();
  
  axios.defaults.withCredentials = true;
  // //RETURNING ACCOUNT NAME IF LOGGED IN
  // useEffect(() => {
  //   axios
  //     .get(`${backendUrl}/session`)
  //     .then((res) => {
  //       console.log(res.data);
  //       if (res.data.valid) {
  //         console.log(res.data);
  //         setAccName(res.data.name);
  //       }
  //     })
  //     //RETURNING ERROR IF NOT
  //     .catch((err) => {
  //       console.error("Error validating user session:", err);
  //     });

  //   axios
  //     .get(`${backendUrl}/getPFP`)
  //     .then((res) => {
  //       setPFP(`${backendUrl}/${res.data.pfpURL}`);
  //     })
  //     .catch((err) => {
  //       //TODO: Error prompt
  //       alert("Error: " + err);
  //     });
  // }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
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
    if(!enrollmentPeriod.start || !enrollmentPeriod.end || enrollmentPeriod.start === '' || enrollmentPeriod.end === ''){
      setErrorMsg('Set start and end of enrollment period');
      setErrorPrompt(true);
      return;
    }

    axios
      .post(`${backendUrl}/postEnrollmentPeriod`, enrollmentPeriod)
      .then((res) => {
        if (res.data.message === "Enrollment period posted successfully.") {
          setsuccessPrompt(true);
          setsuccessMsg("Announcement posted successfully");
          setErrorPrompt(false);
          setErrorMsg(res.data.message);

          setIsEnrollment(true);
        } else {
          setsuccessPrompt(false);
          setsuccessMsg(res.data.message);
          setErrorPrompt(true);
          setErrorMsg("Error posting announcement");
        }
      })
      .catch((err) => {
        //TODO: Error prompt
        setErrorPrompt(true);
        setErrorMsg("Error: ", err);
      });
  };

  useEffect(() => {
    axios
      .get(`${backendUrl}/viewEnrollmentPeriod`)
      .then((res) => {
        const { enrollmentPeriod } = res.data;
        if (enrollmentPeriod) {
          if (
            enrollmentPeriod.Status === "Pending" ||
            enrollmentPeriod.Status === "Ongoing"
          ) {
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
    axios
      .get(`${backendUrl}/socOfficerProgram`)
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
        //TODO: Error prompt
        alert("Error: " + err);
        console.error("ERROR FETCHING DATA: " + err);
      });
  }, []);

  //set enrollment period to ongoing
  const handleStartEnrollment = () => {
    axios
      .post(`${backendUrl}/startEnrollment`)
      .then((res) => {
        if (res.data.message === "Enrollment is now ongoing") {
          //TODO: Success prompt
          setsuccessPrompt(true);
          setsuccessMsg(res.data.message);
          setErrorPrompt(false);
          setErrorMsg(res.data.message);
        }
      })
      .catch((err) => {
        //TODO: Error prompt
        alert("Error: " + err.message);
      });
  };

  //set enrollment period to finished
  const handleFinishEnrollment = () => {
    axios
      .post(`${backendUrl}/finishEnrollment`)
      .then((res) => {
        if (res.data.message === "Enrollment ended") {
          //TODO: Success prompt
          setsuccessPrompt(true);
          setsuccessMsg(res.data.message);
          setErrorPrompt(false);
          setErrorMsg(res.data.message);
        }
      })
      .catch((err) => {
        //TODO: Error prompt
        alert("Error: " + err.message);
      });
  };

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />

      {/* SIGN UP PROMPT */}
      {/* SUCCESS PROMPT */}
      {successPrompt && (
        <div
          data-aos="zoom-out"
          data-aos-duration="500"
          className={styles.popup}
        >
          <div className={styles.popupContent}>
            <button
              className={styles.closeButton}
              onClick={() => setsuccessPrompt(false)}
            >
              &times;
            </button>
            <div className={styles.popupHeader}>
              <h2>Success</h2>
            </div>
            <div className={styles.Message}>
              <img
                src={checkmark}
                alt="Success Icon"
                className={styles.messageImage}
              />
            </div>
            <p className={styles.popupText}>{successMsg}</p>
            <button
              className={styles.resetButton}
              onClick={() => {
                window.location.reload();
              }}
            >
              <span>OK</span>
            </button>
          </div>
        </div>
      )}

      {/* ERROR PROMPT */}
      {errorPrompt && (
        <div
          data-aos="zoom-out"
          data-aos-duration="500"
          className={styles.popupError}
        >
          <div className={styles.popupContentError}>
            <button
              className={styles.closeButton}
              onClick={() => setErrorPrompt(false)}
            >
              &times;
            </button>
            <div className={styles.popupHeaderError}>
              <h2>Error</h2>
            </div>
            <div className={styles.MessageError}>
              <img
                src={errormark}
                alt="Error Icon"
                className={styles.messageImage}
              />
            </div>
            <p className={styles.popupTextError}>{errorMsg}</p>
            <button
              className={styles.resetButton}
              onClick={() => {
                window.location.reload();
              }}
            >
              <span>OK</span>
            </button>
          </div>
        </div>
      )}

      <div className={styles.contentSection}>
        <div className={styles.gridContainer}>
          <div className={styles.container1}>
            <div className={styles.GreetingContainer}>
              <div className={styles.nameCard}>
                <div className={styles.profilePic} data-testid="profile-pic">
                  <img
                    src={pfp}
                    alt="Profile"
                    className={styles.profileImage}
                  />
                </div>
                <div
                  className={styles.greetingText}
                  data-testid="greeting-text"
                >
                  <p style={{color: "#3d8c4b"}}>Hi,</p>
                  <h3 style={{color: "#3d8c4b"}}>{accName}!</h3>
                </div>
              </div>

              <div
                className={styles.logoCard}
                style={{
                  backgroundColor:
                    program === 1
                      ? "#9b1f1f"
                      : program === 2
                      ? "#3d8c4b"
                      : "transparent",
                }}
              >
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
                {program === 1 ? (
                  <h3 style={{ color: "white" }}>
                    Alliance of Computer Scientist
                  </h3>
                ) : program === 2 ? (
                  <h3 style={{ color: "white" }}>
                    Information Technology Society
                  </h3>
                ) : null}
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

          {/* Announcement Section */}
          {!isEnrollment && (
            <div
              className={styles.announcementContainer}
              data-testid="enrollment-period"
            >
              <div className={styles.announcementHeader}>
                <h2 className={styles.announcementTitle}>
                  Schedule Enrollment for{" "}
                  {program === 1 ? "BSCS" : program === 2 ? "BSIT" : ""}
                </h2>
              </div>

              {/* Announcement Input */}

              <div className={styles.enrollmentPeriod}>
                <div className={styles.enrollmentPeriodDiv}>
                  <label htmlFor="">Start</label>
                  <input
                    name="start"
                    className={styles.announcementInput}
                    type="datetime-local"
                    value={enrollmentPeriod.start}
                    onChange={handleEnrollmentChange}
                    placeholder="Start"
                    required
                  />
                </div>

                <p
                  style={{
                    margin: "10px",
                    backgroundColor: "transparent",
                    fontWeight: "bold",
                  }}
                >
                  TO
                </p>

                <div className={styles.enrollmentPeriodDiv}>
                  <label htmlFor="">End</label>
                  <input
                    name="end"
                    className={styles.announcementInput}
                    value={enrollmentPeriod.end}
                    type="datetime-local"
                    placeholder="End"
                    onChange={handleEnrollmentChange}
                    required
                  />
                </div>
              </div>

              {/* Post Button */}
              <button
                className={styles.postButton}
                onClick={handlePostAnnouncement}
              >
                <span>POST</span>
              </button>
            </div>
          )}

          {isEnrollment && (
            <div className={styles.container3}>
              <div className={styles.row1}>
                <div className={styles.headerContainer}>
                  <h2 className={styles.announcementHeader}>
                    {enrollmentPeriod.status === "Pending"
                      ? "Enrollment Period"
                      : enrollmentPeriod.status === "Ongoing"
                      ? "Enrollment is Ongoing"
                      : ""}
                  </h2>
                </div>

                <div className={styles.announcementList}>
                  <div className={styles.announcementCard}>
                    <div className={styles.announcementText}>
                      <p>
                        {new Date(enrollmentPeriod.start).toLocaleString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          }
                        )}
                      </p>
                      <p>to</p>
                      <p>
                        {new Date(enrollmentPeriod.end).toLocaleString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          }
                        )}
                      </p>
                    </div>

                    <div className={styles.enrollmentControl}>
                      <button
                        onClick={handleStartEnrollment}
                        className={styles.editButton}
                        style={
                          enrollmentPeriod.status === "Pending"
                            ? { display: "flex" }
                            : { display: "none" }
                        }
                      >
                        Start
                      </button>
                      <button
                        onClick={handleFinishEnrollment}
                        className={styles.deleteButton}
                      >
                        End
                      </button>
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
                <h3>DCS Students Per Program</h3>
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

export default SocOfficerDashboard;
