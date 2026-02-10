import PropTypes from "prop-types";
import "../../styles/categoryIcon.css";

const CategoryIcon = ({ category, size = 40 }) => {
  const icons = {
    utilities: "📄",
    education: "🎓",
    entertainment: "🎬",
    food: "🍴",
    health: "❤️",
    other: "💡",
    shopping: "🛒",
    transport: "🚗",
    travel: "✈️",
  };

  const colors = {
    utilities: "#4b7be3",
    education: "#ff8c00",
    entertainment: "#ff00c3",
    food: "#16a085",
    health: "#ffb3d9",
    other: "#9ca3af",
    shopping: "#ffd600",
    transport: "#00cfff",
    travel: "#a682ff",
  };

  const categoryClass = category
    ? `category-icon-${category}`
    : "category-icon-default";

  const backgroundColor = colors[category] || "#18181b";

  return (
    <span
      className={`category-icon ${categoryClass}`}
      style={{
        fontSize: size * 0.8,
        width: size,
        height: size,
        backgroundColor: backgroundColor,
      }}
    >
      {icons[category] || "⋯"}
    </span>
  );
};

CategoryIcon.propTypes = {
  category: PropTypes.string.isRequired,
  size: PropTypes.number,
};

export default CategoryIcon;
