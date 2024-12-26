import DoctorAccountDetails from "./DoctorAccountDetails";
import DoctorProfileDetails from "./DoctorProfileDetails";

const DoctorProfile = () => {
  
  return (
    <div className="bg-blue-100 min-h-screen p-6">
      <div className="container mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Box */}        
        <DoctorAccountDetails/>

        {/* Right Box */}
        <DoctorProfileDetails/>
       
      </div>
    </div>
  );
};

export default DoctorProfile;
