import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "/src/styles/AdminDash.module.css";
import Header from "/src/components/AdminDashHeader.jsx";


function FreshmanDashboard() {
  const [SideBar, setSideBar] = useState(false);
  const [accName, setAccName] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [SideBar]);



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

  


  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={`${styles.dashboard} container`}>
        <h1 className={styles.greeting}>Hi {accName || "Loading..."}</h1>

        {/* CONTENT */}
      </div>
   
    </>
  );
}

export default FreshmanDashboard;
