import React, { useEffect, useState } from "react";
import axios from "axios";

interface ProjectRequest {
  name: string;
  charter: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  status: string;
  departmentId: number;
  manager: string; // can be manager ID as string
  vendor: string;
}

interface ProjectResponse {
  id: number;
  name: string;
  charter: string;
  startDate: string;
  endDate: string;
  status: string;
  department: string;
  manager: string;
  vendor: string;
}

interface EditProjectInfoProps {
  projectId: number;
  departmentId: number;
  onClose: () => void;
}

const EditProjectInfo: React.FC<EditProjectInfoProps> = ({
  projectId,
  departmentId,
  onClose,
}) => {
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [form, setForm] = useState<ProjectRequest>({
    name: "",
    charter: "",
    startDate: "",
    endDate: "",
    status: "",
    departmentId,
    manager: "",
    vendor: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_NETWORK ||
    import.meta.env.VITE_API_BASE_URL_LOCAL;
    
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProject = async () => {
      if (!token) return;

      try {
        const response = await axios.get<ProjectResponse>(
          `${API_BASE_URL}/api/projects/department/${departmentId}/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProject(response.data);
        setForm({
          name: response.data.name,
          charter: response.data.charter,
          startDate: response.data.startDate,
          endDate: response.data.endDate,
          status: response.data.status,
          departmentId,
          manager: response.data.manager ?? "",
          vendor: response.data.vendor ?? "",
        });
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [API_BASE_URL, projectId, departmentId, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setError(null);

    try {
      await axios.put<ProjectResponse>(
        `${API_BASE_URL}/api/projects/department/${departmentId}/${projectId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Project updated successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading project...</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div className="p-6 bg-white rounded shadow max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Project Info</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Charter</label>
          <textarea
            name="charter"
            value={form.charter}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded h-24"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Manager (User ID)</label>
          <input
            type="text"
            name="manager"
            value={form.manager}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Vendor</label>
          <input
            type="text"
            name="vendor"
            value={form.vendor}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditProjectInfo;
