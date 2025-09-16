import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

interface MilestoneResponse {
  id: number;
  name: string;
  dueDate: string | null;
  status: string;
  projectId: number;
}

interface User {
  department: number;
  token: string;
}

interface MilestonesSectionProps {
  projectId: number;
}

const MilestonesSection: React.FC<MilestonesSectionProps> = ({ projectId }) => {
  const [milestones, setMilestones] = useState<MilestoneResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_NETWORK || import.meta.env.VITE_API_BASE_URL_LOCAL;

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const user: User = JSON.parse(userData);
        const departmentId = user.department;

        const res = await axios.get<MilestoneResponse[]>(
          `${API_BASE_URL}/api/milestones/project/${departmentId}/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMilestones(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Failed to fetch milestones");
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, [projectId, API_BASE_URL]);

  if (loading) return <p className="text-gray-500">Loading milestones...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (milestones.length === 0) return <p className="text-gray-500">No milestones found.</p>;

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <Card key={milestone.id}>
          <CardContent>
            <h3 className="text-lg font-semibold">{milestone.name}</h3>
            <p className="text-gray-500 mt-1">
              Due: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : "N/A"}
            </p>
            <span
              className={`mt-2 px-2 py-1 rounded-full text-sm ${
                milestone.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : milestone.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {milestone.status}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MilestonesSection;
