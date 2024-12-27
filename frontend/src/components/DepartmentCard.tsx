
const DepartmentCard = () => {
  const departments = [
    {
      id: 1,
      title: 'General Medicine',
      description: 'Teething trouble? Schedule a dental checkup',
      image: '/background-1.png', // Replace with the correct image path
    },
    {
      id: 2,
      title: 'Cardiology',
      description: 'Teething trouble? Schedule a dental checkup',
      image: '/background-1.png',
    },
    {
      id: 3,
      title: 'Neurology',
      description: 'Teething trouble? Schedule a dental checkup',
      image: '/background-1.png',
    },
    {
      id: 4,
      title: 'Pediatrics',
      description: 'Teething trouble? Schedule a dental checkup',
      image: '/background-1.png',
    },
    {
      id: 5,
      title: 'Dentist',
      description: 'Teething trouble? Schedule a dental checkup',
      image: '/background-1.png',
    },
  ];

  return (
    <section className="bg-blue-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-black">
            Book an appointment for an in-clinic consultation
          </h2>
          <p className="text-lg text-gray-600">
            Find experienced doctors across all specialties
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {departments.map((department) => (
            <div
              key={department.id}
              className="bg-white shadow-md rounded-md overflow-hidden flex flex-col items-center text-center"
            >
              {/* Image */}
              <img
                src={department.image}
                alt={department.title}
                className="w-full h-40 object-cover"
              />
              {/* Content */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {department.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  {department.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentCard;
