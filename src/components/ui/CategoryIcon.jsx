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

  const categoryClass = category
    ? `category-icon-${category}`
    : "category-icon-default";

  return (
    <span
      className={`category-icon ${categoryClass}`}
      style={{
        fontSize: size * 0.8,
        width: size,
        height: size,
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
