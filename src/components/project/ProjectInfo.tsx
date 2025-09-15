import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

interface ProjectResponse {
  id: number;
  name: string;
  charter: string;
  startDate: string;
  endDate: string;
  status: string;
  department: string;
  manager: string | null;
  vendor: string | null;
}

const ProjectInfo: React.FC = () => {
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userData);
        const departmentId = user.department;
        const projectId = 3; // hardcoded for now

        const response = await axios.get<ProjectResponse>(
          `${API_BASE_URL}/api/projects/department/${departmentId}/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProject(response.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Failed to fetch project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [API_BASE_URL]);

  return (
    <Card>
      <CardContent>
        {loading && <p className="text-gray-500">Loading project info...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {project && (
          <>
            <h2 className="text-2xl font-bold">{project.name}</h2>
            <div className="flex flex-wrap gap-4 mt-2">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  project.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : project.status === "Completed"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {project.status}
              </span>
              <p>
                Start: {project.startDate} | End: {project.endDate}
              </p>
              <p>Department: {project.department}</p>
              <p>Manager: {project.manager || "N/A"}</p>
              <p>Vendor: {project.vendor || "N/A"}</p>
            </div>
            <p className="mt-4 text-gray-600">{project.charter}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectInfo;
