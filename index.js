const keys = require("./src/config/keys");
const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const dbConnection = require("./src/config/dbConnection");

//api security
app.use(helmet());

//limit rate
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
});
app.use("/", apiLimiter);

//cors
app.use(cors());

//database connection string
dbConnection();

//log request
app.use(morgan("tiny"));

// pass request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/* 
#####
                routes
 ##### 
 */
// user routes: authentication, login, register, forget-password
app.use("/api/v1/users", require("./src/routers/userRouter"));
//ticket routes
app.use("/api/v1/tickets", require("./src/routers/ticketRouter"));

const errorHandler = require("./src/utils/errorHandler");
// app.use()
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`connecting on port ${PORT}`);
});
