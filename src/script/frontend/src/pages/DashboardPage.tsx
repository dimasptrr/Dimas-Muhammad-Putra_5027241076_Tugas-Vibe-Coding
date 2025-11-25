// frontend/src/pages/DashboardPage.tsx

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// Pastikan import type sudah diperbarui
import type { Expense, TransactionType } from "../types/Expense";
import { fetchExpenses, deleteExpense } from "../api/ExpenseService";

// Fungsi Helper untuk Format Rupiah
const formatRupiah = (amount: number) => {
  const abs = Math.abs(Number(amount) || 0);
  const formatted = abs.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  // Tampilkan tanda minus jika amount negatif
  return Number(amount) < 0 ? `-${formatted}` : formatted;
};

// Fungsi untuk memformat angka besar di chart (K, M, B)
const formatChartNumber = (value: number) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

const DashboardPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // State untuk filter: 'Semua', 'Pemasukan', 'Pengeluaran'
  const [filterType, setFilterType] = useState<TransactionType | "Semua">(
    "Semua"
  );
  // State untuk filter tanggal
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Ref untuk track initial mount
  const isInitialMount = useRef(true);

  const loadExpenses = useCallback(async (start?: string, end?: string) => {
    setIsLoading(true);
    try {
      // Perhatikan: Anda harus memastikan backend sekarang mengembalikan data dengan field 'type'
      const data = await fetchExpenses(start, end);
      // Normalisasi: pastikan setiap expense memiliki field `type` sehingga UI tidak kosong
      const normalized = data.map((e) => ({
        ...e,
        type: e.type ?? "Pengeluaran",
      }));
      setExpenses(normalized);
    } catch (error) {
      alert("Gagal mengambil data transaksi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handler untuk date change tanpa scroll bug
  const handleStartDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const newDate = e.target.value;
      setStartDate(newDate);
    },
    []
  );

  const handleEndDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const newDate = e.target.value;
      setEndDate(newDate);
    },
    []
  );

  // Effect untuk load data saat date berubah dengan debouncing
  useEffect(() => {
    if (isInitialMount.current) {
      // Load data immediately on initial mount
      loadExpenses(startDate || undefined, endDate || undefined);
      isInitialMount.current = false;
    } else {
      // Debounce subsequent changes
      const timeoutId = setTimeout(() => {
        loadExpenses(startDate || undefined, endDate || undefined);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [startDate, endDate, loadExpenses]);

  // --- LOGIKA PERHITUNGAN RINGKASAN ---
  const { totalPemasukan, totalPengeluaran, saldoAkhir } = useMemo(() => {
    // Pastikan semua amount diparsing sebagai number (jika datang sebagai string)
    const totalP = expenses
      .filter((e) => e.type === "Pemasukan")
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const totalPg = expenses
      .filter((e) => e.type === "Pengeluaran")
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);
    // saldoAkhir = totalPemasukan - totalPengeluaran
    const saldo = totalP - totalPg;
    return {
      totalPemasukan: totalP,
      totalPengeluaran: totalPg,
      saldoAkhir: saldo,
    };
  }, [expenses]);

  // --- LOGIKA FILTER TRANSAKSI ---
  const filteredExpenses = useMemo(() => {
    if (filterType === "Semua") return expenses;
    return expenses.filter((e) => e.type === filterType);
  }, [expenses, filterType]);

  // --- DATA UNTUK GRAFIK PIE (Pengeluaran per Kategori) ---
  const categoryChartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    expenses
      .filter((e) => e.type === "Pengeluaran")
      .forEach((e) => {
        categoryTotals[e.category] =
          (categoryTotals[e.category] || 0) + Number(e.amount);
      });
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [expenses]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // --- DATA UNTUK GRAFIK BAR (6 Bulan Terakhir) ---
  const monthlyTrendData = useMemo(() => {
    const monthlyData: Record<
      string,
      { month: string; pemasukan: number; pengeluaran: number }
    > = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      monthlyData[key] = {
        month: d.toLocaleDateString("id-ID", {
          month: "short",
          year: "numeric",
        }),
        pemasukan: 0,
        pengeluaran: 0,
      };
    }

    expenses.forEach((e) => {
      const expenseMonth = e.date.substring(0, 7);
      if (monthlyData[expenseMonth]) {
        if (e.type === "Pemasukan") {
          monthlyData[expenseMonth].pemasukan += Number(e.amount);
        } else {
          monthlyData[expenseMonth].pengeluaran += Number(e.amount);
        }
      }
    });

    return Object.values(monthlyData);
  }, [expenses]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Yakin ingin menghapus pengeluaran ini?")) {
      try {
        // WAJIB ADA: Pemanggilan fungsi yang diimpor
        await deleteExpense(id);
        // Refresh daftar setelah penghapusan
        loadExpenses();
      } catch (error) {
        alert("Gagal menghapus data.");
      }
    }
  };

  if (isLoading) return <div className="loading-state">Memuat data...</div>;

  return (
    <div className="dashboard-container">
      {/* JUDUL DAN TOMBOL TAMBAH */}
      <div className="header-dashboard">
        <h1>Catatan Keuangan Pribadi</h1>
        <Link to="/expenses/add">
          <button className="btn-add-transaction">Tambah Transaksi</button>
        </Link>
      </div>

      {/* 💳 CARD RINGKASAN (Mirip Tampilan) */}
      <div className="summary-cards">
        <div className="card income-card">
          <h4>Total Pemasukan</h4>
          <h2>{formatRupiah(totalPemasukan)}</h2>
        </div>
        <div className="card expense-card">
          <h4>Total Pengeluaran</h4>
          <h2>{formatRupiah(totalPengeluaran)}</h2>
        </div>
        <div className="card balance-card">
          <h4>Saldo Akhir</h4>
          <h2 className={saldoAkhir < 0 ? "text-danger" : "text-balance"}>
            {formatRupiah(saldoAkhir)}
          </h2>
        </div>
      </div>

      {/* 📊 VISUALISASI DATA */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Pengeluaran per Kategori</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {categoryChartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatRupiah(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Tren 6 Bulan Terakhir</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrendData} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatChartNumber} width={70} />
              <Tooltip
                formatter={(value) => formatRupiah(Number(value))}
                labelStyle={{ color: "#2d3748" }}
              />
              <Legend />
              <Bar dataKey="pemasukan" fill="#4caf50" name="Pemasukan" />
              <Bar dataKey="pengeluaran" fill="#f44336" name="Pengeluaran" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- DAFTAR TRANSAKSI --- */}
      <div className="transaction-section">
        <div className="transaction-header">
          <h3>Daftar Transaksi ({filteredExpenses.length})</h3>
          <div className="date-range-filter">
            <label>
              Dari:
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
              />
            </label>
            <label>
              Sampai:
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </label>
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="btn-clear-filter"
            >
              Reset Filter
            </button>
          </div>
          <div className="filter-buttons">
            <button
              onClick={() => setFilterType("Semua")}
              className={filterType === "Semua" ? "active" : ""}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType("Pemasukan")}
              className={filterType === "Pemasukan" ? "active" : ""}
            >
              Pemasukan
            </button>
            <button
              onClick={() => setFilterType("Pengeluaran")}
              className={filterType === "Pengeluaran" ? "active" : ""}
            >
              Pengeluaran
            </button>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#718096",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📊</div>
            <h3 style={{ marginBottom: "10px", color: "#4a5568" }}>
              Belum Ada Transaksi
            </h3>
            <p>
              Mulai catat transaksi pertama Anda dengan klik tombol "Tambah
              Transaksi"
            </p>
          </div>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th>Jenis</th>
                <th>Jumlah</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      {new Date(exp.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>{exp.description}</td>
                    <td>
                      <span
                        className={`badge ${
                          exp.type === "Pemasukan"
                            ? "badge-income"
                            : "badge-expense"
                        }`}
                      >
                        {exp.type === "Pemasukan"
                          ? "💰 Pemasukan"
                          : "💸 Pengeluaran"}
                      </span>
                    </td>
                    <td
                      style={{
                        fontWeight: 600,
                        color: exp.type === "Pemasukan" ? "#38a169" : "#e53e3e",
                      }}
                    >
                      {formatRupiah(exp.amount)}
                    </td>
                    <td>
                      <Link to={`/expenses/edit/${exp.id}`}>
                        <button className="icon-btn edit-btn" title="Edit">
                          ✏️
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="icon-btn delete-btn"
                        title="Hapus"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
