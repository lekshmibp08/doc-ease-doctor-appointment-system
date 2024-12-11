import useLogout from '../../hooks/useLogout';

const AdminDashboard = () => {

    const logout = useLogout();    

    return (<>
        <h1>ADMIN DASHBOARD</h1>
        <button
            onClick={logout}
            className="bg-red-500 text-white p-2 rounded"
          >
            Logout
          </button>
    
    </>)
}

export default AdminDashboard
