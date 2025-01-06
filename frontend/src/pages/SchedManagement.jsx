import { useState, useEffect } from "react";
import Header from "/src/components/AdminDashHeader.jsx";
import styles from "/src/styles/SchedManagement.module.css";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SchedManagement() {
  const [SideBar, setSideBar] = useState(false);
  const [errorPrompt, setErrorPrompt] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [accName, setAccName] = useState("");

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

  const days = [
    { full: "Monday", short: "Mon" },
    { full: "Tuesday", short: "Tue" },
    { full: "Wednesday", short: "Wed" },
    { full: "Thursday", short: "Thu" },
    { full: "Friday", short: "Fri" },
    { full: "Saturday", short: "Sat" },
  ];
  const times = Array.from({ length: 14 }, (_, i) => {
    const hour = 7 + i;
    return hour.toString().padStart(2, "0") + ":00";
  });

  const [schedule, setSchedule] = useState([]);
  const [formData, setFormData] = useState({
    courseCode: "",
    startTime: "",
    endTime: "",
    room: "",
    year: "",
    section: "",
    day: "",
    classType: "",
    instructor: "",
  });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    

    const mockData = [
      {
        courseCode: "COSC 101",
        startTime: "12:00",
        endTime: "14:00",
        room: "CL5",
        year: "3",
        section: "5",
        day: "Wednesday",
        classType: "Laboratory",
      },
      {
        courseCode: "DCIT 26",
        startTime: "16:00",
        endTime: "17:00",
        room: "CL2",
        year: "3",
        section: "5",
        day: "Monday",
        classType: "Lecture",
      },
      {
        courseCode: "DCIT 26",
        startTime: "17:00",
        endTime: "19:00",
        room: "CL2",
        year: "3",
        section: "5",
        day: "Monday",
        classType: "Laboratory",
      },
      {
        courseCode: "DCIT 65",
        startTime: "14:00",
        endTime: "16:00",
        room: "ACCRE",
        year: "3",
        section: "5",
        day: "Wednesday",
        classType: "Lecture",
      },
    ];

    setSchedule(mockData); // mock data
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const { courseCode, startTime, endTime, room, year, section, day, classType } = formData;
    return courseCode && startTime && endTime && room && year && section && day && classType;
  };

  const addSchedule = () => {
    if (!isFormValid()) {
      setErrorPrompt(true);
      setErrorMsg("All fields must be completed before submission.");
      return;
    }

    axios.post('http://localhost:8080/postClassSched', formData)
    .then((res) => {
      if(res.data.message === "Success"){
        setSchedule((prev) => [...prev, formData]);
        setViewMode("table");
        setFormData({
          courseCode: "",
          startTime: "",
          endTime: "",
          room: "",
          year: "",
          section: "",
          day: "",
          classType: "",
        });
      } else {
        setErrorMsg(res.data.message);
        setErrorPrompt(true);
      }
    })    
    .catch((err) => {
      setErrorPrompt(true);
      setErrorMsg("Error: " + err);
    })
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section); // section
    setPopUpVisible(true);
  };

  const closePopup = () => {
    setPopUpVisible(false);
    setSelectedSection("");
  };

  //FETCH COURSES (COURSE CODE)
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/getOptionsForSched')
      .then((res) => {
        if (res.data.message === "Success") {
          setCourses(res.data.courseData);
          setErrorMsg("");
          setErrorPrompt(false);
        } else {
          setErrorMsg("Error fetching courses");
          setErrorPrompt(true);
        }
      })
      .catch((err) => {
        setErrorPrompt(true);
        setErrorMsg("Error: " + err);
      })
  }, [])

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.contentSection}>
        <div className={styles.PageTitle}>Schedule Management</div>

        <div className={styles.buttonFilterContainer}>
          <button
            className={styles.addButton1}
            onClick={() => setViewMode(viewMode === "table" ? "form" : "table")}
          >
            {viewMode === "table" ? <span>Add Schedule</span> : <span>Back to Table</span>}
          </button>

          {/* Dropdown  */}
          <div className={styles.filterSection} data-aos="fade-up">
            <label htmlFor="filter" className={styles.filterLabel}>Filter by Type:</label>
            <select
              id="filter"
              className={styles.filterDropdown}
              value="filterType"
            >
              <option value="All">All</option>
              <option value="1-1">1-1</option>
              <option value="1-2">1-2</option>
              <option value="1-3">1-3</option>
              <option value="2-1">2-1</option>
            </select>
          </div>
        </div>

        {viewMode === "table" ? (
          <div className={styles.tableContainer}>
            <table className={styles.requestsTable}>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Section</th>
                </tr>
              </thead>
              <tbody>
                {schedule.length > 0 ? (
                  schedule.map((sched, index) => (
                    <tr key={index} onClick={() => handleSectionClick(sched.section)}>
                      <td>{sched.year}</td>
                      <td>{sched.section}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className={styles.noData}>
                      No sections available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <select name="courseCode" id="" value={formData.courseCode} onChange={handleInputChange}>
                <option value="" disabled>Select course code</option>
                {courses.map((row) => (
                  <option key={row.CourseChecklistID} value={row.CourseChecklistID}>
                    {row.CourseCode}
                  </option>
                ))}
              </select>
              <select name="day" value={formData.day} onChange={handleInputChange}>
                <option value="" disabled>Select Day</option>
                {days.map((day) => (
                  <option key={day.full} value={day.full}>
                    {day.full}
                  </option>
                ))}
              </select>
              <select name="startTime" value={formData.startTime} onChange={handleInputChange}>
                <option value="" disabled>Start Time</option>
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <select name="endTime" value={formData.endTime} onChange={handleInputChange}>
                <option value="" disabled>End Time</option>
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <select name="year" id="" value={formData.year} onChange={handleInputChange}>
                <option value="" disabled>Select Year</option>
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
                <option value="Fourth Year">Fourth Year</option>
              </select>
              <input
                type="tel"
                name="section"
                placeholder="Section"
                value={formData.section}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="room"
                placeholder="Room"
                value={formData.room}
                onChange={handleInputChange}
              />
              <select name="classType" value={formData.classType} onChange={handleInputChange}>
                <option value="">Class Type</option>
                <option value="Lecture">Lecture</option>
                <option value="Laboratory">Laboratory</option>
              </select>
              <input
                type="text"
                name="instructor"
                placeholder="Instructor"
                value={formData.instructor}
                onChange={handleInputChange}
              />
              <button className={styles.addButton} onClick={addSchedule}>
                <span>Add Schedule</span>
              </button>
            </div>
          </div>
        )}

        {errorPrompt && (
          <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupError}>
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
              <p className={styles.popupTextError}>{errorMsg}</p>
            </div>
          </div>
        )}

        {popUpVisible && (
          <div
            data-aos="zoom-out"
            data-aos-duration="500"
            className={`${styles.popup} ${popUpVisible ? styles.visible : ""}`}
          >
            <div className={styles.popupContentReq}>
              <div className={styles.popupHeader}>
                <button onClick={closePopup} className={styles.closeButton}>✖</button>
                <h2>CLASS SCHEDULE</h2>
              </div>
              <div data-aos="fade-up" className={styles.studentType}>
                <span>BSCS 2-3</span>
              </div>

              {/* Calendar */}
              <div data-aos="fade-up" className={styles.detailsSection}>
                <div className={styles.table}>
                  <div className={styles.header}>
                    <div className={styles.th}>Time</div>
                    {days.map((day) => (
                      <div className={styles.th} key={day.full}>
                        <span className={styles.fullDay}>{day.full}</span>
                        <span className={styles.shortDay}>{day.short}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.body}>
                    {times.map((time, rowIndex) => {
                      const nextTime = times[rowIndex + 1] || "21:00 PM";
                      const timeRange = `${time} - ${nextTime}`;

                      return (
                        <div key={time} className={styles.timeRow}>
                          <div className={styles.timeCell}>{timeRange}</div>
                          {days.map((day) => (
                            <div key={day.full} className={styles.dayCell}>
                              {schedule
                                .filter(
                                  (sched) =>
                                    sched.day === day.full &&
                                    times.indexOf(sched.startTime) <= rowIndex &&
                                    times.indexOf(sched.endTime) > rowIndex
                                )
                                .map((sched) => {
                                  const startIndex = times.indexOf(sched.startTime);
                                  const endIndex = times.indexOf(sched.endTime);
                                  const blockColor =
                                    sched.classType === "Lecture"
                                      ? styles.lectureBlock
                                      : styles.labBlock;

                                  return (
                                    <div
                                      key={sched.courseCode}
                                      className={`${styles.scheduleBlock} ${blockColor}`}
                                      style={{
                                        gridRow: `${startIndex + 1} / ${endIndex + 1}`,
                                      }}
                                    >
                                      <div className={styles.blox}>{sched.courseCode}</div>
                                      <div className={styles.blox}>{sched.room}</div>
                                      <div className={styles.blox}>
                                        {sched.year}-{sched.section}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SchedManagement;
