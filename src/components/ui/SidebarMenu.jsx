import { useNavigate } from "react-router-dom";
import "../../styles/sidebarMenu.css";
import { logoutAction } from "../../actions/logout";

const SidebarMenu = ({ open, onClose }) => {
  const navigate = useNavigate();
  return (
    <div className={`sidebar-menu${open ? " open" : ""}`}>
      <button className="sidebar-close" onClick={onClose}>
        ×
      </button>
      <button
        onClick={() => {
          navigate("/app/dashboard");
          onClose();
        }}
      >
        Dashboard
      </button>
      <button
        onClick={() => {
          navigate("/app/goals");
          onClose();
        }}
      >
        Goals
      </button>
      <button
        onClick={() => {
          navigate("/app/transactions");
          onClose();
        }}
      >
        Transactions
      </button>
      <button
        onClick={() => {
          navigate("/app/expenses");
          onClose();
        }}
      >
        Expenses
      </button>
      <button
        onClick={async () => {
          await logoutAction();
          navigate("/");
          onClose();
        }}
      >
        Logout
      </button>
    </div>
  );
};
export default SidebarMenu;
