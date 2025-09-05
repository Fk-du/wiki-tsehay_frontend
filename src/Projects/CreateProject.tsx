import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const statusOptions = ["Not Started", "In Progress", "Completed", "On Hold"];

const CreateProject: React.FC = () => {
  const [name, setName] = useState("");
  const [charter, setCharter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(statusOptions[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (!token || !userData) {
        setMessage("User not logged in");
        return;
      }

      const user = JSON.parse(userData);

      const payload = {
        name,
        charter,
        startDate,
        endDate,
        status,
        departmentId: user.department, // Auto-fill department
      };

      await axios.post(`${API_BASE_URL}/api/projects`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Project created successfully!");
      setName("");
      setCharter("");
      setStartDate("");
      setEndDate("");
      setStatus(statusOptions[0]);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Project</h2>
      {message && <p className="mb-4 text-center text-sm">{message}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Charter */}
        <div>
          <label className="block text-sm font-medium mb-1">Charter</label>
          <textarea
            value={charter}
            onChange={(e) => setCharter(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Create Project"}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
