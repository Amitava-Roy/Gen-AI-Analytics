const db = require("../model/database");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../utils/asyncHandle");
const ResponseDto = require("../utils/ResponseDto");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

// Sign Up
exports.signUp = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Insert user into database
    const stmt = db.prepare(
      `INSERT INTO users (username, password) VALUES (?, ?)`
    );
    const result = stmt.run(username, hashedPassword);

    console.log(`User created with id: ${result.lastInsertRowid}`);

    res
      .status(200)
      .json(
        new ResponseDto(
          { userId: result.lastInsertRowid },
          "User created successfully",
          1
        )
      );
  } catch (err) {
    console.log("Error inserting user:", err.message);
    return next(new AppError("Error inserting user", 500));
  }
});

// Login
exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Get user from the database
    const user = db
      .prepare(`SELECT * FROM users WHERE username = ?`)
      .get(username);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });

      res
        .status(200)
        .json(
          new ResponseDto({ userId: user.id, token }, "Login successful", 1)
        );
    } else {
      return next(new AppError("Invalid credentials", 401));
    }
  } catch (err) {
    console.log("Error getting user:", err.message);
    return next(new AppError("Error getting user", 500));
  }
});

// Protect Middleware
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Not authorized to access this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
    const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(decoded.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError("Not authorized to access this route", 401));
  }
});
