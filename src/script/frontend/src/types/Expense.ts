// frontend/src/types/Expense.ts

// Perluas tipe agar bisa membedakan Pemasukan dan Pengeluaran
export type TransactionType = "Pemasukan" | "Pengeluaran";

// Tipe data LENGKAP
export interface Expense {
  id: number;
  description: string; // Keterangan
  amount: number; // Jumlah
  date: string; // Tanggal
  category: string; // Kategori (bisa disederhanakan dari Food, Transport, dll)
  type: TransactionType; // <--- FIELD BARU: Pemasukan atau Pengeluaran
  receipt_data?: string | null;
  receipt_mimetype?: string | null;
  isRecurring?: boolean; // Transaksi berulang
  recurringPeriod?: "Monthly" | "Weekly" | "Yearly"; // Periode pengulangan
}

// Tipe data untuk CREATE/POST (tanpa ID)
export type NewExpense = Omit<Expense, "id">;
