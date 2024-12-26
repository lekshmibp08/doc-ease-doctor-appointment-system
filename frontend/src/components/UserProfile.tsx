import UserAccountDetails from './UserAccountDetails';
import UserProfileDetails from './UserProfileDetails';

const UserProfile = () => {
  
  return (
    <div className="bg-blue-100 min-h-screen p-6">
      <div className="container mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Box */}        
        <UserAccountDetails/>

        {/* Right Box */}
        <UserProfileDetails
        />
      </div>
    </div>
  );
};

export default UserProfile;
