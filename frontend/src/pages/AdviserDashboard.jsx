import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import styles from "/src/styles/AdminDash.module.css";
import Header from "/src/components/AdminDashHeader.jsx";

// Chart.js 
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
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

function AdviserDashboard() {
  const [SideBar, setSideBar] = useState(false);
  const [accName, setAccName] = useState("");
  const navigate = useNavigate();

 
  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [SideBar]);


  useEffect(() => {
    axios.defaults.withCredentials = true;
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
        console.error("Error validating user session:", err);
      });
  }, [navigate]);

  // LINE CHART 
  const lineData = useMemo(
    () => ({
      labels: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
      datasets: [
        {
          label: "Yearly Student Population",
          data: [10, 30, 50, 70, 100, 150, 180],
          fill: true,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    }),
    []
  );

  const lineOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { beginAtZero: true },
        y: { beginAtZero: true },
      },
      plugins: {
        legend: { display: true, position: "top" },
      },
    }),
    []
  );

  // BILOG NA ANO
  const doughnutData = useMemo(
    () => ({
      labels: ["Alliance of Computer Science", "Information Technology Society"],
      datasets: [
        {
          label: "Sales by Category",
          data: [45, 55],
          backgroundColor: ["#d9534f", "#5cb85c"],
          hoverBackgroundColor: ["#c9302c", "#4cae4c"],
          borderWidth: 2,
        },
      ],
    }),
    []
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

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={`${styles.dashboard} container`}>
        <h1 className={styles.greeting}>Hi {accName || "Loading..."}</h1>

        {/* CONTENT */}
        <div className={`${styles.content} container`}>
          {/* STYATS */}
          <div className={`${styles.statCards} container`}>
            <div className={`${styles.statCard} ${styles.computerScience}`}>
              <h3>Computer Science</h3>
              <p>80</p>
            </div>
            <div className={`${styles.statCard} ${styles.informationTechnology}`}>
              <h3>Information Technology</h3>
              <p>100</p>
            </div>
          </div>

          {/* CHARTS */}
          <div className={`${styles.charts} container`}>
            {/* LINE CHARTS */}
            <div className={styles.chart}>
              <h3>DCS Yearly Student Population</h3>
              <div className={styles.chartContainer}>
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
            
            {/* BILOG NA ANO */}
            <div className={styles.chart}>
              <h3>Sales by Category</h3>
              <div className={styles.chartContainer}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdviserDashboard;
