const express = require("express");
const router = express.Router();

const db = require("../db");

const { evalResults } = require("../helpers");


router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
      `SELECT * FROM companies`
    );
    evalResults(results, "No companies selected!", 204);
    return res.json({ companies:results.rows });
  } catch (err) {
    return next(err);
  }
});

router.get("/:code", async function (req, res, next) {
  try {
    const code = req.params.code;
    console.log(code);
    const results = await db.query(
      `SELECT code, name, description
       FROM companies 
       WHERE code=$1`, [code]
      );
      evalResults(results, "Invalid company id!", 204);
    return res.json({ company: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    const { code, name, description } = req.body;
    const results = await db.query(
      `INSERT INTO companies (code, name, description)
      VALUES ($1, $2, $3)
      RETURNING code, name, description`,
      [code, name, description]
    );
    evalResults(results, "Invalid company details!", 400);
    return res.json({ company: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.put("/:code", async function (req, res, next) {
  try {
    const {name, description } = req.body;
    const code = req.params.code;
    const results = await db.query(
      `UPDATE companies SET name=$1, description=$2
      WHERE code=$3
      RETURNING code,name,description`,
      [name, description, code]
    );
    evalResults(results, "Warning: Company details not updated!", 400);
    return res.status(201).json({ company: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:code", async function (req, res, next) {
  try {
    const code = req.params.code;
    const results = await db.query(
      `DELETE FROM companies
      WHERE code=$1`,
      [code]);
    return res.json({ companies:results.rows });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;