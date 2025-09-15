import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Project {
  id: number;
  name: string;
  status: "Not Started" | "In Progress" | "Completed" | "On Hold";
  startDate: string;
  endDate: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getStatusClasses = (status: Project["status"]): string => {
  switch (status) {
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "On Hold":
      return "bg-yellow-100 text-yellow-800";
    case "Not Started":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        if (!token || !userData) return;

        const user = JSON.parse(userData);

        const response = await axios.get<Project[]>(
          `${API_BASE_URL}/api/projects/department/${user.department}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => (statusFilter ? p.status === statusFilter : true))
    .sort((a, b) => {
      if (sortBy === "Start Date")
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      if (sortBy === "End Date")
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      if (sortBy === "Name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <Link
          to="/projects/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Project
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm"
        >
          <option value="">All Status</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm"
        >
          <option value="">Sort By</option>
          <option value="Start Date">Start Date</option>
          <option value="End Date">End Date</option>
          <option value="Name">Name</option>
        </select>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {project.name}
                </h3>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${getStatusClasses(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">
                Start: {new Date(project.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                End: {new Date(project.endDate).toLocaleDateString()}
              </p>
              <div className="flex justify-end gap-3">
                <Link
                    to={`/projects/${project.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                </Link>

                <button className="text-green-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No projects found.</p>
      )}
    </div>
  );
};

export default ProjectsPage;
