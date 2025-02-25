import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import UserHeader from '../../components/UserHeader';
import Footer from '../../components/Footer';
import AppointmentContainer from '../../components/AppointmentContainer';
import { IPractitioner } from '@/types/interfaces';


const AppointmentBookingPage = () => {

    const { doctorId } = useParams<{ doctorId: string }>(); 
    const [doctor, setDoctor] = useState<Partial<IPractitioner> | null>(null);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
          try {
            const response = await axios.get(`/api/users/doctor/${doctorId}`);            
            setDoctor(response.data);
                        
          } catch (err) {
            console.log('Failed to fetch doctor details: ',err);
          } 
        };
        fetchDoctorDetails();
      }, [doctorId]);    

      useEffect(() => {
        console.log("doctor state updated: ", doctor?.modesOfConsultation);
      }, [doctor]);      

  return (
    <div className="min-h-screen flex flex-col bg-customBgLight">
      <UserHeader role="user" />

      {/* Main Content: Appointment Container */}
      <div className="flex-grow">
        <AppointmentContainer
          doctorId= {doctorId}
          modesOfConsultation={doctor?.modesOfConsultation || []}
          fee={doctor?.fee || 300}
                   
        />
      </div>

      <Footer />
    </div>
  );
};

export default AppointmentBookingPage;
