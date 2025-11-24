// src/pages/ExpenseFormPage.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Expense, NewExpense } from "../types/Expense";
import {
  createExpense,
  updateExpense,
  uploadReceipt,
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

  const [file, setFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Logika upload file (jika ada file baru), atau gunakan receiptUrl jika sudah ada
      let receiptPath: string | null = null;
      if (file) {
        const uploadedPath = await uploadReceipt(file);
        receiptPath = uploadedPath;
        setReceiptUrl(uploadedPath);
      } else if (receiptUrl) {
        receiptPath = receiptUrl;
      }

      // finalExpense adalah data yang siap kirim, bertipe NewExpense (tanpa ID)
      const finalExpense: NewExpense = {
        ...expense,
        // Pastikan receipt_path dikirim dengan null jika tidak ada bukti
        receipt_path: receiptPath,
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

          {/* Baris 4: Bukti Pembayaran */}
          <div className="file-upload-row">
            <label htmlFor="receipt-upload">
              📎 Bukti Pembayaran (Opsional):
            </label>
            <input
              id="receipt-upload"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          {receiptUrl && (
            <div style={{ marginTop: 15, textAlign: "center" }}>
              <p style={{ fontWeight: 600, color: "#4a5568" }}>
                Bukti Terlampir:
              </p>
              <img
                src={receiptUrl}
                alt="Bukti Pembayaran"
                style={{
                  maxWidth: "300px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              />
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
