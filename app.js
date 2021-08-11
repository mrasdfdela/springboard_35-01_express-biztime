/** BizTime express application. */

const express = require("express");
const db = require("./db");
// const { router } = express.Router();
const ExpressError = require("./expressError")

const app = express();
app.use(express.json());

app.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
      `SELECT * FROM companies`
    );
    return res.json(results.rows);
  } catch(err) {
    return next(err);
  } 
});

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;