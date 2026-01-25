import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "../components/ui/SidebarMenu";
import CategoryIcon from "../components/ui/CategoryIcon";
import "../styles/dashboard.css";
import "../styles/transactions.css";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "../services/transactionService";

const categoryNames = {
  utilities: "Bills & Utilities",
  education: "Education",
  entertainment: "Entertainment",
  food: "Food & Dining",
  health: "Healthcare",
  other: "Other",
  shopping: "Shopping",
  transport: "Transportation",
  travel: "Travel",
};

const iconToCategoryMap = {
  "📄": "utilities",
  "🎓": "education",
  "🎬": "entertainment",
  "🍴": "food",
  "❤️": "health",
  "💡": "other",
  "🛒": "shopping",
  "🚗": "transport",
  "✈️": "travel",
};

const TransactionsPage = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    category: "food",
    type: "expense",
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch transactions from backend
        const dbTransactions = await getTransactions();
        setTransactions(dbTransactions);
      } catch (err) {
        console.error("Error loading transactions:", err);

        // Redirect to login if not authenticated
        if (err.status === 401) {
          navigate("/");
          return;
        }

        setError("Failed to load transactions. Please try again.");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Refresh session periodically to prevent timeout
    const sessionRefresh = setInterval(async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
        await fetch(`${API_URL}/health`, {
          credentials: "include",
        });
      } catch (error) {
        console.error("Session refresh failed:", error);
      }
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(sessionRefresh);
  }, [navigate]);

  const filtered = transactions.filter((t) => {
    if (filter === "all") return true;
    if (filter === "income") return t.amount > 0;
    if (filter === "expense") return t.amount < 0;
  });

  const handleAddTransaction = () => {
    setForm({
      name: "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      category: "food",
      type: "expense",
    });
    setShowModal(true);
  };

  const handleDeleteTransaction = async (transactionId) => {
    setTransactionToDelete(transactionId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;

    try {
      await deleteTransaction(transactionToDelete);

      // Remove from local state
      setTransactions(transactions.filter(t => t.id !== transactionToDelete));
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    } catch (err) {
      console.error("Error deleting transaction:", err);

      // Redirect to login if not authenticated
      if (err.status === 401) {
        navigate("/");
        return;
      }

      alert("Failed to delete transaction. Please try again.");
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTransactionToDelete(null);
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.amount || isNaN(form.amount)) {
      alert("Fill all fields correctly");
      return;
    }

    const amount =
      form.type === "expense"
        ? -Math.abs(parseFloat(form.amount))
        : Math.abs(parseFloat(form.amount));

    const newTx = {
      name: form.name,
      category: form.category,
      type: form.type,
      amount,
      date: form.date || new Date().toISOString().slice(0, 10),
    };

    try {
      // Save to backend
      const createdTransaction = await createTransaction(newTx);

      // Update local state with the new transaction
      const updated = [createdTransaction, ...transactions];
      setTransactions(updated);

      setShowModal(false);
    } catch (err) {
      console.error("Error saving transaction:", err);

      // Redirect to login if not authenticated
      if (err.status === 401) {
        navigate("/");
        return;
      }

      alert("Failed to save transaction. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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
        <div className="transactions-header">
          <h1 className="dashboard-title">Transactions</h1>
          <button
            className="dashboard-add-transaction-btn"
            onClick={handleAddTransaction}
          >
            + Add
          </button>
        </div>

        {error && (
          <div style={{ color: "red", padding: "10px", textAlign: "center" }}>
            {error}
          </div>
        )}

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
          {loading ? (
            <div className="transactions-empty">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="transactions-empty">No transactions yet</div>
          ) : (
            filtered.map((t, i) => (
              <div className="transaction-card" key={t.id || i}>
                <CategoryIcon category={t.category} size={40} />
                <div className="transaction-info">
                  <span className="transaction-name">{t.name}</span>
                  <span className="transaction-date">{formatDate(t.date)}</span>
                </div>
                <span
                  className={`transaction-amount ${
                    t.amount > 0 ? "income" : "expense"
                  }`}
                >
                  {t.amount > 0 ? "+" : ""}
                  {t.amount < 0 ? "-" : ""}
                  {Math.abs(t.amount).toFixed(2)}$
                </span>
                <button
                  className="transaction-delete-btn"
                  onClick={() => handleDeleteTransaction(t.id)}
                  title="Delete transaction"
                >
                  ✕
                </button>
              </div>
            ))
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

            <label>
              Name
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="entertainment">Entertainment</option>
                <option value="utilities">Utilities</option>
                <option value="health">Health</option>
                <option value="shopping">Shopping</option>
                <option value="other">Other</option>
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
              <button type="submit" className="primary-btn">
                Save
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showDeleteModal && (
        <div className="transaction-modal">
          <div className="delete-modal-content">
            <h2>Do you wanna delete it?</h2>
            <div className="transaction-modal-buttons">
              <button
                type="button"
                className="delete-confirm-btn"
                onClick={confirmDelete}
              >
                Yes
              </button>
              <button
                type="button"
                className="delete-cancel-btn"
                onClick={cancelDelete}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
