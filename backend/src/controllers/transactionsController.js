const Transaction = require("../models/Transaction");

// Get all transactions for the logged-in user
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const transactions = await Transaction.findByUserId(userId);
    res.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { name, category, type, amount, date } = req.body;

    // Validation
    if (!name || !category || !type || amount === undefined || !date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ error: "Type must be 'income' or 'expense'" });
    }

    if (isNaN(amount)) {
      return res.status(400).json({ error: "Amount must be a valid number" });
    }

    const transactionData = {
      userId,
      name: name.trim(),
      category: category.toLowerCase().trim(),
      type,
      amount: parseFloat(amount),
      date,
    };

    const newTransaction = await Transaction.create(transactionData);

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Failed to create transaction" });
  }
};

// Migrate localStorage transactions to database
exports.migrateTransactions = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { transactions } = req.body;

    if (!Array.isArray(transactions)) {
      return res.status(400).json({ error: "Transactions must be an array" });
    }

    // Check if user already has transactions
    const existingTransactions = await Transaction.findByUserId(userId);
    
    if (existingTransactions.length > 0) {
      return res.status(400).json({ 
        error: "User already has transactions in database",
        message: "Migration already completed"
      });
    }

    if (transactions.length === 0) {
      return res.json({ 
        message: "No transactions to migrate",
        transactions: []
      });
    }

    // Validate and prepare transactions
    const validTransactions = transactions
      .filter((tx) => tx.name && tx.category && tx.type && tx.amount !== undefined && tx.date)
      .map((tx) => ({
        name: tx.name.trim(),
        category: tx.category.toLowerCase().trim(),
        type: tx.type,
        amount: parseFloat(tx.amount),
        date: tx.date,
      }));

    if (validTransactions.length === 0) {
      return res.status(400).json({ error: "No valid transactions to migrate" });
    }

    const migratedTransactions = await Transaction.createMany(userId, validTransactions);

    res.status(201).json({
      message: `Successfully migrated ${validTransactions.length} transactions`,
      transactions: migratedTransactions,
    });
  } catch (error) {
    console.error("Error migrating transactions:", error);
    res.status(500).json({ error: "Failed to migrate transactions" });
  }
};

// Get transaction summary by category
exports.getTransactionSummary = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const summary = await Transaction.getSummaryByCategory(userId);
    res.json({ summary });
  } catch (error) {
    console.error("Error fetching transaction summary:", error);
    res.status(500).json({ error: "Failed to fetch transaction summary" });
  }
};
