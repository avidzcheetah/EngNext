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
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/profile';
import CompanyDashboard from './pages/company/CompanyDashboard';
import Companies from './pages/companies';

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
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/company/dashboard" element={<CompanyDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;