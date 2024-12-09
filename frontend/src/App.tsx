import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DoctorSignup from './pages/DoctorSignup';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/doctor/login" element={<LoginPage />} />
        <Route path="/doctor/signup" element={<DoctorSignup />} />
      </Routes>
    </Router>
  );
};

export default App;
