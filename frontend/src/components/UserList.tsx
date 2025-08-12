import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import Pagination from './Pagination';
import { getAllUsers, toggleUserBlock } from '../services/api/adminApi'

interface User {
    _id: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    isBlocked: boolean;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    const fetchUsers = async () => {        
      try {
        const response = await getAllUsers(currentPage, 8, debouncedSearch || "");
        
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentPage, debouncedSearch]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  const handleBlockUser = async (id: string, isBlocked: boolean) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isBlocked ? "Yes, Unblock it!" : "Yes, Block it!",
    });
    if (result.isConfirmed){
      try {
        const response = await toggleUserBlock(id);
        const { isBlocked } = response.data;

        setUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, isBlocked } : user
          )
        );        
        if (isBlocked) {
          Swal.fire("Blocked!", response.data.message, "success");
        } else {
          Swal.fire("Unblocked!", response.data.message, "success");
        }              
      } catch (error: any) {
          console.error('Error blocking/unblocking User:', error);
      }
      }
  }

  return (
    <div className="p-6 bg-customBgLight">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className="px-4 py-2 border rounded-lg w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left border">Sl. No</th>
              <th className="p-3 text-left border">Name</th>
              <th className="p-3 text-left border">Email</th>
              <th className="p-3 text-left border">Phone</th>
              <th className="p-3 text-center border">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index:number) => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td className="p-3 border">{ index + 1 }</td>
                <td className="p-3 border">{ user.fullName }</td>
                <td className="p-3 border">{ user.email }</td>
                <td className="p-3 border font-semibold">{ user.mobileNumber }</td>
                <td className="p-3 text-center border">
                  <button onClick={() => handleBlockUser(user._id, user.isBlocked)}
                    className={`${
                      user.isBlocked ? 'bg-yellow-500 hover:bg-yellow-700' : 'bg-red-600 hover:bg-red-700'
                    } text-white px-4 py-1 rounded transition`}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
            
    </div>
  );
};

export default UserList;
