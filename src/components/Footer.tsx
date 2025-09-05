import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className=" bg-green-700 text-gray-300 py-6 mt-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Quick Links */}
        <div className="flex gap-6">
          <Link to="/docs" className="hover:text-white">Documentation</Link>
          <Link to="/support" className="hover:text-white">Support</Link>
          <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
        </div>

        {/* Contact Info */}
        <div className="text-center md:text-right">
          <p>Email: <a href="mailto:support@tsehaywiki.com.et" className="hover:text-white">support@tsehaywiki.com</a></p>
          <p>Phone: +251-900-000-000</p>
        </div>

        {/* Version Info */}
        <div className="text-sm text-gray-400">
          Version 1.0.0 © {new Date().getFullYear()} Tsehay Wiki
        </div>
      </div>
    </footer>
  );
}
