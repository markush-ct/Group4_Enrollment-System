import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "/src/styles/AdminDash.module.css";
import Header from "/src/components/StudentDashHeader.jsx";

// Set axios defaults globally if not done elsewhere
axios.defaults.withCredentials = true;

function RegIrregDashboard() {
  const [SideBar, setSideBar] = useState(false);
  const [accName, setAccName] = useState("");
  const navigate = useNavigate();

  // Manage body overflow when sidebar is toggled
  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [SideBar]);

  // Fetch account name if logged in
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
      .catch((err) => {
        console.error("Error fetching account name or validating session:", err.message);
      });
  }, [navigate]);

  return (
    <>
      {/* Header with Sidebar Toggle */}
      <Header SideBar={SideBar} setSideBar={setSideBar} />

      {/* Dashboard Content */}
      <div className={`${styles.dashboard} container`}>
        <h1 className={styles.greeting}>Hi {accName || "there"}!</h1>

        {/* Add additional dashboard content here */}
      </div>
    </>
  );
}

export default RegIrregDashboard;
