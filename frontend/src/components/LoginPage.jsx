import '/src/styles/LoginPage.css';
import UserIcon from '../assets/login-userlogo.svg';
import LockIcon from '../assets/login-pwlogo.svg';

function LoginPage() {
  return (
    <div className="container">
      <div className="form-container">
        <form>
          <div className="input-group">
            <div className="input-icon">
              <img src={UserIcon} alt="User Icon" />
            </div>
            <input type="text" placeholder="Username" required />
          </div>
          <div className="input-group">
            <div className="input-icon">
              <img src={LockIcon} alt="Lock Icon" />
            </div>
            <input type="password" placeholder="Temporary Password" required />
          </div>

          {/*Options Section */}
          <div className="options">
            <label className="remember-me">
              <input type="checkbox" name="remember" />
              Remember Me
            </label>
            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;