import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "../components/ui/SidebarMenu";
import DonutChart from "../components/ui/DonutChart1";
import { loadTransactions } from "../utils/storage/transactionsStorage";
import "../styles/expenses.css";

const CATEGORY_COLORS = {
  "📄": "#4B7BE3",
  "🎓": "#FF8C00",
  "🎬": "#FF00C3",
  "🍴": "#4BE36A",
  "❤️": "#FF5E5E",
  "💡": "#9CA3AF",
  "🛒": "#FFD600",
  "🚗": "#00CFFF",
  "✈️": "#A682FF",
};
const CATEGORY_LABELS = {
  "📄": "Bills & Utilities",
  "🎓": "Education",
  "🎬": "Entertainment",
  "🍴": "Food & Dining",
  "❤️": "Healthcare",
  "💡": "Other",
  "🛒": "Shopping",
  "🚗": "Transportation",
  "✈️": "Travel",
};
const CATEGORY_ICONS = {
  utilities: "📄",
  education: "🎓",
  entertainment: "🎬",
  food: "🍴",
  health: "❤️",
  other: "💡",
  shopping: "🛒",
  transport: "🚗",
  travel: "✈️",
};

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

const formatMonthYear = (year, monthIndex) =>
  `${monthNames[monthIndex]} ${year}`;

const sameMonth = (d, year, monthIndex) =>
  d.getFullYear() === year && d.getMonth() === monthIndex;

const sameYear = (d, year) => d.getFullYear() === year;

const ExpensesPage = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [viewMode, setViewMode] = useState("month");

  const [isMonthMenuOpen, setIsMonthMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const allTx = loadTransactions() || [];
    const expenses = allTx.filter((t) => t.amount < 0);
    setTransactions(expenses);
  }, []);

  const availableMonths = useMemo(() => {
    const setKey = new Set();
    const list = [];

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const y = d.getFullYear();
      const m = d.getMonth();
      const key = `${y}-${m}`;
      if (!setKey.has(key)) {
        setKey.add(key);
        list.push({
          year: y,
          month: m,
          label: formatMonthYear(y, m),
          sortKey: new Date(y, m, 1).getTime(),
        });
      }
    });

    list.sort((a, b) => b.sortKey - a.sortKey);
    return list;
  }, [transactions]);

  useEffect(() => {
    if (!selectedMonth || !selectedYear) {
      if (availableMonths.length > 0) {
        setSelectedMonth(availableMonths[0].month);
        setSelectedYear(availableMonths[0].year);
      } else {
        const now = new Date();
        setSelectedMonth(now.getMonth());
        setSelectedYear(now.getFullYear());
      }
    }
  }, [availableMonths]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMonthMenuOpen(false);
      }
    };
    if (isMonthMenuOpen) {
      document.addEventListener("mousedown", onDocClick);
    }
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isMonthMenuOpen]);

  const filteredTransactions = useMemo(() => {
    if (!selectedYear || selectedMonth === null) return [];
    if (viewMode === "month") {
      return transactions.filter((t) => {
        const d = new Date(t.date);
        return sameMonth(d, selectedYear, selectedMonth);
      });
    } else {
      return transactions.filter((t) => {
        const d = new Date(t.date);
        return sameYear(d, selectedYear);
      });
    }
  }, [transactions, viewMode, selectedMonth, selectedYear]);

  const categoriesMap = useMemo(() => {
    const map = {};
    filteredTransactions.forEach((tx) => {
      const icon = CATEGORY_ICONS[tx.category] || "⋯";
      if (!map[icon]) {
        map[icon] = {
          sum: 0,
          count: 0,
          label: CATEGORY_LABELS[icon] || "Other",
          color: CATEGORY_COLORS[icon] || "#18181b",
        };
      }
      map[icon].sum += Math.abs(tx.amount);
      map[icon].count += 1;
    });
    return map;
  }, [filteredTransactions]);

  const chartData = useMemo(
    () =>
      Object.entries(categoriesMap)
        .map(([icon, data]) => ({ icon, ...data }))
        .sort((a, b) => b.sum - a.sum),
    [categoriesMap]
  );

  const total = useMemo(
    () => chartData.reduce((a, c) => a + c.sum, 0),
    [chartData]
  );

  const title = useMemo(() => {
    if (!selectedYear || selectedMonth === null) return "";
    return viewMode === "month"
      ? formatMonthYear(selectedYear, selectedMonth)
      : String(selectedYear);
  }, [viewMode, selectedYear, selectedMonth]);

  const headerTotalValue = useMemo(() => {
    return filteredTransactions.reduce((a, t) => a + Math.abs(t.amount), 0);
  }, [filteredTransactions]);
  const headerTotal = headerTotalValue.toFixed(2);

  const handlePickMonth = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setIsMonthMenuOpen(false);
  };

  const handleToggleView = (mode) => setViewMode(mode);

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
        <div className="expenses-header">
          <div className="month-menu-wrap" ref={menuRef}>
            <button
              className="expenses-title"
              onClick={() => setIsMonthMenuOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={isMonthMenuOpen}
              title="Choose month"
            >
              {title}
              <span className="expenses-title-caret">▾</span>
            </button>

            {isMonthMenuOpen && (
              <div role="listbox" className="month-dropdown">
                {availableMonths.length === 0 && (
                  <div className="month-empty">No months</div>
                )}
                {availableMonths.map((m) => {
                  const isActive =
                    m.year === selectedYear && m.month === selectedMonth;
                  return (
                    <button
                      key={`${m.year}-${m.month}`}
                      onClick={() => handlePickMonth(m.year, m.month)}
                      className={`month-dropdown-item ${
                        isActive ? "active" : ""
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <span className="expenses-total">
            {headerTotalValue === 0 ? `$${headerTotal}` : `-$${headerTotal}`}
          </span>

          <div className="view-toggle-wrap">
            <button
              onClick={() => handleToggleView("month")}
              aria-pressed={viewMode === "month"}
              className={`view-toggle-btn ${
                viewMode === "month" ? "active" : ""
              }`}
              title="Show monthly chart"
            >
              Month
            </button>
            <button
              onClick={() => handleToggleView("year")}
              aria-pressed={viewMode === "year"}
              className={`view-toggle-btn ${
                viewMode === "year" ? "active" : ""
              }`}
              title="Show yearly chart"
            >
              Year
            </button>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div className="expenses-chart-wrap">
            <DonutChart data={chartData} total={total} mode={viewMode} />
          </div>
        ) : (
          <div className="expenses-no-data">
            No data for the selected period.
          </div>
        )}

        {chartData.length > 0 && (
          <>
            <div className="expenses-transactions-title">Transactions</div>
            <div className="expenses-transactions-list">
              {chartData.map((cat) => (
                <div className="expenses-transaction-row" key={cat.icon}>
                  <span
                    className="expenses-transaction-icon"
                    style={{ background: cat.color }}
                  >
                    {cat.icon}
                  </span>
                  <div className="expenses-transaction-info">
                    <div className="expenses-transaction-label">
                      {cat.label}
                    </div>
                    <div className="expenses-transaction-count">
                      {cat.count} transaction{cat.count > 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="expenses-transaction-amount">
                    -${cat.sum.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;
