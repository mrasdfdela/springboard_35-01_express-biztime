/** Server startup for BizTime. */


const app = require("./app");
const compRoutes = require("./routes/companies");

app.listen(3000, function () {
  console.log("Listening on 3000");
});