import { useState, useEffect, useCallback } from "react";

export function useRangeData(startDate, endDate, refreshMs = 60000) {
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!window.electronAPI) return;
    const result = await window.electronAPI.getRange(startDate, endDate);
    if (result.success && result.data) {
      setUsage(result.data);
    }
    setLoading(false);
  }, [startDate, endDate]);

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, refreshMs);
    return () => clearInterval(id);
  }, [fetch, refreshMs]);

  return { usage, loading, refetch: fetch };
}
