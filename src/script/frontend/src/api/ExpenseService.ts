// src/api/ExpenseService.ts

import axios from "axios";
import type { Expense, NewExpense } from "../types/Expense";

const API_URL = "http://localhost:5000/api/expenses"; // Ganti dengan URL Backend Anda

// Helper untuk menambahkan token otentikasi
const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 1. READ (Membaca semua data dengan filter tanggal opsional)
export const fetchExpenses = async (
  startDate?: string,
  endDate?: string
): Promise<Expense[]> => {
  const params: Record<string, string> = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;

  const response = await axios.get(API_URL, {
    ...getAuthHeaders(),
    params,
  });
  return response.data;
};

// 2. CREATE (Membaca data TIPE BARU: NewExpense)
export const createExpense = async (data: NewExpense) => {
  // <-- PERUBAHAN DI SINI
  const response = await axios.post(API_URL, data, getAuthHeaders());
  return response.data;
};

// 3. UPDATE (Membutuhkan ID, jadi menggunakan tipe Expense LENGKAP)
export const updateExpense = async (id: number, data: NewExpense) => {
  // <-- PERUBAHAN DI SINI (Data yang dikirim tetap tanpa ID di body)
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
  return response.data;
};

// 4. DELETE (Menghapus data)
export const deleteExpense = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};

// 5. UPLOAD FILE - Convert to Base64
export const uploadReceipt = async (
  file: File
): Promise<{ data: string; mimetype: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const base64String = reader.result as string;

        // Kirim ke backend untuk validasi
        const response = await axios.post(
          "http://localhost:5000/api/expenses/upload",
          {
            image: base64String,
            mimetype: file.type,
          },
          getAuthHeaders()
        );

        resolve({
          data: response.data.data,
          mimetype: response.data.mimetype,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Gagal membaca file"));
    };

    reader.readAsDataURL(file);
  });
};
