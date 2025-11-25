// src/api/ReportService.ts

import axios from "axios";

const API_URL = "http://localhost:5000/api/reports";

// Helper untuk menambahkan token otentikasi
const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get summary data
export const getReportSummary = async (
  startDate?: string,
  endDate?: string
) => {
  const params: Record<string, string> = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;

  const response = await axios.get(`${API_URL}/summary`, {
    ...getAuthHeaders(),
    params,
  });
  return response.data;
};

// Download report as Excel
export const downloadReport = async (startDate?: string, endDate?: string) => {
  const params: Record<string, string> = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;

  const response = await axios.get(`${API_URL}/export`, {
    ...getAuthHeaders(),
    params,
    responseType: "blob", // Important untuk file download
  });

  // Create blob link to download
  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  // Generate filename
  const fileName = `Laporan_Keuangan_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;
  link.setAttribute("download", fileName);

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};
