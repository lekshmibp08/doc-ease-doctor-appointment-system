import UserAccountDetails from './UserAccountDetails';
import UserProfileDetails from './UserProfileDetails';

const UserProfile = () => {
  
  return (
    <div className="bg-customBgLight min-h-screen p-6">
      <div className="container mx-auto flex flex-col lg:flex-row gap-6">
        <UserAccountDetails/>
        <UserProfileDetails
        />
      </div>
    </div>
  );
};

export default UserProfile;
