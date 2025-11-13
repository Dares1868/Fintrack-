const { getPool } = require("../config/database");
const Balance = require("./Balance");

class Transaction {
  // Get all transactions for a user
  static async findByUserId(userId) {
    const db = getPool();
    const [rows] = await db.query(
      `SELECT id, user_id, name, category, type, amount, date, created_at, updated_at 
       FROM transactions 
       WHERE user_id = ? 
       ORDER BY date DESC, created_at DESC`,
      [userId]
    );
    return rows;
  }

  // Create a new transaction
  static async create(transactionData) {
    const db = getPool();
    const { userId, name, category, type, amount, date } = transactionData;

    const [result] = await db.query(
      `INSERT INTO transactions (user_id, name, category, type, amount, date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, name, category, type, amount, date]
    );

    // Update balance after creating transaction
    await Balance.updateBalance(userId, amount, type);

    // Return the created transaction
    const [newTransaction] = await db.query(
      `SELECT id, user_id, name, category, type, amount, date, created_at, updated_at 
       FROM transactions 
       WHERE id = ?`,
      [result.insertId]
    );

    return newTransaction[0];
  }

  // Create multiple transactions (for migration)
  static async createMany(userId, transactions) {
    const db = getPool();
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const values = transactions.map((tx) => [
      userId,
      tx.name,
      tx.category,
      tx.type,
      tx.amount,
      tx.date,
    ]);

    const placeholders = transactions
      .map(() => "(?, ?, ?, ?, ?, ?)")
      .join(", ");

    await db.query(
      `INSERT INTO transactions (user_id, name, category, type, amount, date) 
       VALUES ${placeholders}`,
      values.flat()
    );

    // Return all user transactions
    return await this.findByUserId(userId);
  }

  // Get transaction by ID (ensuring it belongs to the user)
  static async findById(transactionId, userId) {
    const db = getPool();
    const [rows] = await db.query(
      `SELECT id, user_id, name, category, type, amount, date, created_at, updated_at 
       FROM transactions 
       WHERE id = ? AND user_id = ?`,
      [transactionId, userId]
    );
    return rows[0];
  }

  // Get transactions summary by category for a user
  static async getSummaryByCategory(userId) {
    const db = getPool();
    const [rows] = await db.query(
      `SELECT category, 
              SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END) as total_expenses,
              SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
              COUNT(*) as transaction_count
       FROM transactions 
       WHERE user_id = ? 
       GROUP BY category`,
      [userId]
    );
    return rows;
  }
}

module.exports = Transaction;
