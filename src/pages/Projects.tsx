import React, { useEffect, useState } from "react";
import axios from "axios";

interface Project {
  id: number;
  name: string;
  charter: string;
  startDate: string;
  endDate: string;
  status: string;
  department: string;
}

interface User {
  id: number;
  companyEmail: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  title: string | null;
  department: number; // now it's the ID
  role: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const currentUser: User = JSON.parse(userData);
        setUser(currentUser);

        // Fetch projects directly using department ID
        const projRes = await axios.get<Project[]>(
          `${API_BASE_URL}/api/projects/department/${currentUser.department}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProjects(projRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Projects in Department {user?.department}
      </h1>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Charter</th>
                <th className="border px-4 py-2">Start Date</th>
                <th className="border px-4 py-2">End Date</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Department</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{p.name}</td>
                  <td className="border px-4 py-2">{p.charter}</td>
                  <td className="border px-4 py-2">{p.startDate}</td>
                  <td className="border px-4 py-2">{p.endDate}</td>
                  <td className="border px-4 py-2">{p.status}</td>
                  <td className="border px-4 py-2">{p.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
