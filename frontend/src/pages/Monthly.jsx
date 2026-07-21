import { useMemo, useState } from "react";
import { useRangeData } from "../hooks/useRangeData";
import { SummaryCard } from "../components/ui/SummaryCard";
import { formatDuration, daysAgo, todayDateString } from "../lib/constants";

const RANGE_PRESETS = [
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
  { label: "Custom", days: 0 },
];

export function Monthly() {
  const [presetIdx, setPresetIdx] = useState(1);
  const [customStart, setCustomStart] = useState(daysAgo(89));
  const [customEnd, setCustomEnd] = useState(todayDateString());

  const presetDays = RANGE_PRESETS[presetIdx]?.days ?? 30;
  const startDate = presetDays > 0 ? daysAgo(presetDays - 1) : customStart;
  const endDate = presetDays > 0 ? daysAgo(0) : customEnd;

  const { usage, loading } = useRangeData(startDate, endDate);

  const { heatmapData, maxSeconds, totalSeconds, dayCount } = useMemo(() => {
    const dayMap = new Map();
    let total = 0;
    for (const row of usage) {
      const prev = dayMap.get(row.date) ?? 0;
      dayMap.set(row.date, prev + row.seconds);
      total += row.seconds;
    }

    let max = 0;
    for (const secs of dayMap.values()) {
      if (secs > max) max = secs;
    }

    const start = new Date(startDate + "T12:00:00");
    const end = new Date(endDate + "T12:00:00");
    const days = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const secs = dayMap.get(ds) ?? 0;
      days.push({
        date: ds,
        seconds: secs,
        dayOfWeek: d.getDay(),
        label: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
      });
    }

    return {
      heatmapData: days,
      maxSeconds: max,
      totalSeconds: total,
      dayCount: days.length,
    };
  }, [usage, startDate, endDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Monthly</h1>

      {/* Range picker */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {RANGE_PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setPresetIdx(i)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              i === presetIdx
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700"
            }`}
          >
            {p.label}
          </button>
        ))}
        {presetIdx === 3 && (
          <div className="flex items-center gap-2 ml-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
            />

            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <SummaryCard
          label="Total Active Time"
          value={formatDuration(totalSeconds)}
        />
        <SummaryCard
          label="Avg Daily"
          value={formatDuration(
            Math.round(totalSeconds / Math.max(dayCount, 1)),
          )}
        />
        <SummaryCard label="Days Tracked" value={String(dayCount)} />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Activity Heatmap
        </h2>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-xs text-gray-500">
              {d}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="grid grid-cols-7 gap-1">
          {heatmapData.length > 0 &&
            Array.from({ length: heatmapData[0].dayOfWeek }, (_, i) => (
              <div key={`offset-${i}`} className="aspect-square rounded-sm" />
            ))}
          {heatmapData.map((day) => {
            const intensity = maxSeconds > 0 ? day.seconds / maxSeconds : 0;
            const level =
              day.seconds === 0
                ? 0
                : intensity < 0.25
                  ? 1
                  : intensity < 0.5
                    ? 2
                    : intensity < 0.75
                      ? 3
                      : 4;
            const bgClass = [
              "bg-gray-800/50",
              "bg-indigo-900",
              "bg-indigo-700",
              "bg-indigo-500",
              "bg-indigo-400",
            ][level];

            return (
              <div
                key={day.date}
                className={`aspect-square rounded-sm flex items-center justify-center text-xs ${bgClass} hover:ring-1 hover:ring-gray-500 transition-all cursor-default`}
                title={`${day.label}: ${formatDuration(day.seconds)}`}
              >
                <span className={level >= 2 ? "text-white" : "text-gray-600"}>
                  {new Date(day.date + "T12:00:00").getDate()}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
          <span>Less</span>
          {[
            "bg-gray-800/50",
            "bg-indigo-900",
            "bg-indigo-700",
            "bg-indigo-500",
            "bg-indigo-400",
          ].map((cls, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${cls}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
