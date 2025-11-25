// backend/routes/reportRoutes.js
import express from "express";
import ExcelJS from "exceljs";
import { authenticateToken } from "../middleware/authMiddleware.js";
import Expense from "../models/Expense.js";

const router = express.Router();

// GET /api/reports/export - Export laporan ke Excel
router.get("/export", authenticateToken, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const userId = req.user.id;

    // Build query filter
    const filter = { userId };

    if (start_date || end_date) {
      filter.date = {};
      if (start_date) {
        filter.date.$gte = new Date(start_date);
      }
      if (end_date) {
        filter.date.$lte = new Date(end_date);
      }
    }

    // Fetch expenses dari database
    const expenses = await Expense.find(filter).sort({ date: -1 });

    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Keuangan");

    // Set column headers
    worksheet.columns = [
      { header: "Tanggal", key: "date", width: 15 },
      { header: "Deskripsi", key: "description", width: 30 },
      { header: "Kategori", key: "category", width: 15 },
      { header: "Tipe", key: "type", width: 15 },
      { header: "Jumlah (Rp)", key: "amount", width: 18 },
    ];

    // Style header row
    worksheet.getRow(1).font = {
      bold: true,
      size: 12,
      color: { argb: "FFFFFFFF" },
    };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF667EEA" },
    };
    worksheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getRow(1).height = 25;

    // Add data rows
    expenses.forEach((expense) => {
      const row = worksheet.addRow({
        date: new Date(expense.date).toLocaleDateString("id-ID"),
        description: expense.description,
        category: expense.category,
        type: expense.type,
        amount: expense.amount,
      });

      // Style berdasarkan tipe
      if (expense.type === "Pemasukan") {
        row.getCell("type").font = { color: { argb: "FF38A169" }, bold: true };
        row.getCell("amount").font = {
          color: { argb: "FF38A169" },
          bold: true,
        };
      } else {
        row.getCell("type").font = { color: { argb: "FFE53E3E" }, bold: true };
        row.getCell("amount").font = {
          color: { argb: "FFE53E3E" },
          bold: true,
        };
      }

      // Format amount dengan pemisah ribuan
      row.getCell("amount").numFmt = "#,##0";
    });

    // Add summary section
    const totalIncome = expenses
      .filter((e) => e.type === "Pemasukan")
      .reduce((sum, e) => sum + e.amount, 0);

    const totalExpense = expenses
      .filter((e) => e.type === "Pengeluaran")
      .reduce((sum, e) => sum + e.amount, 0);

    const balance = totalIncome - totalExpense;

    // Add empty row
    worksheet.addRow([]);

    // Add summary rows
    const summaryStartRow = worksheet.rowCount + 1;

    worksheet.addRow(["", "", "", "Total Pemasukan:", totalIncome]);
    worksheet.addRow(["", "", "", "Total Pengeluaran:", totalExpense]);
    worksheet.addRow(["", "", "", "Saldo:", balance]);

    // Style summary section
    for (let i = summaryStartRow; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      row.getCell(4).font = { bold: true };
      row.getCell(5).font = { bold: true };
      row.getCell(5).numFmt = "#,##0";

      if (i === summaryStartRow) {
        row.getCell(5).font = {
          ...row.getCell(5).font,
          color: { argb: "FF38A169" },
        };
      } else if (i === summaryStartRow + 1) {
        row.getCell(5).font = {
          ...row.getCell(5).font,
          color: { argb: "FFE53E3E" },
        };
      } else if (i === summaryStartRow + 2) {
        const color = balance >= 0 ? "FF38A169" : "FFE53E3E";
        row.getCell(5).font = {
          ...row.getCell(5).font,
          color: { argb: color },
        };
      }
    }

    // Add borders to all cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Set response headers
    const fileName = `Laporan_Keuangan_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export report error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat membuat laporan",
      error: error.message,
    });
  }
});

// GET /api/reports/summary - Get summary data
router.get("/summary", authenticateToken, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const userId = req.user.id;

    // Build query filter
    const filter = { userId };

    if (start_date || end_date) {
      filter.date = {};
      if (start_date) {
        filter.date.$gte = new Date(start_date);
      }
      if (end_date) {
        filter.date.$lte = new Date(end_date);
      }
    }

    const expenses = await Expense.find(filter);

    const totalIncome = expenses
      .filter((e) => e.type === "Pemasukan")
      .reduce((sum, e) => sum + e.amount, 0);

    const totalExpense = expenses
      .filter((e) => e.type === "Pengeluaran")
      .reduce((sum, e) => sum + e.amount, 0);

    const balance = totalIncome - totalExpense;

    // Category breakdown
    const categoryBreakdown = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {});

    res.json({
      totalIncome,
      totalExpense,
      balance,
      transactionCount: expenses.length,
      categoryBreakdown,
      dateRange: {
        start: start_date || null,
        end: end_date || null,
      },
    });
  } catch (error) {
    console.error("Get summary error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil ringkasan",
      error: error.message,
    });
  }
});

export default router;
