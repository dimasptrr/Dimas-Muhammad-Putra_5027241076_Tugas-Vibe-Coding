// src/pages/SettingsPage.tsx
import React, { useState, useEffect } from "react";

const SettingsPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currency, setCurrency] = useState("IDR");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  // Toggle states for expandable cards
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Load user data from localStorage or API
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setEmail(user.email || "");
      setName(user.name || "");
    }

    // Load preferences
    const savedCurrency = localStorage.getItem("currency");
    const savedDateFormat = localStorage.getItem("dateFormat");
    const savedEmailNotif = localStorage.getItem("emailNotifications");

    if (savedCurrency) setCurrency(savedCurrency);
    if (savedDateFormat) setDateFormat(savedDateFormat);
    if (savedEmailNotif) setEmailNotifications(savedEmailNotif === "true");
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update localStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      userData.name = name;
      userData.email = email;
      localStorage.setItem("user", JSON.stringify(userData));

      alert("✅ Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Update profile error:", error);
      alert("❌ Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      alert("⚠️ Password saat ini harus diisi!");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("⚠️ Password baru dan konfirmasi password tidak cocok!");
      return;
    }

    if (newPassword.length < 6) {
      alert("⚠️ Password minimal 6 karakter!");
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement API call to change password
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("✅ Password berhasil diubah!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Change password error:", error);
      alert("❌ Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem("currency", currency);
    localStorage.setItem("dateFormat", dateFormat);
    localStorage.setItem("emailNotifications", emailNotifications.toString());
    alert("✅ Preferensi berhasil disimpan!");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>⚙️ Pengaturan Akun</h1>
        <p className="page-subtitle">
          Kelola informasi profil, keamanan, dan preferensi akun Anda
        </p>
      </div>

      <div className="settings-grid">
        {/* Card 1: Informasi Profil */}
        <div className="settings-card settings-card-expandable">
          <div
            className="settings-card-header"
            onClick={() => setShowProfileForm(!showProfileForm)}
          >
            <h2>📝 Informasi Profil</h2>
            <span className="expand-icon">{showProfileForm ? "▼" : "▶"}</span>
          </div>

          {showProfileForm && (
            <div className="settings-card-content">
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="input-disabled"
                    title="Email tidak dapat diubah"
                  />
                  <small className="form-hint">Email tidak dapat diubah</small>
                </div>
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "⏳ Menyimpan..." : "💾 Simpan Perubahan"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Card 2: Ubah Password */}
        <div className="settings-card settings-card-expandable">
          <div
            className="settings-card-header"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            <h2>🔒 Ubah Password</h2>
            <span className="expand-icon">{showPasswordForm ? "▼" : "▶"}</span>
          </div>

          {showPasswordForm && (
            <div className="settings-card-content">
              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label>Password Saat Ini</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan password saat ini"
                  />
                </div>
                <div className="form-group">
                  <label>Password Baru</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                  />
                </div>
                <div className="form-group">
                  <label>Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "⏳ Mengubah..." : "🔐 Ubah Password"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Card 3: Informasi Akun */}
        <div className="settings-card settings-card-expandable">
          <div
            className="settings-card-header"
            onClick={() => setShowAccountInfo(!showAccountInfo)}
          >
            <h2>ℹ️ Informasi Akun</h2>
            <span className="expand-icon">{showAccountInfo ? "▼" : "▶"}</span>
          </div>

          {showAccountInfo && (
            <div className="settings-card-content">
              <div className="info-group">
                <div className="info-item">
                  <span className="info-label">Status Akun:</span>
                  <span className="info-value status-active">✓ Aktif</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Terdaftar Sejak:</span>
                  <span className="info-value">
                    {new Date().toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email Terverifikasi:</span>
                  <span className="info-value status-verified">✓ Ya</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tipe Akun:</span>
                  <span className="info-value">Personal</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card 4: Preferensi */}
        <div className="settings-card settings-card-expandable">
          <div
            className="settings-card-header"
            onClick={() => setShowPreferences(!showPreferences)}
          >
            <h2>🎨 Preferensi</h2>
            <span className="expand-icon">{showPreferences ? "▼" : "▶"}</span>
          </div>

          {showPreferences && (
            <div className="settings-card-content">
              <div className="form-group">
                <label>Mata Uang</label>
                <select
                  className="form-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="IDR">IDR (Rupiah)</option>
                  <option value="USD">USD (Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (Pound Sterling)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Format Tanggal</label>
                <select
                  className="form-select"
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <span>Aktifkan Notifikasi Email</span>
                </label>
                <small className="form-hint">
                  Terima email untuk transaksi penting dan laporan bulanan
                </small>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSavePreferences}
              >
                💾 Simpan Preferensi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
