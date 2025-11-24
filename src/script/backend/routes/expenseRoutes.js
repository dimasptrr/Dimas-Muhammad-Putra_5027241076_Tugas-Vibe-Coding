// backend/routes/expenseRoutes.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  findExpenseById,
} from "../database.js";

const router = express.Router();

// GET all expenses untuk user yang login
router.get("/", authenticateToken, (req, res) => {
  const { start_date, end_date } = req.query;
  let expenses = getAllExpenses(req.user.id);

  // Filter berdasarkan tanggal jika parameter tersedia
  if (start_date) {
    expenses = expenses.filter((e) => e.date >= start_date);
  }
  if (end_date) {
    expenses = expenses.filter((e) => e.date <= end_date);
  }

  res.json(expenses);
});

// GET single expense
router.get("/:id", authenticateToken, (req, res) => {
  const expense = findExpenseById(parseInt(req.params.id), req.user.id);
  if (!expense) {
    return res.status(404).json({ message: "Pengeluaran tidak ditemukan" });
  }
  res.json(expense);
});

// CREATE new expense
router.post("/", authenticateToken, (req, res) => {
  const { description, amount, category, date, receipt_path, type } = req.body;

  // Validasi input
  if (!description || amount === undefined || !category || !type) {
    return res
      .status(400)
      .json({ message: "description, amount, category, dan type harus diisi" });
  }

  // Validasi tipe transaksi
  if (!["Pemasukan", "Pengeluaran"].includes(type)) {
    return res
      .status(400)
      .json({ message: "type harus Pemasukan atau Pengeluaran" });
  }

  const newExpense = createExpense({
    userId: req.user.id,
    description,
    amount: parseFloat(amount),
    category,
    type,
    date: date || new Date().toISOString().split("T")[0],
    receipt_path: receipt_path || null,
  });

  res.status(201).json({
    message: "Pengeluaran berhasil ditambahkan",
    expense: newExpense,
  });
});

// UPDATE expense
router.put("/:id", authenticateToken, (req, res) => {
  const { description, amount, category, date, receipt_path, type } = req.body;
  const expenseId = parseInt(req.params.id);

  // Validasi expense exists dan milik user
  const expense = findExpenseById(expenseId, req.user.id);
  if (!expense) {
    return res.status(404).json({ message: "Pengeluaran tidak ditemukan" });
  }

  const updatedExpense = updateExpense(expenseId, req.user.id, {
    description: description || expense.description,
    amount: amount ? parseFloat(amount) : expense.amount,
    category: category || expense.category,
    type: type || expense.type,
    date: date || expense.date,
    receipt_path:
      receipt_path !== undefined ? receipt_path : expense.receipt_path,
  });

  res.json({
    message: "Pengeluaran berhasil diperbarui",
    expense: updatedExpense,
  });
});

// DELETE expense
router.delete("/:id", authenticateToken, (req, res) => {
  const expenseId = parseInt(req.params.id);

  // Validasi expense exists dan milik user
  const expense = findExpenseById(expenseId, req.user.id);
  if (!expense) {
    return res.status(404).json({ message: "Pengeluaran tidak ditemukan" });
  }

  const deleted = deleteExpense(expenseId, req.user.id);
  if (deleted) {
    res.json({ message: "Pengeluaran berhasil dihapus" });
  } else {
    res.status(500).json({ message: "Gagal menghapus pengeluaran" });
  }
});

export default router;
