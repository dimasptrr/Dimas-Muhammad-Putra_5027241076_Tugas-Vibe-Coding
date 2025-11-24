// backend/database.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "data.json");

const defaultData = {
  users: [],
  expenses: [],
};

// Initialize database if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
}

export const readDatabase = () => {
  try {
    const data = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return defaultData;
  }
};

export const writeDatabase = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing database:", error);
  }
};

export const findUserByEmail = (email) => {
  const db = readDatabase();
  return db.users.find((u) => u.email === email);
};

export const createUser = (user) => {
  const db = readDatabase();
  const newUser = {
    ...user,
    id: db.users.length + 1,
  };
  db.users.push(newUser);
  writeDatabase(db);
  return newUser;
};

export const findExpenseById = (id, userId) => {
  const db = readDatabase();
  return db.expenses.find((e) => e.id === id && e.userId === userId);
};

export const getAllExpenses = (userId) => {
  const db = readDatabase();
  return db.expenses.filter((e) => e.userId === userId);
};

export const createExpense = (expense) => {
  const db = readDatabase();
  const newExpense = {
    ...expense,
    id: db.expenses.length + 1,
    date: new Date().toISOString(),
  };
  db.expenses.push(newExpense);
  writeDatabase(db);
  return newExpense;
};

export const updateExpense = (id, userId, updatedData) => {
  const db = readDatabase();
  const index = db.expenses.findIndex(
    (e) => e.id === id && e.userId === userId
  );
  if (index !== -1) {
    db.expenses[index] = { ...db.expenses[index], ...updatedData };
    writeDatabase(db);
    return db.expenses[index];
  }
  return null;
};

export const deleteExpense = (id, userId) => {
  const db = readDatabase();
  const index = db.expenses.findIndex(
    (e) => e.id === id && e.userId === userId
  );
  if (index !== -1) {
    db.expenses.splice(index, 1);
    writeDatabase(db);
    return true;
  }
  return false;
};
