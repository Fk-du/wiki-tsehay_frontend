import { useEffect, useState } from "react";
import axios from "axios";
// import HeroSection from "../components/HeroSection";
import KeyMetrics from "../components/KeyMetrics";
import ProjectsSnapshot from "../components/ProjectsSnapshot";
import ServicesHealth from "../components/ServicesHealth";
import RecentReports from "../components/RecentReports";

const sampleProjects = [];

const sampleServices = [];

const sampleIncidents = [
  { id: 1, title: "API Outage", status: "Open", date: "2025-09-02" },
  { id: 2, title: "DB Latency", status: "Resolved", date: "2025-09-01" },
  { id: 3, title: "Login Bug", status: "Resolved", date: "2025-08-30" },
];

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_NETWORK || import.meta.env.VITE_API_BASE_URL_LOCAL;

export default function Dashboard() {
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [runningServices, setRunningServices] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (!token || !userData) return;

      const user = JSON.parse(userData);
      try {
        const projectsRes = await axios.get<number>(
          `${API_BASE_URL}/api/projects/department/${user.department}/count`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTotalProjects(projectsRes.data);

        const servicesRes = await axios.get<number>(
          `${API_BASE_URL}/operations/department/${user.department}/running/count`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRunningServices(servicesRes.data);
        
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts(); 
  }, []);

  if (loading) return <p className="text-center">Loading dashboard...</p>;

  return (
    <div>

      <section className="py-12 px-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Key Metrics Overview</h2>

        <KeyMetrics
          totalProjects={totalProjects}
          runningServices={runningServices}
          activeIncidents={sampleIncidents.filter(i => i.status === "Open").length}
          recentUpdates={5}
        />

        <div className="mt-8 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <ProjectsSnapshot projects={sampleProjects} />
          </div>

          <div className="md:w-1/2">
            <ServicesHealth services={sampleServices} />
            <RecentReports incidents={sampleIncidents} />
          </div>
        </div>
      </section>
    </div>
  );
}
