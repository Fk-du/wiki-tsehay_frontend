import React from "react";
import { Outlet } from "react-router-dom";
// import Sidebar from "../pages/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";



const RootLayout: React.FC = () => {
    return (
        
        <div className="flex flex-col h-screen">
    
            <div>
            {/* Navbar */}
                <Header 
                    isLoggedIn={!!localStorage.getItem("token")} 
                    onLogout={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/login"; 
                    }} 
                    />

            </div>
            {/* Sidebar + Content */}
            <div className="flex flex-1 bg-t ransparent">
                <main className="flex-1 p-6 bg-gray-100 overflow-y-auto text-center">
                <Outlet /> {/* Page content */}
                </main>
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
}
export default RootLayout;