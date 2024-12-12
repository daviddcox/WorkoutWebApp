import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  ID: number;
  Email: string; 
  FirstName: string;
  LastName: string;
  Purdue_ID: string;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updatedUser, setUpdatedUser] = useState<Omit<User, 'ID'> | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = Number(event.target.value);
    const user = users.find(u => u.ID === userId) || null;
    setSelectedUser(user);
    setUpdatedUser(user ? { Email: user.Email, FirstName: user.FirstName, LastName: user.LastName, Purdue_ID: user.Purdue_ID } : null);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (updatedUser) {
      setUpdatedUser({ ...updatedUser, [name]: value });
    }
  };

  const handleUpdateUser = async () => {
    if (selectedUser) {
      try {
        await axios.put(`http://localhost:5000/users/${selectedUser.ID}`, updatedUser);
        fetchUsers(); 
        setSelectedUser(null);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await axios.delete(`http://localhost:5000/users/${selectedUser.ID}`);
        setSelectedUser(null); // Reset selected user after deletion
        fetchUsers(); // Refresh the user list after deletion
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      <h1 className="text-2xl font-bold mb-4">Manage Existing Users</h1>
      <select
        value={selectedUser ? selectedUser.ID : ""}
        onChange={handleUserChange}
        className="p-2 border rounded mb-4"
      >
        <option value="" disabled>
          Select a user to edit/view
        </option>
        {users.map((user) => (
          <option key={user.ID} value={user.ID}>
            {user.FirstName} {user.LastName}
          </option>
        ))}
      </select>

      {selectedUser && (
        <div className="mt-4">
          <h2 className="text-xl">Edit User Details</h2>
          <div>
            <label>Email: </label>
            <input
              type="email"
              name="Email"
              value={updatedUser?.Email || ''}
              onChange={handleInputChange}
              className="p-2 border rounded mb-2"
            />
          </div>
          <div>
            <label>First Name: </label>
            <input
              type="text"
              name="FirstName"
              value={updatedUser?.FirstName || ''}
              onChange={handleInputChange}
              className="p-2 border rounded mb-2"
            />
          </div>
          <div>
            <label>Last Name: </label>
            <input
              type="text"
              name="LastName"
              value={updatedUser?.LastName || ''}
              onChange={handleInputChange}
              className="p-2 border rounded mb-2"
            />
          </div>
          <div>
            <label>Purdue ID: </label>
            <input
              type="text"
              name="Purdue_ID"
              value={updatedUser?.Purdue_ID || ''}
              onChange={handleInputChange}
              className="p-2 border rounded mb-4"
            />
          </div>
          <button onClick={handleUpdateUser} className="bg-blue-500 text-white p-2 rounded mr-2">
            Update User
          </button>
          <button onClick={handleDeleteUser} className="bg-red-500 text-white p-2 rounded">
            Delete User
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
