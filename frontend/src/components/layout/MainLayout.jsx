import { NavLink, Outlet } from "react-router-dom";
import {
  Clock,
  Calendar,
  CalendarDays,
  Settings,
  Pause,
  Play,
  AlertTriangle,
} from "lucide-react";
import { useTrackingStatus } from "../../hooks/useTrackingStatus";
import { useState, useEffect } from "react";

const navItems = [
  { to: "/today", label: "Today", icon: Clock },
  { to: "/weekly", label: "Week", icon: Calendar },
  { to: "/monthly", label: "Month", icon: CalendarDays },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function MainLayout() {
  const { isPaused, toggle } = useTrackingStatus();
  const [trackerReady, setTrackerReady] = useState(true);
  const [isWayland, setIsWayland] = useState(false);

  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.isTrackerReady().then((result) => {
      if (result.success && result.data) {
        setTrackerReady(result.data.ready);
      }
    });
    window.electronAPI.checkDeps().then((result) => {
      if (result.success && result.data) {
        setIsWayland(result.data.isWayland);
      }
    });
  }, []);

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-lg font-bold text-white">Screen Time</h1>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <button
            onClick={toggle}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isPaused
                ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                : "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30"
            }`}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {!trackerReady && (
          <div className="bg-yellow-900/30 border-b border-yellow-700/50 px-4 py-2 flex items-center gap-2 text-yellow-300 text-sm">
            <AlertTriangle size={16} />
            Tracking is unavailable — active-win module failed to load. Window detection requires X11 and xdotool.
          </div>
        )}
        {trackerReady && isWayland && (
          <div className="bg-yellow-900/30 border-b border-yellow-700/50 px-4 py-2 flex items-center gap-2 text-yellow-300 text-sm">
            <AlertTriangle size={16} />
            Wayland session detected. Active window tracking is unavailable due to Wayland security restrictions; only idle tracking is active.
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
