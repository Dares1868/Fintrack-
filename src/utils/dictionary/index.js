const DICTIONARY = {
  // Common
  greeting: { pl: "Cześć", en: "Hello" },
  welcome: { pl: "Witamy", en: "Welcome" },
  save: { pl: "Zapisz", en: "Save" },
  cancel: { pl: "Anuluj", en: "Cancel" },
  delete: { pl: "Usuń", en: "Delete" },
  edit: { pl: "Edytuj", en: "Edit" },
  close: { pl: "Zamknij", en: "Close" },
  add: { pl: "Dodaj", en: "Add" },
  addAmount: { pl: "Dodaj kwotę", en: "Add amount" },
  left: { pl: "pozostało", en: "left" },
  goalAchieved: { pl: "🎉 Cel osiągnięty!", en: "🎉 Goal achieved!" },
  targetReached: { pl: "Cel osiągnięty!", en: "Target reached!" },
  seeAll: { pl: "Zobacz wszystko", en: "See all" },
  loading: { pl: "Ładowanie...", en: "Loading..." },
  error: { pl: "Błąd", en: "Error" },
  success: { pl: "Sukces", en: "Success" },

  // Auth
  welcomeBack: { pl: "Witaj ponownie", en: "Welcome back" },
  email: { pl: "Email", en: "Email" },
  password: { pl: "Hasło", en: "Password" },
  name: { pl: "Nazwa", en: "Name" },
  signIn: { pl: "Zaloguj się", en: "Sign in" },
  signUp: { pl: "Zarejestruj się", en: "Sign up" },
  signingIn: { pl: "Logowanie...", en: "Signing in..." },
  signingUp: { pl: "Rejestracja...", en: "Signing up..." },
  dontHaveAccount: { pl: "Nie masz konta?", en: "Don't have an account?" },
  alreadyHaveAccount: { pl: "Masz już konto?", en: "Already have an account?" },
  forgotPassword: { pl: "Zapomniałeś hasła?", en: "Forgot Password?" },
  resetPassword: { pl: "Resetuj hasło", en: "Reset Password" },
  sendResetLink: { pl: "Wyślij link resetujący", en: "Send Reset Link" },
  newPassword: { pl: "Nowe hasło", en: "New Password" },
  confirmPassword: { pl: "Potwierdź hasło", en: "Confirm Password" },
  passwordResetSuccess: { pl: "Hasło zostało zresetowane pomyślnie", en: "Password reset successfully" },
  resetLinkSent: { pl: "Link resetujący został wysłany", en: "Reset link sent" },
  demoResetLink: { pl: "Dla celów demonstracyjnych, twój link resetujący to:", en: "For demo purposes, your reset link is:" },
  checkEmailInstructions: { pl: "Sprawdź swoją skrzynkę e-mail i kliknij link resetujący.", en: "Check your email and click the reset link." },
  close: { pl: "Zamknij", en: "Close" },
  invalidResetToken: { pl: "Nieprawidłowy lub wygasły token resetujący", en: "Invalid or expired reset token" },
  passwordsMustMatch: { pl: "Hasła muszą być identyczne", en: "Passwords must match" },
  loginFailed: {
    pl: "Logowanie nie powiodło się. Spróbuj ponownie.",
    en: "Login failed. Please try again.",
  },
  registrationSuccess: {
    pl: "Rejestracja zakończona sukcesem! Możesz się teraz zalogować.",
    en: "Registration successful! You can now log in.",
  },

  // Dashboard
  hello: { pl: "Cześć", en: "Hello" },
  myBalance: { pl: "Moje saldo", en: "My balance" },
  goal: { pl: "Cel", en: "Goal" },
  goals: { pl: "Cele", en: "Goals" },
  transactions: { pl: "Transakcje", en: "Transactions" },
  expenses: { pl: "Wydatki", en: "Expenses" },

  // Transactions
  addTransaction: { pl: "Dodaj transakcję", en: "Add Transaction" },
  transactionName: { pl: "Nazwa", en: "Name" },
  amount: { pl: "Kwota", en: "Amount" },
  date: { pl: "Data", en: "Date" },
  category: { pl: "Kategoria", en: "Category" },
  type: { pl: "Typ", en: "Type" },
  income: { pl: "Dochód", en: "Income" },
  expense: { pl: "Wydatek", en: "Expense" },
  filter: { pl: "Filtruj", en: "Filter" },
  all: { pl: "Wszystkie", en: "All" },
  deleteConfirm: { pl: "Czy chcesz to usunąć?", en: "Do you wanna delete it?" },
  confirmDelete: { pl: "Czy chcesz to usunąć?", en: "Do you wanna delete it?" },
  yes: { pl: "Tak", en: "Yes" },
  no: { pl: "Nie", en: "No" },
  noTransactions: { pl: "Brak transakcji", en: "No transactions yet" },
  utilities: { pl: "Usługi komunalne", en: "Utilities" },

  // Months
  january: { pl: "Styczeń", en: "January" },
  february: { pl: "Luty", en: "February" },
  march: { pl: "Marzec", en: "March" },
  april: { pl: "Kwiecień", en: "April" },
  may: { pl: "Maj", en: "May" },
  june: { pl: "Czerwiec", en: "June" },
  july: { pl: "Lipiec", en: "July" },
  august: { pl: "Sierpień", en: "August" },
  september: { pl: "Wrzesień", en: "September" },
  october: { pl: "Październik", en: "October" },
  november: { pl: "Listopad", en: "November" },
  december: { pl: "Grudzień", en: "December" },

  // Categories
  food: { pl: "Jedzenie", en: "Food" },
  transport: { pl: "Transport", en: "Transport" },
  entertainment: { pl: "Rozrywka", en: "Entertainment" },
  shopping: { pl: "Zakupy", en: "Shopping" },
  health: { pl: "Zdrowie", en: "Health" },
  bills: { pl: "Rachunki", en: "Bills" },
  salary: { pl: "Wypłata", en: "Salary" },
  other: { pl: "Inne", en: "Other" },
  customCategory: { pl: "Niestandardowa kategoria", en: "Custom Category" },

  // Expense Categories (detailed)
  billsAndUtilities: { pl: "Rachunki i opłaty", en: "Bills & Utilities" },
  education: { pl: "Edukacja", en: "Education" },
  foodAndDining: { pl: "Jedzenie i restauracje", en: "Food & Dining" },
  healthcare: { pl: "Opieka zdrowotna", en: "Healthcare" },
  transportation: { pl: "Transport", en: "Transportation" },
  travel: { pl: "Podróże", en: "Travel" },

  // Goals
  addGoal: { pl: "Dodaj cel", en: "Add Goal" },
  savingGoals: { pl: "Cele oszczędnościowe", en: "Saving goals" },
  addNewGoal: { pl: "+ Dodaj nowy cel", en: "+ Add New Goal" },
  goalName: { pl: "Nazwa celu", en: "Goal Name" },
  targetAmount: { pl: "Docelowa kwota", en: "Target Amount" },
  currentAmount: { pl: "Obecna kwota", en: "Current Amount" },
  targetDate: { pl: "Data docelowa", en: "Target Date" },
  deadline: { pl: "Termin", en: "Deadline" },
  progress: { pl: "Postęp", en: "Progress" },
  completed: { pl: "Ukończone", en: "Completed" },
  description: { pl: "Opis", en: "Description" },
  status: { pl: "Status", en: "Status" },
  active: { pl: "Aktywny", en: "Active" },
  achieved: { pl: "Osiągnięty", en: "Achieved" },
  cancelled: { pl: "Anulowany", en: "Cancelled" },
  deleteGoal: { pl: "Usuń cel", en: "Delete Goal" },
  confirmDeleteGoal: {
    pl: (data) => `Czy na pewno chcesz usunąć "${data?.name}"?`,
    en: (data) => `Are you sure you want to delete "${data?.name}"?`,
  },
  actionCannotBeUndone: {
    pl: "Tej akcji nie można cofnąć.",
    en: "This action cannot be undone.",
  },
  goalDescriptionPlaceholder: {
    pl: "Do czego służy ten cel?",
    en: "What is this goal for?",
  },
  customCategoryName: {
    pl: "Nazwa niestandardowej kategorii",
    en: "Custom Category Name",
  },
  customIcon: { pl: "Niestandardowa ikona (emoji)", en: "Custom Icon (Emoji)" },
  customColor: { pl: "Niestandardowy kolor", en: "Custom Color" },
  categoryPlaceholder: { pl: "np. Wyjazd służbowy", en: "e.g., Business Trip" },
  iconPlaceholder: { pl: "np. 💼", en: "e.g., 💼" },

  // Expenses
  totalExpenses: { pl: "Całkowite wydatki", en: "Total Expenses" },
  byCategory: { pl: "Według kategorii", en: "By Category" },
  monthly: { pl: "Miesięczne", en: "Monthly" },
  weekly: { pl: "Tygodniowe", en: "Weekly" },
  month: { pl: "Miesiąc", en: "Month" },
  year: { pl: "Rok", en: "Year" },
  noDataForPeriod: {
    pl: "Brak danych dla wybranego okresu.",
    en: "No data for the selected period.",
  },
  transaction: { pl: "transakcja", en: "transaction" },
  transactions: { pl: "Transakcje", en: "Transactions" },
  loadingExpenses: { pl: "Ładowanie wydatków...", en: "Loading expenses..." },
  failedToLoadExpenses: {
    pl: "Nie udało się załadować wydatków. Spróbuj ponownie.",
    en: "Failed to load expenses. Please try again.",
  },
  noMonths: { pl: "Brak miesięcy", en: "No months" },
  chooseMonth: { pl: "Wybierz miesiąc", en: "Choose month" },
  chooseYear: { pl: "Wybierz rok", en: "Choose year" },

  // Goal categories
  vacation: { pl: "Wakacje", en: "Vacation" },
  gadgetsElectronics: {
    pl: "Gadżety / Elektronika",
    en: "Gadgets / Electronics",
  },
  holidayShopping: { pl: "Zakupy świąteczne", en: "Holiday Shopping" },
  emergencyBuffer: { pl: "Fundusz awaryjny", en: "Emergency Buffer" },
  homeRenovation: { pl: "Remont domu", en: "Home Renovation" },
  carPurchase: { pl: "Zakup samochodu", en: "Car Purchase" },
  weddingBigEvent: { pl: "Ślub / Duże wydarzenie", en: "Wedding / Big Event" },
  educationFund: { pl: "Fundusz edukacyjny", en: "Education Fund" },
  retirement: { pl: "Emerytura", en: "Retirement" },
  realEstateDownPayment: {
    pl: "Wpłata na nieruchomość",
    en: "Real Estate Down Payment",
  },
  investmentFund: { pl: "Fundusz inwestycyjny", en: "Investment Fund" },
  showMonthlyChart: { pl: "Pokaż wykres miesięczny", en: "Show monthly chart" },
  showYearlyChart: { pl: "Pokaż wykres roczny", en: "Show yearly chart" },
  spendThis: { pl: "Wydatki w tym", en: "Spend this" },
  spendInMonth: { pl: "Wydatki w tym miesiącu", en: "Spend this month" },
  spendInYear: { pl: "Wydatki w tym roku", en: "Spend this year" },
  thisMonth: { pl: "tym miesiącu", en: "this month" },
  thisYear: { pl: "tym roku", en: "this year" },

  // Error messages
  errorFetchingData: {
    pl: "Błąd podczas pobierania danych",
    en: "Error fetching data",
  },
  errorSavingData: {
    pl: "Błąd podczas zapisywania danych",
    en: "Error saving data",
  },
  errorDeletingData: {
    pl: "Błąd podczas usuwania danych",
    en: "Error deleting data",
  },
  fillAllFields: {
    pl: "Wypełnij wszystkie pola",
    en: "Please fill all fields",
  },

  // Navigation
  dashboard: { pl: "Panel główny", en: "Dashboard" },
  goBack: { pl: "Wróć", en: "Go Back" },
  goHome: { pl: "Strona główna", en: "Go Home" },
  logout: { pl: "Wyloguj", en: "Logout" },
};

// Get current language from localStorage or default to 'en'
export const getCurrentLanguage = () => {
  return localStorage.getItem("language") || "en";
};

// Set language in localStorage
export const setLanguage = (lang) => {
  localStorage.setItem("language", lang);
  window.dispatchEvent(new Event("languageChange"));
};

// Translate function - can be called with language or without (uses getCurrentLanguage)
export const translate = (languageOrKey, keyOrData = null, data = null) => {
  let language;
  let key;
  let translationData;

  // Check if first argument is a language code
  if (languageOrKey === "en" || languageOrKey === "pl") {
    language = languageOrKey;
    key = keyOrData;
    translationData = data;
  } else {
    // First argument is the key, use current language
    language = getCurrentLanguage();
    key = languageOrKey;
    translationData = keyOrData;
  }

  const translation = DICTIONARY[key]?.[language] || key;

  // If translation is a function, call it with data
  if (typeof translation === "function") {
    return translation(translationData);
  }

  return translation;
};

export default DICTIONARY;
