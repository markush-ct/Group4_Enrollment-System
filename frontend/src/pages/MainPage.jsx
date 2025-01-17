import React from "react";
import { useEffect } from "react";
import styles from "/src/styles/MainPage.module.css";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "/src/styles/globalToastStyles.css"; // for toastify css
import { useRef, useState } from "react";
import Header from "/src/components/Header.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import { useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "/src/styles/SwiperStyles.css";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom"; // FOR LINKING PAGE
import cl5 from '/src/assets/cl5.jpg';
import cl1 from '/src/assets/cl1.jpg';
import canteen from '/src/assets/canteen.jpg';
import hmlab from '/src/assets/hmlab.jpg'
import hmlab2 from '/src/assets/hmlab2.jpg';
import registrarpic from '/src/assets/registrarpic.jpg';
import room from '/src/assets/room.jpg';
import faculty from '/src/assets/faculty.jpg'
import gympic from '/src/assets/gympic.jpg';
import librarypic from '/src/assets/librarypic.jpg';
import newroom from '/src/assets/newroom.jpg'
import locationLogo from '/src/assets/location-logo.svg';
import emailLogo from '/src/assets/email-logo.svg'
import phoneLogo from '/src/assets/phone-logo.svg';
import cvsuLogo from '/src/assets/cvsu-logo.png';
import fbLogo from '/src/assets/facebook.png';

function MainPage() {
  const [SideBar, setSideBar] = useState(false);
  SideBar
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "auto");

  const emailUs = useRef(null);
  const [senderName, setSenderName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  {
    /* Linking contact section */
  }
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  {
    /* FOR ANIMATION */
  }
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_mpjmyfm", "template_b3wgc54", emailUs.current, {
        publicKey: "Z9nUoyrtbdrLWu_kT",
      })
      .then(
        () => {
          toast.success("Email sent successfully!", {
            position: "bottom-right",
            autoClose: 3000,
          });
          setSenderName("");
          setSubject("");
          setEmail("");
          setMessage("");
        },
        (error) => {
          toast.error(`Failed to send email: ${error}`, {
            position: "bottom-right",
            autoClose: 5000,
          });
        }
      );
  };

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={styles.mainPage}>
        <div
          className={`${styles.parallaxSection} ${styles.parallax1}`}
          data-testid="parallax-section1"
        >
          <h2 data-aos="fade-up">STEP INTO THE FUTURE WITH</h2>
          <h1 data-aos="fade-up">CAVITE STATE UNIVERSITY</h1>
          <Link to="/Apply">
            <button data-aos="fade-up" className={styles.mainButton}>
              <span>ENROLL NOW</span>
            </button>
          </Link>
        </div>

        <div data-aos="fade-up" className={styles.contentSection}>
          <h2>Welcome to Your Future in Technology</h2>
          <p>
            Are you ready to shape the future and be at the forefront of
            innovation?
          </p>
        </div>

        <div data-aos="fade-up" className={styles.galleryContainer}>
          {/* GALLERY SWIPER */}
          <div
            className={styles.galleryContainer}
            data-testid="swiper-container"
          >
            <div className="swiper-button-prev"></div>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              pagination={{ clickable: true }}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
            >
              <SwiperSlide>
                <div className={styles.galleryItem}>
                  <img src={cl5} alt="Image 1" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={styles.galleryItem}>
                  <img src={cl1} alt="Image 2" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={styles.galleryItem}>
                  <img src={canteen} alt="Image 3" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={styles.galleryItem}>
                  <img src={hmlab} alt="Image 4" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={styles.galleryItem}>
                  <img src={hmlab2} alt="Image 5" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={styles.galleryItem}>
                  <img src={registrarpic} alt="Image 6" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={styles.galleryItem}>
                  <img src={room} alt="Image 7" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={styles.galleryItem}>
                  <img src={faculty} alt="Image 8" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={styles.galleryItem}>
                  <img src={gympic} alt="Image 9" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={styles.galleryItem}>
                  <img src={librarypic} alt="Image 10" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={styles.galleryItem}>
                  <img src={newroom} alt="Image 11" />
                </div>
              </SwiperSlide>
            </Swiper>
            <div className="swiper-button-next"></div>
          </div>
        </div>

        <div
          className={`${styles.parallaxSection} ${styles.parallax2}`}
          data-testid="parallax-section2"
        >
          <h2 data-testid="join-us-now-heading">JOIN US NOW</h2>
          <h3>
            Taking a course in Computer Studies is a great way to prepare for a
            career in a world that&apos;s becoming more digital every day.
          </h3>
        </div>

        <div data-aos="fade-up" className={styles.contactSection} id="contact">
          <h1 className={styles.contactTitle}>Contact Us</h1>

          <div className={styles.contactInfo}>
            <div className={styles.contactCard}>
              <div className={styles.iconContainer}>
                <img
                  src={locationLogo}
                  alt="Location Icon"
                  className={styles.contactIcon}
                />
              </div>
              <h3>Our Address</h3>
              <p>Cavite State University - Bacoor Campus, Bacoor, Cavite.</p>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.iconContainer}>
                <img
                  src={emailLogo}
                  alt="Email Icon"
                  className={styles.contactIcon}
                />
              </div>
              <h3>Email Us</h3>
              <p>
                <a href="mailto:cvsubacoor@cvsu.edu.ph">
                  cvsubacoor@cvsu.edu.ph
                </a>
              </p>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.iconContainer}>
                <img
                  src={phoneLogo}
                  alt="Phone Icon"
                  className={styles.contactIcon}
                />
              </div>
              <h3>Call Us</h3>
              <p>
                <a href="tel:+0464765029">(046)476-5029</a>
              </p>
            </div>
          </div>

          <div data-aos="fade-up" className={styles.mapAndForm}>
            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7728.492551893659!2d120.98262883794918!3d14.412961712080733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d22f4810979f%3A0xaf0dae4457b7d498!2sCavite%20State%20University%20-%20Bacoor%20Campus!5e0!3m2!1sen!2sph!4v1698966659589!5m2!1sen!2sph"
                width="100%"
                height="400"
                style={{ border: "0" }}
                allowFullScreen=""
                loading="lazy"
                title="Cavite State University Bacoor Campus Map"
              ></iframe>
            </div>

            <div
              data-aos="fade-up"
              className={styles.contactForm}
              data-testid="emailUs"
            >
              <h1 className={styles.contactTitle}>Email Us</h1>
              <form
                ref={emailUs}
                onSubmit={sendEmail}
                data-testid="contact-form"
              >
                <div className={styles.formGroup}>
                  <input
                    value={senderName}
                    name="from_senderName"
                    type="text"
                    placeholder="Your Name"
                    onChange={(e) => {
                      setSenderName(e.target.value);
                    }}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    value={email}
                    name="from_email"
                    type="email"
                    placeholder="Your Email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    value={subject}
                    name="subject"
                    type="text"
                    placeholder="Subject"
                    onChange={(e) => {
                      setSubject(e.target.value);
                    }}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <textarea
                    value={message}
                    name="message"
                    placeholder="Message"
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                    required
                  ></textarea>
                </div>
                <button type="submit" className={styles.sendEmailBtn}>
                  <span>Send Message</span>
                </button>
              </form>
              <ToastContainer />
            </div>
          </div>
        </div>

        <footer className={styles.parallaxFooter} data-testid="parallax-footer">
          <div className={styles.parallaxContent}>
            <div className={styles.footerBranding}>
              <img
                src={cvsuLogo}
                alt="Cavite State University Logo"
                className={styles.footerLogo}
              />
              <h2>Cavite State University - Bacoor Campus</h2>
            </div>
            <p>The Future Begins Here!</p>

            <div className={styles.socialIcons}>
              <a
                href="https://www.facebook.com/CvSUBacoorCityCampus"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={fbLogo}
                  alt="Facebook"
                  className={styles.socialIcon}
                />
              </a>
            </div>
          </div>
        </footer>

        <footer
          className={styles.footerCopyright}
          data-testid="footer-copyright"
        >
          <p>
            © Copyright <span>Cavite State University</span>. All Rights
            Reserved.
          </p>
          <p>
            Designed by{" "}
            <span className={styles.highlighted}>BSCS 3-5 Group 4</span>
          </p>
        </footer>
      </div>
    </>
  );
}

export default MainPage;
