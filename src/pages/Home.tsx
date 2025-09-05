import React from "react";
import Login from "./Login";
import HeroSection from "../components/HeroSection";

const Dashboard: React.FC = () => {
  return (
    <div className="container">
      <HeroSection />
      <Login />
    </div>
  );
}
export default Dashboard;