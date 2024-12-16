import { useState, useEffect } from "react";
import Header from '/src/components/AdminDashHeader.jsx';
import styles from "/src/styles/SchedManagement.module.css";

function SchedManagement() {

      const [SideBar, setSideBar] = useState(false);

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
    classType: "", // Added class type
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const { courseCode, startTime, endTime, room, year, section, day, classType } = formData;
    return courseCode && startTime && endTime && room && year && section && day && classType;
  };

  const hasTimeConflict = () => {
    const { day, startTime, endTime } = formData;
    const startIndex = times.indexOf(startTime);
    const endIndex = times.indexOf(endTime);

    return schedule.some(
      (sched) =>
        sched.day === day &&
        times.indexOf(sched.startTime) < endIndex &&
        times.indexOf(sched.endTime) > startIndex
    );
  };

  const addSchedule = () => {
    const { startTime, endTime } = formData;

    if (!isFormValid()) {
      alert("Please fill out all fields.");
      return;
    }

    if (times.indexOf(startTime) >= times.indexOf(endTime)) {
      alert("Start Time must be earlier than End Time.");
      return;
    }

    if (hasTimeConflict()) {
      alert("Schedule conflict detected. Please choose a different time.");
      return;
    }

    setSchedule((prev) => [...prev, formData]);

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

  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [SideBar]);

  return (
     <>
          <Header SideBar={SideBar} setSideBar={setSideBar} />
    <div className={styles.contentSection}>
            <div className={styles.PageTitle}>
              Schedule Management
            </div>
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
            <span>ADD SCHEDULE</span>
          </button>
        </div>
      </div>
      <div className={styles.table}>
        <div className={styles.header}>
          <div className={styles.th}>Time</div>
          {days.map((day) => (
            <div className={styles.th} key={day}>{day}</div>
          ))}
        </div>
        <div className={styles.body}>
          {times.map((time, rowIndex) => {
            const nextTime = times[rowIndex + 1] || "08:00 PM";
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
                          times.indexOf(sched.startTime) === rowIndex
                      )
                      .map((sched) => {
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
                              gridRow: `span ${endIndex - rowIndex}`,
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
      {schedule.length === 0 && (
        <p className={styles.noSchedule}>No schedules added yet. Start by adding a new one!</p>
      )}
    </div>
    </>
  );
}

export default SchedManagement;
