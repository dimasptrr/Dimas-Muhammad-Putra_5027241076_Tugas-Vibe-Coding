// src/pages/BudgetingPage.tsx
import React, { useState, useEffect } from "react";
import { fetchExpenses } from "../api/ExpenseService";

interface Budget {
  category: string;
  limit: number;
  spent: number;
  percentage: number;
}

const BudgetingPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [budgetLimit, setBudgetLimit] = useState("");

  const categories = ["Food", "Transport", "Housing", "Entertainment", "Other"];

  // Fetch expenses for current month
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const startDate = firstDay.toISOString().split("T")[0];
        const endDate = lastDay.toISOString().split("T")[0];

        const data = await fetchExpenses(startDate, endDate);
        const expenseData = data.filter((e) => e.type === "Pengeluaran");

        // Calculate budgets
        const savedBudgets = localStorage.getItem("budgets");
        const budgetLimits: Record<string, number> = savedBudgets
          ? JSON.parse(savedBudgets)
          : {};

        const budgetData: Budget[] = categories.map((category) => {
          const spent = expenseData
            .filter((e) => e.category === category)
            .reduce((sum, e) => sum + e.amount, 0);

          const limit = budgetLimits[category] || 0;
          const percentage = limit > 0 ? (spent / limit) * 100 : 0;

          return { category, limit, spent, percentage };
        });

        setBudgets(budgetData);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSetBudget = () => {
    if (!budgetLimit || parseFloat(budgetLimit) <= 0) {
      alert("Masukkan jumlah anggaran yang valid!");
      return;
    }

    const savedBudgets = localStorage.getItem("budgets");
    const budgetLimits: Record<string, number> = savedBudgets
      ? JSON.parse(savedBudgets)
      : {};

    budgetLimits[selectedCategory] = parseFloat(budgetLimit);
    localStorage.setItem("budgets", JSON.stringify(budgetLimits));

    // Update budgets state
    const updatedBudgets = budgets.map((budget) => {
      if (budget.category === selectedCategory) {
        const limit = parseFloat(budgetLimit);
        const percentage = limit > 0 ? (budget.spent / limit) * 100 : 0;
        return { ...budget, limit, percentage };
      }
      return budget;
    });

    setBudgets(updatedBudgets);
    setShowModal(false);
    setBudgetLimit("");
    alert(`✅ Anggaran untuk ${selectedCategory} berhasil diatur!`);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "#e53e3e";
    if (percentage >= 80) return "#f56565";
    if (percentage >= 60) return "#ed8936";
    return "#38a169";
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 100) return "🚨";
    if (percentage >= 80) return "⚠️";
    if (percentage >= 60) return "📊";
    return "✅";
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>🎯 Anggaran Bulanan</h1>
          <p className="page-subtitle">
            Kelola dan pantau anggaran pengeluaran Anda per kategori
          </p>
        </div>
        <button
          className="btn-add-transaction"
          onClick={() => setShowModal(true)}
        >
          Atur Anggaran Baru
        </button>
      </div>

      {loading ? (
        <div className="loading-state">⏳ Memuat data anggaran...</div>
      ) : (
        <>
          {/* Overall Summary */}
          <div className="summary-cards">
            <div className="card balance-card">
              <h4>Total Anggaran Bulan Ini</h4>
              <h2>Rp {totalBudget.toLocaleString("id-ID")}</h2>
            </div>
            <div className="card expense-card">
              <h4>Total Terpakai</h4>
              <h2>Rp {totalSpent.toLocaleString("id-ID")}</h2>
              <p className="card-subtitle">
                {overallPercentage.toFixed(1)}% dari anggaran
              </p>
            </div>
            <div className="card income-card">
              <h4>Sisa Anggaran</h4>
              <h2
                style={{
                  color: totalBudget - totalSpent >= 0 ? "#38a169" : "#e53e3e",
                }}
              >
                Rp {(totalBudget - totalSpent).toLocaleString("id-ID")}
              </h2>
            </div>
          </div>

          {/* Budget Cards */}
          <div className="budget-grid">
            {budgets.map((budget) => (
              <div key={budget.category} className="budget-card">
                <div className="budget-card-header">
                  <h3>
                    {getStatusIcon(budget.percentage)} {budget.category}
                  </h3>
                  <button
                    className="btn-edit-budget"
                    onClick={() => {
                      setSelectedCategory(budget.category);
                      setBudgetLimit(budget.limit.toString());
                      setShowModal(true);
                    }}
                  >
                    ✏️
                  </button>
                </div>

                <div className="budget-info">
                  <div className="budget-row">
                    <span>Anggaran:</span>
                    <strong>Rp {budget.limit.toLocaleString("id-ID")}</strong>
                  </div>
                  <div className="budget-row">
                    <span>Terpakai:</span>
                    <strong
                      style={{ color: getProgressColor(budget.percentage) }}
                    >
                      Rp {budget.spent.toLocaleString("id-ID")}
                    </strong>
                  </div>
                  <div className="budget-row">
                    <span>Sisa:</span>
                    <strong
                      style={{
                        color:
                          budget.limit - budget.spent >= 0
                            ? "#38a169"
                            : "#e53e3e",
                      }}
                    >
                      Rp {(budget.limit - budget.spent).toLocaleString("id-ID")}
                    </strong>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${Math.min(budget.percentage, 100)}%`,
                      backgroundColor: getProgressColor(budget.percentage),
                    }}
                  />
                </div>
                <div className="progress-label">
                  {budget.percentage.toFixed(1)}% terpakai
                </div>

                {budget.percentage >= 100 && (
                  <div className="budget-warning">
                    ⚠️ Anggaran sudah melebihi batas!
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="budget-tips">
            <h3>💡 Tips Mengelola Anggaran</h3>
            <ul>
              <li>
                Atur anggaran realistis berdasarkan kebutuhan bulanan Anda
              </li>
              <li>Pantau progress anggaran secara berkala</li>
              <li>Prioritaskan pengeluaran penting (Housing, Food)</li>
              <li>Sisihkan 10-20% dari pendapatan untuk tabungan</li>
              <li>Review dan sesuaikan anggaran setiap bulan</li>
            </ul>
          </div>
        </>
      )}

      {/* Modal Set Budget */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🎯 Atur Anggaran</h2>
            <div className="form-group">
              <label>Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Batas Anggaran (Rp)</label>
              <input
                type="number"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                placeholder="Contoh: 1000000"
                className="filter-input"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleSetBudget} className="btn-primary">
                Simpan Anggaran
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetingPage;
