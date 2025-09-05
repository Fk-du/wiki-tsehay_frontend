import React from "react";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section className="bg-blue-50 py-20 px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
        Centralized platform to track projects, services, incidents, and reports
      </h1>
      <p className="text-gray-600 mb-8 text-lg md:text-xl">
        Stay informed and manage everything in one place.
      </p>

      <div className="flex justify-center gap-4 flex-wrap">
        <Link
          to="/projects"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          View Projects
        </Link>

        <Link
          to="/incidents"
          className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg transition"
        >
          Report Issue
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
