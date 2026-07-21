import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CHART_COLORS, formatDuration, formatYAxis } from "../../lib/constants";

export function AppBarChart({ data }) {
  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data.slice(0, 10)}
        layout="vertical"
        margin={{ left: 10 }}
      >
        <XAxis
          type="number"
          tickFormatter={formatYAxis}
          stroke="#9ca3af"
          fontSize={12}
        />

        <YAxis
          type="category"
          dataKey="app_name"
          width={120}
          stroke="#9ca3af"
          fontSize={12}
        />

        <Tooltip
          formatter={(value) => [formatDuration(value), "Time"]}
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#f3f4f6",
          }}
        />

        <Bar dataKey="seconds" radius={[0, 4, 4, 0]}>
          {data.slice(0, 10).map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
