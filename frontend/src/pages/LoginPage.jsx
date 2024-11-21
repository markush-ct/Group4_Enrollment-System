import { useEffect, useState } from 'react';
import styles from '/src/styles/LoginPage.module.css';
import Header from '/src/components/Header.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {

    const [signUpPrompt, setsignUpPrompt] = useState(false); //success
    const [signUpMsg, setsignUpMsg] = useState("");
    const [errorPrompt, setErrorPrompt] = useState(false); //errors
    const [errorMsg, setErrorMsg] = useState("");
    
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    {/* NECESSARY FOR OTHER MAIN PAGES TO AVOID ROLLING BACK WHEN LOGGED IN. COPY TOGETHER WITH NECESSARY IMPORTED MODULES */}
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    useEffect(() => {
        axios.get('http://localhost:8080')
            .then(res => {
                if (res.data.valid) {
                    if(res.data.role === 'Enrollment Officer'){
                        navigate('/EnrollmentOfficerDashboard');
                    } else if (res.data.role === 'Student') {
                        navigate('/StudentDashboard');
                    } else if (res.data.role === 'Society Officer') {
                        navigate('/SocOfficerDashboard');
                    } else if (res.data.role === 'Adviser') {
                        navigate('/AdviserDashboard');
                    } else if (res.data.role === 'DCS Head') {
                        navigate('/DCSHeadDashboard');
                    } else if (res.data.role === 'School Head') {
                        navigate('/SchoolHeadDashboard');
                    }
                } else {
                    navigate('/LoginPage');
                }
            })
            .catch(err => alert("Error: " + err))
    }, []);
    {/* NECESSARY FOR OTHER MAIN PAGES TO AVOID ROLLING BACK WHEN LOGGED IN. COPY TOGETHER WITH NECESSARY IMPORTED MODULES */}

    const submitLogin = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8080/LoginPage', values)
            .then((res) => {
                if (res.data.isLoggedIn && res.data.status === 'Active') {
                    const role = res.data.role;


                        if (role === 'Enrollment Officer') {
                            navigate('/EnrollmentOfficerDashboard');
                        } else if (role === 'Student') {
                            navigate('/StudentDashboard');
                        } else if (role === 'Society Officer') {
                            navigate('/SocOfficerDashboard');
                        } else if (role === 'Adviser') {
                            navigate('/AdviserDashboard');
                        } else if (role === 'DCS Head') {
                            navigate('/DCSHeadDashboard');
                        } else if (role === 'School Head') {
                            navigate('/SchoolHeadDashboard');
                        } else {
                            navigate('/LoginPage'); // Fallback route if role is not recognized
                        }
                } else {
                    setsignUpPrompt(false);
                    setsignUpMsg(false);
                    setErrorPrompt(true);
                    setErrorMsg(res.data.message);
                    setError('');
                    res.data.isLoggedIn = false;
                }
            })
            .catch((err) => {
                setError('Login failed. Please try again.');
                console.error(err);
            });
    };

    const [SideBar, setSideBar] = useState(false);
    SideBar ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <>

            <Header SideBar={SideBar} setSideBar={setSideBar} />
            <div className={styles.mainPage}>
                <div data-aos="fade-up" className={styles.PageTitle}>Log In</div>
                <div data-aos="fade-up" className={styles.formContainer}>
                    <form onSubmit={submitLogin}>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputIcon}>
                                <img src="/src/assets/login-userlogo.svg" alt="User Icon" />
                            </div>
                            <input name='email' type="email" placeholder="Username" onChange={(e) => setValues({ ...values, email: e.target.value })} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputIcon}>
                                <img src="/src/assets/login-pwlogo.svg" alt="Lock Icon" />
                            </div>
                            <input name='password' type={showPassword ? "text" : "password"} placeholder="Password" onChange={(e) => setValues({ ...values, password: e.target.value })} required />
                            <div className={styles.togglePasswordIcon} onClick={togglePasswordVisibility}>
                <img title='Show/Hide Password'
                    src={showPassword ? "/src/assets/showPass.png" : "/src/assets/hidePass.png"} 
                    alt={showPassword ? "Hide Password" : "Show Password"} 
                />
            </div>
                        </div>


                        {/* SIGN UP PROMPT */}
            {/* SUCCESS PROMPT */}
            {signUpPrompt && (
                <div data-aos="zoom-out" data-aos-duration="500" className={styles.popup}>
                    <div className={styles.popupContent}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setsignUpPrompt(false)}
                        >
                            &times;
                        </button>
                        <div className={styles.popupHeader}>
                            <h2>Success</h2>
                        </div>
                        <div className={styles.Message}>
                        <img src="/src/assets/checkmark.png" alt="Success Icon" className={styles.messageImage} />
                        </div>
                        <p className={styles.popupText}>{signUpMsg}</p>
                    </div>
                </div>
            )}

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
                        <div className={styles.MessageError} >
                            <img src="/src/assets/errormark.png" alt="Error Icon" className={styles.messageImage} />
                        </div>
                        <p className={styles.popupTextError}>{errorMsg}</p>
                    </div>
                </div>
            )}
                        

                        <div className={styles.options}>
                            <label className={styles.rememberMe}>
                                <input type="checkbox" name="remember" title='Remember my username for next time' />
                                Remember Me
                            </label>
                            <a href="/forgot-password" className={styles.forgotPassword}>Forgot Password?</a>
                        </div>

                        {error && <p className={styles.errorMessage}>{error}</p>}
                        <button type="submit" className={styles.loginButton}><span>LOGIN</span></button>
                    </form>

                    <div className={styles.createAcc}>
                        <p>Don&apos;t have an account? <Link to='/CreateAcc' className={styles.createAccBtn}>Create an account</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
