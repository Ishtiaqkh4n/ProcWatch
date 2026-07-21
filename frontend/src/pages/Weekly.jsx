import { useState, useMemo } from "react";
import { useRangeData } from "../hooks/useRangeData";
import { useCategories } from "../hooks/useCategories";
import { StackedBarChart } from "../components/charts/StackedBarChart";
import { SummaryCard } from "../components/ui/SummaryCard";
import { formatDuration, daysAgo } from "../lib/constants";

export function Weekly() {
  const [groupBy, setGroupBy] = useState("app");
  const startDate = daysAgo(6);
  const endDate = daysAgo(0);
  const { usage, loading } = useRangeData(startDate, endDate);
  const { categories } = useCategories();

  const { chartData, keys, totalSeconds } = useMemo(() => {
    const dayMap = new Map();

    for (const row of usage) {
      const groupKey =
        groupBy === "category"
          ? (categories.find((c) => c.app_name === row.app_name)?.category ??
            "Uncategorized")
          : row.app_name;

      if (!dayMap.has(row.date)) dayMap.set(row.date, new Map());
      const appMap = dayMap.get(row.date);
      appMap.set(groupKey, (appMap.get(groupKey) ?? 0) + row.seconds);
    }

    const allKeys = new Set();
    let total = 0;

    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = daysAgo(i);
      const appMap = dayMap.get(d) ?? new Map();
      const entry = {
        day: new Date(d + "T12:00:00").toLocaleDateString("en", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      };
      for (const [key, secs] of appMap) {
        entry[key] = secs;
        allKeys.add(key);
        total += secs;
      }
      data.push(entry);
    }

    return { chartData: data, keys: [...allKeys], totalSeconds: total };
  }, [usage, groupBy, categories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">This Week</h1>
        <div className="flex bg-gray-800 rounded-lg p-0.5">
          <button
            onClick={() => setGroupBy("app")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              groupBy === "app" ? "bg-gray-700 text-white" : "text-gray-400"
            }`}
          >
            By App
          </button>
          <button
            onClick={() => setGroupBy("category")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              groupBy === "category"
                ? "bg-gray-700 text-white"
                : "text-gray-400"
            }`}
          >
            By Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <SummaryCard
          label="Total Active Time"
          value={formatDuration(totalSeconds)}
        />
        <SummaryCard
          label="Days Tracked"
          value={String(new Set(usage.map((r) => r.date)).size)}
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Daily Breakdown
        </h2>
        {keys.length > 0 ? (
          <StackedBarChart data={chartData} apps={keys} />
        ) : (
          <div className="text-gray-500 text-center py-8">No data yet</div>
        )}
      </div>
    </div>
  );
}
