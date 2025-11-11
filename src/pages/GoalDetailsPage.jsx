import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SidebarMenu from "../components/ui/SidebarMenu";
import "../styles/dashboard.css";
import "../styles/goals.css";
import { getGoals, saveGoals } from "../utils/storage/goalsStorage";

const GoalDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [amount, setAmount] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const goals = getGoals();
    setGoal(goals[id]);
  }, [id]);

  if (!goal) return null;

  const percentage = goal.target
    ? Math.round(((goal.current || 0) / goal.target) * 100)
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return;
    const goals = getGoals();
    goals[id].current = (goals[id].current || 0) + Number(amount);
    saveGoals(goals);
    setGoal(goals[id]);
    setAmount("");
  };

  return (
    <div className="dashboard-gradient-bg">
      <button className="back-btn" onClick={() => navigate("/app/goals")}>
        ←
      </button>
      <button className="burger-btn" onClick={() => setShowMenu(true)}>
        ☰
      </button>
      <SidebarMenu open={showMenu} onClose={() => setShowMenu(false)} />
      <div className="dashboard-center-wrap">
        <h1 className="dashboard-title">{goal.name}</h1>
        <div className="goal-details-chart-wrap">
          <svg width="140" height="140">
            <circle
              cx="70"
              cy="70"
              r="60"
              stroke="#ddd"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="70"
              cy="70"
              r="60"
              stroke="#a682ff"
              strokeWidth="12"
              fill="none"
              strokeDasharray={2 * Math.PI * 60}
              strokeDashoffset={
                2 * Math.PI * 60 * (1 - Math.min(percentage, 100) / 100)
              }
              strokeLinecap="round"
              className="goal-details-progress-circle"
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dy="0.35em"
              fontSize="22"
              fill="#fff"
              fontWeight="bold"
            >
              {percentage}%
            </text>
          </svg>
          <div className="goal-details-progress-text">
            ${goal.current || 0} / ${goal.target}
          </div>
          <div className="goal-details-remaining">
            {goal.target - (goal.current || 0) > 0
              ? `$${goal.target - (goal.current || 0)} left`
              : "Goal reached!"}
          </div>
        </div>

        <form onSubmit={handleAdd} className="goal-details-form">
          <input
            type="number"
            placeholder="Add amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            className="goal-details-input"
            required
          />
          <button type="submit" className="goal-details-submit-btn">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalDetailsPage;
