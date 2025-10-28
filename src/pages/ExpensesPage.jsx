import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "../components/ui/SidebarMenu";
import DonutChart from "../components/ui/DonutChart1";
import transactionService from "../services/transactionService";
import categoryService from "../services/categoryService";

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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [viewMode, setViewMode] = useState("month");

  const [isMonthMenuOpen, setIsMonthMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [transactionsRes, categoriesRes] = await Promise.all([
        transactionService.getTransactions(),
        categoryService.getCategories(),
      ]);

      // Filter only expense transactions
      const expenses = transactionsRes.transactions.filter(
        (t) => t.type === "expense"
      );

      setTransactions(expenses);
      setCategories(categoriesRes.categories);
    } catch (error) {
      console.error("Error loading data:", error);
      // Set empty data on error
      setTransactions([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

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
    if (categories.length === 0) return {};

    const map = {};
    filteredTransactions.forEach((tx) => {
      const category = categories.find((cat) => cat.id === tx.category_id);
      const categoryKey = category ? category.id : "uncategorized";

      if (!map[categoryKey]) {
        map[categoryKey] = {
          sum: 0,
          count: 0,
          label: category ? category.name : "Uncategorized",
          color: category ? category.color : "#95a5a6",
          icon: category ? category.icon : "📋",
        };
      }
      map[categoryKey].sum += Math.abs(tx.amount);
      map[categoryKey].count += 1;
    });
    return map;
  }, [filteredTransactions, categories]);

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

  if (loading) {
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
          <div style={{ textAlign: "center", padding: "40px", color: "white" }}>
            Loading expenses data...
          </div>
        </div>
      </div>
    );
  }

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
        <div className="expenses-header" style={{ alignItems: "center" }}>
          <div style={{ position: "relative" }} ref={menuRef}>
            <button
              className="expenses-title"
              onClick={() => setIsMonthMenuOpen((v) => !v)}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontSize: 28,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              aria-haspopup="listbox"
              aria-expanded={isMonthMenuOpen}
              title="Choose month"
            >
              {title}
              <span style={{ fontSize: 16, opacity: 0.8 }}>▾</span>
            </button>

            {isMonthMenuOpen && (
              <div
                role="listbox"
                className="month-dropdown"
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  minWidth: 220,
                  maxHeight: 300,
                  overflowY: "auto",
                  background: "white",
                  color: "#111",
                  borderRadius: 12,
                  padding: 8,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  zIndex: 50,
                }}
              >
                {availableMonths.length === 0 && (
                  <div style={{ padding: "8px 10px", opacity: 0.7 }}>
                    No months
                  </div>
                )}
                {availableMonths.map((m) => {
                  const isActive =
                    m.year === selectedYear && m.month === selectedMonth;
                  return (
                    <button
                      key={`${m.year}-${m.month}`}
                      onClick={() => handlePickMonth(m.year, m.month)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "none",
                        cursor: "pointer",
                        background: isActive ? "#eef2ff" : "transparent",
                        fontWeight: isActive ? 700 : 500,
                      }}
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

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              onClick={() => handleToggleView("month")}
              aria-pressed={viewMode === "month"}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.25)",
                background:
                  viewMode === "month"
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
              title="Show monthly chart"
            >
              Month
            </button>
            <button
              onClick={() => handleToggleView("year")}
              aria-pressed={viewMode === "year"}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.25)",
                background:
                  viewMode === "year"
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
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
          <div style={{ opacity: 0.7, padding: "16px 0" }}>
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
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{cat.label}</div>
                    <div style={{ fontSize: 14, opacity: 0.7 }}>
                      {cat.count} transaction{cat.count > 1 ? "s" : ""}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>
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
