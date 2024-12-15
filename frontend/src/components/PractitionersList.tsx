import React, { useState } from 'react';

interface Practitioner {
  id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
}

const PractitionersList: React.FC = () => {
  // Sample data for practitioners
  const [practitioners, setPractitioners] = useState<Practitioner[]>([
    { id: 'UP12345', name: 'Dr. Varun', email: 'varun72@gmail.com', phone: '9746731172', isBlocked: true },
    { id: 'UP12346', name: 'Dr. Anoop', email: 'anoop91@gmail.com', phone: '9809762096', isBlocked: false },
  ]);

  const [search, setSearch] = useState('');

  const handleApprove = (id: string) => {
    console.log(`Updates approved for practitioner: ${id}`);
    alert(`Updates approved for ${id}`);
  };

  const handleBlockToggle = (id: string) => {
    setPractitioners((prev) =>
      prev.map((practitioner) =>
        practitioner.id === id ? { ...practitioner, isBlocked: !practitioner.isBlocked } : practitioner
      )
    );
  };

  const filteredPractitioners = practitioners.filter((practitioner) =>
    practitioner.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-customBgLight">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Practitioners</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left border">Reg. No</th>
              <th className="p-3 text-left border">Name</th>
              <th className="p-3 text-left border">Email</th>
              <th className="p-3 text-left border">Phone</th>
              <th className="p-3 text-center border">Approve Updates</th>
              <th className="p-3 text-center border">Block</th>
            </tr>
          </thead>
          <tbody>
            {filteredPractitioners.map((practitioner) => (
              <tr key={practitioner.id} className="hover:bg-gray-100">
                <td className="p-3 border">{practitioner.id}</td>
                <td className="p-3 border">{practitioner.name}</td>
                <td className="p-3 border">{practitioner.email}</td>
                <td className="p-3 border font-semibold">{practitioner.phone}</td>
                <td className="p-3 text-center border">
                  <button
                    onClick={() => handleApprove(practitioner.id)}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
                  >
                    Approve
                  </button>
                </td>
                <td className="p-3 text-center border">
                  <button
                    onClick={() => handleBlockToggle(practitioner.id)}
                    className={`${
                      practitioner.isBlocked ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'
                    } text-white px-4 py-1 rounded transition`}
                  >
                    {practitioner.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4">
        <nav className="flex space-x-2 text-sm font-semibold">
          <a href="#" className="text-customTeal hover:underline">
            Previous
          </a>
          {[1, 2, 3, 4, 5, 6].map((page) => (
            <a
              key={page}
              href="#"
              className={`px-3 py-1 rounded text-customTeal ${
                page === 6 ? 'bg-customTeal text-white' : 'hover:bg-gray-200'
              } transition`}
            >
              {page}
            </a>
          ))}
          <a href="#" className="text-customTeal hover:underline">
            Next
          </a>
        </nav>
      </div>
    </div>
  );
};

export default PractitionersList;
