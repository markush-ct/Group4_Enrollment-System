import { useEffect, useState } from 'react';
import styles from '/src/styles/FAQs.module.css';
import Header from '/src/components/Header.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';

function FAQs() {
  const [SideBar, setSideBar] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [studentType, setStudentType] = useState('General');
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');

  const studentFaqs = {
    General: [
      {
        question: 'Do I need to pay a tuition fee to be accepted by the institution?',
        reply: 'No, Cavite State University Bacoor Campus is a public university in Bacoor Cavite that is under the Commission on Higher Education (CHED) and offers free tuition and miscellaneous fees to students. However, six or more years of residency in the institution will terminate the said offers.',
      },
      {
        question: 'How to apply?',
        reply: 'The applicant must have a CvSU account created by the enrollment officer in order to log in and answer the online admission application form. They must read the posted announcement on the official page of  CvSu Bacoor City Campus for guidance.',
      },
      {
        question: 'Can I apply to more than one campus of CvsU?',
        reply: 'No, an applicant cannot apply to more than one campus at the same time because there should only be one application existing for one applicant.',
      },
      {
        question: 'Can the applicant go or visit the OSAS in advance of the scheduled appointment?',
        reply: 'No, it is not advised. The applicant must follow the schedule of appointments.',
      },

      {
        question: 'Can the requirements of the applicant be followed up for later?',
        reply: 'Can the requirements of the applicant be followed up for later?',
      },

      {
        question: 'What if the attached document is not really the document being required?',
        reply: 'The application will be declined due to dishonest application.',
      },

      {
        question: 'What if the requirements are not yet complete for online submission or are not yet available?',
        reply: 'The online application will not push through until the requirements are correctly and completely submitted in the enrollment system. Contact the registrar’s office immediately to discuss your situation.',
      },

      {
        question: 'I lived or came from a far place, how can I apply or make an appointment?',
        reply: 'Kindly follow or read the posted announcement on the procedure for applying online. You may have an authorized person to bring your complete and correct documents to represent you on the appointment date.',
      },

      {
        question: 'Can I use my cellphone to scan or take a picture of my requirements?',
        reply: 'Yes, just make sure it is clear and readable. ',
      },

      {
        question: 'Can I still edit my information and change my program and courses?',
        reply: 'Yes, the information details can still be edited as long as you have not yet submitted the final step of the online process.',
      },
      {
        question: 'Can the parent, guardian, sibling, classmate, schoolmate, or distant relative represent the applicant at OSAS during the appointment date?',
        reply: 'Yes, provided that they will bring an authorization letter from the applicant and a photocopy of the applicant’s ID.',
      },
      {
        question: 'Can I adjust my class schedule after enrollment?',
        reply: 'You may be able to adjust your schedule, which is usually within the first week of the semester. Be sure to check with the Department of Computer Studies and the enrollment officer for deadlines.',
      },
      {
        question: 'Can I switch or drop courses after enrollment?',
        reply: 'Yes, the institution allows students to switch or drop courses within a specific timeframe. Check the school’s academic calendar for the exact dates and consult with an academic adviser for guidance.',
      },
      {
        question: 'How do I apply for a leave of absence or delay my enrollment?',
        reply: 'To apply for a leave of absence, you will typically need to submit a formal request to the registrar office. They will inform you of any specific requirements and deadlines.',
      },
      {
        question: 'Does the school accept late enrollees?',
        reply: 'Yes, just wait for the announcement on the Facebook page of CvSu Bacoor City Campus or contact the registrar’s office immediately to discuss your options. <br>  <br>Late applicants who desire to be part of the Department of Computer Studies may visit the Aliance of Computer Scientists and Information Technology Society Facebook pages for announcements related to the selected specific program.',
        
      },
      {
        question: 'Are there any fees associated with the enrollment system?',
        reply: 'None. Payment transactions, such as society fee payments, should be done face-to-face per program and wait until the society officer sets your payment status to access the attendance as part of the requirements of the enrollment process.<br><br>Late enrollees have an additional 20 pesos to the original fee of society payment as a penalty for not following the enrollment schedule.',
      },
        


    ],
    Regular: [
      {
        question: 'What do I do if I cannot enroll due to issues with my grades or academic standing?',
        reply: 'If you are facing issues such as academic probation, you should meet with your academic adviser or the student affairs office to discuss your options for clearing academic requirements.',
      },
    ],
    Irregular: [
      {
        question: 'Are there any restrictions for irregular students during enrollment?',
        reply: 'Irregular students may face restrictions if they are missing key prerequisites for courses. They may need to consult with their program’s academic adviser to ensure that they can take the courses they need.',
      },
      
    ],
    Transferee: [

      {
              question: 'What are the requirements required for a transfee to be accepted by the institution?',
              reply: 'Transfer students need to provide the following requirements:<br><br>&#8226; &nbsp; Accomplished Application Form for Admission<br>&#8226; &nbsp; Original copy of Transcript of records/Certification of grades<br>&#8226;&nbsp; Honorable Dismissal<br>&#8226;&nbsp; Certificate of Good Moral Character<br>&#8226;&nbsp; NBI or Police Clearance<br>&#8226;&nbsp; Medical Results<br>&#8226;&nbsp; Medical clearance from the campus nurse<br>&#8226;&nbsp; Equivalency Form',
            },
            {
              question: 'Will my previous credits be accepted?',
              reply: 'This depends on the school’s transfer policies and whether the courses you have taken are equivalent to the program’s requirements. The enrollment officer or the Department of Computer Studies will evaluate your credits.',
            },
            {
              question: 'How do I know if I qualify for transfer?',
              reply: 'Eligibility for transfer typically depends on your academic standing, the program you wish to transfer into, and the university’s specific requirements. Contact the Cavite State University Bacoor Admission for more details.',
            },
            {
              question: 'How do I apply for a transfer of records from my previous institution?',
              reply: 'You must request your transcripts and other academic records from your previous school and submit them to the registrar or admissions office for evaluation.',
            },

      
      ],
      Freshman: [

        {
          question:
            'Can a first-year applicant enroll in a program that is not related to senior high school strand?',
          reply: `
            No, the program must be aligned to the Senior High School strand. Check the following details below for the program-strand alignment before proceeding with enrollment.<br><br>
            <table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
              <thead>
                <tr>
                  <th>PROGRAM</th>
                  <th>SHS STRAND/TRACK</th>
                  <th>OTHERS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>BS in Business Management</td>
                  <td>STEM, ABM, GAS, ALS</td>
                  <td></td>
                </tr>
                <tr>
                  <td>BS in Computer Science</td>
                  <td>STEM, TVL-ICT, ALS</td>
                  <td>Grade not lower in Mathematics, Science, and English subjects in High School.</td>
                </tr>
                <tr>
                  <td>BS in Information Technology</td>
                  <td>TVL-ICT, ALS</td>
                  <td></td>
                </tr>
                <tr>
                  <td>BS in Hospitality Management</td>
                  <td>ANY STRAND</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Bachelor of Secondary Education (English, Math)</td>
                  <td>STEM, HUMSS, GAS</td>
                  <td>GPA of 85 and above</td>
                </tr>
                <tr>
                  <td>BS in Criminology</td>
                  <td>STEM, HUMSS, GAS, TVL-ICT</td>
                  <td></td>
                </tr>
                <tr>
                  <td>BS in Psychology</td>
                  <td>STEM, HUMSS, GAS</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          `,
        },
              {
                question: 'Do I need to take an entrance exam?',
                reply: 'Yes, incoming freshmen are required to take an entrance exam. Check the page of Cavite State University Bacoor Admission for specific details.',
              },
        
        
        ],
        Shiftee: [

          {
                  question: 'Can I shift courses during the semester?',
                  reply: 'Typically, students are only allowed to shift at the start of the semester or academic year. Make sure to consult with the enrollment officer and academic adviser for specific policies and deadlines.',
                },
                
{
  question: 'What happens if my shift is not approved?',
  reply: 'If your application to shift is not approved, you may need to stay in your current program or explore other options, such as transferring to a different school or taking courses in your current program until the next shift application period.',
},
          ],
          Technical: [

            {
                    question: 'How do I fix issues with the online enrollment system?',
                    reply: 'For issues with the enrollment system, check for common issues such as browser compatibility, internet connection, or session timeouts. Try clearing your browser cache or switching browsers. If the problem persists, contact the technical support team.',
                  },
                  {
                    question: 'I am having trouble uploading my documents. What should I do?',
                    reply: 'Ensure your documents are in the correct file format (e.g., PDF, JPEG, PNG) and within the size limits. If you are still encountering issues, contact the support team for assistance in uploading your documents.',
                  },
            
            
            ],
            Account: [

              {
                      question: 'How do I update my personal information?',
                      reply: 'You can usually update your personal information directly through your portal. If you encounter any issues, contact the enrollment officer to make the necessary changes.',
                    },
              
{
  question: 'What should I do if my account is terminated?',
  reply: 'Go to contact and fill out the needed details for requesting an account reactivation to the enrollment officer.',
},

              ],
              
          
        
      
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const faqs = studentType ? studentFaqs[studentType] : [];
    const filtered = faqs.filter((faq) =>
      faq.question.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredFaqs(filtered);
  }, [studentType, searchInput]);

  const handleContainerClick = (content) => {
    setPopupContent(content);
    setPopupVisible(true);
  };

  const closePopup = () => setPopupVisible(false);

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.mainPage}>
        {/* Parallax Section */}
        <div className={`${styles.parallaxSection} ${styles.parallax1}`}>
          <h2>DEPARTMENT OF COMPUTER STUDIES</h2>
          <h1>ENROLLMENT FAQs</h1>
        </div>

        {/* FAQs Section */}
        <div data-aos="fade-up" className={styles.PageTitle}>
          FREQUENTLY ASKED QUESTIONS
        </div>
        <div data-aos="fade-up" className={styles.contentSection}>
          {/* Academic Calendar */}
          <div
            onClick={() => handleContainerClick('Academic Calendar for SY 2024 - 2025')}
            className={styles.AcademicContainer}
          >
            Academic Calendar for SY 2024 - 2025
          </div>

          {/* Student Type Selection */}
          <div data-aos="fade-up" className={styles.studentSelection}>
            {['General', 'Regular', 'Irregular', 'Transferee', 'Freshman', 'Shiftee', 'Technical', 'Account',].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="studentType"
                  value={type}
                  checked={studentType === type} 
                  onChange={() => setStudentType(type)} 
                  className={styles.radioInput}
                />
                {type}
              </label>
            ))}
          </div>
          <div data-aos="fade-up" className={styles.PageTitle2}>
  {studentType && 
    ((studentType === 'Regular' || 
      studentType === 'Irregular' || 
      studentType === 'Transferee' || 
      studentType === 'Freshman' || 
      studentType === 'Shiftee') 
      ? `${studentType} Student Support`
      : `${studentType} Support`)
      
      
          }
</div>


          {/* Search Bar */}
          <div data-aos="fade-up" className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          

          {/* FAQs Table */}
          <table data-aos="fade-up" className={styles.faqTable}>
            <thead>
              <tr>
                <th>FAQs:</th>
                <th>Replies:</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <tr key={index}>
                    <td className={styles.question}>{faq.question}</td>
                    <td dangerouslySetInnerHTML={{ __html: faq.reply }} />
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className={styles.noResults}>
                    No FAQs available for the selected student type.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Popup */}
        {popupVisible && (
          <div data-aos="zoom-out" className={styles.popup}>
            <div className={styles.popupContent}>
              <div className={styles.popupHeader}>
                <span>{popupContent}</span>
                <button onClick={closePopup} className={styles.closeButton}>
                  ✖
                </button>
              </div>
              <img src="/src/assets/academic-calendar.jpg" alt="Academic Calendar 1" />
              <img src="/src/assets/academic-calendar2.jpg" alt="Academic Calendar 2" />
              <img src="/src/assets/academic-calendar3.jpg" alt="Academic Calendar 3" />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerCopyright}>
            <p>
              © Copyright <span>Cavite State University</span>. All Rights Reserved
            </p>
            <p>
              Designed by <span className={styles.highlighted}>BSCS 3-5 Group 4</span>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default FAQs;
