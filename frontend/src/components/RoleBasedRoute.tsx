import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

interface RoleBasedRouteProps {
  allowedRole: string;
  children: JSX.Element;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRole, children }) => {

  const { token, role } = useSelector((state: RootState) => state.auth)
  console.log("allowedRole: ", allowedRole);
  console.log("Role: ", role);
  
  

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/doctor/login" replace />;
  }

  if (allowedRole !== role) {
    // If role is not allowed, redirect to an unauthorized page or login
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the page if role is allowed
  return children;
};

export default RoleBasedRoute;
