import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "../components/ui/SidebarMenu";
import "../styles/dashboard.css";
import "../styles/transactions.css";
import transactionService from "../services/transactionService";
import categoryService from "../services/categoryService";

// Remove hardcoded mappings - we'll use real category data from API

const TransactionsPage = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    category_id: null,
    type: "expense",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Load both transactions and categories
      const [transactionResponse, categoryResponse] = await Promise.all([
        transactionService.getTransactions({ limit: 100 }),
        categoryService.getCategories(),
      ]);

      setTransactions(transactionResponse.transactions || []);
      setCategories(categoryResponse.categories || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      setError(error.message || "Failed to load data");

      // If user is not authenticated, redirect to login
      if (error.message && error.message.includes("Authentication")) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await transactionService.getTransactions({ limit: 100 });
      setTransactions(response.transactions || []);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      throw error;
    }
  };

  const filtered = transactions.filter((t) => {
    if (filter === "all") return true;
    if (filter === "income") return t.type === "income";
    if (filter === "expense") return t.type === "expense";
  });

  const handleAddTransaction = () => {
    setForm({
      description: "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      category_id: categories.length > 0 ? categories[0].id : null,
      type: "expense",
    });
    setError("");
    setShowModal(true);
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();

    if (!form.description.trim() || !form.amount || isNaN(form.amount)) {
      setError("Please fill all fields correctly");
      return;
    }

    const amount = Math.abs(parseFloat(form.amount));

    if (amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const transactionData = {
        description: form.description.trim(),
        amount: amount,
        date: form.date,
        type: form.type,
        category_id: form.category_id || null,
      };

      await transactionService.createTransaction(transactionData);

      // Reload transactions to get the updated list
      await loadTransactions();

      setShowModal(false);
      setForm({
        description: "",
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        category_id: categories.length > 0 ? categories[0].id : null,
        type: "expense",
      });
    } catch (error) {
      console.error("Failed to save transaction:", error);
      setError(error.message || "Failed to save transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const date = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonthYear = `${
    monthNames[date.getMonth()]
  } ${date.getFullYear()}`;

  return (
    <div className="dashboard-gradient-bg">
      <button className="burger-btn" onClick={() => setShowMenu(true)}>
        ☰
      </button>
      <button onClick={() => navigate("/app/dashboard")} className="back-btn">
        ←
      </button>
      <SidebarMenu open={showMenu} onClose={() => setShowMenu(false)} />
      <div className="dashboard-center-wrap">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h1 className="dashboard-title">Transactions</h1>
          <button
            className="dashboard-add-transaction-btn"
            onClick={handleAddTransaction}
          >
            + Add
          </button>
        </div>

        <div className="transactions-filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            all
          </button>
          <button
            className={filter === "income" ? "active" : ""}
            onClick={() => setFilter("income")}
          >
            income
          </button>
          <button
            className={filter === "expense" ? "active" : ""}
            onClick={() => setFilter("expense")}
          >
            expense
          </button>
        </div>

        <div className="transactions-date-header">{currentMonthYear}</div>

        <div className="transactions-list">
          {isLoading ? (
            <div style={{ color: "#bcb6f6", textAlign: "center" }}>
              Loading transactions...
            </div>
          ) : error ? (
            <div style={{ color: "#f44336", textAlign: "center" }}>{error}</div>
          ) : filtered.length === 0 ? (
            <div style={{ color: "#bcb6f6", textAlign: "center" }}>
              No transactions yet
            </div>
          ) : (
            filtered.map((t, i) => {
              // Find the category for this transaction
              const category = categories.find(
                (cat) => cat.id === t.category_id
              );

              return (
                <div className="transaction-card" key={i}>
                  <span
                    className="transaction-icon"
                    style={{
                      fontSize: 32,
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: category ? category.color : "#95a5a6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {category ? category.icon : "📋"}
                  </span>
                  <div className="transaction-info">
                    <span className="transaction-name">{t.description}</span>
                    <span
                      className="transaction-category"
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        display: "block",
                      }}
                    >
                      {category ? category.name : "Uncategorized"}
                    </span>
                    <span className="transaction-date">
                      {new Date(t.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span
                    className={`transaction-amount ${
                      t.type === "income" ? "income" : "expense"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showModal && (
        <div className="transaction-modal">
          <form
            className="transaction-modal-content"
            onSubmit={handleSaveTransaction}
          >
            <h2>Add Transaction</h2>
            {error && <p className="error">{error}</p>}

            <label>
              Description
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </label>

            <label>
              Amount
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </label>

            <label>
              Date
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </label>

            <label>
              Category
              <select
                value={form.category_id || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category_id: parseInt(e.target.value) || null,
                  })
                }
                required
                style={{ fontSize: "16px" }}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Type
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>

            <div className="transaction-modal-buttons">
              <button
                type="submit"
                className="primary-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
