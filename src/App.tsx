import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import About from './pages/about';
import Contact from './pages/contact';
import LoginPage from './pages/auth/LoginPage';
import RegisterStudentPage from './pages/auth/RegisterStudentPage';
import RegisterCompanyPage from './pages/auth/RegisterCompanyPage';
import RegisterAdminPage from './pages/auth/RegisterAdminPage';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/profile';
import CompanyDashboard from './pages/company/CompanyDashboard';
import ApplicationsPage from './pages/company/application';
// import CompanyProfile from './pages/company/profile';
import Companies from './pages/companies';
import PublicStudentProfile from './pages/student/PublicProfile';
import PublicCompanyProfile from './pages/company/PublicProfile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/auth/AdminLogin';
import AllStudents from './pages/admin/allStudents';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register/student" element={<RegisterStudentPage />} />
              <Route path="/register/company" element={<RegisterCompanyPage />} />
              <Route path="/register/admin" element={<RegisterAdminPage />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/company/dashboard" element={<CompanyDashboard />} />
              <Route path="/company/application" element={<ApplicationsPage/>} />
              <Route path="/student/publicprofile/:id" element={<PublicStudentProfile />} />
              <Route path="/company/publicprofile/:id" element={<PublicCompanyProfile />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/adminlogin" element={<AdminLogin/>} />
              <Route path="/students" element={<AllStudents />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;