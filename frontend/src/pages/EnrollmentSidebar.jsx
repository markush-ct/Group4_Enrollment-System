import { useEffect, useState } from "react";
import styles from "/src/styles/Enrollment.module.css";
import Header from "/src/components/StudentDashHeader.jsx";

function EnrollmentSidebar() {
  const [SideBar, setSideBar] = useState(false);
  const [activeContainer, setActiveContainer] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  // CHECKLIST
  const [digitalChecklist, setDigitalChecklist] = useState({
    "1st Year": {
      "First Semester": [
        { code: "GNED 02", courseTitle: "Ethics", units: "3", grade: "", instructor: "" },
        { code: "GNED 05", courseTitle: "Purposive Communication", units: "3", grade: "", instructor: "" },
        { code: "GNED 11", courseTitle: "Konteskwalisadong Komunikasyon sa Filipino", units: "3", grade: "", instructor: "" },
        { code: "COSC 50", courseTitle: "Discrete Structures I", units: "3", grade: "", instructor: "" },
        { code: "DCIT 21", courseTitle: "Introduction to Computing", units: "3", grade: "", instructor: "" },
        { code: "DCIT 22", courseTitle: "Computer Programming I", units: "3", grade: "", instructor: "" },
        { code: "FITT 1", courseTitle: "Movement Enhancement", units: "2", grade: "", instructor: "" },
        { code: "NSTP 1", courseTitle: "National Service Training Program I", units: "3", grade: "", instructor: "" },
        { code: "CvSU 101", courseTitle: "Institutional Orientation", units: "1", grade: "", instructor: "" },
      ],
      "Second Semester": [
        { code: "GNED 01", courseTitle: "Art Appreciation", units: "3", grade: "", instructor: "" },
        { code: "GNED 03", courseTitle: "Mathematics in the Modern World", units: "3", grade: "", instructor: "" },
        { code: "GNED 06", courseTitle: "Science, Technology and Society", units: "3", grade: "", instructor: "" },
        { code: "GNED 12", courseTitle: "Dalumat Ng/Sa Filipino", units: "3", grade: "", instructor: "" },
        { code: "DCIT 23", courseTitle: "Computer Programming II", units: "3", grade: "", instructor: "" },
        { code: "ITEC 50", courseTitle: "Web Systems and Technologies", units: "3", grade: "", instructor: "" },
        { code: "FITT 2", courseTitle: "Fitness Exercise", units: "2", grade: "", instructor: "" },
        { code: "NSTP 2", courseTitle: "National Service Training Program 2", units: "3", grade: "", instructor: "" },
       
      ],
    },
    "2nd Year": {
      "First Semester": [
        { code: "GNED 02", courseTitle: "Ethics", units: "3", grade: "", instructor: "" },
        { code: "GNED 05", courseTitle: "Purposive Communication", units: "3", grade: "", instructor: "" },
        { code: "GNED 11", courseTitle: "Konteskwalisadong Komunikasyon sa Filipino", units: "3", grade: "", instructor: "" },
        { code: "COSC 50", courseTitle: "Discrete Structures I", units: "3", grade: "", instructor: "" },
        { code: "DCIT 21", courseTitle: "Introduction to Computing", units: "3", grade: "", instructor: "" },
        { code: "DCIT 22", courseTitle: "Computer Programming I", units: "3", grade: "", instructor: "" },
        { code: "FITT 1", courseTitle: "Movement Enhancement", units: "2", grade: "", instructor: "" },
        { code: "NSTP 1", courseTitle: "National Service Training Program I", units: "3", grade: "", instructor: "" },
        { code: "CvSU 101", courseTitle: "Institutional Orientation", units: "1", grade: "", instructor: "" },
      ],
      "Second Semester": [
        { code: "GNED 01", courseTitle: "Art Appreciation", units: "3", grade: "", instructor: "" },
        { code: "GNED 03", courseTitle: "Mathematics in the Modern World", units: "3", grade: "", instructor: "" },
        { code: "GNED 06", courseTitle: "Science, Technology and Society", units: "3", grade: "", instructor: "" },
        { code: "GNED 12", courseTitle: "Dalumat Ng/Sa Filipino", units: "3", grade: "", instructor: "" },
        { code: "DCIT 23", courseTitle: "Computer Programming II", units: "3", grade: "", instructor: "" },
        { code: "ITEC 50", courseTitle: "Web Systems and Technologies", units: "3", grade: "", instructor: "" },
        { code: "FITT 2", courseTitle: "Fitness Exercise", units: "2", grade: "", instructor: "" },
        { code: "NSTP 2", courseTitle: "National Service Training Program 2", units: "3", grade: "", instructor: "" },
       
      ],
    },
  });

  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [SideBar]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const updateChecklistField = (year, semester, index, field, value) => {
    const updatedChecklist = { ...digitalChecklist };
    updatedChecklist[year][semester][index][field] = value;
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

        {/* Horizontal Row of Containers */}
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

        {/* Super Container */}
        <div className={styles.superContainer}>
          {activeContainer ? (
            <>
              <h3 className={styles.superContainerTitle}>{activeContainer}</h3>
              <div className={styles.superContainerContent}>
                {activeContainer === "Requirements Submission" && (
                  <>
                    <div className={styles.Contentt}>
                      <p className={styles.Title}>Certification of Grades (COG)</p>
                      <label className={styles.uploadLabel}>
                        Upload COG:
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                      {uploadedImage && (
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className={styles.uploadedImage}
                        />
                      )}

                      <p className={styles.Title}>Digital Checklist</p>
                      {Object.keys(digitalChecklist).map((year) => (
                        <div className={styles.Contentt} key={year}>
                          <h4 className={styles.yearTitle}>{year}</h4>
                          {Object.keys(digitalChecklist[year]).map((semester) => (
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
                                  {digitalChecklist[year][semester].map((item, index) => (
                                    <tr key={index}>
                                      <td>{item.code}</td>
                                      <td>{item.courseTitle}</td>
                                      <td>{item.units}</td>
                                      <td>
                                        <input
                                          type="text"
                                          value={item.grade}
                                          onChange={(e) =>
                                            updateChecklistField(year, semester, index, "grade", e.target.value)
                                          }
                                          className={styles.tableInput}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          value={item.instructor}
                                          onChange={(e) =>
                                            updateChecklistField(year, semester, index, "instructor", e.target.value)
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
                {activeContainer === "Society Fee Status" && (
                  <p className={styles.Text}>DI KAPA BAYAD TOL</p>
                )}
                {activeContainer === "Advising" && (
                  <p className={styles.Text}>Get advising details here.</p>
                )}
                {activeContainer === "Pre-Enrollment Form" && (
                  <p className={styles.Text}>CONTENT</p>
                )}
                {activeContainer === "Enrollment Status" && (
                  <p className={styles.Text}>CONTENT</p>
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
