const { getPool } = require("../config/database");

class Transaction {
  constructor(transactionData) {
    this.id = transactionData.id;
    this.user_id = transactionData.user_id;
    this.category_id = transactionData.category_id;
    this.type = transactionData.type; // 'income' or 'expense'
    this.amount = transactionData.amount;
    this.description = transactionData.description;
    this.date = transactionData.date;
    this.created_at = transactionData.created_at;
    this.updated_at = transactionData.updated_at;
    // Category fields from JOIN query
    this.category_name = transactionData.category_name;
    this.category_color = transactionData.category_color;
    this.category_icon = transactionData.category_icon;
  }

  static async create(transactionData) {
    const pool = getPool();

    try {
      const [result] = await pool.execute(
        `INSERT INTO transactions (user_id, category_id, type, amount, description, date) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          transactionData.user_id,
          transactionData.category_id || null,
          transactionData.type,
          transactionData.amount,
          transactionData.description || null,
          transactionData.date,
        ]
      );

      // Return the created transaction
      const [rows] = await pool.execute(
        `SELECT t.*, c.name as category_name, c.color as category_color 
         FROM transactions t 
         LEFT JOIN categories c ON t.category_id = c.id 
         WHERE t.id = ?`,
        [result.insertId]
      );

      return new Transaction(rows[0]);
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  static async findByUserId(userId, limit = 50, offset = 0) {
    const pool = getPool();

    try {
      // Use query instead of execute for LIMIT/OFFSET parameters
      const sql = `SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon 
         FROM transactions t 
         LEFT JOIN categories c ON t.category_id = c.id 
         WHERE t.user_id = ? 
         ORDER BY t.date DESC, t.created_at DESC 
         LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

      const [rows] = await pool.execute(sql, [parseInt(userId)]);

      return rows.map((row) => new Transaction(row));
    } catch (error) {
      console.error("Error finding transactions by user ID:", error);
      throw error;
    }
  }

  static async findById(id, userId) {
    const pool = getPool();

    try {
      const [rows] = await pool.execute(
        `SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon 
         FROM transactions t 
         LEFT JOIN categories c ON t.category_id = c.id 
         WHERE t.id = ? AND t.user_id = ?`,
        [id, userId]
      );

      if (rows.length === 0) {
        return null;
      }

      return new Transaction(rows[0]);
    } catch (error) {
      console.error("Error finding transaction by ID:", error);
      throw error;
    }
  }

  static async update(id, userId, updateData) {
    const pool = getPool();

    try {
      const fields = [];
      const values = [];

      if (updateData.category_id !== undefined) {
        fields.push("category_id = ?");
        values.push(updateData.category_id);
      }
      if (updateData.type !== undefined) {
        fields.push("type = ?");
        values.push(updateData.type);
      }
      if (updateData.amount !== undefined) {
        fields.push("amount = ?");
        values.push(updateData.amount);
      }
      if (updateData.description !== undefined) {
        fields.push("description = ?");
        values.push(updateData.description);
      }
      if (updateData.date !== undefined) {
        fields.push("date = ?");
        values.push(updateData.date);
      }

      if (fields.length === 0) {
        throw new Error("No fields to update");
      }

      values.push(id, userId);

      const [result] = await pool.execute(
        `UPDATE transactions SET ${fields.join(
          ", "
        )} WHERE id = ? AND user_id = ?`,
        values
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return await Transaction.findById(id, userId);
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  }

  static async delete(id, userId) {
    const pool = getPool();

    try {
      const [result] = await pool.execute(
        "DELETE FROM transactions WHERE id = ? AND user_id = ?",
        [id, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }

  static async getUserTransactionSummary(
    userId,
    startDate = null,
    endDate = null
  ) {
    const pool = getPool();

    try {
      let query = `
        SELECT 
          type,
          COUNT(*) as count,
          SUM(amount) as total_amount
        FROM transactions 
        WHERE user_id = ?
      `;

      const params = [userId];

      if (startDate) {
        query += " AND date >= ?";
        params.push(startDate);
      }

      if (endDate) {
        query += " AND date <= ?";
        params.push(endDate);
      }

      query += " GROUP BY type";

      const [rows] = await pool.execute(query, params);

      const summary = {
        income: { count: 0, total: 0 },
        expense: { count: 0, total: 0 },
      };

      rows.forEach((row) => {
        summary[row.type] = {
          count: row.count,
          total: parseFloat(row.total_amount),
        };
      });

      return summary;
    } catch (error) {
      console.error("Error getting transaction summary:", error);
      throw error;
    }
  }

  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      category_id: this.category_id,
      type: this.type,
      amount: parseFloat(this.amount),
      description: this.description,
      date: this.date,
      created_at: this.created_at,
      updated_at: this.updated_at,
      category_name: this.category_name,
      category_color: this.category_color,
      category_icon: this.category_icon,
    };
  }
}

module.exports = Transaction;
