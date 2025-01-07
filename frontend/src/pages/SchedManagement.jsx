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
  const [filterType, setFilterType] = useState("");

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
  const times = Array.from({ length: 15 }, (_, i) => {
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
        if (res.data.message === "Success") {
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

  const [schedInfo, setSchedInfo] = useState([]);

  const handleSectionClick = (request) => {
    setSelectedSection(request);

    axios.post('http://localhost:8080/getClassSched/popup', {
      year: request.YearLevel,
      section: request.Section
    })
      .then((res) => {
        if (res.data.message === "Success") {
          const { schedInfo } = res.data;
          setSchedInfo(schedInfo);

          schedInfo.map((row, index) => {
            console.log(`Row ${index}:`, row);
          });

          setPopUpVisible(true);
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

  const closePopup = () => {
    setPopUpVisible(false);
    setSelectedSection("");
  };

  //FETCH COURSES (COURSE CODE)
  const [courses, setCourses] = useState([]);

  useEffect(() => {

    Promise.all([
      axios.get('http://localhost:8080/getOptionsForSched'),
      axios.get('http://localhost:8080/getClassSched/table'),
    ])
      .then((res) => {
        if (res[0].data.message === "Success") {
          setCourses(res[0].data.courseData);
          setErrorMsg("");
          setErrorPrompt(false);
        } else {
          setErrorMsg("Error fetching courses");
          setErrorPrompt(true);
        }

        if (res[1].data.message === "Success") {
          setSchedule(res[1].data.sections);
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
  }, [schedule]);

  const filteredSchedule = filterType
    ? schedule.filter(
        (sched) => `${sched.YearLevel} - ${sched.Section}` === filterType
      )
    : schedule;

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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Sections</option> {/* Option to reset the filter */}
        {schedule.map((sched, index) => (
          <option value={`${sched.YearLevel} - ${sched.Section}`} key={index}>
            {`${sched.YearLevel} - ${sched.Section}`}
          </option>
        ))}
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
                {filteredSchedule.length > 0 ? (
                  filteredSchedule.map((sched, index) => (
                    <tr key={index} onClick={() => handleSectionClick(sched)}>
                      <td>{sched.YearLevel}</td>
                      <td>{sched.Section}</td>
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
                <span>{schedInfo[0]?.ProgramID === 1 ? "BSCS" : "BSIT"} {selectedSection.YearLevel === "First Year" ? 1
                  : selectedSection.YearLevel === "Second Year" ? 2
                    : selectedSection.YearLevel === "Third Year" ? 3
                      : selectedSection.YearLevel === "Fourth Year" ? 4
                        : ""} - {selectedSection.Section}</span>
              </div>

              {/* Calendar */}
              <div data-aos="fade-up" className={styles.detailsSection}>
                {schedInfo && schedInfo.length > 0 ? (
                  <div className={styles.table}>
                    <div className={styles.header}>
                      <div className={styles.th}>Time</div>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                        <div className={styles.th} key={day}>
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className={styles.body}>
                      {times.map((time, rowIndex) => {
                        const nextTime = times[rowIndex + 1] || "21:00 PM";
                        const timeRange = `${time} - ${nextTime}`;

                        return (
                          <div key={`${time}-${rowIndex}`} className={styles.timeRow}>
                            <div className={styles.timeCell}>{timeRange}</div>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                              <div key={day} className={styles.dayCell}>
                                {schedInfo
                                  .filter(
                                    (sched) =>
                                      sched.Day === day &&
                                      sched.StartTime <= time &&
                                      sched.EndTime > time
                                  )
                                  .map((sched, index) => (
                                    <div
                                      key={`${sched.CourseCode}-${index}`}
                                      className={`${styles.scheduleBlock} ${sched.ClassType === "Lecture" ? styles.lectureBlock : styles.labBlock
                                        }`}
                                    >
                                      <div className={styles.blox}>{sched.CourseCode}</div>
                                      <div className={styles.blox}>{sched.Room}</div>
                                      <div className={styles.blox}>{sched.InstructorName}</div>
                                      <div className={styles.blox}>{selectedSection.YearLevel === "First Year" ? 1
                                        : selectedSection.YearLevel === "Second Year" ? 2
                                          : selectedSection.YearLevel === "Third Year" ? 3
                                            : selectedSection.YearLevel === "Fourth Year" ? 4
                                              : ""} - {selectedSection.Section}</div>
                                    </div>
                                  ))}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>No schedule data available</div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SchedManagement;