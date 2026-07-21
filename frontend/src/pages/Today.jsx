import { useTodayData } from "../hooks/useTodayData";
import { SummaryCard } from "../components/ui/SummaryCard";
import { AppBarChart } from "../components/charts/AppBarChart";
import { AppUsageList } from "../components/dashboard/AppUsageList";
import { formatDuration } from "../lib/constants";

export function Today() {
  const { usage, totalActiveSeconds, idleSeconds, loading } = useTodayData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (usage.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-2xl text-gray-300">Tracking started!</div>
        <div className="text-gray-500">
          Check back in a bit to see your usage.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Today</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <SummaryCard
          label="Active Time"
          value={formatDuration(totalActiveSeconds)}
        />

        <SummaryCard label="Idle Time" value={formatDuration(idleSeconds)} />

        <SummaryCard
          label="Top App"
          value={usage[0]?.app_name ?? "—"}
          sub={usage[0] ? formatDuration(usage[0].seconds) : undefined}
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Time per App</h2>
        <AppBarChart data={usage} />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Breakdown</h2>
        <AppUsageList data={usage} totalSeconds={totalActiveSeconds} />
      </div>
    </div>
  );
}
