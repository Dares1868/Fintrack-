const Goal = require("../models/Goal");

// Get all goals for the logged-in user
exports.getGoals = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const goals = await Goal.findByUserId(userId);
    res.json({ goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

// Get a single goal by ID
exports.getGoalById = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { id } = req.params;
    const goal = await Goal.findById(id, userId);

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json({ goal });
  } catch (error) {
    console.error("Error fetching goal:", error);
    res.status(500).json({ error: "Failed to fetch goal" });
  }
};

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const {
      name,
      description,
      target,
      targetDate,
      icon,
      color,
      categoryName,
      status,
    } = req.body;

    // Validation
    if (!name || !target) {
      return res
        .status(400)
        .json({ error: "Name and target amount are required" });
    }

    if (isNaN(target) || target <= 0) {
      return res
        .status(400)
        .json({ error: "Target amount must be a positive number" });
    }

    const goalData = {
      userId,
      name,
      description,
      target: parseFloat(target),
      targetDate,
      icon,
      color,
      categoryName,
      status: status || "active",
    };

    const newGoal = await Goal.create(goalData);
    res.status(201).json({ goal: newGoal });
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ error: "Failed to create goal" });
  }
};

// Update a goal
exports.updateGoal = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check if goal exists and belongs to user
    const existingGoal = await Goal.findById(id, userId);
    if (!existingGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const updatedGoal = await Goal.update(id, userId, updateData);
    res.json({ goal: updatedGoal });
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ error: "Failed to update goal" });
  }
};

// Add amount to goal's current amount
exports.addAmountToGoal = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be a positive number" });
    }

    // Check if goal exists and belongs to user
    const existingGoal = await Goal.findById(id, userId);
    if (!existingGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const updatedGoal = await Goal.addAmount(id, userId, parseFloat(amount));

    // Auto-achieve if target reached
    if (
      updatedGoal.current >= updatedGoal.target &&
      updatedGoal.status === "active"
    ) {
      await Goal.update(id, userId, { status: "achieved" });
      updatedGoal.status = "achieved";
    }

    res.json({ goal: updatedGoal });
  } catch (error) {
    console.error("Error adding amount to goal:", error);
    res.status(500).json({ error: "Failed to add amount to goal" });
  }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { id } = req.params;

    // Check if goal exists and belongs to user
    const existingGoal = await Goal.findById(id, userId);
    if (!existingGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const deleted = await Goal.delete(id, userId);

    if (!deleted) {
      return res.status(500).json({ error: "Failed to delete goal" });
    }

    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ error: "Failed to delete goal" });
  }
};
