import React, { useEffect, useState } from "react";
import axios from "axios";

interface Operation {
  id: number;
  name: string;
  vendor: string;
  status: "Running" | "Stopped" | "Failed" | "Paused" | "Maintenance";
  criticality: string;
  sla: string;
}

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_NETWORK || import.meta.env.VITE_API_BASE_URL_LOCAL;

const getStatusClasses = (status: Operation["status"]) => {
  switch (status) {
    case "Running":
      return "bg-green-100 text-green-800";
    case "Stopped":
      return "bg-gray-200 text-gray-700";
    case "Failed":
      return "bg-red-100 text-red-800";
    case "Paused":
      return "bg-yellow-100 text-yellow-800";
    case "Maintenance":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OperationsPage: React.FC = () => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        if (!token || !userData) return;

        const user = JSON.parse(userData);
        const res = await axios.get<Operation[]>(
          `${API_BASE_URL}/operations/department/${user.department}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOperations(res.data);
      } catch (error) {
        console.error("Error fetching operations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOperations();
  }, []);

  const filteredOps = operations.filter((op) =>
    op.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center">Loading services...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services / Operations</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Add Operation
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full md:w-1/3"
        />
      </div>

      {/* Cards */}
      {filteredOps.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOps.map((op) => (
            <div
              key={op.id}
              className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{op.name}</h2>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusClasses(
                    op.status
                  )}`}
                >
                  {op.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Vendor:</strong> {op.vendor}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Criticality:</strong> {op.criticality}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>SLA:</strong> {op.sla}
              </p>
              <div className="flex justify-end gap-3">
                <button className="text-blue-600 hover:underline">View</button>
                <button className="text-green-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No Services found.</p>
      )}
    </div>
  );
};

export default OperationsPage;
