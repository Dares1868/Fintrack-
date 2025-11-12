const express = require("express");
const router = express.Router();
const goalsController = require("../controllers/goalsController");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated. Please log in." });
  }
  next();
};

// Apply authentication middleware to all goal routes
router.use(isAuthenticated);

// Get all goals for the logged-in user
router.get("/", goalsController.getGoals);

// Get a single goal by ID
router.get("/:id", goalsController.getGoalById);

// Create a new goal
router.post("/", goalsController.createGoal);

// Update a goal
router.patch("/:id", goalsController.updateGoal);

// Add amount to a goal
router.patch("/:id/add-amount", goalsController.addAmountToGoal);

// Delete a goal
router.delete("/:id", goalsController.deleteGoal);

module.exports = router;
