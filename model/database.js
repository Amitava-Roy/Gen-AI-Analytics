const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
    return;
  }
  console.log("Database connection established.");

  // Create users table
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`,
    (err) => {
      if (err) console.log("Error creating users table:", err.message);
      else console.log("Users table created.");
    }
  );

  // Create sales table and insert sales data after it's created
  db.run(
    `CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        price INTEGER,
        date TEXT
    )`,
    (err) => {
      if (err) console.log("Error creating sales table:", err.message);
      else {
        console.log("Sales table created.");

        // Insert 5 sales records
        const salesStmt = db.prepare(
          `INSERT INTO sales (price, date) VALUES (?, ?)`
        );
        const salesData = [
          { price: 100, date: "2025-03-25" },
          { price: 150, date: "2025-03-26" },
          { price: 200, date: "2025-03-27" },
          { price: 250, date: "2025-03-28" },
          { price: 300, date: "2025-03-29" },
        ];

        salesData.forEach(({ price, date }) => {
          salesStmt.run(price, date, (err) => {
            if (err)
              console.log(
                `Error inserting sale (${price}, ${date}):`,
                err.message
              );
          });
        });

        salesStmt.finalize(() => console.log("Sales records inserted."));
      }
    }
  );
});

module.exports = db;
