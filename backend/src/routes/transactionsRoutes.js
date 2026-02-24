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


router.use(isAuthenticated);


router.get("/", transactionsController.getTransactions);


router.post("/", transactionsController.createTransaction);


router.post("/migrate", transactionsController.migrateTransactions);


router.get("/summary", transactionsController.getTransactionSummary);


router.delete("/:id", transactionsController.deleteTransaction);

module.exports = router;
