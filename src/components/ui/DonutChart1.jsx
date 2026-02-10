import { translate } from "../../utils/dictionary";
import { useLanguage } from "../../context/LanguageContext";

const DonutChart = ({ data, total, mode = "month" }) => {
  const { language } = useLanguage();
  const size = 180;
  const stroke = 28;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  let prev = 0;

  return (
    <svg width={size} height={size}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {data.map((cat, i) => {
          const val = cat.sum / total;
          const dash = circ * val;
          const dashArray = `${dash} ${circ - dash}`;
          const el = (
            <circle
              key={cat.icon}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={cat.color}
              strokeWidth={stroke}
              strokeDasharray={dashArray}
              strokeDashoffset={circ - prev}
              style={{ transition: "stroke-dashoffset 0.5s" }}
            />
          );
          prev += dash;
          return el;
        })}
      </g>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius - stroke / 2}
        fill="#18181b"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="-0.5em"
        fontSize="15"
        fill="#fff"
        fontWeight="bold"
      >
        {translate(language, "expenses")}
      </text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.8em"
        fontSize="15"
        fill="#fff"
        fontWeight="bold"
      >
        {translate(language, mode === "month" ? "thisMonth" : "thisYear")}
      </text>
    </svg>
  );
};
export default DonutChart;
