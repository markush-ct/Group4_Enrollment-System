import { useState, useEffect } from 'react';
import Header from '/src/components/StudentDashHeader.jsx';
import { Stepper, Step, StepLabel } from '@mui/material';
import styles from '/src/styles/AdmissionForm.module.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function FreshmenAdmissionForm() {
  const [accName, setAccName] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [prefProgram, setPrefProgram] = useState("");
  const [formData, setFormData] = useState({
    applyingFor: '',
    applicantType: 'Freshman',
    preferredCampus: 'CvSU - Bacoor',
    strand: '',
    finalAverage: '',
    firstQuarter: '',
    secondQuarter: '',
    thirdQuarter: '',
    fourthQuarter: '',
    idPicture: null, // For file upload
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
    seniorHighSchool: '',
    seniorHighAddress: '',
    seniorHighYearGraduated: '',
    seniorHighSchoolType: '',
    vocationalSchool: '',
    vocationalAddress: '',
    vocationalYearGraduated: '',
    vocationalSchoolType: '',

    medicalConditions: '',
    medications: '',
    controlNo: '',
    applicationStatus: '',
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
  //Reuse in other pages that requires logging in

  const steps = [ //steps title
    'Admission Information',
    'Personal Information',
    'Family Background',
    'Educational Background',
    'Medical History',
    'Schedule Appointment',
  ];

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //GET PREFERRED PROGRAM
  useEffect(() => {
    axios.get("http://localhost:8080/getFormData")
      .then((res) => {
        console.log(res.data.preferredProgram);
        if (res.data.preferredProgram === 1) {
          setPrefProgram("Bachelor of Science in Computer Science");
          setFormData({
            applyingFor: res.data.applyingFor || '',
            applicantType: 'Freshman',
            preferredCampus: 'CvSU - Bacoor',
            strand: res.data.strand || '',
            finalAverage: res.data.finalAve || '',
            firstQuarter: res.data.firstQuarter || '',
            secondQuarter: res.data.secondQuarter || '',
            thirdQuarter: res.data.thirdQuarter || '',
            fourthQuarter: res.data.fourthQuarter || '',
            idPicture: res.data.IDPicture || null,
            firstName: res.data.firstname || '',
            middleName: res.data.middlename || '',
            lastName: res.data.lastname || '',
            zipCode: res.data.zipCode || '',
            permanentAddress: res.data.permanentAddress || '',
            email: res.data.email || '',
            lrn: res.data.lrn || '',
            contactNumber: res.data.contactnum || '',
            sex: res.data.sex || '',
            age: res.data.age || '',
            dateOfBirth: res.data.dob || '',
            religion: res.data.religion || '',
            nationality: res.data.nationality || '',
            civilStatus: res.data.civilStatus || '',
            isPWD: res.data.isPWD || '',
            pwd: res.data.pwd || '',
            isIndigenous: res.data.isIndigenous || '',
            indigenous: res.data.indigenous || '',
            fatherName: res.data.fatherName || '',
            motherName: res.data.motherName || '',
            guardianName: res.data.guardianName || '',
            fatherContact: res.data.fatherContact || '',
            motherContact: res.data.motherContact || '',
            guardianContact: res.data.guardianContact || '',
            fatherOccupation: res.data.fatherOccupation || '',
            motherOccupation: res.data.motherOccupation || '',
            guardianOccupation: res.data.guardianOccupation || '',
            guardianRelationship: res.data.guardianRelationship || '',
            siblings: res.data.siblings || '',
            birthOrder: res.data.birthOrder || '',
            familyIncome: res.data.familyIncome || '',
            elementarySchool: res.data.elementarySchool || '',
            elementaryAddress: res.data.elementaryAddress || '',
            elementaryYearGraduated: res.data.elementaryYearGraduated || '',
            elementarySchoolType: res.data.elementarySchoolType || '',
            seniorHighSchool: res.data.seniorHighSchool || '',
            seniorHighAddress: res.data.seniorHighAddress || '',
            seniorHighYearGraduated: res.data.seniorHighYearGraduated || '',
            seniorHighSchoolType: res.data.seniorHighSchoolType || '',
            vocationalSchool: res.data.vocationalSchool || '',
            vocationalAddress: res.data.vocationalAddress || '',
            vocationalYearGraduated: res.data.vocationalYearGraduated || '',
            vocationalSchoolType: res.data.vocationalSchoolType || '',

            medicalConditions: res.data.medicalConditions || '',
            medications: res.data.medications || '',
            controlNo: res.data.controlNo || '',
            applicationStatus: res.data.applicationStatus || '',
          });
        } else if (res.data.preferredProgram === 2) {
          setPrefProgram("Bachelor of Science in Information Technology");
          setFormData({
            applyingFor: res.data.applyingFor || '',
            applicantType: 'Freshman',
            preferredCampus: 'CvSU - Bacoor',
            strand: res.data.strand || '',
            finalAverage: res.data.finalAve || '',
            firstQuarter: res.data.firstQuarter || '',
            secondQuarter: res.data.secondQuarter || '',
            thirdQuarter: res.data.thirdQuarter || '',
            fourthQuarter: res.data.fourthQuarter || '',
            idPicture: res.data.IDPicture || null,
            firstName: res.data.firstname || '',
            middleName: res.data.middlename || '',
            lastName: res.data.lastname || '',
            zipCode: res.data.zipCode || '',
            permanentAddress: res.data.permanentAddress || '',
            email: res.data.email || '',
            lrn: res.data.lrn || '',
            contactNumber: res.data.contactnum || '',
            sex: res.data.sex || '',
            age: res.data.age || '',
            dateOfBirth: res.data.dob || '',
            religion: res.data.religion || '',
            nationality: res.data.nationality || '',
            civilStatus: res.data.civilStatus || '',
            isPWD: res.data.isPWD || '',
            pwd: res.data.pwd || '',
            isIndigenous: res.data.isIndigenous || '',
            indigenous: res.data.indigenous || '',
            fatherName: res.data.fatherName || '',
            motherName: res.data.motherName || '',
            guardianName: res.data.guardianName || '',
            fatherContact: res.data.fatherContact || '',
            motherContact: res.data.motherContact || '',
            guardianContact: res.data.guardianContact || '',
            fatherOccupation: res.data.fatherOccupation || '',
            motherOccupation: res.data.motherOccupation || '',
            guardianOccupation: res.data.guardianOccupation || '',
            guardianRelationship: res.data.guardianRelationship || '',
            siblings: res.data.siblings || '',
            birthOrder: res.data.birthOrder || '',
            familyIncome: res.data.familyIncome || '',
            elementarySchool: res.data.elementarySchool || '',
            elementaryAddress: res.data.elementaryAddress || '',
            elementaryYearGraduated: res.data.elementaryYearGraduated || '',
            elementarySchoolType: res.data.elementarySchoolType || '',
            seniorHighSchool: res.data.seniorHighSchool || '',
            seniorHighAddress: res.data.seniorHighAddress || '',
            seniorHighYearGraduated: res.data.seniorHighYearGraduated || '',
            seniorHighSchoolType: res.data.seniorHighSchoolType || '',
            vocationalSchool: res.data.vocationalSchool || '',
            vocationalAddress: res.data.vocationalAddress || '',
            vocationalYearGraduated: res.data.vocationalYearGraduated || '',
            vocationalSchoolType: res.data.vocationalSchoolType || '',

            medicalConditions: res.data.medicalConditions || '',
            medications: res.data.medications || '',
            controlNo: res.data.controlNo || '',
            applicationStatus: res.data.applicationStatus || '',
          });
        }
      })
      .catch((err) => {
        alert("Error fetching preferred program: " + err);
      });
  }, [])

  const autoSave = () => {
    setIsSaving(true);

    Promise.all([
      axios.post("http://localhost:8080/admissionFormTable", formData),
      axios.post("http://localhost:8080/studentTable", formData)
    ])
      .then((responses) => {
        console.log("Form saved successfully:", responses[0].data);
        console.log("Student saved successfully:", responses[1].data);
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


  const handleFileUpload = (e) => {
    setFormData({ ...formData, idPicture: e.target.files[0] });
  };

  const handleDownloadForm = () => {
    const link = document.createElement('a');
    link.href = '/path/to/application-form.pdf'; // APPLICATION FORM
    link.download = 'Application_Form.pdf';
    link.click();
  };

  const [SideBar, setSideBar] = useState(false);
  document.body.style.overflow = SideBar ? 'hidden' : 'auto';

  // Steps
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className={styles.content}>
            <h3 className={styles.stepTitle}>
              <img
                src='/src/assets/admission-icon.png'
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
                  required
                >
                  <option value="" disabled>
                    Select Semester
                  </option>
                  <option value="1st Year 1st Sem 2024 - 2025">1st Year 1st Sem 2024 - 2025</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="applicantType">Applicant Type:</label>
                <input
                  id="applicantType"
                  name="applicantType"
                  value={formData.applicantType}
                  readOnly                  
                />
              </div>

              {/* 1 2 */}

              <div className={styles.formGroup}>
                <label htmlFor="preferredCampus">Preferred Campus:</label>
                <input
                  id="preferredCampus"
                  name="preferredCampus"
                  value={formData.preferredCampus}
                  readOnly
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="strand">Strand:</label>
                <select
                  id="strand"
                  name="strand"
                  value={formData.strand}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Select Strand
                  </option>
                  <option value="STEM">STEM</option>
                  <option value="ICIT">ICIT</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="preferredProgram">Preferred Program:</label>
                <input type="text" value={prefProgram} readOnly />
              </div>



              {/* 1 1 */}
              <div className={styles.formGroup}>
                <label htmlFor="finalAverage">Final Average:</label>
                <input
                  id="finalAverage"
                  name="finalAverage"
                  value={formData.finalAverage}
                  onChange={handleInputChange}
                  type="number"
                  step="0.01"
                  required
                />
              </div>

              {/* 1 2 */}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstQuarter">1st Quarter:</label>
                  <input
                    id="firstQuarter"
                    name="firstQuarter"
                    value={formData.firstQuarter}
                    onChange={handleInputChange}
                    type="number"
                    step="0.01"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="secondQuarter">2nd Quarter:</label>
                  <input
                    id="secondQuarter"
                    name="secondQuarter"
                    value={formData.secondQuarter}
                    onChange={handleInputChange}
                    type="number"
                    step="0.01"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="thirdQuarter">3rd Quarter:</label>
                  <input
                    id="thirdQuarter"
                    name="thirdQuarter"
                    value={formData.thirdQuarter}
                    onChange={handleInputChange}
                    type="number"
                    step="0.01"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="fourthQuarter">4th Quarter:</label>
                  <input
                    id="fourthQuarter"
                    name="fourthQuarter"
                    value={formData.fourthQuarter}
                    onChange={handleInputChange}
                    type="number"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* ID */}
              <div className={styles.formGroup}>
                <label htmlFor="idPicture">Upload ID 1x1 Picture:</label>
                <input
                  id="idPicture"
                  name="idPicture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  required
                />
              </div>
            </form>
          </div>
        );


      case 1:
        return (
          <div className={styles.content}>
            <h3 className={styles.stepTitle}>
              <img src='/src/assets/personal-icon.png' alt="ICON" className={styles.icon} />
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
                  readOnly
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
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            type="date"
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
              <img src='/src/assets/family-icon.png' alt="Personal Info Icon" className={styles.icon} />
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
              <img src='/src/assets/education-icon.png' alt="Personal Info Icon" className={styles.icon} />
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
              <img src='/src/assets/medical-icon.png' alt="Personal Info Icon" className={styles.icon} />
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
                />
              </div>
            </form>
          </div>
        );

      case 5: // Schedule Appointment
        return (
          <div className={styles.content}>
            <h3 className={styles.stepTitle}>
              <img src='/src/assets/calendar-icon.png' alt="Personal Info Icon" className={styles.icon} />
              Schedule Appointment
            </h3>

            <form className={styles.form}>

              <div className={styles.formGroup}>
                <label htmlFor="applicationStatus">Application Status:</label>
                <input
                  id="applicationStatus"
                  name="applicationStatus"
                  value={formData.applicationStatus}
                  readOnly
                  disabled
                />
              </div>


              <div className={styles.formGroup}>
                <label htmlFor="controlNo">Control No.:</label>
                <input
                  id="controlNo"
                  name="controlNo"
                  value={formData.controlNo}
                  readOnly
                  disabled
                />
              </div>


              <div className={styles.formGroup}>
                <label htmlFor="dateTimeSchedule">Date & Time Schedule:</label>
                <input
                  id="dateTimeSchedule"
                  name="dateTimeSchedule"
                  value={formData.dateTimeSchedule}
                  onChange={handleInputChange}
                  type="datetime-local"
                  required
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


              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" className={styles.checkbox} name="certify" id="certify" required />
                  I hereby certify that the information provided is accurate and true.
                </label>
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
          <h4>Please fill out the form below</h4>
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
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
              className={`${styles.button} ${styles.nextButton}`}
              aria-label="Go to the next step"
            ><span>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FreshmenAdmissionForm;