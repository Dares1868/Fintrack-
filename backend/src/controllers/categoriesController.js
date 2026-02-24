const Category = require("../models/Category");

// Get all categories for authenticated user
const getCategories = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { type } = req.query;

    let categories;
    if (type) {
      categories = await Category.findByUserAndType(userId, type);
    } else {
      categories = await Category.findByUser(userId);
    }

    res.json({ categories: categories.map(cat => cat.toJSON()) });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { name, color, icon, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ 
        error: "Category name and type are required" 
      });
    }

    if (!["expense", "goal"].includes(type)) {
      return res.status(400).json({ 
        error: "Type must be either 'expense' or 'goal'" 
      });
    }

    const category = await Category.create({
      user_id: userId,
      name,
      color,
      icon,
      type
    });

    res.status(201).json({ 
      message: "Category created successfully",
      category: category.toJSON() 
    });
  } catch (error) {
    console.error("Create category error:", error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        error: "A category with this name and type already exists" 
      });
    }

    res.status(500).json({ error: "Failed to create category" });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const userId = req.session.userId;
    const categoryId = parseInt(req.params.id);
    const { name, color, icon, type } = req.body;

    const category = await Category.findByIdAndUser(categoryId, userId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (color !== undefined) updates.color = color;
    if (icon !== undefined) updates.icon = icon;
    if (type !== undefined) {
      if (!["expense", "goal"].includes(type)) {
        return res.status(400).json({ 
          error: "Type must be either 'expense' or 'goal'" 
        });
      }
      updates.type = type;
    }

    await category.update(updates);

    res.json({ 
      message: "Category updated successfully",
      category: category.toJSON() 
    });
  } catch (error) {
    console.error("Update category error:", error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        error: "A category with this name and type already exists" 
      });
    }

    res.status(500).json({ error: "Failed to update category" });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const userId = req.session.userId;
    const categoryId = parseInt(req.params.id);

    const category = await Category.findByIdAndUser(categoryId, userId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await category.delete();

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    
    if (error.message.includes("Cannot delete category")) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Failed to delete category" });
  }
};


const initializeDefaultCategories = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Check if user already has categories
    const existingCategories = await Category.findByUser(userId);
    if (existingCategories.length > 0) {
      return res.status(400).json({ 
        error: "User already has categories initialized" 
      });
    }

    const categories = await Category.createDefaultCategories(userId);

    res.json({ 
      message: "Default categories initialized successfully",
      categories: categories.map(cat => cat.toJSON())
    });
  } catch (error) {
    console.error("Initialize categories error:", error);
    res.status(500).json({ error: "Failed to initialize default categories" });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  initializeDefaultCategories,
};