const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  initializeDefaultCategories,
} = require("../controllers/categoriesController");

const router = express.Router();

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

// Apply auth middleware to all routes
router.use(requireAuth);

// GET /api/categories - Get all categories for user (or filter by type with ?type=expense|goal)
router.get("/", getCategories);

// POST /api/categories - Create a new category
router.post("/", createCategory);

// PUT /api/categories/:id - Update a category
router.put("/:id", updateCategory);

// DELETE /api/categories/:id - Delete a category
router.delete("/:id", deleteCategory);

// POST /api/categories/initialize - Initialize default categories for new user
router.post("/initialize", initializeDefaultCategories);

module.exports = router;