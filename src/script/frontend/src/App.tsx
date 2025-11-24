// src/App.tsx

import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header.tsx'; // Kita buatkan sebentar
import './App.css'; 

// Fungsi placeholder untuk mengecek status login
const isAuthenticated = () => {
    // Implementasi nyata: cek token di localStorage/sessionStorage
    return localStorage.getItem('jwt_token') ? true : false;
};

// Komponen Pelindung Rute (Route Guard)
const ProtectedRoute = () => {
  const location = useLocation();
  const isAuth = isAuthenticated();

  // Daftar rute yang TIDAK membutuhkan otentikasi
  const publicPaths = ['/login', '/register'];

  if (!isAuth && !publicPaths.includes(location.pathname)) {
    // Jika belum login dan mencoba akses rute terproteksi, redirect ke Login
    return <Navigate to="/login" replace />;
  }
  
  // Render Outlet (halaman yang diminta)
  return <Outlet />;
};

function App() {
  return (
    <>
      <Header /> 
      <main>
        {/* ProtectedRoute akan mengecek status sebelum merender halaman */}
        <ProtectedRoute />
      </main>
      {/* Jika diperlukan, tambahkan Footer di sini */}
    </>
  );
}

export default App;