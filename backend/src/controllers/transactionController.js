const Transaction = require("../models/Transaction");

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      error: "Authentication required",
      details: "You must be logged in to access this resource",
    });
  }
  next();
};

const createTransaction = async (req, res) => {
  try {
    const { category_id, type, amount, description, date } = req.body;
    const userId = req.session.userId;

    // Validation
    if (!type || !amount || !date) {
      return res.status(400).json({
        error: "Required fields missing",
        details: "Type, amount, and date are required",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        error: "Invalid transaction type",
        details: 'Type must be either "income" or "expense"',
      });
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        error: "Invalid amount",
        details: "Amount must be a positive number",
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      user_id: userId,
      category_id: category_id || null,
      type,
      amount: parseFloat(amount),
      description,
      date,
    });

    console.log("Transaction created successfully:", {
      id: transaction.id,
      user_id: userId,
      type,
      amount,
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: transaction.toJSON(),
    });
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({
      error: "Failed to create transaction",
      details: "An internal server error occurred",
    });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.session.userId;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const transactions = await Transaction.findByUserId(userId, limit, offset);

    res.json({
      transactions: transactions.map((t) => t.toJSON()),
      total: transactions.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      error: "Failed to get transactions",
      details: "An internal server error occurred",
    });
  }
};

const getTransaction = async (req, res) => {
  try {
    const userId = req.session.userId;
    const transactionId = parseInt(req.params.id);

    if (isNaN(transactionId)) {
      return res.status(400).json({
        error: "Invalid transaction ID",
      });
    }

    const transaction = await Transaction.findById(transactionId, userId);

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found",
        details:
          "Transaction does not exist or you do not have permission to access it",
      });
    }

    res.json({
      transaction: transaction.toJSON(),
    });
  } catch (error) {
    console.error("Get transaction error:", error);
    res.status(500).json({
      error: "Failed to get transaction",
      details: "An internal server error occurred",
    });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const userId = req.session.userId;
    const transactionId = parseInt(req.params.id);
    const { category_id, type, amount, description, date } = req.body;

    if (isNaN(transactionId)) {
      return res.status(400).json({
        error: "Invalid transaction ID",
      });
    }

    // Validation
    if (type && !["income", "expense"].includes(type)) {
      return res.status(400).json({
        error: "Invalid transaction type",
        details: 'Type must be either "income" or "expense"',
      });
    }

    if (
      amount !== undefined &&
      (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)
    ) {
      return res.status(400).json({
        error: "Invalid amount",
        details: "Amount must be a positive number",
      });
    }

    const updateData = {};
    if (category_id !== undefined) updateData.category_id = category_id;
    if (type !== undefined) updateData.type = type;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = date;

    const transaction = await Transaction.update(
      transactionId,
      userId,
      updateData
    );

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found",
        details:
          "Transaction does not exist or you do not have permission to update it",
      });
    }

    console.log("Transaction updated successfully:", {
      id: transaction.id,
      user_id: userId,
    });

    res.json({
      message: "Transaction updated successfully",
      transaction: transaction.toJSON(),
    });
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({
      error: "Failed to update transaction",
      details: "An internal server error occurred",
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const userId = req.session.userId;
    const transactionId = parseInt(req.params.id);

    if (isNaN(transactionId)) {
      return res.status(400).json({
        error: "Invalid transaction ID",
      });
    }

    const deleted = await Transaction.delete(transactionId, userId);

    if (!deleted) {
      return res.status(404).json({
        error: "Transaction not found",
        details:
          "Transaction does not exist or you do not have permission to delete it",
      });
    }

    console.log("Transaction deleted successfully:", {
      id: transactionId,
      user_id: userId,
    });

    res.json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({
      error: "Failed to delete transaction",
      details: "An internal server error occurred",
    });
  }
};

const getTransactionSummary = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { start_date, end_date } = req.query;

    const summary = await Transaction.getUserTransactionSummary(
      userId,
      start_date || null,
      end_date || null
    );

    res.json({
      summary,
      period: {
        start_date: start_date || null,
        end_date: end_date || null,
      },
    });
  } catch (error) {
    console.error("Get transaction summary error:", error);
    res.status(500).json({
      error: "Failed to get transaction summary",
      details: "An internal server error occurred",
    });
  }
};

module.exports = {
  requireAuth,
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
};
