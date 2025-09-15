import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

interface IncidentResponse {
  id: number;
  title: string;
  description: string;
  dateRegistered: string;
  startDate: string | null;
  endDate: string | null;
  severity: string;
  category: string;
  status: string;
  rootCause?: string;
  actionTaken?: string;
  department?: string;
  project?: string;
}

interface User {
  department: number;
  token: string;
}

interface IncidentsSectionProps {
  projectId: number;
}

const IncidentsSection: React.FC<IncidentsSectionProps> = ({ projectId }) => {
  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchIncidents = async () => {
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

        const res = await axios.get<IncidentResponse[]>(
          `${API_BASE_URL}/api/projects/incidents/department/${departmentId}/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setIncidents(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Failed to fetch incidents");
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [projectId, API_BASE_URL]);

  if (loading) return <p className="text-gray-500">Loading incidents...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (incidents.length === 0) return <p className="text-gray-500">No incidents found.</p>;

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <Card key={incident.id}>
          <CardContent>
            <h3 className="text-lg font-semibold">{incident.title}</h3>
            <p className="text-gray-600 mt-1">{incident.description}</p>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              <span>Status: {incident.status}</span>
              <span>Severity: {incident.severity}</span>
              <span>Category: {incident.category}</span>
              {incident.startDate && <span>Start: {new Date(incident.startDate).toLocaleString()}</span>}
              {incident.endDate && <span>End: {new Date(incident.endDate).toLocaleString()}</span>}
              <span>Department: {incident.department}</span>
            </div>
            {incident.rootCause && <p className="mt-2 text-red-600">Root Cause: {incident.rootCause}</p>}
            {incident.actionTaken && <p className="mt-1 text-green-600">Action Taken: {incident.actionTaken}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IncidentsSection;
