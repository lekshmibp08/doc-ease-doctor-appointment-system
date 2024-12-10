
const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-red-500">Unauthorized Access</h1>
      <p className="text-gray-600 mt-4">You do not have permission to view this page.</p>
    </div>
  );
};

export default Unauthorized;
