const Transaction = require("../models/Transaction");

// Get all expenses for the logged-in user with optional filtering
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { month, year, category } = req.query;

    // Get all transactions for the user
    const allTransactions = await Transaction.findByUserId(userId);

    // Filter for expenses only (negative amounts or type='expense')
    let expenses = allTransactions.filter(
      (t) => t.type === "expense" || t.amount < 0
    );

    // Apply filters if provided
    if (year) {
      expenses = expenses.filter((t) => {
        const transactionYear = new Date(t.date).getFullYear();
        return transactionYear === parseInt(year);
      });
    }

    if (month !== undefined && month !== null) {
      expenses = expenses.filter((t) => {
        const transactionMonth = new Date(t.date).getMonth();
        return transactionMonth === parseInt(month);
      });
    }

    if (category) {
      expenses = expenses.filter(
        (t) => t.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.json({ expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

// Get expense statistics grouped by category
exports.getExpenseStats = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { month, year } = req.query;

    // Get all transactions for the user
    const allTransactions = await Transaction.findByUserId(userId);

    // Filter for expenses only
    let expenses = allTransactions.filter(
      (t) => t.type === "expense" || t.amount < 0
    );

    // Apply date filters if provided
    if (year) {
      expenses = expenses.filter((t) => {
        const transactionYear = new Date(t.date).getFullYear();
        return transactionYear === parseInt(year);
      });
    }

    if (month !== undefined && month !== null) {
      expenses = expenses.filter((t) => {
        const transactionMonth = new Date(t.date).getMonth();
        return transactionMonth === parseInt(month);
      });
    }

    // Group by category
    const categoryStats = {};
    let totalExpenses = 0;

    expenses.forEach((expense) => {
      const category = expense.category || "other";
      const amount = Math.abs(expense.amount);

      if (!categoryStats[category]) {
        categoryStats[category] = {
          category,
          sum: 0,
          count: 0,
          transactions: [],
        };
      }

      categoryStats[category].sum += amount;
      categoryStats[category].count += 1;
      categoryStats[category].transactions.push({
        id: expense.id,
        name: expense.name,
        amount: amount,
        date: expense.date,
      });

      totalExpenses += amount;
    });

    // Convert to array and sort by sum (descending)
    const stats = Object.values(categoryStats).sort((a, b) => b.sum - a.sum);

    res.json({
      stats,
      total: totalExpenses,
      period: {
        month: month ? parseInt(month) : null,
        year: year ? parseInt(year) : null,
      },
    });
  } catch (error) {
    console.error("Error fetching expense stats:", error);
    res.status(500).json({ error: "Failed to fetch expense statistics" });
  }
};

// Get available months that have expenses
exports.getAvailableMonths = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Get all transactions for the user
    const allTransactions = await Transaction.findByUserId(userId);

    // Filter for expenses only
    const expenses = allTransactions.filter(
      (t) => t.type === "expense" || t.amount < 0
    );

    // Extract unique year-month combinations
    const monthsSet = new Set();
    const monthsList = [];

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${month}`;

      if (!monthsSet.has(key)) {
        monthsSet.add(key);
        monthsList.push({
          year,
          month,
          sortKey: new Date(year, month, 1).getTime(),
        });
      }
    });

    // Sort by date (most recent first)
    monthsList.sort((a, b) => b.sortKey - a.sortKey);

    res.json({ months: monthsList });
  } catch (error) {
    console.error("Error fetching available months:", error);
    res.status(500).json({ error: "Failed to fetch available months" });
  }
};
