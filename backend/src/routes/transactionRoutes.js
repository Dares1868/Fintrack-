const express = require("express");
const router = express.Router();
const {
  requireAuth,
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
} = require("../controllers/transactionController");

// Apply authentication middleware to all transaction routes
router.use(requireAuth);

// Transaction CRUD routes
router.post("/", createTransaction); // Create transaction
router.get("/", getTransactions); // Get user's transactions
router.get("/summary", getTransactionSummary); // Get transaction summary
router.get("/:id", getTransaction); // Get specific transaction
router.put("/:id", updateTransaction); // Update transaction
router.delete("/:id", deleteTransaction); // Delete transaction

module.exports = router;
