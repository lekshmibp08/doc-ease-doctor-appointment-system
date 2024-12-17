import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Unauthorized from './pages/Unauthorized';
import RoleBasedRoute from './components/RoleBasedRoute';
import DoctorLogin from './pages/doctorPages/DoctorLogin';
import DoctorSignup from './pages/doctorPages/DoctorSignup';
import DoctorDashboard from './pages/doctorPages/DoctorDashboard';
import AdminLogin from './pages/adminPages/AdminLogin';
import AdminDashboard from './pages/adminPages/AdminDashboard';
import UserLogin from './pages/userPages/UserLogin';
import Home from './pages/userPages/Home';
import DoctorList from './pages/userPages/DoctorList';
import UserSignup from './pages/userPages/UserSignup';
import ProfilePage from './pages/userPages/ProfilePage';
import PractitionersPage from './pages/adminPages/PractitionersPage';
import UserManagement from './pages/adminPages/UserManagement';


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
        <Route path="/doctors" element={<DoctorList/>} />
        <Route path="/profile" element={<ProfilePage/>} />

        
        
        {/* User-Specific Pages */}
        {/* DOCTOR PAGES*/}
        <Route path="/doctor/dashboard" 
          element={
          <RoleBasedRoute allowedRole={'doctor'}>
            <DoctorDashboard />
          </RoleBasedRoute>} 
        />

        {/* ADMIN PAGES*/}        
        <Route path="/admin/dashboard" 
          element={
          <RoleBasedRoute allowedRole={'admin'}>
            <AdminDashboard />
          </RoleBasedRoute>} 
        />
        <Route path="/admin/doctors" 
          element={
          <RoleBasedRoute allowedRole={'admin'}>
            <PractitionersPage/>
          </RoleBasedRoute>} 
        />
        <Route path="/admin/users" 
          element={
          <RoleBasedRoute allowedRole={'admin'}>
            <UserManagement/>
          </RoleBasedRoute>} 
        />

        {/* USER PAGES*/}
        {/*
        <Route path="/doctors" 
          element={
          <RoleBasedRoute allowedRole={'user'}>
            <DoctorList />
          </RoleBasedRoute>} 
        />
        */}

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

      </Routes>
    </Router>
  );
};

export default App;
