const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Get all transactions for the logged-in user
export const getTransactions = async () => {
  try {
    const response = await fetch(`${API_URL}/api/transactions`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch transactions");
    }

    const data = await response.json();
    return data.transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Create a new transaction
export const createTransaction = async (transactionData) => {
  try {
    const response = await fetch(`${API_URL}/api/transactions`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create transaction");
    }

    const data = await response.json();
    return data.transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

// Migrate localStorage transactions to database
export const migrateTransactions = async (transactions) => {
  try {
    const response = await fetch(`${API_URL}/api/transactions/migrate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactions }),
    });

    if (!response.ok) {
      const error = await response.json();
      // If migration already happened, it's not really an error
      if (error.message === "Migration already completed") {
        return null;
      }
      throw new Error(error.error || "Failed to migrate transactions");
    }

    const data = await response.json();
    return data.transactions;
  } catch (error) {
    console.error("Error migrating transactions:", error);
    throw error;
  }
};

// Get transaction summary by category
export const getTransactionSummary = async () => {
  try {
    const response = await fetch(`${API_URL}/api/transactions/summary`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch transaction summary");
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error("Error fetching transaction summary:", error);
    throw error;
  }
};
