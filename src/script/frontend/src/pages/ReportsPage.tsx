// src/pages/ReportsPage.tsx
import React, { useState, useEffect } from "react";
import { getReportSummary, downloadReport } from "../api/ReportService";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  categoryBreakdown: Record<string, number>;
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

const ReportsPage: React.FC = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch summary data
  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReportSummary(startDate, endDate);
      setSummary(data);
    } catch (err: any) {
      console.error("Error fetching summary:", err);
      setError(
        err?.response?.data?.message || "Gagal memuat ringkasan laporan"
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSummary();
  }, []);

  // Handle download
  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError(null);
      await downloadReport(startDate, endDate);
      alert("✅ Laporan berhasil diunduh!");
    } catch (err: any) {
      console.error("Error downloading report:", err);
      setError(err?.response?.data?.message || "Gagal mengunduh laporan");
      alert("❌ Gagal mengunduh laporan");
    } finally {
      setDownloading(false);
    }
  };

  // Prepare chart data
  const categoryData = summary
    ? Object.entries(summary.categoryBreakdown).map(([category, amount]) => ({
        name: category,
        value: amount,
      }))
    : [];

  const summaryData = summary
    ? [
        { name: "Pemasukan", value: summary.totalIncome, color: "#38a169" },
        { name: "Pengeluaran", value: summary.totalExpense, color: "#e53e3e" },
      ]
    : [];

  const COLORS = ["#667eea", "#764ba2", "#f56565", "#48bb78", "#4299e1"];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>📈 Laporan Keuangan</h1>
          <p className="page-subtitle">
            Analisis dan download laporan transaksi keuangan Anda
          </p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filter Section */}
      <div className="report-filter-card">
        <h2>📅 Filter Periode Laporan</h2>
        <div className="filter-row">
          <div className="filter-group">
            <label>Dari Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <button
              onClick={fetchSummary}
              className="btn-apply-filter"
              disabled={loading}
            >
              {loading ? "⏳ Memuat..." : "🔍 Terapkan Filter"}
            </button>
          </div>

          <div className="filter-group">
            <button
              onClick={handleDownload}
              className="btn-download-report"
              disabled={downloading || !summary}
            >
              {downloading ? "⏳ Mengunduh..." : "📥 Download Excel (.xlsx)"}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">⏳ Memuat data laporan...</div>
      ) : summary ? (
        <>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="card income-card">
              <h4>Total Pemasukan</h4>
              <h2>Rp {summary.totalIncome.toLocaleString("id-ID")}</h2>
              <p className="card-subtitle">
                {summary.transactionCount} transaksi
              </p>
            </div>
            <div className="card expense-card">
              <h4>Total Pengeluaran</h4>
              <h2>Rp {summary.totalExpense.toLocaleString("id-ID")}</h2>
            </div>
            <div className="card balance-card">
              <h4>Saldo Bersih</h4>
              <h2
                style={{ color: summary.balance >= 0 ? "#38a169" : "#e53e3e" }}
              >
                Rp {summary.balance.toLocaleString("id-ID")}
              </h2>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            {/* Pemasukan vs Pengeluaran */}
            <div className="chart-card">
              <h3>💰 Pemasukan vs Pengeluaran</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={summaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => {
                      if (value >= 1000000)
                        return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                      return value.toString();
                    }}
                    width={70}
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      `Rp ${value.toLocaleString("id-ID")}`
                    }
                  />
                  <Legend />
                  <Bar dataKey="value" name="Jumlah">
                    {summaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Breakdown */}
            {categoryData.length > 0 && (
              <div className="chart-card">
                <h3>🏷️ Pengeluaran per Kategori</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) =>
                        `${entry.name}: ${(
                          (entry.value / summary.totalExpense) *
                          100
                        ).toFixed(1)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        `Rp ${value.toLocaleString("id-ID")}`
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="report-info-card">
            <h3>ℹ️ Informasi Laporan</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Periode:</span>
                <span className="info-value">
                  {summary.dateRange.start && summary.dateRange.end
                    ? `${new Date(summary.dateRange.start).toLocaleDateString(
                        "id-ID"
                      )} - ${new Date(summary.dateRange.end).toLocaleDateString(
                        "id-ID"
                      )}`
                    : "Semua waktu"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Total Transaksi:</span>
                <span className="info-value">
                  {summary.transactionCount} transaksi
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Rata-rata Pengeluaran:</span>
                <span className="info-value">
                  Rp{" "}
                  {summary.transactionCount > 0
                    ? (
                        summary.totalExpense / summary.transactionCount
                      ).toLocaleString("id-ID", { maximumFractionDigits: 0 })
                    : 0}
                </span>
              </div>
            </div>
          </div>

          {/* Download Info */}
          <div className="download-info">
            <p>
              💡 <strong>Tips:</strong> Klik tombol "Download Excel" untuk
              mengunduh laporan lengkap dalam format .xlsx yang dapat dibuka
              dengan Microsoft Excel atau Google Sheets.
            </p>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h3>📭 Tidak ada data</h3>
          <p>
            Pilih periode tanggal dan klik "Terapkan Filter" untuk melihat
            laporan
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
