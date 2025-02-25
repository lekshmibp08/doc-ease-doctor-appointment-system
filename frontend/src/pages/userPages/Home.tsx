import HeroSection from "../../components/HeroSection";
import UserHeader from "../../components/UserHeader";
import HowItWorks from "../../components/HowItWorks";
import Footer from "../../components/Footer";
import DepartmentSlider from "../../components/DepartmentSlider";

const Home = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header at the top */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <UserHeader role="user" />
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto mt-[110px] mb-[50px] scrollbar-hidden"> 
        <HeroSection />
        <DepartmentSlider />
        <HowItWorks />
      </div>

      {/* Fixed Footer at the bottom */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white shadow-md">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
