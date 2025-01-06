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
import DoctorProfilePage from './pages/doctorPages/DoctorProfilePage';
import RequestPage from './pages/adminPages/RequestPage';
import ViewDocuments from './components/ViewDocuments';
import DoctorDetailsPage from './pages/userPages/DoctorDetailsPage';
import SlotManagementPage from './pages/doctorPages/SlotManagementPage';
import AppointmentBookingPage from './pages/userPages/AppointmentBookingPage';
import AppointmentPage from './pages/userPages/AppointmentsPage';
import AdminAppointmentPage from './pages/adminPages/AdminAppointmentPage';
import DocAppointmentManagementPage from './pages/doctorPages/DocAppointmentManagementPage';

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
        {/* DOCTOR PAGES*/}
        <Route path="/doctor/dashboard" 
          element={
          <RoleBasedRoute allowedRole={'doctor'}>
            <DoctorDashboard />
          </RoleBasedRoute>} 
        />

        <Route path="/doctor/profile" 
          element={
          <RoleBasedRoute allowedRole={'doctor'}>
            <DoctorProfilePage />
          </RoleBasedRoute>} 
        />

        <Route path="/doctor/slot-management" 
          element={
          <RoleBasedRoute allowedRole={'doctor'}>
            < SlotManagementPage />
          </RoleBasedRoute>} 
        />        

        <Route path="/doctor/appointment-management" 
          element={
          <RoleBasedRoute allowedRole={'doctor'}>
            < DocAppointmentManagementPage />
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
        <Route path="/admin/requests" 
          element={
          <RoleBasedRoute allowedRole={'admin'}>
            <RequestPage/>
          </RoleBasedRoute>} 
        />
        <Route path="/admin/users" 
          element={
          <RoleBasedRoute allowedRole={'admin'}>
            <UserManagement/>
          </RoleBasedRoute>} 
        />
        <Route path="/admin/doctors/view-documents/:id" 
          element={
            <RoleBasedRoute allowedRole={'admin'}>
            <ViewDocuments/>
          </RoleBasedRoute>} 
        />

        <Route path="/admin/appointments" 
          element={
          <RoleBasedRoute allowedRole={'admin'}>
            <AdminAppointmentPage/>
          </RoleBasedRoute>} 
        />


        {/* USER PAGES*/}
        <Route path="/doctors" 
          element={
          <RoleBasedRoute allowedRole={'user'}>
            <DoctorList />
          </RoleBasedRoute>} 
        />
        <Route path="/doctor/details/:id" 
          element={
          <RoleBasedRoute allowedRole={'user'}>
            <DoctorDetailsPage />
          </RoleBasedRoute>} 
        />
        <Route path="/book-appoinment/:doctorId" 
          element={
          <RoleBasedRoute allowedRole={'user'}>
            < AppointmentBookingPage />
          </RoleBasedRoute>} 
        />

        <Route path="/profile" 
          element={
          <RoleBasedRoute allowedRole={'user'}>
            <ProfilePage />
          </RoleBasedRoute>} 
        />

        <Route path="/appointments" 
          element={
          <RoleBasedRoute allowedRole={'user'}>
            <AppointmentPage />
          </RoleBasedRoute>} 
        />

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

      </Routes>
    </Router>
  );
};

export default App;
