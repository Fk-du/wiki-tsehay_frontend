import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

interface IncidentResponse {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  severity: string;
  category: string;
  status: string;
  rootCause?: string;
  actionTaken?: string;
  department: string;
  project: string;
}

interface IncidentRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  severity: string;
  category: string;
  status: string;
  rootCause?: string;
  actionTaken?: string;
  departmentId?: number; // not editable
  projectId?: number;    // not editable
}

interface EditIncidentsSectionProps {
  departmentId: number;
  projectId: number;
  incidentId: number;
}

const EditIncidentsSection: React.FC<EditIncidentsSectionProps> = ({
  departmentId,
  projectId,
  incidentId,
}) => {
  const [incident, setIncident] = useState<IncidentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_NETWORK ||
    import.meta.env.VITE_API_BASE_URL_LOCAL;

  const [formData, setFormData] = useState<IncidentRequest>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    severity: "LOW",
    category: "GENERAL",
    status: "OPEN",
    rootCause: "",
    actionTaken: "",
  });

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<IncidentResponse>(
          `${API_BASE_URL}/api/projects/incidents/department/${departmentId}/${projectId}/${incidentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIncident(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          startDate: response.data.startDate,
          endDate: response.data.endDate,
          severity: response.data.severity,
          category: response.data.category,
          status: response.data.status,
          rootCause: response.data.rootCause || "",
          actionTaken: response.data.actionTaken || "",
        });
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Failed to fetch incident");
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [API_BASE_URL, departmentId, projectId, incidentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/projects/incidents/department/${departmentId}/${projectId}/${incidentId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Incident updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to update incident");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading incident...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-bold mb-4">Edit Incident</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="border p-2 rounded"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded"
          />
          <div className="flex gap-2">
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="GENERAL">GENERAL</option>
            <option value="SERVICE">SERVICE</option>
            <option value="SECURITY">SECURITY</option>
            <option value="OTHER">OTHER</option>
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="CLOSED">CLOSED</option>
          </select>
          <textarea
            name="rootCause"
            value={formData.rootCause}
            onChange={handleChange}
            placeholder="Root Cause (optional)"
            className="border p-2 rounded"
          />
          <textarea
            name="actionTaken"
            value={formData.actionTaken}
            onChange={handleChange}
            placeholder="Action Taken (optional)"
            className="border p-2 rounded"
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Incident"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditIncidentsSection;
