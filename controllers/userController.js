const db = require("../model/database");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../utils/asyncHandle");
const ResponseDto = require("../utils/ResponseDto");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

//sing up
exports.signUp = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  //hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  //create user in the database
  db.run(
    `INSERT INTO users (username, password) VALUES (?, ?)`,
    [username, hashedPassword],
    function (err) {
      if (err) {
        console.log("Error inserting user:", err.message);
        return next(new AppError("Error inserting user", 500));
      } else {
        console.log(`User created with id: ${this.lastID}`);

        res
          .status(200)
          .json(
            new ResponseDto(
              { userId: this.lastID },
              "User created successfully",
              1
            )
          );
      }
    }
  );
});

//login
exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  //get user from the database
  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async function (err, row) {
      if (err) {
        console.log("Error getting user:", err.message);
        return next(new AppError("Error getting user", 500));
      } else if (!row) {
        return next(new AppError("User not found", 404));
      } else {
        //compare password
        const isMatch = await bcrypt.compare(password, row.password);

        if (isMatch) {
          const token = jwt.sign({ id: row.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
          });
          res
            .status(200)
            .json(
              new ResponseDto({ userId: row.id, token }, "Login successful", 1)
            );
        } else {
          return next(new AppError("Invalid credentials", 401));
        }
      }
    }
  );
});

//protect
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
    db.get(
      `SELECT * FROM users WHERE id = ?`,
      [decoded.id],
      function (err, row) {
        if (err) {
          console.log("Error getting user:", err.message);
          return next(new AppError("Error getting user", 500));
        } else if (!row) {
          return next(new AppError("User not found", 404));
        } else {
          req.user = row;
          next();
        }
      }
    );
  } catch (err) {
    return next(new AppError("Not authorized to access this route", 401));
  }
});
