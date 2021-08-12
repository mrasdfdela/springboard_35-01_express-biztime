const ExpressError = require("./expressError");

function evalResults(results, msg, status) {
  if (results.rows.length === 0) {
    throw new ExpressError(msg, status);
  }
}

module.exports = { evalResults };
