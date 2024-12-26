import HeroSection from "../../components/HeroSection"
import UserHeader from "../../components/UserHeader"
import DepartmentCard from "../../components/DepartmentCard"
import HowItWorks from "../../components/HowItWorks"
import Footer from "../../components/Footer"

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader role="user"/>
      <HeroSection/>
      <DepartmentCard/>
      <HowItWorks/>
      <Footer/>
    </div>
  )
}

export default Home
