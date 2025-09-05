import React from "react";

interface KeyMetricsProps {
  totalProjects: number;
  runningServices: number;
  activeIncidents: number;
  recentUpdates: number;
}

const KeyMetrics: React.FC<KeyMetricsProps> = ({
  totalProjects,
  runningServices,
  activeIncidents,
  recentUpdates,
}) => {
  const metrics = [
    { title: "Total Projects", value: totalProjects, color: "bg-blue-100", icon: "📁" },
    { title: "Running Services", value: runningServices, color: "bg-green-100", icon: "⚙️" },
    { title: "Active Incidents", value: activeIncidents, color: "bg-red-100", icon: "🚨" },
    { title: "Recent Updates", value: recentUpdates, color: "bg-yellow-100", icon: "📝" },
  ];

  return (
    <section className="py-12 px-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-md ${metric.color}`}
          >
            <div className="text-4xl mb-3">{metric.icon}</div>
            <div className="text-xl font-semibold">{metric.value}</div>
            <div className="text-gray-600 mt-1">{metric.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KeyMetrics;
