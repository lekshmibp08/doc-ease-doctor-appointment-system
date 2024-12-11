
const AdminHeader = () => {
  return (
    <div className="w-full bg-customTeal text-white py-6 px-4 text-center md:text-left">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Admin Area</h1>
            <p className="text-lg">Control Your Client From Here</p>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="text-5xl" style={{ fontFamily: "'Lobster', cursive" }}
          >
            DocEase
          </div>
          <i className="fas fa-stethoscope text-white text-4xl"></i>
        </div>
    </div>
  </div>    
  )
}

export default AdminHeader
