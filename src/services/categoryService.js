const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

class CategoryService {
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get categories");
      }

      return data;
    } catch (error) {
      console.error("Get categories error:", error);
      throw error;
    }
  }

  async createCategory(categoryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      return data;
    } catch (error) {
      console.error("Create category error:", error);
      throw error;
    }
  }
}

export default new CategoryService();
