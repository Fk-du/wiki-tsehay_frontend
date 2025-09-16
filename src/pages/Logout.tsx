import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_NETWORK || import.meta.env.VITE_API_BASE_URL_LOCAL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode token to get user email
        const payload = JSON.parse(atob(token.split('.')[1]));
        setEmail(payload.email);
      } catch {
        setEmail("");
      }

      // Call backend logout API
      axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .catch(err => console.error("Logout API error:", err))
      .finally(() => {
        // Clear local token/session
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to login
        navigate("/login", { replace: true });
      });
    } else {
      // No token, redirect immediately
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-xl font-semibold">Logging out...</h2>
      {email && <p className="text-gray-600 mt-2">User: {email}</p>}
      <p className="text-gray-600 mt-1">Redirecting to login page.</p>
    </div>
  );
};

export default Logout;
