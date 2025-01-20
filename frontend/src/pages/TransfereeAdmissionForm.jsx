import { useState, useEffect } from 'react';
import Header from '/src/components/StudentDashHeader.jsx';
import { Stepper, Step, StepLabel } from '@mui/material';
import styles from '/src/styles/AdmissionForm.module.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import admissionIcon from '/src/assets/admission-icon.png';
import personalIcon from '/src/assets/personal-icon.png';
import famIcon from '/src/assets/family-icon.png';
import educIcon from '/src/assets/education-icon.png';
import medIcon from '/src/assets/medical-icon.png';
import calendarIcon from '/src/assets/calendar-icon.png';
import pendingIcon from "/src/assets/pending-icon.png";
import errormark from "/src/assets/errormark.png";

function FreshmenAdmissionForm() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  const [accName, setAccName] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [errorPrompt, setErrorPrompt] = useState(false); //errors
  const [isSaving, setIsSaving] = useState(false);
  const [prefProgram, setPrefProgram] = useState("");
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [studentID, setStudentID] = useState(""); //Will store student ID to use as a reference for download page of admission form

  const [formData, setFormData] = useState({
    applyingFor: '',
    applicantType: 'Transferee',
    preferredCampus: 'CvSU - Bacoor',
    idPicture: null, // For file upload
    idPictureUrl: '',
    firstName: '',
    middleName: '',
    lastName: '',
    zipCode: '',
    permanentAddress: '',
    email: '',
    lrn: '',
    contactNumber: '',
    sex: '',
    age: '',
    dateOfBirth: '',
    religion: '',
    nationality: '',
    civilStatus: '',
    isPWD: '',
    pwd: '',
    isIndigenous: '',
    indigenous: '',
    fatherName: '',
    motherName: '',
    guardianName: '',
    fatherContact: '',
    motherContact: '',
    guardianContact: '',
    fatherOccupation: '',
    motherOccupation: '',
    guardianOccupation: '',
    guardianRelationship: '',
    siblings: '',
    birthOrder: '',
    familyIncome: '',
    elementarySchool: '',
    elementaryAddress: '',
    elementaryYearGraduated: '',
    elementarySchoolType: '',
    highSchool: '',
    jhsAddress: '',
    jhsYearGraduated: '',
    highSchoolType: '',
    seniorHighSchool: '',
    seniorHighAddress: '',
    seniorHighYearGraduated: '',
    seniorHighSchoolType: '',
    vocationalSchool: '',
    vocationalAddress: '',
    vocationalYearGraduated: '',
    vocationalSchoolType: '',
    transfereeCollegeSchool: '',
    transfereeCollegeAddress: '',
    transfereeCollegeCourse: '',
    transfereeCollegeSchoolType: '',
    medicalConditions: '',
    medications: '',
    controlNo: '',
    applicationStatus: '',
    examSched: '',
    reqSubmission: '',
  });
  {/* FOR ANIMATION */ }
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  //Reuse in other pages that requires logging in
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  //RETURNING ACCOUNT NAME IF LOGGED IN
  useEffect(() => {
    axios
      .get(`${backendUrl}/session`)
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
  //Reuse in other pages that requires logging in

  const steps = [ //steps title
    'Admission Information',
    'Personal Information',
    'Family Background',
    'Educational Background',
    'Medical History',
    'Admission Status',
  ];




  const requiredFields = {
    admissionInfo: ['idPicture'],
    personalInfo: ['firstName', 'lastName', 'zipCode', 'permanentAddress', 'email', 'lrn', 'contactNumber', 'sex', 'age', 'dateOfBirth', 'religion', 'nationality', 'civilStatus', 'isPWD', 'pwd', 'isIndigenous', 'indigenous'],
    familyBackground: ['fatherName', 'motherName', 'guardianName', 'guardianContact', 'fatherOccupation', 'motherOccupation', 'guardianOccupation', 'guardianRelationship', 'siblings', 'birthOrder', 'familyIncome'],
    educationalBackground: ['elementarySchool', 'elementaryAddress', 'elementaryYearGraduated', 'elementarySchoolType', 'highSchool', 'jhsAddress', 'jhsYearGraduated', 'highSchoolType', 'seniorHighSchool', 'seniorHighAddress', 'seniorHighYearGraduated', 'seniorHighSchoolType', 'transfereeCollegeSchool', 'transfereeCollegeAddress', 'transfereeCollegeCourse', 'transfereeCollegeSchoolType'],
    medicalHistory: [],
    scheduleAppointment: ['certify'],
  };




  const handleNext = () => {
    const stepKeys = Object.keys(requiredFields);
    const currentStepFields = requiredFields[stepKeys[activeStep]];

    const missingFields = currentStepFields.filter((field) => {
      const value = formData[field];


      if (field === 'pwd' && formData.isPWD === 'No') {
        return false;
      }
      if (field === 'indigenous' && formData.isIndigenous === 'No') {
        return false;
      }


      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      setErrorPrompt(true);
      return;
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  //TODO: Fetch the transferee's data from the database
  useEffect(() => {
    axios.get(`${backendUrl}/getTransfereeData`)
    .then((res) => {
      if(res.data.message === "Fetched records successfully"){
        const student = res.data.student;
        const transferee = res.data.transferee;

        setFormData({
          applyingFor: transferee.ApplyingFor || '',
          applicantType: "Transferee",
          preferredCampus: transferee.Branch || '',
          idPicture: transferee.IDPicture || '',
          idPictureUrl: transferee.IDPicture || '',
          firstName: student.Firstname || '',
          middleName: student.Middlename || '',
          lastName: student.Lastname || '',
          zipCode: transferee.ZipCode || '',
          permanentAddress: student.Address || '',
          email: student.Email || '',
          lrn: transferee.LRN || '',
          contactNumber: student.PhoneNo || '',
          sex: student.Gender || '',
          age: student.Age || '',
          dateOfBirth: student.DOB || '',
          religion: transferee.Religion || '',
          nationality: transferee.Nationality || '',
          civilStatus: transferee.CivilStatus || '',
          isPWD: transferee.PWD || '',
          pwd: transferee.PWDSpecification || '',
          isIndigenous: transferee.Indigenous || '',
          indigenous: transferee.IndigenousSpecification || '',
          fatherName: transferee.FatherName || '',
          motherName: transferee.MotherName || '',
          guardianName: transferee.GuardianName || '',
          fatherContact: transferee.FatherContactNo || '',
          motherContact: transferee.MotherContactNo || '',
          guardianContact: transferee.GuardianContactNo || '',
          fatherOccupation: transferee.FatherOccupation || '',
          motherOccupation: transferee.MotherOccupation || '',
          guardianOccupation: transferee.GuardianOccupation || '',
          guardianRelationship: transferee.GuardianRelationship || '',
          siblings: transferee.NoOfSiblings || '',
          birthOrder: transferee.BirthOrder || '',
          familyIncome: transferee.MonthlyFamilyIncome || '',
          elementarySchool: transferee.ElemSchoolName || '',
          elementaryAddress: transferee.ElemSchoolAddress || '',
          elementaryYearGraduated: transferee.ElemYearGraduated || '',
          elementarySchoolType: transferee.ElemSchoolType || '',
          highSchool: transferee.HighSchoolName || '',
          jhsAddress: transferee.HighSchoolAddress || '',
          jhsYearGraduated: transferee.HighSchoolYearGraduated || '',
          highSchoolType: transferee.HighSchoolType || '',
          seniorHighSchool: transferee.SHSchoolName || '',
          seniorHighAddress: transferee.SHSchoolAddress || '',
          seniorHighYearGraduated: transferee.SHYearGraduated || '',
          seniorHighSchoolType: transferee.SHSchoolType || '',
          vocationalSchool: transferee.VocationalSchoolName || '',
          vocationalAddress: transferee.VocationalSchoolAddress || '',
          vocationalYearGraduated: transferee.VocationalYearGraduated || '',
          vocationalSchoolType: transferee.VocationalSchoolType || '',
          transfereeCollegeSchool: transferee.TransfereeCollegeSchoolName || '',
          transfereeCollegeAddress: transferee.TransfereeCollegeSchoolAddress || '',
          transfereeCollegeCourse: transferee.TransfereeCollegeCourse || '',
          transfereeCollegeSchoolType: transferee.TransfereeCollegeSchoolType || '',
          medicalConditions: transferee.MedicalHistory || '',
          medications: transferee.Medication || '',
          controlNo: transferee.ExamControlNo || '',
          applicationStatus: transferee.AdmissionStatus || '',
          examSched: transferee.DateOfExamAndTime || '',
          reqSubmission: transferee.SubmissionSchedule ? 
          new Date(transferee.SubmissionSchedule).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) 
          : '',
      });

      console.log("Student ID: ", student.StudentID);

      setStudentID(student.StudentID);

      setPrefProgram(student.ProgramID);
      
      {formData.applicationStatus === "Pending" ? setActiveStep(0) : setActiveStep(5)}
      }
    })
    .catch((err) => {
      alert("error: " + err);       
    })
  },[formData.applicationStatus])

  const autoSave = () => {
    setIsSaving(true);

    // Create a FormData object to include the file
    const data = new FormData();
    data.append("applyingFor", formData.applyingFor);
    data.append("applicantType", formData.applicantType);
    data.append("preferredCampus", formData.preferredCampus);
    if (formData.idPicture) {
      data.append("idPicture", formData.idPicture);
    }
    data.append("idPictureUrl", formData.idPictureUrl);
    data.append("firstName", formData.firstName);
    data.append("middleName", formData.middleName);
    data.append("lastName", formData.lastName);
    data.append("zipCode", formData.zipCode);
    data.append("permanentAddress", formData.permanentAddress);
    data.append("email", formData.email);
    data.append("lrn", formData.lrn);
    data.append("contactNumber", formData.contactNumber);
    data.append("sex", formData.sex);
    data.append("age", formData.age);
    data.append("dateOfBirth", formData.dateOfBirth);
    data.append("religion", formData.religion);
    data.append("nationality", formData.nationality);
    data.append("civilStatus", formData.civilStatus);
    data.append("isPWD", formData.isPWD);
    data.append("pwd", formData.pwd);
    data.append("isIndigenous", formData.isIndigenous);
    data.append("indigenous", formData.indigenous);
    data.append("fatherName", formData.fatherName);
    data.append("motherName", formData.motherName);
    data.append("guardianName", formData.guardianName);
    data.append("fatherContact", formData.fatherContact);
    data.append("motherContact", formData.motherContact);
    data.append("guardianContact", formData.guardianContact);
    data.append("fatherOccupation", formData.fatherOccupation);
    data.append("motherOccupation", formData.motherOccupation);
    data.append("guardianOccupation", formData.guardianOccupation);
    data.append("guardianRelationship", formData.guardianRelationship);
    data.append("siblings", formData.siblings);
    data.append("birthOrder", formData.birthOrder);
    data.append("familyIncome", formData.familyIncome);
    data.append("elementarySchool", formData.elementarySchool);
    data.append("elementaryAddress", formData.elementaryAddress);
    data.append("elementaryYearGraduated", formData.elementaryYearGraduated);
    data.append("elementarySchoolType", formData.elementarySchoolType);
    data.append("highSchool", formData.highSchool);
    data.append("jhsAddress", formData.jhsAddress);
    data.append("jhsYearGraduated", formData.jhsYearGraduated);
    data.append("highSchoolType", formData.highSchoolType);
    data.append("seniorHighSchool", formData.seniorHighSchool);
    data.append("seniorHighAddress", formData.seniorHighAddress);
    data.append("seniorHighYearGraduated", formData.seniorHighYearGraduated);
    data.append("seniorHighSchoolType", formData.seniorHighSchoolType);
    data.append("vocationalSchool", formData.vocationalSchool);
    data.append("vocationalAddress", formData.vocationalAddress);
    data.append("vocationalYearGraduated", formData.vocationalYearGraduated);
    data.append("vocationalSchoolType", formData.vocationalSchoolType);
    data.append("transfereeCollegeSchool", formData.transfereeCollegeSchool);
    data.append("transfereeCollegeCourse", formData.transfereeCollegeCourse);
    data.append("transfereeCollegeAddress", formData.transfereeCollegeAddress);
    data.append("transfereeCollegeSchoolType", formData.transfereeCollegeSchoolType);
    data.append("medicalConditions", formData.medicalConditions);
    data.append("medications", formData.medications);
    data.append("controlNo", formData.controlNo);
    data.append("applicationStatus", formData.applicationStatus);
    data.append("examSched", formData.examSched);
    data.append("dateTimeSchedule", formData.dateTimeSchedule);


    Promise.all([
      axios.post(`${backendUrl}/saveTransfereeAdmissionForm`, data, {
        headers: { "Content-Type": "multipart/form-data", },
      }),
      axios.post(`${backendUrl}/saveTransfereeData`, formData)
    ])
      .then((responses) => {
        console.log("Form saved successfully:", responses[0].data);
        console.log("Student saved successfully:", responses[1].data);

        setUploadedImage(`${backendUrl}/${responses[0].data.idPictureUrl}`);
      })
      .catch((err) => {
        console.log("Error:", err);
        alert("Failed to save data");
      })
      .finally(() => {
        setIsSaving(false); // Only called after both requests are done
      });
  }

  //AUTOSAVE INPUT IN TEXTFIELDS AFTER 1 SECOND OF CHANGES
  useEffect(() => {
    const timer = setTimeout(() => {
      autoSave();
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    setFormData({ ...formData, idPicture: e.target.files[0] });
  };

  const handleDownloadForm = () => {
      if(formData.applicationStatus !== "Approved"){
        alert("You can only download the form once your application is approved.");
        return;
      }

      const url = `/download-form/${studentID}`;
      window.open(url, "_blank");
  };

  const [SideBar, setSideBar] = useState(false);
  document.body.style.overflow = SideBar ? 'hidden' : 'auto';

  const submitForm = (e) => {
e.preventDefault();

    if(!isConfirmation){
      alert("Please check the box to proceed.")
    } else{
      axios.post(`${backendUrl}/submitAdmissionForm`)
      .then((res) => {
        if(res.data.message === "Admission Form submitted successfully."){
          setStudentID(res.data.studentID)
          alert(res.data.message);
          window.location.reload();
          setActiveStep(5);
        } else{
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert("Error: " + err);
      })
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle cases where the date might be empty
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  //TODO: ADD FIELDS FOR TRANSFEREE PREVIOUS COLLEGE SCHOOL
  // Steps
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className={styles.content}>
            <h3 className={styles.stepTitle}>
              <img
                src={admissionIcon}
                alt="ICON"
                className={styles.icon}
              />Admission Information
            </h3>

            <form className={styles.form}>
              {/* 1 1 */}
              <div className={styles.formGroup}>
                <label htmlFor="applyingFor">Applying For:</label>
                <select
                  id="applyingFor"
                  name="applyingFor"
                  value={formData.applyingFor}
                  onChange={handleInputChange}     
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                >
                  <option value={formData.applyingFor !== "" ? formData.applyingFor : ""} disabled>
                  {formData.applyingFor !== "" ? formData.applyingFor : "Select Year and Semester"}
                  </option>
                  <option value="1st Year 2nd Sem">1st Year 2nd Sem</option>
                  <option value="2nd Year 1st Sem">2nd Year 1st Sem</option>
                  <option value="2nd Year 2nd Sem">2nd Year 2nd Sem</option>
                  <option value="3rd Year 1st Sem">3rd Year 1st Sem</option>
                  <option value="3rd Year 2nd Sem">3rd Year 2nd Sem</option>
                  <option value="4th Year 1st Sem">4th Year 1st Sem</option>
                  <option value="4th Year 2nd Sem">4th Year 2nd Sem</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="applicantType">Applicant Type:</label>
                <input
                  id="applicantType"
                  name="applicantType"
                  value={formData.applicantType}
                  disabled
                />
              </div>

              {/* 1 2 */}

              <div className={styles.formGroup}>
                <label htmlFor="preferredCampus">Preferred Campus:</label>
                <input
                  id="preferredCampus"
                  name="preferredCampus"
                  value={formData.preferredCampus}
                  disabled
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="preferredProgram">Preferred Program:</label>
                <input type="text" value={prefProgram === 1 ? "Bachelor of Science in Computer Science"
                  : prefProgram === 2 ? "Bachelor of Science in Information Technology"
                  : ""
                } disabled />
              </div>


              {/* ID */}
              {uploadedImage ? (
                <div className={styles.formGroup}>
                  <label htmlFor="idPicture">Upload ID 1x1 Picture:</label>
                  <input
                    id="idPicture"
                    name="idPicture"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  />

                  {formData.idPicture ? (
                    <div className={styles.imagePreview}>
                      <img
                        src={uploadedImage}
                        alt="Uploaded ID"
                        style={{ maxWidth: "150px", maxHeight: "150px", textAlign: "center" }}
                      />
                    </div>
                  ) : (
                    'No picture uploaded'
                  )}
                </div>)
                : ('')}
            </form>
          </div>
        );


      case 1:
        return (
          <div className={styles.content}>
            <h3 className={styles.stepTitle}>
              <img src={personalIcon} alt="ICON" className={styles.icon} />
              Personal Information
            </h3>
            <form className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name:</label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    type="text"
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="middleName">Middle Name:</label>
                  <input
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    type="text"
                    disabled={formData.applicationStatus !== "Pending"}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName">Last Name:</label>
                <input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  type="text"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>



              <div className={styles.formGroup}>
                <label htmlFor="permanentAddress">Permanent Address:</label>
                <input
                  id="permanentAddress"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                  type="text"
                  placeholder='House No. & Street, Barangay, City or Municipality, Province'
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="zipCode">Zip Code:</label>
                <input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  type="number"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                  disabled
                  required
                />
              </div>



              <div className={styles.formGroup}>
                <label htmlFor="lrn">LRN:</label>
                <input
                  id="lrn"
                  name="lrn"
                  value={formData.lrn}
                  onChange={handleInputChange}
                  type="tel"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>



              <div className={styles.formGroup}>
                <label htmlFor="contactNumber">Contact Number:</label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  type="tel"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="sex">Sex:</label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                >
                  <option value="" disabled>Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="age">Age:</label>
                  <input
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    type="number"
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="dateOfBirth">Date of Birth:</label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={
                      formData.applicationStatus === "Pending"
                        ? formData.dateOfBirth // Unformatted for "Pending" status
                        : formatDate(formData.dateOfBirth) // Formatted otherwise
                    }
                    onChange={handleInputChange}
                    type={formData.applicationStatus === "Pending" ? "date" : "text"}
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="religion">Religion:</label>
                <input
                  id="religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  type="text"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="nationality">Nationality:</label>
                <input
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  type="text"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="civilStatus">Civil Status:</label>
                <select
                  id="civilStatus"
                  name="civilStatus"
                  value={formData.civilStatus}
                  onChange={handleInputChange}
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                >
                  <option value="" disabled>Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>PWD (If yes, specify):</label>
                <div className={styles.radiobutton}>
                  <label>
                    <input
                      type="radio"
                      name="isPWD"
                      value="Yes"
                      checked={formData.isPWD === 'Yes'}
                      disabled={formData.applicationStatus !== "Pending"}
                      onChange={handleInputChange}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="isPWD"
                      value="No"
                      checked={formData.isPWD === 'No'}
                      onChange={handleInputChange}
                      disabled={formData.applicationStatus !== "Pending"}
                    />
                    No
                  </label>
                </div>
                {formData.isPWD === 'Yes' && (
                  <input
                    id="pwd"
                    name="pwd"
                    value={formData.pwd}
                    onChange={handleInputChange}
                    type="text"
                    disabled={formData.applicationStatus !== "Pending"}
                    placeholder="Please specify"
                  />
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Indigenous (If yes, specify):</label>
                <div className={styles.radiobutton}>
                  <label>
                    <input
                      type="radio"
                      name="isIndigenous"
                      value="Yes"
                      checked={formData.isIndigenous === 'Yes'}
                      disabled={formData.applicationStatus !== "Pending"}
                      onChange={handleInputChange}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="isIndigenous"
                      value="No"
                      checked={formData.isIndigenous === 'No'}
                      disabled={formData.applicationStatus !== "Pending"}
                      onChange={handleInputChange}
                    />
                    No
                  </label>
                </div>
                {formData.isIndigenous === 'Yes' && (
                  <input
                    id="indigenous"
                    name="indigenous"
                    value={formData.indigenous}
                    onChange={handleInputChange}
                    type="text"
                    disabled={formData.applicationStatus !== "Pending"}
                    placeholder="Please specify"
                  />
                )}
              </div>

            </form>
          </div>
        );

      case 2: // Family Background
        return (
          <div className={styles.content}>
            <h3 className={styles.stepTitle}>
              <img src={famIcon} alt="Personal Info Icon" className={styles.icon} />
              Family Background
            </h3>

            <form className={styles.form}>

              <div className={styles.formGroup}>
                <label htmlFor="fatherName">Father&#39;s Full Name:</label>
                <input
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder='e.g. John A. Doe'
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="motherName">Mother&#39;s Full Name:</label>
                <input
                  id="motherName"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder='e.g. Jane C. Doe'
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="guardianName">Guardian&#39;s Full Name:</label>
                <input
                  id="guardianName"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder='e.g. Jane C. Doe'
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="fatherContact">Father&#39;s Contact No.:</label>
                  <input
                    id="fatherContact"
                    name="fatherContact"
                    value={formData.fatherContact}
                    onChange={handleInputChange}
                    type="tel"
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="motherContact">Mother&#39;s Contact No.:</label>
                  <input
                    id="motherContact"
                    name="motherContact"
                    value={formData.motherContact}
                    onChange={handleInputChange}
                    type="tel"
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="guardianContact">Guardian&#39;s Contact No.:</label>
                <input
                  id="guardianContact"
                  name="guardianContact"
                  value={formData.guardianContact}
                  onChange={handleInputChange}
                  type="tel"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="fatherOccupation">Father&#39;s Occupation:</label>
                  <input
                    id="fatherOccupation"
                    name="fatherOccupation"
                    value={formData.fatherOccupation}
                    onChange={handleInputChange}
                    type="text"
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="motherOccupation">Mother&#39;s Occupation:</label>
                  <input
                    id="motherOccupation"
                    name="motherOccupation"
                    value={formData.motherOccupation}
                    onChange={handleInputChange}
                    type="text"
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="guardianOccupation">Guardian&#39;s Occupation:</label>
                <input
                  id="guardianOccupation"
                  name="guardianOccupation"
                  value={formData.guardianOccupation}
                  onChange={handleInputChange}
                  type="text"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="guardianRelationship">Relationship to Guardian:</label>
                <input
                  id="guardianRelationship"
                  name="guardianRelationship"
                  value={formData.guardianRelationship}
                  onChange={handleInputChange}
                  type="text"
                  placeholder='e.g. Mother'
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="siblings">Number of Siblings:</label>
                  <input
                    id="siblings"
                    name="siblings"
                    value={formData.siblings}
                    onChange={handleInputChange}
                    type="number"
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  />
                </div>


                <div className={styles.formGroup}>
                  <label htmlFor="birthOrder">Birth Order:</label>
                  <select
                    id="birthOrder"
                    name="birthOrder"
                    value={formData.birthOrder}
                    onChange={handleInputChange}
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  >
                    <option value="" disabled>
                      Select Birth Order
                    </option>
                    <option value="Eldest">Eldest</option>
                    <option value="Second">Second</option>
                    <option value="Middle">Middle</option>
                    <option value="Youngest">Youngest</option>
                    <option value="Only Child">Only Child</option>
                  </select>
                </div>

              </div>


              <div className={styles.formGroup}>
                <label htmlFor="familyIncome">Estimated Monthly Family Income:</label>
                <select
                  id="familyIncome"
                  name="familyIncome"
                  value={formData.familyIncome}
                  onChange={handleInputChange}
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                >
                  <option value="" disabled>
                    Select Income Range
                  </option>
                  <option value="below - 10,000">below - 10,000</option>
                  <option value="11,000 - 20,000">11,000 - 20,000</option>
                  <option value="21,000 - 30,000">21,000 - 30,000</option>
                  <option value="31,000 - 40,000">31,000 - 40,000</option>
                  <option value="41,000 - 50,000">41,000 - 50,000</option>
                  <option value="above 50,000">above 50,000</option>
                </select>
              </div>
            </form>
          </div>
        );

      case 3: // Educational Background
        return (
          <div className={styles.content}>
            <h3 className={styles.stepTitle}>
              <img src={educIcon} alt="Personal Info Icon" className={styles.icon} />
              Educational Background
            </h3>

            <form className={styles.form}>

              <div className={styles.formGroup}>
                <label htmlFor="elementarySchool">Name of Elementary School:</label>
                <input
                  id="elementarySchool"
                  name="elementarySchool"
                  value={formData.elementarySchool}
                  onChange={handleInputChange}
                  type="text"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="elementaryAddress">Address:</label>
                <input
                  id="elementaryAddress"
                  name="elementaryAddress"
                  value={formData.elementaryAddress}
                  onChange={handleInputChange}
                  placeholder='Street, Village or Subdivision, Barangay, City or Municipality'
                  type="text"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="elementaryYearGraduated">Year Graduated:</label>
                  <input
                    id="elementaryYearGraduated"
                    name="elementaryYearGraduated"
                    value={formData.elementaryYearGraduated}
                    onChange={handleInputChange}
                    type="tel"
                    placeholder='YYYY'
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="elementarySchoolType">School Type:</label>
                  <select
                    id="elementarySchoolType"
                    name="elementarySchoolType"
                    value={formData.elementarySchoolType}
                    onChange={handleInputChange}
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>

              <br />

              <div className={styles.formGroup}>
                <label htmlFor="highSchool">Name of High School:</label>
                <input
                  id="highSchool"
                  name="highSchool"
                  value={formData.highSchool}
                  onChange={handleInputChange}
                  type="text"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="jhsAddress">Address:</label>
                <input
                  id="jhsAddress"
                  name="jhsAddress"
                  value={formData.jhsAddress}
                  onChange={handleInputChange}
                  placeholder='Street, Village or Subdivision, Barangay, City or Municipality'
                  type="text"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="jhsYearGraduated">Year Graduated:</label>
                  <input
                    id="jhsYearGraduated"
                    name="jhsYearGraduated"
                    value={formData.jhsYearGraduated}
                    onChange={handleInputChange}
                    type="tel"
                    placeholder='YYYY'
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="highSchoolType">School Type:</label>
                  <select
                    id="highSchoolType"
                    name="highSchoolType"
                    value={formData.highSchoolType}
                    onChange={handleInputChange}
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>

              <br />

              <div className={styles.formGroup}>
                <label htmlFor="seniorHighSchool">Name of Senior High School:</label>
                <input
                  id="seniorHighSchool"
                  name="seniorHighSchool"
                  value={formData.seniorHighSchool}
                  onChange={handleInputChange}
                  type="text"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="seniorHighAddress">Address:</label>
                <input
                  id="seniorHighAddress"
                  name="seniorHighAddress"
                  value={formData.seniorHighAddress}
                  onChange={handleInputChange}
                  placeholder='Street, Village or Subdivision, Barangay, City or Municipality'
                  type="text"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="seniorHighYearGraduated">Year Graduated (or expected graduation):</label>
                  <input
                    id="seniorHighYearGraduated"
                    name="seniorHighYearGraduated"
                    value={formData.seniorHighYearGraduated}
                    onChange={handleInputChange}
                    type="tel"
                    placeholder='YYYY'
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="seniorHighSchoolType">School Type:</label>
                  <select
                    id="seniorHighSchoolType"
                    name="seniorHighSchoolType"
                    value={formData.seniorHighSchoolType}
                    onChange={handleInputChange}
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>

              </div>

              <br />

              <div className={styles.formGroup}>
                <label htmlFor="transfereeCollegeSchool">Name of Previous College School:</label>
                <input
                  id="transfereeCollegeSchool"
                  name="transfereeCollegeSchool"
                  value={formData.transfereeCollegeSchool}
                  onChange={handleInputChange}
                  type="text"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="transfereeCollegeAddress">Address:</label>
                <input
                  id="transfereeCollegeAddress"
                  name="transfereeCollegeAddress"
                  value={formData.transfereeCollegeAddress}
                  onChange={handleInputChange}
                  placeholder='Street, Village or Subdivision, Barangay, City or Municipality'
                  type="text"
                  disabled={formData.applicationStatus !== "Pending"}
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="transfereeCollegeCourse">Previous Program:</label>
                  <input
                    id="transfereeCollegeCourse"
                    name="transfereeCollegeCourse"
                    value={formData.transfereeCollegeCourse}
                    onChange={handleInputChange}
                    type="text"
                    placeholder='e.g. Bachelor of Science in Computer Science'
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="transfereeCollegeSchoolType">School Type:</label>
                  <select
                    id="transfereeCollegeSchoolType"
                    name="transfereeCollegeSchoolType"
                    value={formData.transfereeCollegeSchoolType}
                    onChange={handleInputChange}
                    disabled={formData.applicationStatus !== "Pending"}
                    required
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>

              </div>


              <br />


              <div className={styles.formGroup}>
                <label htmlFor="vocationalSchool">Name of Vocational School (if any):</label>
                <input
                  id="vocationalSchool"
                  name="vocationalSchool"
                  value={formData.vocationalSchool}
                  onChange={handleInputChange}
                  disabled={formData.applicationStatus !== "Pending"}
                  type="text"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="vocationalAddress">Address:</label>
                <input
                  id="vocationalAddress"
                  name="vocationalAddress"
                  value={formData.vocationalAddress}
                  onChange={handleInputChange}
                  placeholder='Street, Village or Subdivision, Barangay, City or Municipality'
                  disabled={formData.applicationStatus !== "Pending"}
                  type="text"
                />
              </div>


              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="vocationalYearGraduated">Year Graduated:</label>
                  <input
                    id="vocationalYearGraduated"
                    name="vocationalYearGraduated"
                    value={formData.vocationalYearGraduated}
                    onChange={handleInputChange}
                    type="tel"
                    placeholder='YYYY'
                    disabled={formData.applicationStatus !== "Pending"}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="vocationalSchoolType">School Type:</label>
                  <select
                    id="vocationalSchoolType"
                    name="vocationalSchoolType"
                    value={formData.vocationalSchoolType}
                    onChange={handleInputChange}
                    required
                    disabled={formData.applicationStatus !== "Pending"}
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>


            </form>
          </div>
        );

      case 4: // Medical History
        return (
          <div className={styles.content}>
            <h3 className={styles.stepTitle}>
              <img src={medIcon} alt="Personal Info Icon" className={styles.icon} />
              Medical History
            </h3>

            <form className={styles.form}>

              <div className={styles.formGroup}>
                <label htmlFor="medicalConditions">Medical Condition(s):</label>
                <textarea
                  id="medicalConditions"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="List any medical conditions you have"
                  disabled={formData.applicationStatus !== "Pending"}
                />
              </div>


              <div className={styles.formGroup}>
                <label htmlFor="medications">Medications:</label>
                <textarea
                  id="medications"
                  name="medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="List any medications you are currently taking"
                  disabled={formData.applicationStatus !== "Pending"}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input 
                  type="checkbox" 
                  className={styles.checkbox} 
                  name="certify" 
                  id="certify" 
                  disabled={formData.applicationStatus !== "Pending"} 
                  onChange={(e) => setIsConfirmation(e.target.checked)} 
                  required />
                  I hereby certify that the information provided is accurate and true.
                </label>
              </div>
              <button type="button" onClick={submitForm} className={styles.submitButton}>
                <span>Submit</span>
              </button>
            </form>
          </div>
        );

      case 5: // Schedule Appointment
        return (
          <div className={styles.content}>
            <h3 className={styles.stepTitle}>
              <img src={calendarIcon} alt="Personal Info Icon" className={styles.icon} />
              Admission Status
            </h3>

            <form className={styles.form}>

              <div className={styles.formGroup}>
                <label htmlFor="applicationStatus">Application Status:</label>
                <input
                  id="applicationStatus"
                  name="applicationStatus"
                  value={formData.applicationStatus}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>


              <div className={styles.formGroup}>
                <label htmlFor="controlNo">Control No.:</label>
                <input
                  id="controlNo"
                  name="controlNo"
                  value={formData.controlNo}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>


              <div className={styles.formGroup}>
                <label htmlFor="reqSubmission">Submission of Requirements</label>
                <input
                  id="reqSubmission"
                  name="reqSubmission"
                  value={formData.reqSubmission === "" || !formData.reqSubmission ? "Not yet scheduled" : formData.reqSubmission}
                  onChange={handleInputChange}
                  type="text"
                  readOnly
                />
              </div>


              <div className={styles.formGroup}>
                <button
                  type="button"
                  className={styles.downloadButton}
                  onClick={handleDownloadForm}
                ><span>
                    Download Application Form</span>
                </button>
              </div>

            </form>
          </div>
        );




      default:
        return <div>Step {step + 1} CONTENT.</div>;
    }
  };

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.contentSection}>
        <div className={styles.PageTitle}>Admission
          <h4>Please fill out the form below. Form can no longer be edited once submitted.</h4>
        </div>

        {/* STEPPER */}
        <div data-aos="fade-up" className={styles.container}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              '& .MuiStepIcon-root': {
                color: 'gray',
              },
              '& .MuiStepIcon-root.Mui-active': {
                color: '#d0943d',
              },
              '& .MuiStepIcon-root.Mui-completed': {
                color: '#3d8c4b',
              },
              '& .MuiStepLabel-label': {
                color: 'rgba(0, 0, 0, 0.6)',
                display: { xs: 'none', sm: 'block' }, // Hide labels on mobile, show on larger screens
              },
              '& .MuiStepLabel-label.Mui-active': {
                color: '#d0943d',
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'block' },
              },
              '& .MuiStepLabel-label.Mui-completed': {
                color: '#3d8c4b',
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'block' },
              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          <div data-aos="fade-up" className={styles.stepContent}>
            {renderStepContent(activeStep)}
          </div>


          <div className={styles.buttons}>
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className={`${styles.button} ${styles.backButton}`}
              aria-label="Go to the previous step"
            >
              <span>Back</span>
            </button>
            <button
              onClick={(event) => {
                event.preventDefault();
                handleNext();
              }}
              disabled={activeStep === steps.length - 1}
              className={`${styles.button} ${styles.nextButton}`}
              aria-label={
                activeStep === steps.length - 1 ? "Finish the form" : "Go to the next step"
              }
            >
              <span>{activeStep === steps.length - 1 ? "Finish" : "Next"}</span>
            </button>
          </div>

        </div>
        {/* ERROR PROMPT */}
        {errorPrompt && (
          <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupError}>
            <div className={styles.popupContentError}>
              <button
                className={styles.closeButton}
                onClick={() => setErrorPrompt(false)}
              >
                &times;
              </button>
              <div className={styles.popupHeaderError}>
                <h2>Error</h2>
              </div>
              <div className={styles.MessageError}>
                <img
                  src={errormark}
                  alt="Error Icon"
                  className={styles.messageImage}
                />
              </div>
              <p className={styles.popupTextError}>Please fill out all fields.</p>
            </div>
          </div>
        )}
      </div>

    </>
  );
}

export default FreshmenAdmissionForm;