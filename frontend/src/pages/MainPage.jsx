import { useEffect } from 'react';
import styles from '../styles/MainPage.module.css';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '/src/styles/globalToastStyles.css'; // for toastify css 
import { useRef, useState } from 'react';
import Header from '../components/Header.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/SwiperStyles.css'; 
import { Navigation, Pagination } from 'swiper/modules';


function MainPage() {
    const [SideBar, setSideBar] = useState(false);
    SideBar ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';

    const emailUs = useRef(null);
    const [senderName, setSenderName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    

    {/* Linking contact section */ }
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [location]);

    {/* FOR ANIMATION */ }
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm('service_mpjmyfm', 'template_b3wgc54', emailUs.current, {
                publicKey: 'Z9nUoyrtbdrLWu_kT',
            })
            .then(
                () => {
                    toast.success('Email sent successfully!', {
                        position: 'bottom-right',
                        autoClose: 3000,
                    });
                    setSenderName('');
                    setEmail('');
                    setMessage('');
                },
                (error) => {
                    toast.error(`Failed to send email: ${error}`, {
                        position: 'bottom-right',
                        autoClose: 5000,
                    });
                }
            );
    };

    

    return (
        <>
            <Header SideBar={SideBar} setSideBar={setSideBar} />
            <div className={styles.mainPage}>
                <div className={`${styles.parallaxSection} ${styles.parallax1}`}>
                    <h2>STEP INTO THE FUTURE WITH</h2>
                    <h1>CAVITE STATE UNIVERSITY</h1>
                    <button className={styles.mainButton}><span>ENROLL NOW</span></button>
                </div>

                <div data-aos="fade-up" className={styles.contentSection}>
                    <h2>Welcome to Your Future in Technology</h2>
                    <p>Are you ready to shape the future and be at the forefront of innovation?</p>
                </div>

                <div data-aos="fade-up" className={styles.galleryContainer}>
                
                {/* GALLERY SWIPER */}
<div className={styles.galleryContainer}>
    <div className="swiper-button-prev"></div>
    <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }}
        pagination={{ clickable: true }}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
    >
        <SwiperSlide>
            <div className={styles.galleryItem}>
                <img src="/src/assets/cl5.jpg" alt="Image 1" />
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className={styles.galleryItem}>
                <img src="/src/assets/cl1.jpg" alt="Image 2" />
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className={styles.galleryItem}>
                <img src="/src/assets/canteen.jpg" alt="Image 3" />
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className={styles.galleryItem}>
                <img src="/src/assets/hmlab.jpg" alt="Image 4" />
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className={styles.galleryItem}>
                <img src="/src/assets/hmlab2.jpg" alt="Image 5" />
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className={styles.galleryItem}>
                <img src="/src/assets/registrarpic.jpg" alt="Image 6" />
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className={styles.galleryItem}>
                <img src="/src/assets/room.jpg" alt="Image 7" />
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className={styles.galleryItem}>
                <img src="/src/assets/faculty.jpg" alt="Image 8" />
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className={styles.galleryItem}>
                <img src="/src/assets/gympic.jpg" alt="Image 9" />
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className={styles.galleryItem}>
                <img src="/src/assets/librarypic.jpg" alt="Image 10" />
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className={styles.galleryItem}>
                <img src="/src/assets/newroom.jpg" alt="Image 11" />
            </div>
        </SwiperSlide>
    </Swiper>
    <div className="swiper-button-next" ></div>
</div>

</div>

                <div className={`${styles.parallaxSection} ${styles.parallax2}`}>
                    <h2>JOIN US NOW</h2>
                    <h3>Taking a course in Computer Studies is a great way to prepare for a career in a world that&apos;s becoming more digital every day.</h3>
                </div>

                <div data-aos="fade-up" className={styles.contactSection} id='contact'>
                    <h1 className={styles.contactTitle}>Contact Us</h1>

                    <div className={styles.contactInfo}>
                        <div className={styles.contactCard}>
                            <div className={styles.iconContainer}>
                                <img src="/src/assets/location-logo.svg" alt="Location Icon" className={styles.contactIcon} />
                            </div>
                            <h3>Our Address</h3>
                            <p>Cavite State University - Bacoor Campus, Bacoor, Cavite</p>
                        </div>
                        <div className={styles.contactCard}>
                            <div className={styles.iconContainer}>
                                <img src="/src/assets/email-logo.svg" alt="Email Icon" className={styles.contactIcon} />
                            </div>
                            <h3>Email Us</h3>
                            <p><a href="mailto:cvsubacoor@cvsu.edu.ph">cvsubacoor@cvsu.edu.ph</a></p>
                        </div>
                        <div className={styles.contactCard}>
                            <div className={styles.iconContainer}>
                                <img src="/src/assets/phone-logo.svg" alt="Phone Icon" className={styles.contactIcon} />
                            </div>
                            <h3>Call Us</h3>
                            <p><a href="tel:+0464765029">(046)476-5029</a></p>
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
                                title="Cavite State University Bacoor Campus Map">
                            </iframe>
                        </div>

                        <div data-aos="fade-up" className={styles.contactForm}>
                            <h1 className={styles.contactTitle}>Email Us</h1>
                            <form ref={emailUs} onSubmit={sendEmail}>
                                <div className={styles.formGroup}>
                                    <input value={senderName} name='from_senderName' type="text" placeholder="Your Name" onChange={(e) => { setSenderName(e.target.value); }} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <input value={email} name='from_email' type="email" placeholder="Your Email" onChange={(e) => { setEmail(e.target.value); }} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <input value={subject} name='subject' type="text" placeholder="Subject" onChange={(e) => { setSubject(e.target.value); }} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <textarea value={message} name='message' placeholder="Message" onChange={(e) => { setMessage(e.target.value); }} required ></textarea>
                                </div>
                                <button type="submit" className={styles.sendEmailBtn}><span>Send Message</span></button>
                            </form>
                            <ToastContainer />
                        </div>
                    </div>
                </div>

                <footer className={styles.parallaxFooter}>
                    <div className={styles.parallaxContent}>
                        <div className={styles.footerBranding}>
                            <img src="/src/assets/cvsu-logo.png" alt="Cavite State University Logo" className={styles.footerLogo} />
                            <h2>Cavite State University - Bacoor Campus</h2>
                        </div>
                        <p>The Future Begins Here!</p>

                        <div className={styles.socialIcons}>
                            <a href="https://www.facebook.com/YourPage" target="_blank" rel="noopener noreferrer">
                                <img src="/src/assets/facebook.png" alt="Facebook" className={styles.socialIcon} />
                            </a>
                        </div>
                    </div>
                </footer>

                <footer className={styles.footerCopyright}>
                    <p>© Copyright <span>Cavite State University</span>. All Rights Reserved</p>
                    <p>Designed by <span className={styles.highlighted}>BSCS 3-5 Group 4</span></p>
                </footer>
            </div>
        </>
    );
}

export default MainPage;
