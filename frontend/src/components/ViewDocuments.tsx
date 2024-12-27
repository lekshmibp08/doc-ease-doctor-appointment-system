import { useLocation } from "react-router-dom";

const ViewDocuments = () => {
  const location = useLocation();
  const { documents } = location.state;

  return (
    <div className="p-6 flex flex-col items-center bg-blue-100">
      <h2 className="text-2xl font-bold mb-6">Uploaded Documents</h2>
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        {documents.map((url: string, index: number) => (
          <div
            key={index}
            className="w-full bg-gray-200 rounded overflow-hidden shadow-lg"
          >
            <img
              src={url}
              alt={`Document ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewDocuments;
