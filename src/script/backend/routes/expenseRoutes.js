// backend/routes/expenseRoutes.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import Expense from "../models/Expense.js";

const router = express.Router();

// POST endpoint untuk upload bukti pembayaran (base64)
router.post("/upload", authenticateToken, async (req, res) => {
  try {
    const { image, mimetype } = req.body;

    if (!image || !mimetype) {
      return res.status(400).json({
        message: "Data gambar tidak lengkap",
      });
    }

    // Validasi mimetype
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(mimetype)) {
      return res.status(400).json({
        message: "Hanya file gambar yang diperbolehkan (jpeg, jpg, png, gif)",
      });
    }

    // Validasi ukuran base64 (approx 5MB = 6.7MB base64)
    const sizeInBytes = (image.length * 3) / 4;
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (sizeInBytes > maxSize) {
      return res.status(400).json({
        message: "File terlalu besar. Maksimal 5MB",
      });
    }

    res.json({
      message: "File berhasil diproses",
      data: image,
      mimetype: mimetype,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Gagal memproses file",
      error: error.message,
    });
  }
});

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
      return res.status(400).json({
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
      receipt_data: req.body.receipt_data || null,
      receipt_mimetype: req.body.receipt_mimetype || null,
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
      receipt_data,
      receipt_mimetype,
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
    if (receipt_data !== undefined) expense.receipt_data = receipt_data;
    if (receipt_mimetype !== undefined)
      expense.receipt_mimetype = receipt_mimetype;
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
