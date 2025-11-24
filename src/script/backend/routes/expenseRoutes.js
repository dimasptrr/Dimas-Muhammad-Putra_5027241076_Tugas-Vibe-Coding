// backend/routes/expenseRoutes.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import Expense from "../models/Expense.js";

const router = express.Router();

// GET all expenses untuk user yang login
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    // Build query filter
    const filter = { userId: req.user.id };

    // Filter berdasarkan tanggal jika parameter tersedia
    if (start_date || end_date) {
      filter.date = {};
      if (start_date) {
        filter.date.$gte = new Date(start_date);
      }
      if (end_date) {
        filter.date.$lte = new Date(end_date);
      }
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil data",
      error: error.message,
    });
  }
});

// GET single expense
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Pengeluaran tidak ditemukan" });
    }

    res.json(expense);
  } catch (error) {
    console.error("Get expense error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil data",
      error: error.message,
    });
  }
});

// CREATE new expense
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      description,
      amount,
      category,
      date,
      receipt_path,
      type,
      isRecurring,
      recurringPeriod,
    } = req.body;

    // Validasi input
    if (!description || amount === undefined || !category || !type) {
      return res
        .status(400)
        .json({
          message: "description, amount, category, dan type harus diisi",
        });
    }

    // Validasi tipe transaksi
    if (!["Pemasukan", "Pengeluaran"].includes(type)) {
      return res
        .status(400)
        .json({ message: "type harus Pemasukan atau Pengeluaran" });
    }

    const newExpense = await Expense.create({
      userId: req.user.id,
      description,
      amount: parseFloat(amount),
      category,
      type,
      date: date || new Date(),
      receipt_path: receipt_path || null,
      isRecurring: isRecurring || false,
      recurringPeriod: recurringPeriod || null,
    });

    res.status(201).json({
      message: "Pengeluaran berhasil ditambahkan",
      expense: newExpense,
    });
  } catch (error) {
    console.error("Create expense error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat menambahkan data",
      error: error.message,
    });
  }
});

// UPDATE expense
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const {
      description,
      amount,
      category,
      date,
      receipt_path,
      type,
      isRecurring,
      recurringPeriod,
    } = req.body;

    // Validasi expense exists dan milik user
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Pengeluaran tidak ditemukan" });
    }

    // Update fields
    if (description !== undefined) expense.description = description;
    if (amount !== undefined) expense.amount = parseFloat(amount);
    if (category !== undefined) expense.category = category;
    if (type !== undefined) expense.type = type;
    if (date !== undefined) expense.date = new Date(date);
    if (receipt_path !== undefined) expense.receipt_path = receipt_path;
    if (isRecurring !== undefined) expense.isRecurring = isRecurring;
    if (recurringPeriod !== undefined)
      expense.recurringPeriod = recurringPeriod;

    const updatedExpense = await expense.save();

    res.json({
      message: "Pengeluaran berhasil diperbarui",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat memperbarui data",
      error: error.message,
    });
  }
});

// DELETE expense
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    // Validasi expense exists dan milik user
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Pengeluaran tidak ditemukan" });
    }

    res.json({ message: "Pengeluaran berhasil dihapus" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat menghapus data",
      error: error.message,
    });
  }
});

export default router;
