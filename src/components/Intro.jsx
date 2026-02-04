import { useNavigate } from "react-router-dom";
import "../styles/introStart.css";
import { translate } from "../utils/dictionary";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./ui/LanguageSwitcher";

const Intro = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="intro-gradient-bg">
      <div className="logo-lang-header">
        <span className="logo-top">FinTrack</span>
        <LanguageSwitcher />
      </div>
      <div className="intro-center">
        <h1 className="intro-title">
          {language === "en" ? (
            <>
              Manage your
              <br />
              finances with
              <br />
              ease
            </>
          ) : (
            <>
              Zarządzaj swoimi
              <br />
              finansami z
              <br />
              łatwością
            </>
          )}
        </h1>
      </div>
      <button
        className="get-started-btn-bottom"
        onClick={() => navigate("/login")}
      >
        {language === "en" ? "Get started" : "Rozpocznij"}
      </button>
    </div>
  );
};

export default Intro;
