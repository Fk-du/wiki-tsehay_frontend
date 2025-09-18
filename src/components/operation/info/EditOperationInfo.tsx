import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface OperationRequest {
  name: string;
  description: string;
  vendor: string;
  status: string;
  sla: string;
  criticality: string;
  startDate: string;
  endDate: string;
  departmentId: number;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_NETWORK ||
  import.meta.env.VITE_API_BASE_URL_LOCAL;

const EditOperationInfo: React.FC = () => {
  const { departmentId, operationId } = useParams<{
    departmentId: string;
    operationId: string;
  }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OperationRequest>({
    name: "",
    description: "",
    vendor: "",
    status: "",
    sla: "",
    criticality: "",
    startDate: "",
    endDate: "",
    departmentId: Number(departmentId),
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOperation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get<OperationRequest>(
          `${API_BASE_URL}/api/operations/${departmentId}/${operationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching operation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (departmentId && operationId) {
      fetchOperation();
    }
  }, [departmentId, operationId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(
        `${API_BASE_URL}/api/operations/${departmentId}/${operationId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/departments/${departmentId}/operations/${operationId}`);
    } catch (error) {
      console.error("Error updating operation:", error);
    }
  };

  if (loading) return <p className="text-gray-600">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Operation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Operation Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="vendor"
          placeholder="Vendor"
          value={formData.vendor}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
        <input
          type="text"
          name="sla"
          placeholder="SLA"
          value={formData.sla}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="criticality"
          value={formData.criticality}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Criticality</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditOperationInfo;
