import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Unauthorized from './pages/Unauthorized';
import RoleBasedRoute from './components/RoleBasedRoute';
import DoctorLogin from './pages/DoctorLogin';
import DoctorSignup from './pages/DoctorSignup';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminLogin from './pages/adminPages/AdminLogin';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/doctor/login" element={<DoctorLogin/>} />
        <Route path="/doctor/signup" element={<DoctorSignup />} />
        <Route path="/admin/login" element={<AdminLogin/>} />
        
        
        {/* User-Specific Pages */}
        
        <Route path="/doctor/dashboard" 
          element={
          <RoleBasedRoute allowedRole={'doctor'}>
            <DoctorDashboard />
          </RoleBasedRoute>} 
        />

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

      </Routes>
    </Router>
  );
};

export default App;
