// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// Import Halaman-Halaman
import LoginPage from "./pages/Auth/LoginPage.tsx";
import RegisterPage from "./pages/Auth/RegisterPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import TransactionsPage from "./pages/TransactionsPage.tsx";
import ReportsPage from "./pages/ReportsPage.tsx";
import BudgetingPage from "./pages/BudgetingPage.tsx";
import ExpenseFormPage from "./pages/ExpenseFormPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App sebagai layout utama atau penyedia Context
    errorElement: <NotFoundPage />,
    children: [
      // Halaman Autentikasi (tanpa Sidebar)
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },

      // Halaman Utama (Dengan Sidebar - Membutuhkan Autentikasi)
      { path: "/", element: <DashboardPage /> }, // Dashboard
      { path: "/transactions", element: <TransactionsPage /> }, // Daftar Transaksi dengan Tabel
      { path: "/expense-form", element: <ExpenseFormPage /> }, // Form Tambah
      { path: "/expenses/add", element: <ExpenseFormPage /> }, // Form Tambah
      { path: "/expenses/edit/:id", element: <ExpenseFormPage /> }, // Form Edit/Detail

      // Halaman ANALISIS & LAPORAN
      { path: "/reports", element: <ReportsPage /> }, // Laporan Keuangan dengan Export Excel
      { path: "/budgeting", element: <BudgetingPage /> }, // Halaman Anggaran dengan Progress Tracking

      // Halaman PENGATURAN
      {
        path: "/categories",
        element: (
          <div className="page-container">
            <h1>🏷️ Kelola Kategori</h1>
            <p>Coming soon...</p>
          </div>
        ),
      },
      { path: "/settings", element: <SettingsPage /> }, // Pengaturan Akun
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* RouterProvider akan menyediakan routing ke seluruh aplikasi */}
    <RouterProvider router={router} />
  </React.StrictMode>
);
