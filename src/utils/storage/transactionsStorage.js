// Deprecated: Use transactionService API calls instead
// These functions are kept only for migration purposes

export function loadTransactions() {
  console.warn('loadTransactions is deprecated. Use transactionService.getTransactions() instead');
  const raw = localStorage.getItem("transactions");
  return raw ? JSON.parse(raw) : [];
}

export function saveTransactions(transactions) {
  console.warn('saveTransactions is deprecated. Use transactionService.createTransaction() instead');
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
