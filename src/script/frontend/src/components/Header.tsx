// frontend/src/components/Header.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/AuthService";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem("jwt_token");

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="main-app-header">
      <h1 style={{ margin: 0 }}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          💰 Expense Tracker Pro
        </Link>
      </h1>
      <nav>
        {isAuth ? (
          <>
            <Link to="/" className="nav-link">
              📊 Dashboard
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              🚪 Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-link">
            🔐 Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
