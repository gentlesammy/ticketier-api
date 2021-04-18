// module.exports = {

if (process.env.NODE_ENV === "production") {
  //we are in production environment
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
