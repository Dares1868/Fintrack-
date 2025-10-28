const express = require("express");
const router = express.Router();
const {
  requireAuth,
  getCategories,
  createCategory,
  updateExistingCategories,
} = require("../controllers/categoryController");

// Apply authentication middleware to all category routes
router.use(requireAuth);

// Category routes
router.get("/", getCategories); // Get user's categories
router.post("/", createCategory); // Create new category
router.put("/update-existing", updateExistingCategories); // Update existing categories with new emojis/colors

module.exports = router;
