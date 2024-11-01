import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from '/src/pages/MainPage.jsx';
import Header from '/src/components/Header.jsx';
import LoginPage from '/src/pages/LoginPage.jsx'; 
import CvsuHistory from './pages/CvsuHistory';
import MissionVision from './pages/MissionVision';
import DcsPage from './pages/DcsPage';
import SocOff from './pages/SocOff';
import Apply from './pages/Apply';
import Undergrad from './pages/Undergrad';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/CvsuHistory" element={<CvsuHistory />} />
        <Route path="/MissionVision" element={<MissionVision />} />
        <Route path="/DcsPage" element={<DcsPage />} />
        <Route path="/SocOff" element={<SocOff />} />
        <Route path="/Apply" element={<Apply />} />
        <Route path="/Undergrad" element={<Undergrad />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;