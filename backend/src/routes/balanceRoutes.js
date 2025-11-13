const express = require("express");
const router = express.Router();
const balanceController = require("../controllers/balanceController");

// GET /api/balance - Get current balance
router.get("/", balanceController.getBalance);

module.exports = router;
