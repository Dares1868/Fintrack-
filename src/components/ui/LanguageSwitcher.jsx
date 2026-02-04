import { useLanguage } from "../../context/LanguageContext";
import "../../styles/sidebarMenu.css";

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button className="language-switcher-btn" onClick={toggleLanguage}>
      {language === "en" ? "EN" : "PL"}
    </button>
  );
};

export default LanguageSwitcher;
