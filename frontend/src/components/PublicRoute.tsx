import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

interface PublicRouteProps {
  children: JSX.Element;
  redirectTo: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectTo }) => {
  const { token } = useSelector((state: RootState) => state.auth);

  if (token) {
    // Redirect to the specified path if token exists
    return <Navigate to={redirectTo} replace />;
  }

  // Render the public page if no valid token
  return children;
};

export default PublicRoute;
