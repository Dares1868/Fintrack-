import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SidebarMenu from "../components/ui/SidebarMenu";
import "../styles/dashboard.css";
import "../styles/goals.css";
import * as goalService from "../services/goalService";
import { translate } from "../utils/dictionary";
import { useLanguage } from "../context/LanguageContext";

const statusOptions = ["active", "achieved", "cancelled"];

const GoalDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [goal, setGoal] = useState(null);
  const [amount, setAmount] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const goalData = await goalService.getGoalById(id);
        setGoal(goalData);
      } catch (error) {
        console.error("Error fetching goal:", error);
        if (error.status === 401) {
          navigate("/");
        } else if (error.status === 404) {
          navigate("/app/goals");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [id, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!goal) return null;

  const percentage = goal.target
    ? Math.round(((goal.current || 0) / goal.target) * 100)
    : 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return;

    try {
      const updatedGoal = await goalService.addAmountToGoal(
        goal.id,
        parseFloat(amount),
      );
      setGoal(updatedGoal);
      setAmount("");
    } catch (error) {
      console.error("Error adding amount:", error);
      alert("Failed to add amount. Please try again.");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedGoal = await goalService.updateGoal(goal.id, {
        status: newStatus,
      });
      setGoal(updatedGoal);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await goalService.deleteGoal(goal.id);
      navigate("/app/goals");
    } catch (error) {
      console.error("Error deleting goal:", error);
      alert("Failed to delete goal. Please try again.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const calculateDaysRemaining = () => {
    if (!goal.targetDate) return null;
    const target = new Date(goal.targetDate);
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

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
        <div className="goal-details-header">
          <h1 className="dashboard-title">{goal.name}</h1>
          <button className="goal-details-delete-btn" onClick={handleDelete}>
            {translate(language, "delete")}
          </button>
        </div>

        {goal.description && (
          <div className="goal-description">
            <p>{goal.description}</p>
          </div>
        )}

        <div className="goal-details-info-cards">
          {goal.categoryName && (
            <div className="goal-info-card">
              <span className="goal-info-label">
                {translate(language, "category")}
              </span>
              <span className="goal-info-value">
                {goal.icon} {goal.categoryName}
              </span>
            </div>
          )}

          {goal.targetDate && (
            <div className="goal-info-card">
              <span className="goal-info-label">
                {translate(language, "targetDate")}
              </span>
              <span className="goal-info-value">
                {new Date(goal.targetDate).toLocaleDateString()}
              </span>
              {daysRemaining !== null && (
                <span
                  className={`goal-days-remaining ${
                    daysRemaining < 0 ? "overdue" : ""
                  }`}
                >
                  {daysRemaining < 0
                    ? `${Math.abs(daysRemaining)} days overdue`
                    : daysRemaining === 0
                      ? "Due today!"
                      : `${daysRemaining} days left`}
                </span>
              )}
            </div>
          )}

          <div className="goal-info-card">
            <span className="goal-info-label">
              {translate(language, "status")}
            </span>
            <select
              className={`goal-status-select status-${goal.status || "active"}`}
              value={goal.status || "active"}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {translate(language, status)}
                </option>
              ))}
            </select>
          </div>
        </div>

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
              stroke={
                goal.status === "achieved"
                  ? "#27ae60"
                  : goal.status === "cancelled"
                    ? "#95a5a6"
                    : "#a682ff"
              }
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
            {goal.current || 0} zł / {goal.target} zł
          </div>
          <div className="goal-details-remaining">
            {goal.target - (goal.current || 0) > 0
              ? `${(goal.target - (goal.current || 0)).toFixed(2)} zł ${translate(language, "left")}`
              : goal.status === "achieved"
                ? translate(language, "goalAchieved")
                : translate(language, "targetReached")}
          </div>
        </div>

        {goal.status !== "cancelled" && (
          <form onSubmit={handleAdd} className="goal-details-form">
            <input
              type="number"
              placeholder={translate(language, "addAmount")}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              className="goal-details-input"
              required
            />
            <button type="submit" className="goal-details-submit-btn">
              {translate(language, "add")}
            </button>
          </form>
        )}

        {showDeleteModal && (
          <div className="transaction-modal">
            <div className="delete-modal-content">
              <h2>{translate(language, "deleteGoal")}</h2>
              <p>
                {translate(language, "confirmDeleteGoal", { name: goal.name })}
              </p>
              <div className="transaction-modal-buttons">
                <button
                  type="button"
                  className="delete-confirm-btn"
                  onClick={confirmDelete}
                >
                  {translate(language, "delete")}
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={cancelDelete}
                >
                  {translate(language, "cancel")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalDetailsPage;
