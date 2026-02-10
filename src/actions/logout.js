// library
import { toast } from "react-toastify";

// helpers
import { deleteItem } from "../helpers";

export async function logoutAction() {
  console.log("logoutAction called");

  // delete the user data from localStorage
  deleteItem({
    key: "userName",
  });
  deleteItem({
    key: "budgets",
  });
  deleteItem({
    key: "expenses",
  });
  // Remove legacy localStorage data that should now be in database
  deleteItem({
    key: "transactions",
  });
  deleteItem({
    key: "goalsData",
  });

  toast.success("You've deleted your account!");

  window.location.href = "/";
}
