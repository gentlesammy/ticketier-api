const express = require("express");
const router = express.Router();

//routes for tickets

router.get("/:ticketsId", (req, res) => {
  res.json({ message: "Hello Ticket world", from: "api/v1/ticket/2" });
});

module.exports = router;
