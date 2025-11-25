// src/components/Sidebar.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/AuthService";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      logoutUser();
      navigate("/login");
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>MoneyFlow Dashboard</h2>
        <p className="sidebar-subtitle">Kelola Keuangan Anda</p>
      </div>

      <nav className="sidebar-nav">
        {/* GRUP UTAMA */}
        <div className="nav-group">
          <div className="nav-group-title">UTAMA</div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            end
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="nav-icon">💳</span>
            <span className="nav-text">Daftar Transaksi</span>
          </NavLink>
          <NavLink
            to="/expense-form"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="nav-icon">➕</span>
            <span className="nav-text">Tambah Transaksi</span>
          </NavLink>
        </div>

        {/* GRUP ANALISIS & LAPORAN */}
        <div className="nav-group">
          <div className="nav-group-title">ANALISIS & LAPORAN</div>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="nav-icon">📈</span>
            <span className="nav-text">Laporan Periodik</span>
          </NavLink>
          <NavLink
            to="/budgeting"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="nav-icon">🎯</span>
            <span className="nav-text">Anggaran</span>
          </NavLink>
        </div>

        {/* GRUP PENGATURAN */}
        <div className="nav-group">
          <div className="nav-group-title">PENGATURAN</div>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Pengaturan Akun</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <span className="nav-icon">🚪</span>
          <span className="nav-text">Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
