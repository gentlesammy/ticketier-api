const keys = require("./keys");
const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect(
    keys.dbConnectionString,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    () => {
      console.log("connected to database");
    }
  );
};
