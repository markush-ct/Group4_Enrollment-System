import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from '/src/pages/MainPage.jsx';
import LoginPage from '/src/pages/LoginPage.jsx'; 
import CvsuHistory from './pages/CvsuHistory';
import MissionVision from './pages/MissionVision';
import DcsPage from './pages/DcsPage';
import SocOff from './pages/SocOff';
import Apply from './pages/Apply';
import FAQs from './pages/FAQs';
import Undergrad from './pages/Undergrad';
import EnrollmentOfficerDashboard from './pages/EnrollmentOfficerDashboard';
import SocOfficerDashboard from './pages/SocOfficerDashboard';
import AdviserDashboard from './pages/AdviserDashboard.jsx';
import DCSHeadDashboard from './pages/DCSHeadDashboard.jsx';
import SchoolHeadDashboard from './pages/SchoolHeadDashboard.jsx';
import SignUp from './pages/SignUp.jsx';
import CreateAcc from './pages/CreateAcc.jsx';
import AccountRequest from './pages/AccountRequest.jsx';
import ForgotPass from './pages/ForgotPass.jsx';
import FreshmanDashboard from './pages/FreshmanDashboard.jsx';
import TransfereeDashboard from './pages/TransfereeDashboard.jsx';
import RegIrregDashboard from './pages/RegIrregDashboard.jsx';
import FreshmenAdmissionForm from './pages/FreshmenAdmissionForm.jsx';
import TransfereeAdmissionForm from './pages/TransfereeAdmissionForm.jsx';
import AccountSettings from './components/AccountSettings.jsx';
import AccountSettingsStudent from './components/AccountSettingsStudent.jsx';
import ClassSchedule from './pages/ClassSchedule.jsx';
import AdminPreEnrollment from './pages/AdminPreEnrollment.jsx';
import EnrollmentRegular from './pages/EnrollmentRegular.jsx';
import EnrollmentIrregular from './pages/EnrollmentIrregular.jsx';
import ShiftingRequest from './pages/ShiftingRequest.jsx';
import ShifteeForm from './pages/ShifteeForm.jsx';
import SocFee from './pages/SocFee.jsx';
import Requirements from './pages/Requirements.jsx';
import SchedManagement from './pages/SchedManagement.jsx';
import DownloadAdmissionForm from './components/DownloadAdmissionForm.jsx';
import DownloadShiftingForm from './components/DownloadShiftingForm.jsx';
import FreshmenAdmissionRequest from './pages/FreshmenAdmissionRequests.jsx';
import TransfereeAdmissionRequest from './pages/TransfereeAdmissionRequests.jsx';
import AccountManagement from './pages/AccountManagement.jsx';
import StudentChecklist from './pages/StudentChecklist.jsx';
import Advising from './pages/Advising.jsx';
import AdminEnrollment from './pages/AdminEnrollment.jsx';
import StudentInformation from './pages/StudentInformation.jsx';

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
        <Route path="/FAQs" element={<FAQs />} />
        <Route path="/Undergrad" element={<Undergrad />} />
        <Route path="/EnrollmentOfficerDashboard" element={<EnrollmentOfficerDashboard />} />
        <Route path="/SocOfficerDashboard" element={<SocOfficerDashboard />} />
        <Route path="/FreshmanDashboard" element={<FreshmanDashboard />} />
        <Route path="/TransfereeDashboard" element={<TransfereeDashboard />} />
        <Route path="/RegIrregDashboard" element={<RegIrregDashboard />} />
        <Route path="/AdviserDashboard" element={<AdviserDashboard />} />
        <Route path="/DCSHeadDashboard" element={<DCSHeadDashboard />} />
        <Route path="/SchoolHeadDashboard" element={<SchoolHeadDashboard />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/CreateAcc" element={<CreateAcc />} />
        <Route path="/AccountRequest" element={<AccountRequest />} />
        <Route path="/ForgotPass" element={<ForgotPass />} />
        <Route path="/FreshmenAdmissionForm" element={<FreshmenAdmissionForm />} />
        <Route path="/TransfereeAdmissionForm" element={<TransfereeAdmissionForm />} />
        <Route path="/AccountSettings" element={<AccountSettings />} />
        <Route path="/AccountSettingsStudent" element={<AccountSettingsStudent />} />
        <Route path="/ClassSchedule" element={<ClassSchedule />} />
        <Route path="/AdminPreEnrollment" element={<AdminPreEnrollment />} />
        <Route path="/EnrollmentRegular" element={<EnrollmentRegular />} />
        <Route path="/EnrollmentIrregular" element={<EnrollmentIrregular />} />
        <Route path="/ShiftingRequest" element={<ShiftingRequest />} />
        <Route path="/ShifteeForm" element={<ShifteeForm />} />
        <Route path="/SocFee" element={<SocFee />} />
        <Route path="/Requirements" element={<Requirements />} />
        <Route path="/SchedManagement" element={<SchedManagement />} />
        <Route path="/download-form/:id" element={<DownloadAdmissionForm />} />
        <Route path="/download-shiftingform/:id" element={<DownloadShiftingForm />} />
        <Route path="/FreshmenAdmissionRequest" element={<FreshmenAdmissionRequest />} />
        <Route path="/TransfereeAdmissionRequest" element={<TransfereeAdmissionRequest />} />
        <Route path="/AccountManagement" element={<AccountManagement />} />
        <Route path="/StudentChecklist" element={<StudentChecklist />} />
        <Route path="/Advising" element={<Advising />} />
        <Route path="/AdminEnrollment" element={<AdminEnrollment />} />
        <Route path="/StudentInformation" element={<StudentInformation />} />        
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;