import React, { useState } from "react";
import { Search, User, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  isLoggedIn: boolean;
  userName?: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, userName, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">Wiki Tsehay</span>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex gap-6">
        {["dashboard","projects","services","reports","incidents","users","contact"].map(
          (item) => (
            <Link
              key={item}
              to={`/${item}`}
              className="text-gray-700 hover:text-blue-600 transition"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          )
        )}
      </nav>

      {/* Right Side (Search + User Menu) */}
      <div className="flex items-center gap-4 relative">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <User className="h-5 w-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2 text-gray-700 border-b">
                    Hello, {userName || "User"}
                  </div>
                  <button
                    className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                    onClick={() => {
                      onLogout();
                      setMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/logout"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Logout
                  </Link>
                  <Link
                    to="#"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
