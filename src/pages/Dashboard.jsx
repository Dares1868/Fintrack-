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

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState({ name: "User", balance: 0 });
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const storedName = getUserFullName();
      const goalsFromStorage = JSON.parse(
        localStorage.getItem("goalsData") || "[]"
      );
      
      if (storedName) {
        setUserName(storedName);
        setGoals(goalsFromStorage);
        
        try {
          // Fetch balance from API
          const balanceData = await getBalance();
          setUser({ name: storedName, balance: balanceData.currentAmount });
        } catch (error) {
          console.error("Error fetching balance:", error);
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
      <h1>Hello, {user.name}!</h1>
      <div className="balance-card">
        <div>
          <span>My balance</span>
        </div>
        <div className="balance-amount">${user.balance.toFixed(2)}</div>
        <div className="card-details">
          <span>**** 0886</span>
          <span>VISA</span>
        </div>
      </div>
      <div className="goals-header">
        <span>Goal</span>
        <button className="seeall-btn" onClick={() => navigate("/app/goals")}>
          See all
        </button>
      </div>
      <div className="goals-list">
        {goals.slice(0, 3).map((goal, idx) => (
          <div
            className="goal-card"
            key={goal.name + idx}
            onClick={() => navigate(`/app/goal/${idx}`)}
            style={{ cursor: "pointer" }}
          >
            <span className="goal-icon">{goal.icon || "🎯"}</span>
            <div>
              <span>{goal.name}</span>
              <span>Goal ${goal.target}</span>
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
