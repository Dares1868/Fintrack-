const { getPool } = require("../config/database");

class Category {
  constructor(category) {
    this.id = category.id;
    this.user_id = category.user_id;
    this.name = category.name;
    this.color = category.color;
    this.icon = category.icon;
    this.type = category.type;
    this.created_at = category.created_at;
    this.updated_at = category.updated_at;
  }

  // Get all categories for a user by type
  static async findByUserAndType(userId, type) {
    const db = getPool();
    const [rows] = await db.query(
      "SELECT * FROM categories WHERE user_id = ? AND type = ? ORDER BY name ASC",
      [userId, type]
    );
    return rows.map((row) => new Category(row));
  }

  // Get all categories for a user (all types)
  static async findByUser(userId) {
    const db = getPool();
    const [rows] = await db.query(
      "SELECT * FROM categories WHERE user_id = ? ORDER BY type, name ASC",
      [userId]
    );
    return rows.map((row) => new Category(row));
  }

  // Find category by ID and user
  static async findByIdAndUser(id, userId) {
    const db = getPool();
    const [rows] = await db.query(
      "SELECT * FROM categories WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return rows.length ? new Category(rows[0]) : null;
  }

  // Create a new category
  static async create({ user_id, name, color, icon, type }) {
    const db = getPool();
    const [result] = await db.query(
      "INSERT INTO categories (user_id, name, color, icon, type) VALUES (?, ?, ?, ?, ?)",
      [user_id, name, color || "#007bff", icon, type || "expense"]
    );

    const [rows] = await db.query(
      "SELECT * FROM categories WHERE id = ?",
      [result.insertId]
    );

    return new Category(rows[0]);
  }

  // Update category
  async update(updates) {
    const db = getPool();
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (["name", "color", "icon", "type"].includes(key) && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return this;

    values.push(this.id);
    await db.query(
      `UPDATE categories SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    // Reload the category
    const updated = await Category.findByIdAndUser(this.id, this.user_id);
    Object.assign(this, updated);
    return this;
  }

  // Delete category
  async delete() {
    const db = getPool();
    // Check if category is being used in transactions
    const [transactionRows] = await db.query(
      "SELECT COUNT(*) as count FROM transactions WHERE category_id = ?",
      [this.id]
    );

    if (transactionRows[0].count > 0) {
      throw new Error("Cannot delete category that is being used in transactions");
    }

    // Check if category is being used in goals
    const [goalRows] = await db.query(
      "SELECT COUNT(*) as count FROM goals WHERE category_id = ?",
      [this.id]
    );

    if (goalRows[0].count > 0) {
      throw new Error("Cannot delete category that is being used in goals");
    }

    await db.query("DELETE FROM categories WHERE id = ?", [this.id]);
    return true;
  }

  // Create default categories for a new user
  static async createDefaultCategories(userId) {
    const defaultExpenseCategories = [
      { name: "Food & Dining", color: "#e74c3c", icon: "utensils" },
      { name: "Transportation", color: "#3498db", icon: "car" },
      { name: "Shopping", color: "#9b59b6", icon: "shopping-bag" },
      { name: "Entertainment", color: "#f39c12", icon: "film" },
      { name: "Bills & Utilities", color: "#34495e", icon: "receipt-percent" },
      { name: "Health & Medical", color: "#e67e22", icon: "heart" },
      { name: "Education", color: "#27ae60", icon: "academic-cap" },
      { name: "Travel", color: "#16a085", icon: "airplane" },
      { name: "Personal Care", color: "#8e44ad", icon: "sparkles" },
      { name: "Other", color: "#95a5a6", icon: "ellipsis-horizontal" }
    ];

    const defaultGoalCategories = [
      { name: "Emergency Fund", color: "#e74c3c", icon: "shield-check" },
      { name: "Vacation", color: "#3498db", icon: "airplane" },
      { name: "Home", color: "#27ae60", icon: "home" },
      { name: "Car", color: "#f39c12", icon: "car" },
      { name: "Education", color: "#9b59b6", icon: "academic-cap" },
      { name: "Investment", color: "#34495e", icon: "chart-bar" },
      { name: "Health", color: "#e67e22", icon: "heart" },
      { name: "Technology", color: "#16a085", icon: "computer-desktop" },
      { name: "Other", color: "#95a5a6", icon: "star" }
    ];

    const categories = [];

    // Create expense categories
    for (const cat of defaultExpenseCategories) {
      const category = await Category.create({
        user_id: userId,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        type: "expense"
      });
      categories.push(category);
    }

    // Create goal categories
    for (const cat of defaultGoalCategories) {
      const category = await Category.create({
        user_id: userId,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        type: "goal"
      });
      categories.push(category);
    }

    return categories;
  }

  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      name: this.name,
      color: this.color,
      icon: this.icon,
      type: this.type,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Category;