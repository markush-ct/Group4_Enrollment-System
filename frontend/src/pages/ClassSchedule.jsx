import { useEffect, useState } from "react";
import styles from "/src/styles/ClassSchedule.module.css";
import Header from "/src/components/StudentDashHeader.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';

function ClassSchedule() {
  const [SideBar, setSideBar] = useState(false);
  const [activeDay, setActiveDay] = useState("All"); // DEFAULT 

   {/* FOR ANIMATION */ }
   useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // EXAMPLE SCHED
  const scheduleData = {
    Monday: [
      {
        time: "4:00 PM - 5:00 PM",
        subject: "DCIT 26 - Applications Dev't and Emerging Technologies",
        instructor: "Mikaela Arciaga",
        room: "Room 301",
        type: "Lecture",
      },
      {
        time: "5:00 PM - 7:00 PM",
        subject: "DCIT 26 - Applications Dev't and Emerging Technologies",
        instructor: "Mikaela Arciaga",
        room: "Computer Lab 5",
        type: "Laboratory",
      },
    ],
    Tuesday: [],
    Wednesday: [
      {
        time: "12:00 AM - 2:00 PM",
        subject: "COSC 101 - Mechanics",
        instructor: "Lawrence Jimenez",
        room: "Computer Lab 5",
        type: "Laboratory",
      },
    ],
    Thursday: [],
    Friday: [],
    Saturday: [],
  };

  const renderDaySchedule = (day) => {
    if (scheduleData[day].length === 0) {
      return (
        <div className={styles.scheduleCard}>
          <div className={styles.scheduleDay}>{day.toUpperCase()}</div>
          <p className={styles.noSchedule}>No schedules for this day.</p>
        </div>
      );
    }

    return scheduleData[day].map((schedule, index) => (
      <div data-aos="fade-up"
        key={index}
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
    ));
  };

  const renderFullScheduleContainers = () => {
    return (
      <div data-aos="fade-up" className={styles.scheduleCardContainer}>
        {Object.entries(scheduleData).flatMap(([day, schedules]) =>
          schedules.map((schedule, index) => (
            <div
              key={`${day}-${index}`}
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

        {/* DAY NAV */}
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
        <div data-aos="fade-up" className={styles.scheduleContainer}>
          {activeDay === "All" ? renderFullScheduleContainers() : renderDaySchedule(activeDay)}
        </div>

        
      </div>
    </>
  );
}

export default ClassSchedule;
