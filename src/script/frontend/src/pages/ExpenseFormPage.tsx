// src/pages/ExpenseFormPage.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Expense, NewExpense } from "../types/Expense";
import {
  createExpense,
  updateExpense,
  // fetchExpenseById, // UNCOMMENT INI JIKA SUDAH ADA DI ExpenseService.ts
} from "../api/ExpenseService";

const ExpenseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // --- INISIALISASI STATE YANG BENAR ---
  const [expense, setExpense] = useState<
    Omit<Expense, "id" | "date"> & { date: string }
  >({
    description: "",
    amount: 0,
    category: "Food",
    type: "Pengeluaran", // FIELD WAJIB BARU DITAMBAHKAN
    date: new Date().toISOString().split("T")[0],
    isRecurring: false,
    recurringPeriod: undefined,
  });
  // --- AKHIR INISIALISASI STATE ---

  // useEffect untuk mengambil data jika mode EDIT
  useEffect(() => {
    if (isEditMode) {
      // TODO: Ambil data pengeluaran berdasarkan ID dari backend
      /*
      const fetchData = async () => {
        try {
          const data = await fetchExpenseById(id);
          setExpense({
            ...data,
            date: data.date.split('T')[0],
            // Hapus ID saat set state
            // id: undefined 
          });
          setReceiptUrl(data.receipt_path || null);
        } catch (err) {
          alert("Gagal memuat data pengeluaran untuk edit.");
          navigate('/');
        }
      };
      fetchData();
      */
    }
  }, [isEditMode, id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setExpense((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "amount"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // finalExpense adalah data yang siap kirim, bertipe NewExpense (tanpa ID)
      const finalExpense: NewExpense = {
        ...expense,
        receipt_path: null,
      };

      if (isEditMode) {
        await updateExpense(Number(id), finalExpense);
      } else {
        await createExpense(finalExpense);
      }

      navigate("/");
    } catch (error) {
      alert(
        `Gagal ${
          isEditMode ? "mengubah" : "menambah"
        } pengeluaran. Pastikan backend berjalan.`
      );
    }
  };

  return (
    <div className="expense-form-page">
      <div className="expense-form-container">
        <h2>{isEditMode ? "✏️ Edit Transaksi" : "➕ Tambah Transaksi Baru"}</h2>
        <form onSubmit={handleSubmit}>
          {/* Baris 1: Type dan Keterangan */}
          <div className="form-row">
            <label>Jenis:</label>
            <select
              name="type"
              value={expense.type}
              onChange={handleChange}
              required
            >
              <option value="Pengeluaran">💸 Pengeluaran</option>
              <option value="Pemasukan">💰 Pemasukan</option>
            </select>
          </div>

          <div className="form-row">
            <label>Keterangan:</label>
            <input
              name="description"
              placeholder="Contoh: Belanja bulanan"
              value={expense.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Baris 2: Jumlah, Kategori, dan Tanggal */}
          <div className="form-row">
            <label>Jumlah:</label>
            <input
              name="amount"
              type="number"
              placeholder="0"
              value={expense.amount}
              onChange={handleChange}
              required
              min="1"
              className="input-amount-no-spinner"
            />
          </div>

          <div className="form-row">
            <label>Kategori:</label>
            <select
              name="category"
              value={expense.category}
              onChange={handleChange}
              required
            >
              <option value="Food">🍔 Makanan</option>
              <option value="Transport">🚗 Transport</option>
              <option value="Housing">🏠 Housing</option>
              <option value="Entertainment">🎮 Entertainment</option>
              <option value="Other">📦 Other</option>
            </select>
          </div>

          <div className="form-row">
            <label>Tanggal:</label>
            <input
              name="date"
              type="date"
              value={expense.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Baris 3: Transaksi Berulang */}
          <div className="checkbox-row">
            <input
              type="checkbox"
              name="isRecurring"
              id="isRecurring"
              checked={expense.isRecurring || false}
              onChange={handleChange}
            />
            <label htmlFor="isRecurring">🔄 Transaksi Berulang</label>
          </div>

          {expense.isRecurring && (
            <div className="form-row">
              <label>Periode:</label>
              <select
                name="recurringPeriod"
                value={expense.recurringPeriod || "Monthly"}
                onChange={handleChange}
                required
              >
                <option value="Weekly">📅 Mingguan</option>
                <option value="Monthly">📆 Bulanan</option>
                <option value="Yearly">🗓️ Tahunan</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn-submit-form">
            {isEditMode ? "💾 Simpan Perubahan" : "✅ Catat Transaksi"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseFormPage;
