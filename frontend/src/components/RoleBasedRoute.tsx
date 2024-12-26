import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

interface IRoleBasedRouteProps {
  allowedRole: 'user' | 'doctor' | 'admin'; // Explicitly define allowed roles
  children: JSX.Element;
}

const RoleBasedRoute = ({ allowedRole, children }: IRoleBasedRouteProps) => {

  const userToken = useSelector((state: RootState) => state.userAuth.token);
  const doctorToken = useSelector((state: RootState) => state.doctorAuth.token);
  const adminToken = useSelector((state: RootState) => state.adminAuth.token);

  let token = null;
  if (allowedRole === 'user') token = userToken;
  if (allowedRole === 'doctor') token = doctorToken;
  if (allowedRole === 'admin') token = adminToken;

  console.log("Allowed Role: ", allowedRole);
  console.log("Token: ", token);

  if (!token || token.trim() === "") {
    const loginPath =
      allowedRole === 'admin'
        ? '/admin/login'
        : allowedRole === 'doctor'
        ? '/doctor/login'
        : '/user/login';

    console.log("Redirecting to login path:", loginPath);
    return <Navigate to={loginPath} replace />;
  }

  // Render the child component if the token is valid
  return children;
};

export default RoleBasedRoute;
