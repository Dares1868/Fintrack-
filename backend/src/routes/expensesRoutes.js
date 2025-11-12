const express = require("express");
const router = express.Router();
const expensesController = require("../controllers/expensesController");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated. Please log in." });
  }
  next();
};

// Apply authentication middleware to all expense routes
router.use(isAuthenticated);

// Get all expenses with optional filtering (month, year, category)
// Query params: ?month=0-11&year=2024&category=food
router.get("/", expensesController.getExpenses);

// Get expense statistics grouped by category
// Query params: ?month=0-11&year=2024
router.get("/stats", expensesController.getExpenseStats);

// Get available months that have expenses
router.get("/available-months", expensesController.getAvailableMonths);

module.exports = router;
