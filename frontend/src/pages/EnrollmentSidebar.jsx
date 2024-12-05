import { useEffect, useState } from "react";
import styles from "/src/styles/EnrollmentForm.module.css";
import Header from "/src/components/StudentDashHeader.jsx";

function CurriculumChecklist() {
  const [SideBar, setSideBar] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const availableCourses = [
    "COSC 101",
    "DCIT 22",
    "COSC 75",
    "MATH 2",
    "COSC 80",
    "COSC 85",
    "COSC 70",
    "DCIT 50",
  ];

  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [SideBar]);

  const toggleCourseSelection = (course) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.includes(course)
        ? prevSelectedCourses.filter((c) => c !== course)
        : [...prevSelectedCourses, course]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Courses:", selectedCourses);
    alert("Curriculum submitted successfully!");
  };

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.contentSection}>
        <div className={styles.PageTitle}>Curriculum Checklist</div>
        <form className={styles.curriculumForm} onSubmit={handleSubmit}>
          <div className={styles.courseList}>
            {availableCourses.map((course, index) => (
              <div key={index} className={styles.courseItem}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course)}
                    onChange={() => toggleCourseSelection(course)}
                  />
                  {course}
                </label>
              </div>
            ))}
          </div>
          <button type="submit" className={styles.submitButton}>
            Submit Curriculum
          </button>
        </form>
      </div>
    </>
  );
}

export default CurriculumChecklist;
