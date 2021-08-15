const express = require("express");
const router = express.Router();

const db = require("../db");

const { evalResults, invoiceDt } = require("../helpers");

router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
      `SELECT * FROM invoices`
    );
    evalResults(results, "No invoices selected!",204);
    return res.json({ companies: results.rows });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const results = await db.query(
      `SELECT id, comp_code, amt, paid, add_date, paid_date
       FROM invoices 
       WHERE id=$1`,
      [id]
    );
    evalResults(results,"Invalid invoice id!",204);
    return res.json({ company: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    const { comp_code, amt, paid, add_date, paid_date } = req.body;
    const results = await db.query(
      `INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING comp_code, amt, paid, add_date, paid_date;`,
      [comp_code, amt, paid, add_date, paid_date]
    );
    evalResults(results, "Invalid invoice details!",400);

    return res.json({ invoice: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    const { amt, paid } = req.body;
    const id = req.params.id;
    const paid_date = await invoiceDt(id,paid);

    const results = await db.query(
      `UPDATE invoices 
      SET amt=$2, paid=$3, paid_date=$4
      WHERE id=$1
      RETURNING comp_code, amt, paid, add_date, paid_date`,
      [id, amt, paid, paid_date]
    );
    evalResults(results, "Warning: Invoice details not updated!",404);
    return res.status(201).json({ invoice: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const results = await db.query(
      `DELETE FROM invoices
      WHERE id=$1`,
      [id]
    );
    return res.json({ companies: results.rows });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;