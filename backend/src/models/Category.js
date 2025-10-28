const { getPool } = require("../config/database");

class Category {
  constructor(categoryData) {
    this.id = categoryData.id;
    this.user_id = categoryData.user_id;
    this.name = categoryData.name;
    this.color = categoryData.color;
    this.icon = categoryData.icon;
    this.created_at = categoryData.created_at;
    this.updated_at = categoryData.updated_at;
  }

  static getDefaultCategoriesData() {
    return [
      { name: "Food & Dining", color: "#FF6B6B", icon: "🍽️" },
      { name: "Transportation", color: "#4ECDC4", icon: "🚗" },
      { name: "Shopping", color: "#45B7D1", icon: "🛍️" },
      { name: "Entertainment", color: "#F7DC6F", icon: "🎬" },
      { name: "Bills & Utilities", color: "#BB8FCE", icon: "⚡" },
      { name: "Healthcare", color: "#F8C471", icon: "🏥" },
      { name: "Education", color: "#82E0AA", icon: "📚" },
      { name: "Travel", color: "#85C1E9", icon: "✈️" },
      { name: "Other", color: "#D5DBDB", icon: "📋" },
    ];
  }

  static async createDefaultCategories(userId) {
    const pool = getPool();

    try {
      // Check if user already has categories
      const existingCategories = await Category.findByUserId(userId);
      if (existingCategories.length > 0) {
        return existingCategories;
      }

      const defaultCategories = Category.getDefaultCategoriesData();

      try {
        const categories = [];
        for (const category of defaultCategories) {
          const [result] = await pool.execute(
            `INSERT INTO categories (user_id, name, color, icon) VALUES (?, ?, ?, ?)`,
            [userId, category.name, category.color, category.icon]
          );

          categories.push(
            new Category({
              id: result.insertId,
              user_id: userId,
              ...category,
            })
          );
        }

        return categories;
      } catch (error) {
        console.error("Error creating default categories:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error checking existing categories:", error);
      throw error;
    }
  }

  static async findByUserId(userId) {
    const pool = getPool();

    try {
      const [rows] = await pool.execute(
        "SELECT * FROM categories WHERE user_id = ? ORDER BY name",
        [userId]
      );

      return rows.map((row) => new Category(row));
    } catch (error) {
      console.error("Error finding categories by user ID:", error);
      throw error;
    }
  }

  static async findById(id, userId) {
    const pool = getPool();

    try {
      const [rows] = await pool.execute(
        "SELECT * FROM categories WHERE id = ? AND user_id = ?",
        [id, userId]
      );

      if (rows.length === 0) {
        return null;
      }

      return new Category(rows[0]);
    } catch (error) {
      console.error("Error finding category by ID:", error);
      throw error;
    }
  }

  static async create(categoryData) {
    const pool = getPool();

    try {
      const [result] = await pool.execute(
        `INSERT INTO categories (user_id, name, color, icon) VALUES (?, ?, ?, ?)`,
        [
          categoryData.user_id,
          categoryData.name,
          categoryData.color || "#95a5a6",
          categoryData.icon || "circle",
        ]
      );

      const [rows] = await pool.execute(
        "SELECT * FROM categories WHERE id = ?",
        [result.insertId]
      );

      return new Category(rows[0]);
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  static async updateExistingCategories(userId) {
    const pool = getPool();

    try {
      const defaultCategories = Category.getDefaultCategoriesData();
      const nameMapping = {
        "Food & Dining": defaultCategories[0],
        Transportation: defaultCategories[1],
        Shopping: defaultCategories[2],
        Entertainment: defaultCategories[3],
        "Bills & Utilities": defaultCategories[4],
        Healthcare: defaultCategories[5],
        Education: defaultCategories[6],
        Travel: defaultCategories[7],
        Other: defaultCategories[8],
      };

      for (const [categoryName, newData] of Object.entries(nameMapping)) {
        await pool.execute(
          `UPDATE categories SET color = ?, icon = ? WHERE user_id = ? AND name = ?`,
          [newData.color, newData.icon, userId, categoryName]
        );
      }

      return await Category.findByUserId(userId);
    } catch (error) {
      console.error("Error updating existing categories:", error);
      throw error;
    }
  }

  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      name: this.name,
      color: this.color,
      icon: this.icon,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Category;
