import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Project {
  id: number;
  name: string;
  status: "Not Started" | "In Progress" | "Completed" | "On Hold";
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const statusColors: Record<Project["status"], string> = {
  "Not Started": "bg-gray-200 text-gray-800",
  "In Progress": "bg-blue-100 text-blue-800",
  "Completed": "bg-green-100 text-green-800",
  "On Hold": "bg-yellow-100 text-yellow-800",
};

const ProjectsSnapshot: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
        setProjects(response.data.slice(0, 7)); // Only first 7 projects
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p className="text-center">Loading projects...</p>;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">Projects Snapshot</h3>
      {projects.length > 0 ? (
        projects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-gray-700">{project.name}</h3>
              <span
                className={`mt-1 inline-block px-2 py-1 rounded-full text-sm font-medium ${
                  statusColors[project.status]
                }`}
              >
                {project.status}
              </span>
            </div>
            <Link
              to={`/projects/${project.id}`}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              View Details →
            </Link>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No projects found.</p>
      )}
    </div>
  );
};

export default ProjectsSnapshot;
