import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CHART_COLORS, formatYAxis } from "../../lib/constants";

export function StackedBarChart({ data, apps }) {
  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
        <YAxis tickFormatter={formatYAxis} stroke="#9ca3af" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#f3f4f6",
          }}
        />

        <Legend />
        {apps.map((app, i) => (
          <Bar
            key={app}
            dataKey={app}
            stackId="a"
            fill={CHART_COLORS[i % CHART_COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
