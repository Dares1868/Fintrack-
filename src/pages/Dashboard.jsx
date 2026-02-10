import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import SidebarMenu from "../components/ui/SidebarMenu";
import {
  getUserFullName,
  getUserBalance,
  saveUserBalance,
} from "../utils/storage/userStorage";
import { getBalance } from "../services/balanceService";
import * as goalService from "../services/goalService";
import { translate } from "../utils/dictionary";
import { useLanguage } from "../context/LanguageContext";
import {
  PaperAirplaneIcon,
  DevicePhoneMobileIcon,
  GiftIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  TruckIcon,
  HeartIcon,
  BookOpenIcon,
  SunIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

// Debug imports
console.log("PaperAirplaneIcon import:", PaperAirplaneIcon);
console.log("BookOpenIcon import:", BookOpenIcon);

// Function to get icon component from icon name
const getIconComponent = (iconName) => {
  console.log("Dashboard getIconComponent called with:", iconName);
  const iconMap = {
    AirplaneIcon: PaperAirplaneIcon,
    DevicePhoneMobileIcon,
    GiftIcon,
    ExclamationTriangleIcon,
    HomeIcon,
    TruckIcon,
    HeartIcon,
    BookOpenIcon,
    SunIcon,
    BuildingOffice2Icon,
    ChartBarIcon,
  };
  const result = iconMap[iconName];
  console.log("Dashboard iconMap result:", result);
  return result;
};

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState({ name: "User", balance: 0 });
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const storedName = getUserFullName();

      if (storedName) {
        setUserName(storedName);

        try {
          // Fetch balance from API
          const balanceData = await getBalance();
          setUser({ name: storedName, balance: balanceData.currentAmount });

          // Fetch goals from API
          const goalsData = await goalService.getGoals();
          setGoals(goalsData);
        } catch (error) {
          console.error("Error fetching data:", error);
          // Fallback to localStorage if API fails
          const storedBalance = getUserBalance();
          setUser({ name: storedName, balance: storedBalance });
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/login");
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <div className="dashboard-gradient-bg">
      <button className="burger-btn" onClick={() => setShowMenu(!showMenu)}>
        ☰
      </button>
      <SidebarMenu open={showMenu} onClose={() => setShowMenu(false)} />
      <h1>
        {translate("hello")}, {user.name}!
      </h1>
      <div className="balance-card">
        <div>
          <span>{translate("myBalance")}</span>
        </div>
        <div className="balance-amount">{user.balance.toFixed(2)} zł</div>
      </div>
      <div className="goals-header">
        <span>{translate("goal")}</span>
        <button className="seeall-btn" onClick={() => navigate("/app/goals")}>
          {translate("seeAll")}
        </button>
      </div>
      <div className="goals-list">
        {goals.slice(0, 3).map((goal, idx) => (
          <div
            className="goal-card"
            key={goal.name + idx}
            onClick={() => navigate(`/app/goal/${goal.id}`)}
            style={{ cursor: "pointer" }}
          >
            <span
              className="goal-icon"
              style={{
                backgroundColor: goal.color || "#a682ff",
              }}
            >
              {(() => {
                console.log("Dashboard rendering icon for goal:", goal.icon);
                const IconComponent = getIconComponent(goal.icon);
                console.log("Dashboard IconComponent:", IconComponent);
                return IconComponent ? (
                  <IconComponent
                    style={{ width: "18px", height: "18px", color: "#fff" }}
                  />
                ) : (
                  <span role="img" aria-label="goal">
                    {goal.icon || "🎯"}
                  </span>
                );
              })()}
            </span>
            <div>
              <span>{goal.name}</span>
              <span>Cel {goal.target} zł</span>
            </div>
            <span>
              {goal.target
                ? Math.round(((goal.current || 0) / goal.target) * 100)
                : 0}
              %
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
