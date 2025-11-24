// src/pages/Auth/RegisterPage.tsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/AuthService"; // Kita panggil fungsi register dari service

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      // Panggil API register
      await registerUser(email, password);

      alert("Pendaftaran berhasil! Silakan Login.");
      // Redirect ke halaman Login setelah berhasil daftar
      navigate("/login");
    } catch (err: any) {
      console.error("Register error:", err);
      let msg =
        "Pendaftaran gagal. Email mungkin sudah terdaftar atau terjadi kesalahan server.";
      if (err?.response) {
        try {
          msg =
            err.response.data?.message ||
            JSON.stringify(err.response.data) ||
            `Server error ${err.response.status}`;
        } catch (e) {
          msg = `Server error ${err.response.status}`;
        }
      } else if (err?.request) {
        msg =
          "Tidak ada respons dari server. Pastikan backend berjalan dan tidak ada masalah CORS.";
      } else {
        msg = err.message || String(err);
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Daftar Akun Baru</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Memproses..." : "Daftar"}
          </button>
          {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
        </form>
        <div className="auth-footer">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
