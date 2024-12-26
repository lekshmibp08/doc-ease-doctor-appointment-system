import Doctors from "../../components/Doctors"
import Footer from "../../components/Footer"
import UserHeader from "../../components/UserHeader"

const DoctorList = () => {
  return (
    <>
      <UserHeader role="user"/>
      <Doctors/>
      <Footer/>
    </>
  )
}

export default DoctorList
