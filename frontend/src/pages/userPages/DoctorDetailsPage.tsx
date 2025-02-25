import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../services/axiosConfig";

import UserHeader from "../../components/UserHeader";
import DoctorDetailsCard from "../../components/DoctorDetailsCard";
import DoctorGallery from "../../components/DoctorGallery";
import DoctorLocation from "../../components/DoctorLocation";
import Review from "../../components/Review";
import Footer from "../../components/Footer";
import { IPractitioner } from "../../types/interfaces";

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<IPractitioner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`/api/users/doctor/${id}`);
        console.log("DOC DETAILS: ", response.data);
        setDoctor(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  if (loading) {
    return <div>Loading doctor details...</div>;
  }
  if (!doctor) {
    return <div>Error loading doctor details.</div>;
  }

  return (
    <div className="bg-customBgLight h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="flex-none">
        <UserHeader role="user" />
      </div>

      {/* Scrollable Main Content */}
      <main className="flex-1 overflow-auto max-w-full px-2 sm:px-4 md:px-8 lg:px-52 py-4">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-sm mb-4">
          <ol className="flex flex-wrap text-gray-600">
            <li>
              <a href="/" className="text-blue-600 hover:underline">Home</a>
              <span className="mx-2">/</span>
            </li>
            <li>
              <a href="/doctors" className="text-blue-600 hover:underline">Doctors</a>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-500">Doctor Details</li>
          </ol>
        </nav>

        <DoctorDetailsCard doctor={doctor} />
        <DoctorGallery images={doctor.gallery} />
        <DoctorLocation
          addressLine={doctor.addressLine}
          locationCoordinates={doctor.locationCoordinates || undefined}
          locationName={doctor.locationName}
        />
        <Review doctorId={doctor._id} />
      </main>

      {/* Fixed Footer */}
      <div className="flex-none">
        <Footer />
      </div>
    </div>
  );
};

export default DoctorDetailsPage;
