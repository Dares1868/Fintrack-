const Category = require("../models/Category");

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

const getCategories = async (req, res) => {
  try {
    const userId = req.session.userId;

    let categories = await Category.findByUserId(userId);

    // If user has no categories, create default ones
    if (categories.length === 0) {
      categories = await Category.createDefaultCategories(userId);
    }

    res.json({
      categories: categories.map((c) => c.toJSON()),
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      error: "Failed to get categories",
      details: "An internal server error occurred",
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    const userId = req.session.userId;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        error: "Category name is required",
      });
    }

    // Create category
    const category = await Category.create({
      user_id: userId,
      name: name.trim(),
      color: color || "#95a5a6",
      icon: icon || "circle",
    });

    console.log("Category created successfully:", {
      id: category.id,
      user_id: userId,
      name: category.name,
    });

    res.status(201).json({
      message: "Category created successfully",
      category: category.toJSON(),
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      error: "Failed to create category",
      details: "An internal server error occurred",
    });
  }
};

const updateExistingCategories = async (req, res) => {
  try {
    const userId = req.session.userId;

    const categories = await Category.updateExistingCategories(userId);

    res.json({
      message: "Categories updated successfully",
      categories: categories.map((c) => c.toJSON()),
    });
  } catch (error) {
    console.error("Update categories error:", error);
    res.status(500).json({
      error: "Failed to update categories",
      details: "An internal server error occurred",
    });
  }
};

module.exports = {
  requireAuth,
  getCategories,
  createCategory,
  updateExistingCategories,
};
