// backend/models/Expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index untuk query performance
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Food", "Transport", "Housing", "Entertainment", "Other"],
      default: "Other",
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["Pemasukan", "Pengeluaran"],
      default: "Pengeluaran",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    receipt_data: {
      type: String, // Base64 encoded image
      default: null,
    },
    receipt_mimetype: {
      type: String, // e.g., 'image/jpeg', 'image/png'
      default: null,
    },
    // Fitur Transaksi Berulang
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPeriod: {
      type: String,
      enum: ["Weekly", "Monthly", "Yearly", null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk filter tanggal yang lebih cepat
expenseSchema.index({ date: -1 });
expenseSchema.index({ userId: 1, date: -1 });

// Virtual untuk format Rupiah (optional)
expenseSchema.virtual("formattedAmount").get(function () {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(this.amount);
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
