import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import EditProjectInfo from "@/components/project/edit-project/EditProjectInfo";

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

interface ProjectInfoProps {
  projectId: number;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectId }) => {
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_NETWORK ||
    import.meta.env.VITE_API_BASE_URL_LOCAL;

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

        const response = await axios.get<ProjectResponse>(
          `${API_BASE_URL}/api/projects/department/${departmentId}/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProject(response.data);
      } catch (err: any) {
        console.error(err);
        setError(
          err.response?.data?.message || err.message || "Failed to fetch project"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [API_BASE_URL, projectId]);

  return (
    <Card>
      <CardContent>
        {loading && <p className="text-gray-500">Loading project info...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {project && (
          <>
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">{project.name}</h2>
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
            </div>

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

      {editing && project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
            <EditProjectInfo
              projectId={project.id}
              departmentId={JSON.parse(localStorage.getItem("user")!).department}
              onClose={() => setEditing(false)}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProjectInfo;
