import { useEffect, useState } from "react";
import styles from "/src/styles/Enrollment.module.css";
import Header from "/src/components/StudentDashHeader.jsx";

function EnrollmentSidebar() {
  const [SideBar, setSideBar] = useState(false);
  const [activeContainer, setActiveContainer] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

// INITIALIZER
  const studentProgram = "CS"; 


  const [digitalChecklist, setDigitalChecklist] = useState({
    CS: {
      "1st Year": {
        "First Semester": [
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },


        ],
        "Second Semester": [
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
        ],
      },

      "2nd Year": {
        "First Semester": [
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },


        ],
        "Second Semester": [
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
        ],
      },

      "3rd Year": {
        "First Semester": [
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },


        ],
        "Second Semester": [
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
        ],
      },
      "Mid Year": {
        "First Semester": [
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
         

        ],
        "Second Semester": [
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
        ],
      },

      "4TH Year": {
        "First Semester": [
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },


        ],
        "Second Semester": [
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
        ],
      },
      
    },
    IT: {
      "1st Year": {
        "First Semester": [
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },


        ],
        "Second Semester": [
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
        ],
      },

      "2nd Year": {
        "First Semester": [
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },


        ],
        "Second Semester": [
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
        ],
      },
    },
    "Mid Year": {
      "First Semester": [
        { code: "CS", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
       

      ],

      "3rd Year": {
        "First Semester": [
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },


        ],
        "Second Semester": [
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
        ],
      },
      

      "4TH Year": {
        "First Semester": [
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },


        ],
        "Second Semester": [
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
          { code: "IT", courseTitle: "WALANG MATUTULOG", units: "3", grade: "", instructor: "" },
        ],
      },
      
    },
  });

  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [SideBar]);

  

  const updateChecklistField = (program, year, semester, index, field, value) => {
    const updatedChecklist = { ...digitalChecklist };
    updatedChecklist[program][year][semester][index][field] = value;
    setDigitalChecklist(updatedChecklist);
  };

  const handleContainerClick = (containerName) => {
    setActiveContainer(containerName);
  };

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.contentSection}>
        <div className={styles.PageTitle}>Enrollment</div>

      

        {/* BUTTONS */}
        <div className={styles.containers}>
          <div
            className={styles.container}
            onClick={() => handleContainerClick("Society Fee Status")}
          >
            <div className={styles.containerTitle}>Society Fee Status</div>
          </div>

          <div
            className={styles.container}
            onClick={() => handleContainerClick("Requirements Submission")}
          >
            <div className={styles.containerTitle}>Requirements Submission</div>
          </div>

          <div
            className={styles.container}
            onClick={() => handleContainerClick("Advising")}
          >
            <div className={styles.containerTitle}>Advising</div>
          </div>

          <div
            className={styles.container}
            onClick={() => handleContainerClick("Pre-Enrollment Form")}
          >
            <div className={styles.containerTitle}>Pre-Enrollment Form</div>
          </div>

          <div
            className={styles.container}
            onClick={() => handleContainerClick("Enrollment Status")}
          >
            <div className={styles.containerTitle}>Enrollment Status</div>
          </div>
        </div>

        {/* CONTENTS */}
        <div className={styles.superContainer}>
          {activeContainer ? (
            <>
              <h3 className={styles.superContainerTitle}>{activeContainer}</h3>
              <div className={styles.superContainerContent}>
                {activeContainer === "Requirements Submission" && (
                  <>
                    <div className={styles.Contentt}>
                      <p className={styles.Title}>Digital Checklist</p>
                      {Object.keys(digitalChecklist[studentProgram]).map((year) => (
                        <div className={styles.Contentt} key={year}>
                          <h4 className={styles.yearTitle}>{year}</h4>
                          {Object.keys(digitalChecklist[studentProgram][year]).map((semester) => (
                            <div className={styles.Contentt} key={semester}>
                              <h5 className={styles.semesterTitle}>{semester}</h5>
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
                                  {digitalChecklist[studentProgram][year][semester].map((item, index) => (
                                    <tr key={index}>
                                      <td>{item.code}</td>
                                      <td>{item.courseTitle}</td>
                                      <td>{item.units}</td>
                                      <td>
                                        <input
                                          type="text"
                                          value={item.grade}
                                          onChange={(e) =>
                                            updateChecklistField(
                                              studentProgram,
                                              year,
                                              semester,
                                              index,
                                              "grade",
                                              e.target.value
                                            )
                                          }
                                          className={styles.tableInput}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          value={item.instructor}
                                          onChange={(e) =>
                                            updateChecklistField(
                                              studentProgram,
                                              year,
                                              semester,
                                              index,
                                              "instructor",
                                              e.target.value
                                            )
                                          }
                                          className={styles.tableInput}
                                        />
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
                )}
              </div>
            </>
          ) : (
            <p className={styles.superContainerPlaceholder}>
              Click a section above to view details.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default EnrollmentSidebar;
