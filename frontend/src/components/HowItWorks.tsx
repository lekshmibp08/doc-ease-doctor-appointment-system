
const HowItWorks = () => {
  const steps = [
    { title: 'Choose Your Doctor', icon: 'fas fa-user-md' },
    { title: 'Select your date And book the appointment', icon: 'fas fa-calendar-alt' },
    { title: 'Get your Confirmation SMS', icon: 'fas fa-envelope' },
    { title: 'Visit clinic as per the appointment', icon: 'fas fa-check-circle' },
  ];

  return (
    <section className="bg-blue-100 py-8 px-4 text-center">
      <div className="border-t border-white my-6"></div>
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        Wondering <span className="font-extrabold">how it works?</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white shadow-md rounded-lg p-4"
          >
            <i className={`${step.icon} text-teal-700 text-4xl mb-4`}></i>
            <p className="font-semibold text-gray-800 text-sm">
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
