const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactionsController");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated. Please log in." });
  }
  next();
};

// Apply authentication middleware to all transaction routes
router.use(isAuthenticated);

// Get all transactions for the logged-in user
router.get("/", transactionsController.getTransactions);

// Create a new transaction
router.post("/", transactionsController.createTransaction);

// Migrate localStorage transactions to database (one-time operation)
router.post("/migrate", transactionsController.migrateTransactions);

// Get transaction summary by category
router.get("/summary", transactionsController.getTransactionSummary);

module.exports = router;
