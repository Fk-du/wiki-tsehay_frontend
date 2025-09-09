import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Enums
const SEVERITY = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const STATUS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const OPERATIONAL_CATEGORIES = ["NETWORK", "HARDWARE", "SOFTWARE", "OTHER"];
const PROJECT_CATEGORIES = [
  "SYSTEM_FAILURE",
  "CYBER_ATTACK",
  "HARDWARE_FAILURE",
  "THIRD_PARTY_ISSUE",
];

// Types
interface OperationalIncidentRequest {
  title: string;
  description: string;
  severity: string;
  status: string;
  incidentDate: string;
  resolutionDate: string;
  category: string;
  rootCause: string;
  actionTaken: string;
  operationId: number;
  reportedById: number;
  resolvedById: number;
}

interface ProjectIncidentRequest {
  title: string;
  description: string;
  severity: string;
  status: string;
  startDate: string;
  endDate: string;
  category: string;
  rootCause: string;
  actionTaken: string;
  departmentId: number;
  projectId: number;
}

interface OperationalIncident {
  id: number;
  serviceName: string;
  incidentDate: string;
  severity: string;
  category: string;
}

interface ProjectIncident {
  id: number;
  title: string;
  project: string;
  severity: string;
  category: string;
}

// Severity badge
const getSeverityBadgeClass = (severity: string) => {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-100 text-red-800";
    case "HIGH":
      return "bg-orange-100 text-orange-800";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800";
    case "LOW":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const IncidentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"operational" | "project">(
    "operational"
  );
  const [operationalIncidents, setOperationalIncidents] = useState<
    OperationalIncident[]
  >([]);
  const [projectIncidents, setProjectIncidents] = useState<ProjectIncident[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<
    OperationalIncidentRequest | ProjectIncidentRequest
  >({} as any);

  // Search & Sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch incidents
  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const opRes = await axios.get(`${API_BASE_URL}/api/operations/incidents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOperationalIncidents(opRes.data);

      const pjRes = await axios.get(`${API_BASE_URL}/api/projects/incidents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjectIncidents(pjRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const numericFields = [
      "departmentId",
      "projectId",
      "operationId",
      "reportedById",
      "resolvedById",
    ];
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const url =
        activeTab === "operational"
          ? `${API_BASE_URL}/api/operations/incidents`
          : `${API_BASE_URL}/api/projects/incidents`;

      await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsModalOpen(false);
      fetchIncidents();
    } catch (error) {
      console.error(error);
    }
  };

  // Filter & Sort
  const filteredOperational = operationalIncidents
    .filter(
      (i) =>
        i.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      let valA: any = a[sortBy as keyof OperationalIncident];
      let valB: any = b[sortBy as keyof OperationalIncident];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const filteredProject = projectIncidents
    .filter(
      (i) =>
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      let valA: any = a[sortBy as keyof ProjectIncident];
      let valB: any = b[sortBy as keyof ProjectIncident];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  if (loading) return <p className="text-center">Loading incidents...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Incidents</h1>
        <button
          onClick={() => {
            setFormData({} as any);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Incident
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b flex gap-6 mb-4">
        <button
          className={`pb-2 ${
            activeTab === "operational"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("operational")}
        >
          Operational Incidents
        </button>
        <button
          className={`pb-2 ${
            activeTab === "project"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("project")}
        >
          Project Incidents
        </button>
      </div>

      {/* Search & Sort */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="severity">Severity</option>
          <option value="category">Category</option>
          {activeTab === "operational" && <option value="incidentDate">Date</option>}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="border p-2 rounded"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      {/* Table */}
      {activeTab === "operational" ? (
        <OperationalIncidentsTable data={filteredOperational} />
      ) : (
        <ProjectIncidentsTable data={filteredProject} />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">
              Add {activeTab === "operational" ? "Operational" : "Project"} Incident
            </h2>

            {activeTab === "operational" ? (
              <OperationalIncidentForm
                formData={formData as OperationalIncidentRequest}
                onChange={handleInputChange}
              />
            ) : (
              <ProjectIncidentForm
                formData={formData as ProjectIncidentRequest}
                onChange={handleInputChange}
              />
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Forms & Tables remain same as your previous code
const OperationalIncidentForm = ({ formData, onChange }: any) => (
  <div className="grid gap-3">
    <input name="title" placeholder="Title" onChange={onChange} className="border p-2 rounded" />
    <textarea name="description" placeholder="Description" onChange={onChange} className="border p-2 rounded" />
    <input name="incidentDate" type="datetime-local" onChange={onChange} className="border p-2 rounded" />
    <input name="resolutionDate" type="datetime-local" onChange={onChange} className="border p-2 rounded" />
    <select name="severity" onChange={onChange} className="border p-2 rounded">
      <option value="">Select Severity</option>
      {SEVERITY.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
    <select name="status" onChange={onChange} className="border p-2 rounded">
      <option value="">Select Status</option>
      {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
    <select name="category" onChange={onChange} className="border p-2 rounded">
      <option value="">Select Category</option>
      {OPERATIONAL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>
    <textarea name="rootCause" placeholder="Root Cause" onChange={onChange} className="border p-2 rounded" />
    <textarea name="actionTaken" placeholder="Action Taken" onChange={onChange} className="border p-2 rounded" />
    <input name="operationId" type="number" placeholder="Operation ID" onChange={onChange} className="border p-2 rounded" />
    <input name="reportedById" type="number" placeholder="Reported By ID" onChange={onChange} className="border p-2 rounded" />
    <input name="resolvedById" type="number" placeholder="Resolved By ID" onChange={onChange} className="border p-2 rounded" />
  </div>
);

const ProjectIncidentForm = ({ formData, onChange }: any) => (
  <div className="grid gap-3">
    <input name="title" placeholder="Title" onChange={onChange} className="border p-2 rounded" />
    <textarea name="description" placeholder="Description" onChange={onChange} className="border p-2 rounded" />
    <input name="startDate" type="datetime-local" onChange={onChange} className="border p-2 rounded" />
    <input name="endDate" type="datetime-local" onChange={onChange} className="border p-2 rounded" />
    <select name="severity" onChange={onChange} className="border p-2 rounded">
      <option value="">Select Severity</option>
      {SEVERITY.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
    <select name="status" onChange={onChange} className="border p-2 rounded">
      <option value="">Select Status</option>
      {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
    <select name="category" onChange={onChange} className="border p-2 rounded">
      <option value="">Select Category</option>
      {PROJECT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>
    <textarea name="rootCause" placeholder="Root Cause" onChange={onChange} className="border p-2 rounded" />
    <textarea name="actionTaken" placeholder="Action Taken" onChange={onChange} className="border p-2 rounded" />
    <input name="departmentId" type="number" placeholder="Department ID" onChange={onChange} className="border p-2 rounded" />
    <input name="projectId" type="number" placeholder="Project ID" onChange={onChange} className="border p-2 rounded" />
  </div>
);

const OperationalIncidentsTable = ({ data }: any) => (
  <table className="table-auto w-full border border-gray-200">
    <thead className="bg-gray-100 text-left">
      <tr>
        <th className="p-3">ID</th>
        <th className="p-3">Service</th>
        <th className="p-3">Incident Date</th>
        <th className="p-3">Severity</th>
        <th className="p-3">Category</th>
      </tr>
    </thead>
    <tbody>
      {data.map((incident: any) => (
        <tr key={incident.id} className="border-b hover:bg-gray-50">
          <td className="p-3">{incident.id}</td>
          <td className="p-3">{incident.serviceName}</td>
          <td className="p-3">{incident.incidentDate}</td>
          <td className="p-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadgeClass(
                incident.severity
              )}`}
            >
              {incident.severity}
            </span>
          </td>
          <td className="p-3">{incident.category}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const ProjectIncidentsTable = ({ data }: any) => (
  <table className="table-auto w-full border border-gray-200">
    <thead className="bg-gray-100 text-left">
      <tr>
        <th className="p-3">ID</th>
        <th className="p-3">Title</th>
        <th className="p-3">Project</th>
        <th className="p-3">Severity</th>
        <th className="p-3">Category</th>
      </tr>
    </thead>
    <tbody>
      {data.map((incident: any) => (
        <tr key={incident.id} className="border-b hover:bg-gray-50">
          <td className="p-3">{incident.id}</td>
          <td className="p-3">{incident.title}</td>
          <td className="p-3">{incident.project}</td>
          <td className="p-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadgeClass(
                incident.severity
              )}`}
            >
              {incident.severity}
            </span>
          </td>
          <td className="p-3">{incident.category}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default IncidentsPage;
