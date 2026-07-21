import { useState, useEffect, useCallback } from "react";

export function useAppDetail(appName, startDate, endDate) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!window.electronAPI) return;
    const result = await window.electronAPI.getAppDetail(
      appName,
      startDate,
      endDate,
    );
    if (result.success && result.data) {
      setDetail(result.data);
    }
    setLoading(false);
  }, [appName, startDate, endDate]);

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, 30000);
    return () => clearInterval(id);
  }, [fetch]);

  return { detail, loading, refetch: fetch };
}
