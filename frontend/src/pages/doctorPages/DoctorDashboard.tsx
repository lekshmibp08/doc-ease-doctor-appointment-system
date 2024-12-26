import UserHeader from "../../components/UserHeader";
import useLogout from "../../hooks/useLogout";


const DoctorDashboard = () => {

  const logout = useLogout();

  return (
    <div>
      <UserHeader role="doctor"/>
      <h1>Doctor Dashboard</h1>
      
      <button
        onClick={logout}
        className="bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  )
}

export default DoctorDashboard
