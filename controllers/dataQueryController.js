const db = require("../model/database");
const ResponseDto = require("../utils/ResponseDto");
const AppError = require("../utils/AppError");

const formatQuery = (queryStr) => {
  queryStr = queryStr.toLowerCase();

  const matchedColumn = {
    "total sales": "SUM(price)",
    "average sales": "AVG(price)",
    "maximum sales": "MAX(price)",
    "minimum sales": "MIN(price)",
    "no of sales": "COUNT(*)",
  };

  let matchedStr = Object.keys(matchedColumn).find((col) =>
    queryStr.includes(col)
  );
  if (!matchedStr) {
    return "Invalid query";
  }

  let colMatch = matchedColumn[matchedStr];

  let dateFilter = "";
  const today = new Date().toISOString().split("T")[0];

  if (queryStr.includes("today")) {
    dateFilter = `WHERE date = '${today}'`;
  } else if (queryStr.includes("last month")) {
    let firstDay = new Date();
    firstDay.setMonth(firstDay.getMonth() - 1, 1);
    let lastDay = new Date();
    lastDay.setDate(0);
    dateFilter = `WHERE date >= '${
      firstDay.toISOString().split("T")[0]
    }' AND date <= '${lastDay.toISOString().split("T")[0]}'`;
  } else {
    const yearMatch = queryStr.match(/\b\d{4}\b/);
    if (yearMatch) {
      dateFilter = `WHERE strftime('%Y', date) = '${yearMatch[0]}'`;
    }
  }

  return `SELECT ${colMatch} FROM sales ${dateFilter};`;
};

exports.query = (req, res, next) => {
  const { query } = req.body;
  const sql = formatQuery(query);
  if (sql === "Invalid query") {
    return res.status(400).json();
  }

  try {
    const rows = db.prepare(sql).all();
    return res.status(200).json(new ResponseDto(rows, "Query successful", 1));
  } catch (err) {
    console.log("Error running query:", err.message);
    return next(new AppError("Error running query", 500));
  }
};

exports.explain = (req, res, next) => {
  const { query } = req.body;
  const sql = formatQuery(query);
  if (sql === "Invalid query") {
    return res
      .status(400)
      .json(new ResponseDto({ query: sql }, "Invalid query", 0));
  }

  res.status(200).json(new ResponseDto({ query: sql }, "Query successful", 1));
};

exports.isValid = (req, res, next) => {
  const { query } = req.body;
  const sql = formatQuery(query);
  if (sql === "Invalid query") {
    return res
      .status(400)
      .json(new ResponseDto({ isValidQuery: false }, "Invalid query", 0));
  }
  res
    .status(200)
    .json(new ResponseDto({ isValidQuery: true }, "Query successful", 1));
};
