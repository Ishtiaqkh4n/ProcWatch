import { useNavigate } from "react-router-dom";
import { CHART_COLORS, formatDuration } from "../../lib/constants";

export function AppUsageList({ data, totalSeconds }) {
  const navigate = useNavigate();

  if (data.length === 0) return null;

  return (
    <div className="space-y-2">
      {data.map((item, index) => {
        const pct = totalSeconds > 0 ? (item.seconds / totalSeconds) * 100 : 0;
        return (
          <div
            key={item.app_name}
            onClick={() =>
              navigate(`/app/${encodeURIComponent(item.app_name)}`)
            }
            className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{
                backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
              }}
            >
              {item.app_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">
                {item.app_name}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                  }}
                />
              </div>
            </div>
            <div className="text-gray-400 text-sm tabular-nums shrink-0">
              {formatDuration(item.seconds)}
            </div>
            <div className="text-gray-500 text-xs w-12 text-right tabular-nums shrink-0">
              {pct.toFixed(0)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
