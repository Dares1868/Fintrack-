import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "../components/ui/SidebarMenu";
import "../styles/dashboard.css";
import "../styles/goals.css";
import * as goalService from "../services/goalService";

const categoryGroups = {
  "Short-Term Goals (0-12 months)": [
    { name: "Vacation", icon: "✈️", color: "#3498db" },
    { name: "Gadgets / Electronics", icon: "📱", color: "#9b59b6" },
    { name: "Holiday Shopping", icon: "🎁", color: "#e74c3c" },
    { name: "Emergency Buffer", icon: "🆘", color: "#e67e22" },
  ],
  "Mid-Term Goals (1-5 years)": [
    { name: "Home Renovation", icon: "🏠", color: "#16a085" },
    { name: "Car Purchase", icon: "🚗", color: "#2980b9" },
    { name: "Wedding / Big Event", icon: "💒", color: "#f39c12" },
    { name: "Education Fund", icon: "📚", color: "#8e44ad" },
  ],
  "Long-Term Goals (5+ years)": [
    { name: "Retirement", icon: "🏖️", color: "#27ae60" },
    { name: "Real Estate Down Payment", icon: "🏡", color: "#2c3e50" },
    { name: "Investment Fund", icon: "📈", color: "#16a085" },
  ],
};

const allCategories = Object.values(categoryGroups).flat();
const statusOptions = ["active", "achieved", "cancelled"];

const GoalsPage = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    target: "",
    targetDate: "",
    category: allCategories[0],
    status: "active",
    isCustomCategory: false,
    customCategoryName: "",
    customIcon: "",
    customColor: "#a682ff",
  });

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const goalsData = await goalService.getGoals();
        setGoals(goalsData);
      } catch (error) {
        console.error("Error fetching goals:", error);
        if (error.status === 401) {
          navigate("/");
        }
      }
    };
    fetchGoals();

    // Refresh session periodically to prevent timeout
    const sessionRefresh = setInterval(async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
        await fetch(`${API_URL}/health`, {
          credentials: "include",
        });
      } catch (error) {
        console.error("Session refresh failed:", error);
      }
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(sessionRefresh);
  }, [navigate]);

  const handleAddGoal = () => {
    setForm({
      name: "",
      description: "",
      target: "",
      targetDate: "",
      category: allCategories[0],
      status: "active",
      isCustomCategory: false,
      customCategoryName: "",
      customIcon: "",
      customColor: "#a682ff",
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.target || isNaN(form.target)) return;

    // Validate custom category fields
    if (form.isCustomCategory) {
      if (!form.customCategoryName || !form.customIcon) {
        alert("Please fill in custom category name and icon");
        return;
      }
    }

    const goalData = {
      name: form.name,
      description: form.description,
      target: parseFloat(form.target),
      targetDate: form.targetDate,
      icon: form.isCustomCategory ? form.customIcon : form.category.icon,
      color: form.isCustomCategory ? form.customColor : form.category.color,
      categoryName: form.isCustomCategory
        ? form.customCategoryName
        : form.category.name,
      status: form.status,
    };

    try {
      const newGoal = await goalService.createGoal(goalData);
      setGoals([...goals, newGoal]);
      setForm({
        name: "",
        description: "",
        target: "",
        targetDate: "",
        category: allCategories[0],
        status: "active",
        isCustomCategory: false,
        customCategoryName: "",
        customIcon: "",
        customColor: "#a682ff",
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error creating goal:", error);
      alert("Failed to create goal. Please try again.");
    }
  };

  const handleDeleteGoal = async (goalIndex, e) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this goal?"
    );
    if (!confirmDelete) return;

    const goalToDelete = goals[goalIndex];
    if (!goalToDelete || !goalToDelete.id) return;

    try {
      await goalService.deleteGoal(goalToDelete.id);
      const updated = goals.filter((_, index) => index !== goalIndex);
      setGoals(updated);
    } catch (error) {
      console.error("Error deleting goal:", error);
      alert("Failed to delete goal. Please try again.");
    }
  };

  return (
    <div className="dashboard-gradient-bg">
      <button className="back-btn" onClick={() => navigate("/app/dashboard")}>
        ←
      </button>
      <button className="burger-btn" onClick={() => setShowMenu(true)}>
        ☰
      </button>
      <SidebarMenu open={showMenu} onClose={() => setShowMenu(false)} />

      <div className="dashboard-center-wrap">
        <h1 className="dashboard-title">Saving goals</h1>

        <div className="goals-list">
          {goals.map((goal, idx) => {
            const percentage = goal.target
              ? Math.min(100, (goal.current / goal.target) * 100)
              : 0;

            const statusBadgeClass =
              goal.status === "achieved"
                ? "status-achieved"
                : goal.status === "cancelled"
                ? "status-cancelled"
                : "status-active";

            return (
              <div
                className="goal-card"
                key={goal.id || goal.name + idx}
                onClick={() => navigate(`/app/goal/${goal.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="goal-icon"
                  style={{ backgroundColor: goal.color }}
                >
                  <span role="img" aria-label="goal">
                    {goal.icon}
                  </span>
                </div>
                <div className="goal-info">
                  <button
                    type="button"
                    className="goal-delete-btn"
                    onClick={(e) => handleDeleteGoal(idx, e)}
                  ></button>
                  <div className="goal-title">{goal.name}</div>
                  <div className="goal-progress-bar">
                    <div
                      className="goal-progress"
                      data-progress={percentage}
                      style={{
                        width: `${percentage}%`,
                        background: "#a682ff",
                      }}
                    ></div>
                  </div>
                  <div className="goal-amounts">
                    <span>${goal.current || 0}</span>
                    <span>${goal.target}</span>
                  </div>
                  <div className="goal-bottom-info">
                    {goal.categoryName && (
                      <div className="goal-category">
                        {goal.icon} {goal.categoryName}
                      </div>
                    )}
                    {goal.targetDate && (
                      <div className="goal-target-date">
                        📅 {new Date(goal.targetDate).toLocaleDateString()}
                      </div>
                    )}
                    <div className={`goal-status-badge ${statusBadgeClass}`}>
                      {goal.status || "active"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="add-goal-btn" onClick={handleAddGoal}>
          + Add New Goal
        </button>

        {showModal && (
          <div className="transaction-modal">
            <form
              className="transaction-modal-content"
              onSubmit={handleFormSubmit}
            >
              <h2>Add Goal</h2>

              <label>
                Name
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows="3"
                  placeholder="What is this goal for?"
                />
              </label>

              <label>
                Target Amount
                <input
                  type="number"
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value })}
                  required
                />
              </label>

              <label>
                Target Date
                <input
                  type="date"
                  value={form.targetDate}
                  onChange={(e) =>
                    setForm({ ...form, targetDate: e.target.value })
                  }
                />
              </label>

              <label>
                Category
                <select
                  value={form.isCustomCategory ? "custom" : form.category.name}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setForm({
                        ...form,
                        isCustomCategory: true,
                      });
                    } else {
                      setForm({
                        ...form,
                        isCustomCategory: false,
                        category: allCategories.find(
                          (opt) => opt.name === e.target.value
                        ),
                      });
                    }
                  }}
                >
                  {Object.entries(categoryGroups).map(
                    ([groupName, categories]) => (
                      <optgroup key={groupName} label={groupName}>
                        {categories.map((opt) => (
                          <option key={opt.name} value={opt.name}>
                            {opt.icon} {opt.name}
                          </option>
                        ))}
                      </optgroup>
                    )
                  )}
                  <option value="custom">✨ Custom Category</option>
                </select>
              </label>

              {form.isCustomCategory && (
                <>
                  <label>
                    Custom Category Name
                    <input
                      type="text"
                      value={form.customCategoryName}
                      onChange={(e) =>
                        setForm({ ...form, customCategoryName: e.target.value })
                      }
                      placeholder="e.g., Business Trip"
                      required
                    />
                  </label>

                  <label>
                    Custom Icon (Emoji)
                    <input
                      type="text"
                      value={form.customIcon}
                      onChange={(e) =>
                        setForm({ ...form, customIcon: e.target.value })
                      }
                      placeholder="e.g., 💼"
                      maxLength="2"
                      required
                    />
                  </label>

                  <label>
                    Custom Color
                    <input
                      type="color"
                      value={form.customColor}
                      onChange={(e) =>
                        setForm({ ...form, customColor: e.target.value })
                      }
                    />
                  </label>
                </>
              )}

              <label>
                Status
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </label>

              <div className="transaction-modal-buttons">
                <button type="submit" className="primary-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;
