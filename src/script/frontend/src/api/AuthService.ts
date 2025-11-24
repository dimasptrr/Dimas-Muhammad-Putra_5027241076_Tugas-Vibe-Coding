// src/api/AuthService.ts

import axios from 'axios';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/Auth.ts'; // Kita buatkan tipe data ini sebentar

const API_URL = 'http://localhost:5000/api/auth'; // Ganti dengan endpoint Auth Backend Anda

// --- Fungsi Login ---
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    const credentials: LoginCredentials = { email, password };
    const response = await axios.post(`${API_URL}/login`, credentials);
    // Asumsikan backend merespons dengan { token: string }
    return response.data; 
};

// --- Fungsi Register ---
export const registerUser = async (email: string, password: string): Promise<void> => {
    const credentials: RegisterCredentials = { email, password };
    // Password akan di-hash menggunakan bcrypt di sisi backend
    await axios.post(`${API_URL}/register`, credentials);
};

// Fungsi Logout (Opsional: menghapus token dari local storage)
export const logoutUser = () => {
    localStorage.removeItem('jwt_token');
};