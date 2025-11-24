// backend/routes/authRoutes.js
import express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserByEmail, createUser } from "../database.js";

dotenv.config();
const router = express.Router();

// Register endpoint
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password harus diisi" });
  }

  // Cek apakah email sudah terdaftar
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: "Email sudah terdaftar" });
  }

  // Hash password menggunakan bcryptjs
  const hashedPassword = await bcryptjs.hash(password, 10);

  // Buat user baru
  const newUser = createUser({
    email,
    password: hashedPassword,
  });

  return res.status(201).json({
    message: "Pendaftaran berhasil",
    user: {
      id: newUser.id,
      email: newUser.email,
    },
  });
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password harus diisi" });
  }

  // Cari user berdasarkan email
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Email atau password tidak valid" });
  }

  // Verifikasi password
  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Email atau password tidak valid" });
  }

  // Buat JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return res.json({
    message: "Login berhasil",
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  });
});

export default router;
