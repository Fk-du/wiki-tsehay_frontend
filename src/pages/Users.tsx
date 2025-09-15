import React, { useEffect, useState } from "react";
import axios from "axios";

interface Department {
  id: number;
  name: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  companyEmail: string;
  departmentName: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10); // page size
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [departments, setDepartments] = useState<Department[]>([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_BASE_URL}/api/users/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          size,
          filter: search || undefined,
        },
      });

      setUsers(res.data.content || []);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments
const fetchDepartments = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get(`${API_BASE_URL}/departments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDepartments(res.data);
  } catch (err) {
    console.error(err);
  }
};

const getDepartmentName = (id: number) => {
  const dept = departments.find((d) => d.id === id);
  return dept ? dept.name : "Unknown";
};

    const handleView = (user: User) => {
        console.log("View", user);
        // implement modal or navigate to view page
    };

    const handleEdit = (user: User) => {
        console.log("Edit", user);
        // implement modal or navigate to edit page
    };

    const handleDelete = (user: User) => {
        console.log("Delete", user);
        // implement delete confirmation and API call
    };


    useEffect(() => {
    fetchDepartments();
    }, []);

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleSort = () => {
    const sorted = [...users].sort((a, b) =>
      sortOrder === "asc"
        ? a.firstName.localeCompare(b.firstName)
        : b.firstName.localeCompare(a.firstName)
    );
    setUsers(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSort}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Sort ({sortOrder === "asc" ? "↑" : "↓"})
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2 text-left">ID</th>
                <th className="border border-gray-200 px-4 py-2 text-left">First Name</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Last Name</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Department</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">{user.id}</td>
                    <td className="border border-gray-200 px-4 py-2">{user.firstName}</td>
                    <td className="border border-gray-200 px-4 py-2">{user.lastName}</td>
                    <td className="border border-gray-200 px-4 py-2">{user.companyEmail}</td>
                    <td className="border border-gray-200 px-4 py-2">{getDepartmentName(user.department)}</td>
                    <td className="border border-gray-200 px-4 py-2 px-1 flex gap-2">
                        <button
                            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                            onClick={() => handleView(user)}
                            >
                            View
                         </button>
                         <button
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                            onClick={() => handleEdit(user)}
                            >
                            Edit
                         </button>
                         <button
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                            onClick={() => handleDelete(user)}
                            >
                            Delete
                         </button>
                        </td>
                    </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan={5} className="text-center py-4">
                                No users found
                            </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className={`px-4 py-2 rounded-lg border ${
            page === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          Prev
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => (page + 1 < totalPages ? prev + 1 : prev))}
          disabled={page + 1 >= totalPages}
          className={`px-4 py-2 rounded-lg border ${
            page + 1 >= totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersPage;
