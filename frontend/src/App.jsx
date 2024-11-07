import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from '/src/pages/MainPage.jsx';
import LoginPage from '/src/pages/LoginPage.jsx'; 
import CvsuHistory from './pages/CvsuHistory';
import MissionVision from './pages/MissionVision';
import DcsPage from './pages/DcsPage';
import SocOff from './pages/SocOff';
import Apply from './pages/Apply';
import Undergrad from './pages/Undergrad';
import EnrollmentOfficerDashboard from './pages/EnrollmentOfficerDashboard';
import SocOfficerDashboard from './pages/SocOfficerDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdviserDashboard from './pages/AdviserDashboard.jsx';
import DCSHeadDashboard from './pages/DCSHeadDashboard.jsx';
import SchoolHeadDashboard from './pages/SchoolHeadDashboard.jsx';
import SignUp from './pages/SignUp.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/CvsuHistory" element={<CvsuHistory />} />
        <Route path="/MissionVision" element={<MissionVision />} />
        <Route path="/DcsPage" element={<DcsPage />} />
        <Route path="/SocOff" element={<SocOff />} />
        <Route path="/Apply" element={<Apply />} />
        <Route path="/Undergrad" element={<Undergrad />} />
        <Route path="/EnrollmentOfficerDashboard" element={<EnrollmentOfficerDashboard />} />
        <Route path="/SocOfficerDashboard" element={<SocOfficerDashboard />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        <Route path="/AdviserDashboard" element={<AdviserDashboard />} />
        <Route path="/DCSHeadDashboard" element={<DCSHeadDashboard />} />
        <Route path="/SchoolHeadDashboard" element={<SchoolHeadDashboard />} />
        <Route path="/SignUp" element={<SignUp />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;