// src/pages/TransactionsPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { fetchExpenses, deleteExpense } from "../api/ExpenseService";
import type { Expense } from "../types/Expense";
import { useNavigate } from "react-router-dom";

const TransactionsPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state for viewing receipt
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const navigate = useNavigate();
  const isInitialMount = useRef(true);
  const filterTimeout = useRef<number | null>(null);

  // Fetch expenses
  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await fetchExpenses(startDate, endDate);
      setExpenses(data);
      setFilteredExpenses(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching expenses:", err);
      setError(err?.response?.data?.message || "Gagal memuat data transaksi");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadExpenses();
  }, []);

  // Filter dengan debounce
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (filterTimeout.current) {
      clearTimeout(filterTimeout.current);
    }

    filterTimeout.current = window.setTimeout(() => {
      loadExpenses();
    }, 500);

    return () => {
      if (filterTimeout.current) {
        clearTimeout(filterTimeout.current);
      }
    };
  }, [startDate, endDate]);

  // Apply filters
  useEffect(() => {
    let filtered = [...expenses];

    // Filter by type
    if (filterType !== "All") {
      filtered = filtered.filter((exp) => exp.type === filterType);
    }

    // Filter by category
    if (filterCategory !== "All") {
      filtered = filtered.filter((exp) => exp.category === filterCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((exp) =>
        exp.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExpenses(filtered);
  }, [expenses, filterType, filterCategory, searchQuery]);

  // Delete expense
  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      return;
    }

    try {
      await deleteExpense(id);
      loadExpenses();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal menghapus transaksi");
    }
  };

  // View receipt
  const handleViewReceipt = (receiptPath: string) => {
    setSelectedReceipt(receiptPath);
    setShowReceiptModal(true);
  };

  const closeReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedReceipt(null);
  };

  // Calculate summary
  const totalIncome = filteredExpenses
    .filter((exp) => exp.type === "Pemasukan")
    .reduce((sum, exp) => sum + exp.amount, 0);

  const totalExpense = filteredExpenses
    .filter((exp) => exp.type === "Pengeluaran")
    .reduce((sum, exp) => sum + exp.amount, 0);

  const balance = totalIncome - totalExpense;

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">⏳ Memuat data transaksi...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>💳 Daftar Transaksi</h1>
          <p className="page-subtitle">
            Kelola semua transaksi pemasukan dan pengeluaran Anda
          </p>
        </div>
        <button
          className="btn-add-transaction"
          onClick={() => navigate("/expense-form")}
        >
          ➕ Tambah Transaksi
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card income-card">
          <h4>Total Pemasukan</h4>
          <h2>Rp {totalIncome.toLocaleString("id-ID")}</h2>
        </div>
        <div className="card expense-card">
          <h4>Total Pengeluaran</h4>
          <h2>Rp {totalExpense.toLocaleString("id-ID")}</h2>
        </div>
        <div className="card balance-card">
          <h4>Saldo</h4>
          <h2 style={{ color: balance >= 0 ? "#38a169" : "#e53e3e" }}>
            Rp {balance.toLocaleString("id-ID")}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>🔍 Cari Transaksi</label>
            <input
              type="text"
              placeholder="Cari berdasarkan deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>📅 Dari Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>📅 Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label>💰 Tipe Transaksi</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="All">Semua Tipe</option>
              <option value="Pemasukan">Pemasukan</option>
              <option value="Pengeluaran">Pengeluaran</option>
            </select>
          </div>

          <div className="filter-group">
            <label>🏷️ Kategori</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="All">Semua Kategori</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Housing">Housing</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setFilterType("All");
                setFilterCategory("All");
                setSearchQuery("");
              }}
              className="btn-reset-filter"
            >
              🔄 Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="table-container">
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <h3>📭 Tidak ada transaksi</h3>
            <p>Belum ada transaksi yang sesuai dengan filter Anda</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/expense-form")}
            >
              ➕ Tambah Transaksi Pertama
            </button>
          </div>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Deskripsi</th>
                <th>Kategori</th>
                <th>Tipe</th>
                <th>Jumlah</th>
                <th>Bukti</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>
                    {new Date(expense.date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <strong>{expense.description}</strong>
                  </td>
                  <td>
                    <span className="category-badge">{expense.category}</span>
                  </td>
                  <td>
                    <span
                      className={`type-badge ${
                        expense.type === "Pemasukan"
                          ? "type-income"
                          : "type-expense"
                      }`}
                    >
                      {expense.type === "Pemasukan" ? "📈" : "📉"}{" "}
                      {expense.type}
                    </span>
                  </td>
                  <td>
                    <strong
                      style={{
                        color:
                          expense.type === "Pemasukan" ? "#38a169" : "#e53e3e",
                      }}
                    >
                      {expense.type === "Pemasukan" ? "+" : "-"} Rp{" "}
                      {expense.amount.toLocaleString("id-ID")}
                    </strong>
                  </td>
                  <td>
                    {expense.receipt_data ? (
                      <button
                        className="btn-view-receipt"
                        onClick={() => handleViewReceipt(expense.receipt_data!)}
                        title="Lihat Bukti"
                      >
                        📎 Lihat
                      </button>
                    ) : (
                      <span style={{ color: "#a0aec0", fontSize: "0.875rem" }}>
                        Tidak ada
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => navigate(`/expenses/edit/${expense.id}`)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(expense.id)}
                        title="Hapus"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Info */}
      <div className="table-footer">
        <p>
          Menampilkan <strong>{filteredExpenses.length}</strong> dari{" "}
          <strong>{expenses.length}</strong> transaksi
        </p>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="modal-overlay" onClick={closeReceiptModal}>
          <div
            className="modal-content receipt-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>📎 Bukti Pembayaran</h2>
              <button className="btn-close-modal" onClick={closeReceiptModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <img
                src={selectedReceipt}
                alt="Bukti Pembayaran"
                style={{
                  width: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div className="modal-footer">
              <a
                href={selectedReceipt}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                🔗 Buka di Tab Baru
              </a>
              <button className="btn-cancel" onClick={closeReceiptModal}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
