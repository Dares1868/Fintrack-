const Balance = require("../models/Balance");

// Get balance for the logged-in user
exports.getBalance = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Get or create balance for user
    const balance = await Balance.getOrCreate(userId);

    res.json({ 
      balance: {
        currentAmount: parseFloat(balance.current_amount),
        updatedAt: balance.updated_at
      }
    });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
};
