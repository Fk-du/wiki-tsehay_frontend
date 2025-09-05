import React from "react";
import { Link } from "react-router-dom";

interface Incident {
  id: number;
  title: string;
  status: "Open" | "Resolved";
  date: string;
}

interface RecentReportsProps {
  incidents: Incident[];
}

const statusColors: Record<string, string> = {
  Open: "bg-red-100 text-red-800",
  Resolved: "bg-green-100 text-green-800",
};

const RecentReports: React.FC<RecentReportsProps> = ({ incidents }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Reports & Incidents</h3>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Title</th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id} className="border-t">
                <td className="px-4 py-2">{incident.title}</td>
                <td className="px-4 py-2">{incident.date}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[incident.status]}`}
                  >
                    {incident.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-right">
        <Link to="/reports" className="text-blue-600 hover:underline text-sm font-medium">
          View All Reports →
        </Link>
      </div>
    </div>
  );
};

export default RecentReports;
