// src/pages/Auth/LoginPage.tsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/AuthService"; // Kita buatkan templatenya nanti

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Panggil API login
      const response = await loginUser(email, password);
      // Simpan token di localStorage (atau sessionStorage jika diinginkan)
      localStorage.setItem("jwt_token", response.token);
      // Redirect ke Dashboard setelah berhasil
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      let msg = "Login gagal. Periksa email dan password.";
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
        <h2>Login Pengguna</h2>
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
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
          {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
        </form>
        <div className="auth-footer">
          Belum punya akun? <Link to="/register">Daftar di sini</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
