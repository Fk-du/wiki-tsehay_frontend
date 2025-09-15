import React, { useEffect, useState } from "react";
import axios from "axios";

interface Service {
  id: number;
  name: string;
  status: "Running" | "Stopped" | "Failed" | "Paused" | "Maintenance";
  recentAlert?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const statusColors: Record<Service["status"], string> = {
  "Running": "bg-green-100 text-green-800",
  "Stopped": "bg-gray-200 text-gray-700",
  "Failed": "bg-red-100 text-red-800",
  "Paused": "bg-yellow-100 text-yellow-800",
  "Maintenance": "bg-blue-100 text-blue-800",
};

const ServicesHealth: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        if (!token || !userData) return;

        const user = JSON.parse(userData);

        const response = await axios.get<Service[]>(
          `${API_BASE_URL}/operations/department/${user.department}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <p className="text-center">Loading services...</p>;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">
        Services Health Overview
      </h3>

      {services.length > 0 ? (
        services.map((service) => (
          <div
            key={service.id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">{service.name}</span>
              <span
                className={`mt-1 inline-block px-2 py-1 rounded-full text-sm font-medium ${
                  statusColors[service.status]
                }`}
              >
                {service.status}
              </span>

            </div>
            {service.recentAlert && (
              <p className="text-red-600 text-sm mt-1">
                Alert: {service.recentAlert}
              </p>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No services found.</p>
      )}
    </div>
  );
};

export default ServicesHealth;
