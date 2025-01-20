import { useEffect, useState } from "react";
import styles from "/src/styles/ClassSchedule.module.css";
import Header from "/src/components/StudentDashHeader.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ClassSchedule() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  const [SideBar, setSideBar] = useState(false);
  const [activeDay, setActiveDay] = useState("All"); // Default to "All"
  const [accName, setAccName] = useState("");
  const [scheduleData, setScheduleData] = useState({});

  // Initialize animation
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  // Get user session info
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get(`${backendUrl}/session`)
      .then((res) => {
        if (res.data.valid) {
          setAccName(res.data.name);
        } else {
          navigate("/LoginPage");
        }
      })
      .catch((err) => {
        console.error("Error validating user session:", err);
      });
  }, []);

  // Fetch schedule data
  useEffect(() => {
    axios.get(`${backendUrl}/viewSched/regirreg`)
      .then((res) => {
        if (res.data.message === "Success") {
          const schedules = res.data.schedInfo.reduce((acc, item) => {
            const day = item.Day || "Unknown"; // Default if no day provided
            if (!acc[day]) acc[day] = [];
            acc[day].push({
              time: `${item.StartTime} - ${item.EndTime}`,
              subject: `${item.CourseCode} - ${item.CourseTitle}`,
              instructor: item.InstructorName,
              room: item.Room,
              type: item.ClassType,
            });
            return acc;
          }, {});
          setScheduleData(schedules);
        } else {
          setScheduleData({});
        }
      })
      .catch((err) => {
        console.error("Error fetching schedule:", err);
        alert("Error fetching schedule");
      });
  }, []); // Only runs once on component mount

  // Format time function
  function formatTime(time) {
    const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const formattedTime = `${currentDate}T${time}`; // Combine current date with the time
    const validDate = new Date(formattedTime); // Create a valid Date object
    return validDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format the time
  }

  // Render schedule for a specific day
  const renderDaySchedule = (day) => {
    // Check if scheduleData[day] exists and is an array
    if (!scheduleData[day] || scheduleData[day].length === 0) {
      return (
        <div className={styles.scheduleCard}>
          <div className={styles.scheduleDay}>{day.toUpperCase()}</div>
          <p className={styles.noSchedule}>No schedules for this day.</p>
        </div>
      );
    }

    return scheduleData[day].map((schedule, index) => (
      <div data-aos="fade-up"
        key={`${day}-${schedule.subject}-${index}`} // Unique key
        className={`${styles.scheduleCard} ${
          schedule.type === "Lecture" ? styles.primaryBorder : styles.secondaryBorder
        }`}
      >
        <div className={styles.scheduleDay}>{day.toUpperCase()}</div>
        <div className={styles.scheduleContent}>
          <div className={styles.scheduleSubject}>{schedule.subject}</div>
          <div className={styles.scheduleInstructor}>{schedule.instructor}</div>
          <div className={styles.scheduleTime}>
            {formatTime(schedule.time.split(' - ')[0])} - {formatTime(schedule.time.split(' - ')[1])}
          </div>
          <div className={styles.scheduleLocation}>{schedule.room}</div>
        </div>
      </div>
    ));
  };

  // Render full schedule for "All" day
  const renderFullScheduleContainers = () => {
    return (
      <div data-aos="fade-up" className={styles.scheduleCardContainer}>
        {Object.entries(scheduleData).flatMap(([day, schedules]) =>
          schedules.map((schedule, index) => (
            <div
              key={`${day}-${schedule.subject}-${index}`} // Unique key
              className={`${styles.scheduleCard} ${
                schedule.type === "Lecture" ? styles.primaryBorder : styles.secondaryBorder
              }`}
            >
              <div className={styles.scheduleDay}>{day.toUpperCase()}</div>
              <div className={styles.scheduleContent}>
                <div className={styles.scheduleSubject}>{schedule.subject}</div>
                <div className={styles.scheduleInstructor}>{schedule.instructor}</div>
                <div className={styles.scheduleTime}>{schedule.time}</div>
                <div className={styles.scheduleLocation}>{schedule.room}</div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div data-aos="fade-up" className={styles.contentSection}>
        <div className={styles.PageTitle}>CLASS SCHEDULE</div>

        {/* Day Navigation */}
        <div className={styles.tabs}>
          {[
            { full: "All", short: "All" },
            { full: "Monday", short: "Mon" },
            { full: "Tuesday", short: "Tue" },
            { full: "Wednesday", short: "Wed" },
            { full: "Thursday", short: "Thu" },
            { full: "Friday", short: "Fri" },
            { full: "Saturday", short: "Sat" },
          ].map((day) => (
            <button
              key={day.full}
              className={`${styles.tab} ${
                activeDay === day.full ? styles.activeTab : ""
              }`}
              onClick={() => setActiveDay(day.full)}
            >
              {day.short}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.primaryBorder}`}></span>
            Lecture
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.secondaryBorder}`}></span>
            Laboratory
          </div>
        </div>

        {/* Schedule Display */}
        {Object.keys(scheduleData).length > 0 ? (
          <div data-aos="fade-up" className={styles.scheduleContainer}>
            {activeDay === "All" ? renderFullScheduleContainers() : renderDaySchedule(activeDay)}
          </div>
        ) : (
          <div className={styles.noScheduleMessage}>No schedule</div>
        )}
      </div>
    </>
  );
}

export default ClassSchedule;
