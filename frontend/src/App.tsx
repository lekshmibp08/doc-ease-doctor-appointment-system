import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Unauthorized from './pages/Unauthorized';
import RoleBasedRoute from './components/RoleBasedRoute';
import DoctorLogin from './pages/DoctorLogin';
import DoctorSignup from './pages/DoctorSignup';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminLogin from './pages/adminPages/AdminLogin';
import AdminDashboard from './pages/adminPages/AdminDashboard';
import UserLogin from './pages/userPages/UserLogin';
import Home from './pages/userPages/Home';
import DoctorList from './pages/userPages/DoctorList';
import UserSignup from './pages/userPages/UserSignup';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/admin/login" element={<AdminLogin/>} />
        <Route path="/doctor/login" element={<DoctorLogin/>} />
        <Route path="/doctor/signup" element={<DoctorSignup />} />
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/user/login" element={<UserLogin/>} />
        <Route path="/" element={<Home/>} />
        
        
        {/* User-Specific Pages */}
        
        <Route path="/doctor/dashboard" 
          element={
          <RoleBasedRoute allowedRole={'doctor'}>
            <DoctorDashboard />
          </RoleBasedRoute>} 
        />
        <Route path="/admin/dashboard" 
          element={
          <RoleBasedRoute allowedRole={'admin'}>
            <AdminDashboard />
          </RoleBasedRoute>} 
        />
        <Route path="/doctors" 
          element={
          <RoleBasedRoute allowedRole={'user'}>
            <DoctorList />
          </RoleBasedRoute>} 
        />

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

      </Routes>
    </Router>
  );
};

export default App;
