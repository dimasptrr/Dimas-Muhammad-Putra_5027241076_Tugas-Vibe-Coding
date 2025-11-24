// src/types/Auth.ts

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  // Anda bisa menambahkan name, dll.
}

export interface AuthResponse {
  token: string;
  // Anda bisa menambahkan user data, dll.
}