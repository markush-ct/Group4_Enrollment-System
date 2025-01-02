import { useEffect, useState } from "react";
import styles from "/src/styles/StudentChecklist.module.css";
import Header from "/src/components/StudentDashHeader.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentChecklist() {
  const [SideBar, setSideBar] = useState(false);
  const [accName, setAccName] = useState("");
  const [checklistData, setChecklistData] = useState([]);

  useEffect(() => {
    // Fetch the checklist data
    axios
      .get('http://localhost:8080/viewStudentChecklist')
      .then((response) => {
        if (response.data.message === 'Success') {
          setChecklistData(response.data.checklistData);
        } else {
          alert(response.data.message);
        }
      })
      .catch((err) => {
        alert('An error occurred while fetching data.');
        console.error(err);
      });
  }, []);

  // Group data by YearLevel and Semester
  const groupedByYearAndSemester = checklistData.reduce((acc, course) => {
    const { yearLevel, semester } = course;

    // Initialize year level object if it doesn't exist
    if (!acc[yearLevel]) {
      acc[yearLevel] = {};
    }

    // Initialize semester array if it doesn't exist for the year level
    if (!acc[yearLevel][semester]) {
      acc[yearLevel][semester] = [];
    }

    // Add the course to the corresponding year level and semester
    acc[yearLevel][semester].push(course);
    return acc;
  }, {});

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



  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.contentSection}>
        <h2 className={styles.PageTitle}>Student Checklist</h2>
        {Object.keys(groupedByYearAndSemester).map((yearLevel) => (
        <div className={styles.Contentt} key={yearLevel}>
          <h4>{yearLevel}</h4>
          {Object.keys(groupedByYearAndSemester[yearLevel]).map((semester) => (
            <div className={styles.Contentt} key={semester}>
              <h5>{semester || ""}</h5>
              <table className={styles.checklistTable}>
                <thead>
                  <tr>
                    <th colSpan="2">COURSE</th>
                    <th colSpan="2">CREDIT UNIT</th>
                    <th colSpan="2">CONTACT HRS.</th>
                    <th rowSpan="2">PRE-REQUISITE</th>
                    <th rowSpan="2">SY TAKEN</th>
                    <th rowSpan="2">FINAL GRADE</th>
                    <th rowSpan="2">INSTRUCTOR</th>
                  </tr>
                  <tr>
                    <th>CODE</th>
                    <th>TITLE</th>
                    <th>Lec</th>
                    <th>Lab</th>
                    <th>Lec</th>
                    <th>Lab</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedByYearAndSemester[yearLevel][semester].map((course, index) => (
                    <tr key={index}>
                      <td>{course.courseDetails.code}</td>
                      <td>{course.courseDetails.title}</td>
                      <td>{course.courseDetails.creditLec === 0 ? '' : course.courseDetails.creditLec}</td>
                      <td>{course.courseDetails.creditLab === 0 ? '' : course.courseDetails.creditLab}</td>
                      <td>{course.courseDetails.contactHrsLec === 0 ? '' : course.courseDetails.contactHrsLec}</td>
                      <td>{course.courseDetails.contactHrsLab === 0 ? '' : course.courseDetails.contactHrsLab}</td>
                      <td>{course.courseDetails.preReq || ''}</td>
                      <td>{course.syTaken}</td>
                      <td>{course.finalGrade}</td>
                      <td>{course.instructor}</td>
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
