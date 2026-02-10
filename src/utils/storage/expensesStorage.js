// Deprecated: Use transactionService API calls instead
// These functions are kept only for legacy support

export const getExpenses = () => {
  console.warn(
    "getExpenses is deprecated. Use transactionService.getTransactions() instead",
  );
  return JSON.parse(localStorage.getItem("expenses") || "[]");
};

export const saveExpenses = (expenses) => {
  localStorage.setItem("expenses", JSON.stringify(expenses));
};

export const createExpense = ({ name, amount, budgetId }) => {
  const newItem = {
    id: crypto.randomUUID(),
    name,
    createdAt: Date.now(),
    amount: +amount,
    budgetId,
  };
  const expenses = getExpenses();
  saveExpenses([...expenses, newItem]);
  return newItem;
};

export const deleteExpense = (id) => {
  const expenses = getExpenses().filter((e) => e.id !== id);
  saveExpenses(expenses);
};

export const getExpensesByBudget = (budgetId) => {
  return getExpenses().filter((e) => e.budgetId === budgetId);
};

export const calculateSpentByBudget = (budgetId) => {
  return getExpensesByBudget(budgetId).reduce(
    (acc, expense) => acc + expense.amount,
    0,
  );
};
