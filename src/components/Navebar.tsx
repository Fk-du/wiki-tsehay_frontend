import React from "react";
import { AppBar, Toolbar, Button, IconButton, Box } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{ backgroundColor: "rgb(37,91,48)" }}
      className="shadow-md"
    >
      <Toolbar className="flex justify-between px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="/Tsehay_logo.png"
            alt="Logo"
            className="h-12 w-auto"
            onClick={() => navigate("/")}
          />
          <span className="text-lg font-semibold text-white hidden sm:block">
            Tsehay Wiki
          </span>
        </div>

        {/* Center: Nav Links */}
        <Box
          component="ul"
          className="flex items-center justify-center gap-8 px-6 py-2 rounded-full shadow-inner"
        >
          <li>
            <NavLink
              to="/"
              
              className={({ isActive }) =>
                `hover:text-yellow-400 transition ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `hover:text-yellow-400 transition ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              Services
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `hover:text-yellow-400 transition ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-yellow-400 transition ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `hover:text-yellow-400 transition ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              Contact
            </NavLink>
          </li>
        </Box>

        {/* Right: Button */}
        <Button
          variant="contained"
          onClick={() => navigate("/about")}
          sx={{
            backgroundColor: "rgba(240,206,13,0.937)",
            color: "white",
            "&:hover": { backgroundColor: "#facc15" },
          }}
          className="rounded-lg px-6 py-2 font-medium hidden sm:block"
        >
          About Us
        </Button>

        {/* Mobile Menu Button */}
        <IconButton
          edge="end"
          className="md:hidden text-white"
          onClick={() => alert("Open mobile menu")}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
