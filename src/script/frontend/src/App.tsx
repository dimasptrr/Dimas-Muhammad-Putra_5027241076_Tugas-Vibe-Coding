// src/App.tsx

import { Outlet, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.tsx";
import "./App.css";

// Fungsi placeholder untuk mengecek status login
const isAuthenticated = () => {
  // Implementasi nyata: cek token di localStorage/sessionStorage
  return localStorage.getItem("jwt_token") ? true : false;
};

// Komponen Pelindung Rute (Route Guard)
const ProtectedRoute = () => {
  const location = useLocation();
  const isAuth = isAuthenticated();

  // Daftar rute yang TIDAK membutuhkan otentikasi
  const publicPaths = ["/login", "/register"];

  if (!isAuth && !publicPaths.includes(location.pathname)) {
    // Jika belum login dan mencoba akses rute terproteksi, redirect ke Login
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, tampilkan layout dengan Sidebar
  if (isAuth && !publicPaths.includes(location.pathname)) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    );
  }

  // Untuk halaman public (login/register), render tanpa Sidebar
  return (
    <main className="auth-layout">
      <Outlet />
    </main>
  );
};

function App() {
  return <ProtectedRoute />;
}

export default App;
