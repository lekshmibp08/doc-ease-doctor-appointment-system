import UserHeader from '../../components/UserHeader'
import Footer from '../../components/Footer'
import DoctorProfile from '../../components/DoctorProfile'

const DoctorProfilePage = () => {
  return (
    <>
        <UserHeader role="doctor"/>
        <DoctorProfile/>
        <Footer/>
      
    </>
  )
}

export default DoctorProfilePage
