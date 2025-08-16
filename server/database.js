// server/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'users.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Помилка підключення до бази даних:', err.message);
  } else {
    console.log('Підключено до SQLite бази даних.');
  }
});

// Створення таблиць
db.serialize(() => {
  // Таблиця користувачів
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Таблиця міток
  db.run(`CREATE TABLE IF NOT EXISTS markers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    description TEXT NOT NULL,
    user_email TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users (email)
  )`);
});

// Перевірка створення таблиць
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
  if (err) {
    console.error('Помилка перевірки таблиці users:', err);
  } else if (row) {
    console.log('Таблиця users успішно створена');
  }
});

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='markers'", (err, row) => {
  if (err) {
    console.error('Помилка перевірки таблиці markers:', err);
  } else if (row) {
    console.log('Таблиця markers успішно створена');
  }
});

module.exports = db;