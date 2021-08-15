const db = require("./db");
const ExpressError = require("./expressError");

function evalResults(results, msg, status) {
  if (results.rows.length === 0) {
    throw new ExpressError(msg, status);
  }
}

async function invoiceDt(id, paid){
  const current = await db.query(
    `SELECT comp_code, amt, paid, add_date, paid_date 
     FROM invoices
     WHERE id=$1`,
    [id]
  );

  if (current.rows[0].paid_date === null && paid === true){
    const d = new Date(Date.now());
    return d.toISOString();
  } else if (paid === false) {
    return null
  } else {
    return current.paid_date
  }
}

function create_industry_promises(arr) {
  let promises = []
  arr.forEach( (ind) => {
    promises.push(
      db.query(
        `SELECT c.name FROM companies as c
        JOIN company_industries AS ci ON ci.cd_company = c.code
        WHERE ci.cd_industry = $1`,
        [ ind.code ]
      )
    );
  });
  return promises;
}

async function await_industry_promises(promises, industries) {
  await Promise.all(promises)
    .then((res) => {
      res.forEach((response, idx) =>{
        industries[idx].companies = response.rows
      });
    });
  return industries;
}

module.exports = {
  evalResults,
  invoiceDt,
  create_industry_promises,
  await_industry_promises,
};
