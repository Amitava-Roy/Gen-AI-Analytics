const Database = require("better-sqlite3");
const db = new Database("database.db");

// Create users table
db.prepare(
  `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
  )`
).run();

console.log("Users table created.");

// Create sales table
db.prepare(
  `CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      price INTEGER,
      date TEXT
  )`
).run();

console.log("Sales table created.");

// Insert sales data
const salesData = [
  { price: 100, date: "2025-03-25" },
  { price: 150, date: "2025-03-26" },
  { price: 200, date: "2025-03-27" },
  { price: 250, date: "2025-03-28" },
  { price: 300, date: "2025-03-29" },
];

const insertStmt = db.prepare(`INSERT INTO sales (price, date) VALUES (?, ?)`);

salesData.forEach(({ price, date }) => {
  insertStmt.run(price, date);
});

console.log("Sales records inserted.");

module.exports = db;
