const express = require("express");
const router = express.Router();

const db = require("../db");
const {
  evalResults,
  create_industry_promises,
  await_industry_promises,
} = require("../helpers");

router.get("/", async function(req,res,next){
  try {
    let industries = await db.query(
      `SELECT code, industry FROM industries`
    );
    let ind_promises = create_industry_promises(industries.rows);
    industries = await await_industry_promises(ind_promises, industries.rows);
    
    if (industries.length === 0) {
      throw new ExpressError("No industries selected!", 404);
    }
    
    return res.status(201).json({ industries: industries})
  } catch(e) {
    next(e);
  }
});

router.post('/new', async (req,res,next) =>{
  try {
    const { code, industry } = req.body;
    const results = await db.query(
      `INSERT INTO industries ( code, industry)
      VALUES ($1, $2)
      RETURNING code, industry`,
      [code, industry]
    );
    evalResults(results, "Invalid industry details!", 400);
    return res.json({ industry: results.rows[0] });
  } catch(err) {
    return next(err);
  }
});

router.post('/company_industry', async (req, res,next) => {
  try {
    const { cd_company, cd_industry } = req.body;
    const results = await db.query(
      `INSERT INTO company_industries ( cd_company, cd_industry)
      VALUES ($1, $2)
      RETURNING cd_company, cd_industry`,
      [cd_company, cd_industry]
    );
    evalResults(results, "Invalid company-industry details!", 400);
    return res.json({ industry: results.rows[0] });
  } catch(err) {
    return next(err);
  }
});
router.delete('/company_industry', async (req, res, next) => {
  try {
    const { cd_company, cd_industry } = req.body;
    const results = await db.query(
      `DELETE FROM company_industries 
      WHERE cd_company=$1 AND cd_industry=$2
      RETURNING cd_company, cd_industry`,
      [cd_company, cd_industry]
    );
    evalResults(results, "Error; company-industry not deleted!", 400);
    return res.json({ industry: results.rows });
  } catch(err) {
    return next(err);
  }
});

module.exports = router;