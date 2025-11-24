// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Import Halaman-Halaman
import LoginPage from './pages/Auth/LoginPage.tsx';
import RegisterPage from './pages/Auth/RegisterPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import ExpenseFormPage from './pages/ExpenseFormPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App sebagai layout utama atau penyedia Context
    errorElement: <NotFoundPage />,
    children: [
      // Halaman Autentikasi (tanpa layout)
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      
      // Halaman Utama (Membutuhkan Autentikasi)
      { path: '/', element: <DashboardPage /> }, // Halaman Dashboard (List Data)
      { path: '/expenses/add', element: <ExpenseFormPage /> }, // Form Tambah
      { path: '/expenses/edit/:id', element: <ExpenseFormPage /> }, // Form Edit/Detail
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* RouterProvider akan menyediakan routing ke seluruh aplikasi */}
    <RouterProvider router={router} />
  </React.StrictMode>
);