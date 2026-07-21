export const CHART_COLORS = [
  "#4C78A8",
  "#F58518",
  "#E45756",
  "#72B7B2",
  "#54A24B",
  "#EECA3B",
  "#B279A2",
  "#FF9DA6",
  "#9D755D",
  "#BAB0AC",
];

export function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function formatYAxis(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h${minutes > 0 ? minutes + "m" : ""}`;
  return `${minutes}m`;
}

function toLocalDateString(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayDateString() {
  return toLocalDateString(new Date());
}

export function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toLocalDateString(d);
}
