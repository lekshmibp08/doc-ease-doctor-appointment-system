import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

interface RoleBasedRouteProps {
  allowedRole: string;
  children: JSX.Element;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRole, children }) => {
  const { token, role } = useSelector((state: RootState) => state.auth);

  // Log details only in development
    console.log("allowedRole: ", allowedRole);
    console.log("Role: ", role);
    console.log("TOKEN: ", token);

  // Redirect to the appropriate login page if token is missing
  if (!token || token.trim() === "") {
    const loginPath = allowedRole === 'admin' ? '/admin/login' : allowedRole === 'doctor' ? '/doctor/login' : '/user/login';
    console.log("LOGIN PATH: ", loginPath);
    
    return <Navigate to={loginPath} replace />;
  }

  // Redirect to unauthorized page if the role is not allowed
  if (!role || allowedRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the child component if the role matches
  return children;
};

export default RoleBasedRoute;
