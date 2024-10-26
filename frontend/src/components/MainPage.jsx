import { useState } from 'react';
import { Link } from 'react-router-dom';
import '/src/styles/mainpage.css';

function MainPage() {
    return (
        <div className="main-page">
            {/* Parallax Section 1 */}
            <div className="parallax-section parallax1">
                <h2>STEP INTO THE FUTURE WITH</h2>
                <h1>CAVITE STATE UNIVERSITY</h1>
                <button className="main-button">ENROLL NOW</button>
            </div>

            {/* Regular Section */}
            <div className="content-section">
                <h2>Welcome to Your Future in Technology</h2>
                <p>Are you ready to shape the future and be at the forefront of innovation?</p>
            </div>

            {/* Pictures Section */}
            <div className="gallery-container">
                <div className="gallery-item">
                    <img src="/src/assets/cs1.jpg" alt="Image 1" />
                </div>
                <div className="gallery-item">
                    <img src="/src/assets/cs2.jpg" alt="Image 2" />
                </div>
                <div className="gallery-item">
                    <img src="/src/assets/it1.jpg" alt="Image 3" />
                </div>
                <div className="gallery-item">
                    <img src="/src/assets/it2.jpg" alt="Image 4" />
                </div>
            </div>

            {/* Parallax Section 2 */}
            <div className="parallax-section parallax2">
                <h2>Join us now</h2>
                <h3>Taking a course in Computer Studies is a great way to prepare for a career in a world that's becoming more digital every day.</h3>
            </div>



            {/* Contact Section */}
            <div className="contact-section">
                <h1 className="contact-title">Contact Us</h1>

                <div className="contact-info">
                    <div className="contact-card">
                        <div className="icon-container">
                            <img src="/src/assets/location-logo.svg" alt="Location Icon" className="contact-icon" />
                        </div>
                        <h3>Our Address</h3>
                        <p>Cavite State University - Bacoor Campus, Bacoor, Cavite</p>
                    </div>
                    <div className="contact-card">
                        <div className="icon-container">
                            <img src="/src/assets/email-logo.svg" alt="Email Icon" className="contact-icon" />
                        </div>
                        <h3>Email Us</h3>
                        <p><a href="mailto:kupal@gmail.com">kupal@gmail.com</a></p>
                    </div>
                    <div className="contact-card">
                        <div className="icon-container">
                            <img src="/src/assets/phone-logo.svg" alt="Phone Icon" className="contact-icon" />
                        </div>
                        <h3>Call Us</h3>
                        <p><a href="tel:+8177436898">(817) 743-6898</a></p>
                    </div>
                </div>

                <div className="map-and-form">
                    <div className="map-container">
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

                    <div className="contact-form">
                        <h3>Email Us</h3>
                        <form>
                            <div className="form-group">
                                <input type="text" placeholder="Your Name" required />
                                <input type="email" placeholder="Your Email" required />
                            </div>
                            <div className="form-group">
                                <input type="text" placeholder="Subject" required />
                            </div>
                            <div className="form-group">
                                <textarea placeholder="Message" required></textarea>
                            </div>
                            <button type="submit">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>

            <footer className="parallax-footer">
                <div className="parallax-content">
                    <div className="footer-branding">
                        <img src="/src/assets/cvsu-logo.png" alt="Cavite State University Logo" className="footer-logo" />
                        <h2>Cavite State University - Bacoor Campus</h2>
                    </div>
                    <p>The Future Begins Here!</p>

                    <div className="social-icons">
                        <a href="https://www.facebook.com/YourPage" target="_blank" rel="noopener noreferrer">
                            <img src="/src/assets/facebook.png" alt="Facebook" className="social-icon" />
                        </a>

                    </div>
                </div>

            </footer>
            <footer>
                <div className="footer-copyright">
                    <p>© Copyright <span>Cavite State University</span>. All Rights Reserved</p>
                    <p>Designed by <span className="highlighted">BSCS 3-5 Group 4</span></p>
                </div>
            </footer>
        </div>
    );
}

export default MainPage;