import { useState, useEffect } from "react";

import styles from "/src/styles/DCSHeadDash.module.css";
import Header from "/src/components/AdminDashHeader.jsx";



function DCSHeadDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [announcement, setAnnouncement] = useState("");
  const [SideBar, setSideBar] = useState(false);

  
  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [SideBar]);

  const handleAddAnnouncement = () => {
    if (announcement.trim()) {
      setAnnouncements([...announcements, announcement]);
      setAnnouncement("");
    }
  };

  const handleDeleteAnnouncement = (index) => {
    const updatedAnnouncements = announcements.filter((_, i) => i !== index);
    setAnnouncements(updatedAnnouncements);
  };

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={`${styles.dashboard} container`}>
     

        {/* CONTENT */}
        <div className={`${styles.content} container`}>

        <div className={styles.inputSection}>
        <textarea
          className={styles.textarea}
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          placeholder="Write your announcement here..."
        />
        <button className={styles.addButton} onClick={handleAddAnnouncement}>
          Add Announcement
        </button>
      </div>

      <div className={styles.announcementList}>
        {announcements.map((item, index) => (
          <div key={index} className={styles.announcementItem}>
            <p>{item}</p>
            <button
              className={styles.deleteButton}
              onClick={() => handleDeleteAnnouncement(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
</div>

    </>
  );
}

export default DCSHeadDashboard;
