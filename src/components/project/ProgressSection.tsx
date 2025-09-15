import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

interface ProgressResponse {
  id: number;
  reportDate: string;
  summary: string;
  projectName: string;
}

interface ProgressSectionProps {
  projectId: number;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ projectId }) => {
  const [progressReports, setProgressReports] = useState<ProgressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const res = await axios.get<ProgressResponse[]>(
          `${API_BASE_URL}/api/progress/project/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProgressReports(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Failed to fetch progress reports");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [projectId, API_BASE_URL]);

  if (loading) return <p className="text-gray-500">Loading progress reports...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (progressReports.length === 0) return <p className="text-gray-500">No progress reports found.</p>;

  return (
    <div className="space-y-4">
      {progressReports.map((report) => (
        <Card key={report.id}>
          <CardContent>
            <h3 className="text-lg font-semibold">{report.projectName}</h3>
            <p className="text-gray-500 mt-1">
              Date: {report.reportDate ? new Date(report.reportDate).toLocaleDateString() : "N/A"}
            </p>
            <p className="mt-2 text-gray-700">{report.summary}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProgressSection;
