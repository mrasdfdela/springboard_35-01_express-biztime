const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");

const db = require("../db");

router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(`SELECT * FROM companies`);
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
    if (results.length === 0) { 
      throw ExpressError ("Invalid company code!",)
    }
    return res.status(201).json({ company: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    const { code, name, description } = req.body;
    console.log(code);
    console.log(name);
    console.log(description);
    const results = await db.query(
      `INSERT INTO companies (code, name, description)
      VALUES ($1, $2, $3)
      RETURNING code, name, description`,
      [code, name, description]
      );
    if (results.length === 0) {
      throw ExpressError("Invalid company code!");
    }
      return res.json({ company:results.rows[0] });
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
    if (results.length === 0) {
      throw ExpressError("Invalid company code!");
    }
    return res.json({ companies:results.rows });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;