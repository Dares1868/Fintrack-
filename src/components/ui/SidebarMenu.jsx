import { useNavigate } from "react-router-dom";
import "../../styles/sidebarMenu.css";
import { logoutAction } from "../../actions/logout";
import { translate } from "../../utils/dictionary";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const SidebarMenu = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className={`sidebar-menu${open ? " open" : ""}`}>
      <button className="sidebar-close" onClick={onClose}>
        ×
      </button>
      <div className="sidebar-lang-switcher">
        <LanguageSwitcher />
      </div>
      <button
        onClick={() => {
          navigate("/app/dashboard");
          onClose();
        }}
      >
        {translate("dashboard")}
      </button>
      <button
        onClick={() => {
          navigate("/app/goals");
          onClose();
        }}
      >
        {translate("goals")}
      </button>
      <button
        onClick={() => {
          navigate("/app/transactions");
          onClose();
        }}
      >
        {translate("transactions")}
      </button>
      <button
        onClick={() => {
          navigate("/app/expenses");
          onClose();
        }}
      >
        {translate("expenses")}
      </button>
      <button
        onClick={() => {
          // navigate("/app/logout");
          logoutAction();
          onClose();
        }}
      >
        {translate("logout")}
      </button>
    </div>
  );
};
export default SidebarMenu;
