import UserHeader from '../../components/UserHeader';
import UserAppointmentTable from '../../components/UserAppointmentTable';
import Footer from '../../components/Footer';

const AppointmentPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-customBgLight">
      {/* Header */}
      <header className="sticky top-0 z-10">
        <UserHeader role="user" />
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-lightTeal p-4">
        <UserAppointmentTable />
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default AppointmentPage;
