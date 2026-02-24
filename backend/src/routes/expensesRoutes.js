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


router.get("/", expensesController.getExpenses);


router.get("/stats", expensesController.getExpenseStats);


router.get("/available-months", expensesController.getAvailableMonths);

module.exports = router;
