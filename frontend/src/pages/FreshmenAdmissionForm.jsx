import { useState } from 'react';
import Header from '/src/components/Header.jsx';
import { Stepper, Step, StepLabel } from '@mui/material';
import styles from '/src/styles/FreshmenAdmissionForm.module.css';

function FreshmenAdmissionForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    applyingFor: '',
    applicantType: 'Freshman',
    preferredCampus: 'CvSU - Bacoor',
    strand: '',
    preferredProgram: '',
    lrn: '',
    finalAverage: '',
    firstQuarter: '',
    secondQuarter: '',
    thirdQuarter: '',
    fourthQuarter: '',
    idPicture: null, // For file upload
  });

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
                    readOnly
                    disabled
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
                  <select
                    id="preferredProgram"
                    name="preferredProgram"
                    value={formData.preferredProgram}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select Program
                    </option>
                    <option value="BSCS">BSCS</option>
                    <option value="BSIT">BSIT</option>
                  </select>
                </div>
  
                <div className={styles.formGroup}>
                  <label htmlFor="lrn">LRN:</label>
                  <input
                    id="lrn"
                    name="lrn"
                    value={formData.lrn}
                    onChange={handleInputChange}
                    type="number"
                    required
                  />
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
            value={formData.firstName || ''}
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
            value={formData.middleName || ''}
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
            value={formData.lastName || ''}
            onChange={handleInputChange}
            type="text"
            required
          />
        </div>

        <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="permanentAddress">Permanent Address:</label>
          <input
            id="permanentAddress"
            name="permanentAddress"
            value={formData.permanentAddress || ''}
            onChange={handleInputChange}
            type="text"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="zipCode">Zip Code:</label>
          <input
            id="zipCode"
            name="zipCode"
            value={formData.zipCode || ''}
            onChange={handleInputChange}
            type="number"
            required
          />
        </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            type="email"
            required
          />
        </div>

        

        <div className={styles.formGroup}>
          <label htmlFor="lrn">LRN:</label>
          <input
            id="lrn"
            name="lrn"
            value={formData.lrn || ''}
            onChange={handleInputChange}
            type="text"
            required
          />
        </div>



        <div className={styles.formGroup}>
          <label htmlFor="contactNumber">Contact Number:</label>
          <input
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber || ''}
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
            value={formData.sex || ''}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="age">Age:</label>
          <input
            id="age"
            name="age"
            value={formData.age || ''}
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
            value={formData.dateOfBirth || ''}
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
            value={formData.religion || ''}
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
            value={formData.nationality || ''}
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
            value={formData.civilStatus || ''}
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
          <label htmlFor="pwd">PWD (If yes, specify):</label>
          <input
            id="pwd"
            name="pwd"
            value={formData.pwd || ''}
            onChange={handleInputChange}
            type="text"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="indigenous">Indigenous (If yes, specify):</label>
          <input
            id="indigenous"
            name="indigenous"
            value={formData.indigenous || ''}
            onChange={handleInputChange}
            type="text"
          />
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
                type="text"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="elementaryYearGraduated">Year Graduated:</label>
              <input
                id="elementaryYearGraduated"
                name="elementaryYearGraduated"
                value={formData.elementaryYearGraduated}
                onChange={handleInputChange}
                type="number"
                required
              />
            </div>

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
                type="text"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="seniorHighYearGraduated">Year Graduated:</label>
              <input
                id="seniorHighYearGraduated"
                name="seniorHighYearGraduated"
                value={formData.seniorHighYearGraduated}
                onChange={handleInputChange}
                type="number"
                required
              />
            </div>

    
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
                type="text"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="vocationalYearGraduated">Year Graduated:</label>
              <input
                id="vocationalYearGraduated"
                name="vocationalYearGraduated"
                value={formData.vocationalYearGraduated}
                onChange={handleInputChange}
                type="number"
              />
            </div>


            <div className={styles.formGroup}>
              <label htmlFor="collegeSchool">Name of College (For Transferees/Second Courser):</label>
              <input
                id="collegeSchool"
                name="collegeSchool"
                value={formData.collegeSchool}
                onChange={handleInputChange}
                type="text"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="collegeAddress">Address:</label>
              <input
                id="collegeAddress"
                name="collegeAddress"
                value={formData.collegeAddress}
                onChange={handleInputChange}
                type="text"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="collegeYearGraduated">Year Graduated:</label>
              <input
                id="collegeYearGraduated"
                name="collegeYearGraduated"
                value={formData.collegeYearGraduated}
                onChange={handleInputChange}
                type="number"
              />
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
                required
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
                required
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
        <div className={styles.container}>
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
    },
    '& .MuiStepLabel-label.Mui-active': {
      color: '#d0943d', 
      fontWeight: 'bold',
    },
    '& .MuiStepLabel-label.Mui-completed': {
      color: '#3d8c4b',
      fontWeight: 'bold', 
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
          <div className={styles.stepContent}>
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
