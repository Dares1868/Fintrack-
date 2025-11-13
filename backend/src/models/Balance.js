const { getPool } = require("../config/database");

class Balance {
  // Get balance for a user
  static async findByUserId(userId) {
    const db = getPool();
    const [rows] = await db.query(
      `SELECT id, user_id, current_amount, created_at, updated_at 
       FROM balance 
       WHERE user_id = ?`,
      [userId]
    );
    return rows[0] || null;
  }

  // Create initial balance for a user
  static async create(userId, initialAmount = 0) {
    const db = getPool();
    const [result] = await db.query(
      `INSERT INTO balance (user_id, current_amount) 
       VALUES (?, ?)`,
      [userId, initialAmount]
    );

    // Return the created balance
    const [newBalance] = await db.query(
      `SELECT id, user_id, current_amount, created_at, updated_at 
       FROM balance 
       WHERE id = ?`,
      [result.insertId]
    );

    return newBalance[0];
  }

  // Update balance by adding/subtracting amount
  static async updateBalance(userId, amount, type) {
    const db = getPool();
    
    // Calculate the change based on transaction type
    // Use absolute value to handle cases where amount might already be negative
    const absAmount = Math.abs(parseFloat(amount));
    const change = type === 'income' ? absAmount : -absAmount;

    // Get current balance or create if doesn't exist
    let balance = await this.findByUserId(userId);
    
    if (!balance) {
      // Create initial balance with the first transaction
      balance = await this.create(userId, change);
      return balance;
    }

    // Update existing balance
    const newAmount = parseFloat(balance.current_amount) + change;
    
    await db.query(
      `UPDATE balance 
       SET current_amount = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = ?`,
      [newAmount, userId]
    );

    // Return updated balance
    return await this.findByUserId(userId);
  }

  // Get or create balance for a user
  static async getOrCreate(userId) {
    let balance = await this.findByUserId(userId);
    
    if (!balance) {
      balance = await this.create(userId, 0);
    }

    return balance;
  }
}

module.exports = Balance;
