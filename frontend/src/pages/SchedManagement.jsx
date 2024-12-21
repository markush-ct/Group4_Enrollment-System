import { useState, useEffect } from "react";
import Header from "/src/components/AdminDashHeader.jsx";
import styles from "/src/styles/SchedManagement.module.css";
import AOS from "aos";
import "aos/dist/aos.css";

function SchedManagement() {
  const [SideBar, setSideBar] = useState(false);
  const [errorPrompt, setErrorPrompt] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [viewMode, setViewMode] = useState("table"); 
  const [popUpVisible, setPopUpVisible] = useState(false); 
  const [selectedSection, setSelectedSection] = useState(""); 

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section); // section
    setPopUpVisible(true); 
  };

  const closePopup = () => {
    setPopUpVisible(false); 
    setSelectedSection(""); 
  };

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
              <input
                type="text"
                name="courseCode"
                placeholder="Course Code"
                value={formData.courseCode}
                onChange={handleInputChange}
              />
              <select name="day" value={formData.day} onChange={handleInputChange}>
                <option value="">Select Day</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select name="startTime" value={formData.startTime} onChange={handleInputChange}>
                <option value="">Start Time</option>
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <select name="endTime" value={formData.endTime} onChange={handleInputChange}>
                <option value="">End Time</option>
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="room"
                placeholder="Room"
                value={formData.room}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="year"
                placeholder="Year"
                value={formData.year}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="section"
                placeholder="Section"
                value={formData.section}
                onChange={handleInputChange}
              />
              <select name="classType" value={formData.classType} onChange={handleInputChange}>
                <option value="">Class Type</option>
                <option value="Lecture">Lecture</option>
                <option value="Laboratory">Laboratory</option>
              </select>
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

      {/* calendar */}
      <div data-aos="fade-up" className={styles.detailsSection}>
        <div className={styles.table}>
          <div className={styles.header}>
            <div className={styles.th}>Time</div>
            {days.map((day) => (
              <div className={styles.th} key={day}>{day}</div>
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
                    <div key={day} className={styles.dayCell}>
                      {schedule
                        .filter(
                          (sched) =>
                            sched.day === day &&
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
