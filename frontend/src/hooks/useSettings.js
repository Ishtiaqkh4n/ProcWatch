import { useState, useEffect, useCallback } from "react";

export function useSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!window.electronAPI) return;
    const result = await window.electronAPI.getSettings();
    if (result.success && result.data) {
      setSettings(result.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const update = async (updates) => {
    if (!window.electronAPI) return;
    const result = await window.electronAPI.updateSettings(updates);
    if (result.success) {
      setSettings((prev) => ({ ...prev, ...updates }));
    }
  };

  return { settings, loading, update, refetch: fetch };
}
