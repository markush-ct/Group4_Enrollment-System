import { useEffect, useState } from "react";
import styles from "/src/styles/StudentChecklist.module.css";
import Header from "/src/components/StudentDashHeader.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentChecklist() {
  const [SideBar, setSideBar] = useState(false);

  const [digitalChecklist, setDigitalChecklist] = useState({
    CS: {
      "1st Year": {
        "First Semester": [
          { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
          { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
          { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
          { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
          { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
          { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
        ],
        "Second Semester": [
            { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
            { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
            { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
            { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
            { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
            { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
        ],
    },
   
      "2nd Year": {
        "First Semester": [
          { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
          { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
          { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
          { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
          { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
          { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
        ],
        "Second Semester": [
            { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
            { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
            { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
            { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
            { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
            { code: "CS101", courseTitle: "CS Elective", units: "3", grade: "1.00", instructor: "Kai Sotto" },
        ],
      },
    },
  });

  const navigate = useNavigate();


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
        console.error("Error validating user session:", err);
      });
  }, [navigate]);

  


  const updateChecklistField = (program, year, semester, index, field, value) => {
    const updatedChecklist = { ...digitalChecklist };
    updatedChecklist[program][year][semester][index][field] = value;
    setDigitalChecklist(updatedChecklist);
  };

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.contentSection}>
        <h2 className={styles.PageTitle}>Student Checklist</h2>
        {Object.keys(digitalChecklist["CS"]).map((year) => (
          <div className={styles.Contentt} key={year}>
            <h4>{year}</h4>
            {Object.keys(digitalChecklist["CS"][year]).map((semester) => (
              <div className={styles.Contentt} key={semester}>
                <h5>{semester}</h5>
                <table className={styles.checklistTable}>
                  <thead>
                    <tr>
                      <th>COURSE CODE</th>
                      <th>COURSE TITLE</th>
                      <th>UNITS</th>
                      <th>FINAL GRADE</th>
                      <th>INSTRUCTOR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {digitalChecklist["CS"][year][semester].map((item, index) => (
                      <tr key={index}>
                        <td>{item.code}</td>
                        <td>{item.courseTitle}</td>
                        <td>{item.units}</td>
                        <td>
                          {item.grade}
                            
                        </td>
                        <td>
                          {item.instructor}
                            
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default StudentChecklist;
