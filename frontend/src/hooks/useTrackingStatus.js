import { useState, useEffect, useCallback } from "react";

export function useTrackingStatus() {
  const [isPaused, setIsPaused] = useState(false);

  const fetch = useCallback(async () => {
    if (!window.electronAPI) return;
    const result = await window.electronAPI.getTrackingStatus();
    if (result.success && result.data) {
      setIsPaused(result.data.isPaused);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const toggle = async () => {
    if (!window.electronAPI) return;
    try {
      if (isPaused) {
        const result = await window.electronAPI.resumeTracking();
        if (result.success) setIsPaused(false);
      } else {
        const result = await window.electronAPI.pauseTracking();
        if (result.success) setIsPaused(true);
      }
    } catch {
      // IPC failed — don't update local state
    }
  };

  return { isPaused, toggle, refetch: fetch };
}
