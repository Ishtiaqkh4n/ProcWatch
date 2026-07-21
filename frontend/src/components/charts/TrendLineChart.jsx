import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS, formatDuration, formatYAxis } from "../../lib/constants";

export function TrendLineChart({ data }) {
  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
        <YAxis tickFormatter={formatYAxis} stroke="#9ca3af" fontSize={12} />
        <Tooltip
          formatter={(value) => [formatDuration(value), "Time"]}
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#f3f4f6",
          }}
        />

        <Line
          type="monotone"
          dataKey="seconds"
          stroke={CHART_COLORS[0]}
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
