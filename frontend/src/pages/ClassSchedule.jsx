import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import styles from "/src/styles/ClassSchedule.module.css"; // Your styles should be imported after the default styles
import Header from "/src/components/StudentDashHeader.jsx";

function ClassSchedule() {
  const [SideBar, setSideBar] = useState(false);
  const [date, setDate] = useState(new Date());

  // Predefined schedules
  const schedules = [
    { date: "Wed Nov 29 2024", event: "Math Class at 10:00 AM" },
    { date: "Thu Nov 30 2024", event: "Science Fair at 12:00 PM" },
    { date: "Fri Dec 01 2024", event: "History Lecture at 2:00 PM" },
  ];

  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [SideBar]);

  const getSchedulesForDate = (selectedDate) => {
    return schedules.filter((schedule) => schedule.date === selectedDate.toDateString());
  };

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.contentSection}>
        <div className={styles.PageTitle}>Class Schedule</div>

        <div className={styles.classSchedule}>
          <Calendar onChange={setDate} value={date} />
          <div className={styles.scheduleDetails}>
            <h3>Schedules for {date.toDateString()}</h3>
            <ul className={styles.scheduleList}>
              {getSchedulesForDate(date).length > 0 ? (
                getSchedulesForDate(date).map((schedule, index) => (
                  <li key={index}>{schedule.event}</li>
                ))
              ) : (
                <li>No schedules for this date.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClassSchedule;
