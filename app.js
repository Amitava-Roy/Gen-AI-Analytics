const express = require("express");
const userRouter = require("./routes/userRoute");
const queryRouter = require("./routes/queryRoutes");
const e = require("express");

const app = express();

app.use(express.json());

app.use("/", queryRouter);
app.use("/users", userRouter);

app.get("/test", (req, res) => {
  res.send("Hello World");
});

app.all("*", (req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl} on this server!`));
});

//global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  console.error(err.stack);

  res.status(err.statusCode).json({
    status: "error",
    statusCode: err.statusCode,
    message: err.message,
  });
});

module.exports = app;
