// library
import { toast } from "react-toastify";

// helpers
import { deleteItem } from "../helpers";

export async function logoutAction() {
  console.log("logoutAction called");

  try {
    // Call backend logout to clear session
    const response = await fetch("http://localhost:3001/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  }

  // delete the user data from localStorage
  deleteItem({
    key: "userName",
  });
  deleteItem({
    key: "userFullName",
  });
  deleteItem({
    key: "budgets",
  });
  deleteItem({
    key: "expenses",
  });

  toast.success("You've been logged out!");

  // Use proper navigation instead of window.location
  // This should be handled by the calling component with navigate()
  return true;
}
