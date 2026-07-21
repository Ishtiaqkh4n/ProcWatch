import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAppDetail } from "../hooks/useAppDetail";
import { SummaryCard } from "../components/ui/SummaryCard";
import { DataTable } from "../components/ui/DataTable";
import { TrendLineChart } from "../components/charts/TrendLineChart";
import { formatDuration, daysAgo, todayDateString } from "../lib/constants";

const RANGE_PRESETS = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "Custom", days: 0 },
];

export function AppDetail() {
  const { appName = "" } = useParams();
  const decodedName = decodeURIComponent(appName);
  const [presetIdx, setPresetIdx] = useState(1);
  const [customStart, setCustomStart] = useState(daysAgo(89));
  const [customEnd, setCustomEnd] = useState(todayDateString());

  const preset = RANGE_PRESETS[presetIdx];
  const presetDays = preset?.days ?? 30;
  const startDate = presetDays > 0 ? daysAgo(presetDays - 1) : customStart;
  const endDate = presetDays > 0 ? daysAgo(0) : customEnd;

  const { detail, loading } = useAppDetail(decodedName, startDate, endDate);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const totalSeconds = detail?.daily.reduce((s, d) => s + d.seconds, 0) ?? 0;
  const dayCount = detail?.daily.length ?? 1;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">{decodedName}</h1>

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
        <SummaryCard label="Total" value={formatDuration(totalSeconds)} />
        <SummaryCard
          label="Avg Daily"
          value={formatDuration(Math.round(totalSeconds / dayCount))}
        />

        <SummaryCard
          label="Window Titles"
          value={String(detail?.titles.length ?? 0)}
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Daily Trend</h2>
        {detail && detail.daily.length > 0 ? (
          <TrendLineChart data={detail.daily} />
        ) : (
          <div className="text-gray-500 text-center py-8">No data</div>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Window Titles</h2>
        {detail && detail.titles.length > 0 ? (
          <DataTable
            headers={["Title", "Time"]}
            rows={detail.titles.map((t) => [
              t.window_title ?? "(untitled)",
              formatDuration(t.seconds),
            ])}
          />
        ) : (
          <div className="text-gray-500 text-center py-8">No data</div>
        )}
      </div>
    </div>
  );
}
