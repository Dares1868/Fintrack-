import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SidebarMenu from "../components/ui/SidebarMenu";
import "../styles/transactions.css";

const CategoryTransactionsPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const txs = JSON.parse(localStorage.getItem("transactions") || "[]");
    setTransactions(txs.filter((t) => t.category === category));
  }, [category]);

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="dashboard-gradient-bg">
      <button className="back-btn" onClick={() => navigate("/app/expenses")}>
        ←
      </button>
      <SidebarMenu />
      <div className="dashboard-center-wrap">
        <h1 className="dashboard-title">
          {category}
          <span className="category-title-count">
            {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""}
          </span>
        </h1>
        <div className="transactions-list">
          {sortedTransactions.length === 0 ? (
            <div className="transactions-empty">No transactions</div>
          ) : (
            sortedTransactions.map((t, i) => (
              <div className="transaction-card" key={i}>
                <span className="category-transaction-icon">{t.icon}</span>
                <div className="transaction-info">
                  <span className="transaction-name">{t.name}</span>
                  <span className="transaction-date">{t.date}</span>
                </div>
                <span
                  className={`transaction-amount ${
                    t.amount > 0 ? "income" : "expense"
                  }`}
                >
                  {t.amount > 0 ? "+" : ""}
                  {Math.abs(t.amount).toFixed(2)}$
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryTransactionsPage;
