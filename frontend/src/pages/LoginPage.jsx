import { useEffect, useState } from 'react';
import styles from '/src/styles/LoginPage.module.css';
import Header from '/src/components/Header.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
    const [values, setValues] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const submitLogin = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8080/LoginPage', values)
            .then((res) => {
                if (res.data.message === 'Login successful') {
                    const role = res.data.role;

                    // Redirect based on role
                    if (role === 'Enrollment Officer') {
                        navigate('/AdminDashboard');
                    } else if (role === 'Student') {
                        navigate('/');
                    } else if (role === '') {
                        navigate('/');
                    } else {
                        navigate('/LoginPage'); // Fallback route if role is not recognized
                    }
                } else {
                    setError(res.data.message);
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
                            <input name='password' type="password" placeholder="Password" onChange={(e) => setValues({ ...values, password: e.target.value })} required />
                        </div>

                        <div className={styles.options}>
                            <label className={styles.rememberMe}>
                                <input type="checkbox" name="remember" />
                                Remember Me
                            </label>
                            <a href="/forgot-password" className={styles.forgotPassword}>Forgot Password?</a>
                        </div>

                        {error && <p className={styles.errorMessage}>{error}</p>}
                        <button type="submit" className={styles.loginButton}><span>LOGIN</span></button>
                    </form>

                    <div className={styles.createAcc}>
                        <p>Don&apos;t have an account? <Link to='/' className={styles.createAccBtn}>Create an account</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
