"use client";

import { useState } from "react";

interface Admin {
  id: string;
  schoolId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
}

const AdminTable = ({ admins }: { admins: Admin[] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter admins based on search term
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 w-full"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">First Name</th>
            <th className="border border-gray-300 p-2 text-left">Last Name</th>
            <th className="border border-gray-300 p-2 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmins.map((admin) => (
            <tr key={admin.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{admin.firstName}</td>
              <td className="border border-gray-300 p-2">{admin.lastName}</td>
              <td className="border border-gray-300 p-2">{admin.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* No results message */}
      {filteredAdmins.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No results found.</p>
      )}
    </div>
  );
};

export default AdminTable;
