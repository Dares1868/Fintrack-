const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

class TransactionService {
  async createTransaction(transactionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(transactionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create transaction");
      }

      return data;
    } catch (error) {
      console.error("Create transaction error:", error);
      throw error;
    }
  }

  async getTransactions(params = {}) {
    try {
      const searchParams = new URLSearchParams();

      if (params.limit) searchParams.append("limit", params.limit);
      if (params.offset) searchParams.append("offset", params.offset);

      const url = `${API_BASE_URL}/api/transactions${
        searchParams.toString() ? "?" + searchParams.toString() : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get transactions");
      }

      return data;
    } catch (error) {
      console.error("Get transactions error:", error);
      throw error;
    }
  }

  async getTransaction(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get transaction");
      }

      return data;
    } catch (error) {
      console.error("Get transaction error:", error);
      throw error;
    }
  }

  async updateTransaction(id, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update transaction");
      }

      return data;
    } catch (error) {
      console.error("Update transaction error:", error);
      throw error;
    }
  }

  async deleteTransaction(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete transaction");
      }

      return data;
    } catch (error) {
      console.error("Delete transaction error:", error);
      throw error;
    }
  }

  async getTransactionSummary(params = {}) {
    try {
      const searchParams = new URLSearchParams();

      if (params.start_date)
        searchParams.append("start_date", params.start_date);
      if (params.end_date) searchParams.append("end_date", params.end_date);

      const url = `${API_BASE_URL}/api/transactions/summary${
        searchParams.toString() ? "?" + searchParams.toString() : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get transaction summary");
      }

      return data;
    } catch (error) {
      console.error("Get transaction summary error:", error);
      throw error;
    }
  }
}

export default new TransactionService();
