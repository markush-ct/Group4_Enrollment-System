import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from '/src/components/MainPage.jsx';
import Header from '/src/components/Header.jsx';
import LoginPage from '/src/components/LoginPage.jsx'; 

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;