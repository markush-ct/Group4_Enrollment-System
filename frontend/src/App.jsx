import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SidebarMenu from '/src/components/SidebarMenu.jsx'; 
import MainPage from '/src/components/MainPage.jsx';
import LoginPage from '/src/components/LoginPage.jsx'; 

function App() {
  return (
    <Router>
      <SidebarMenu />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;