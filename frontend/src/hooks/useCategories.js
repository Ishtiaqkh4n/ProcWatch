import { useState, useEffect, useCallback } from "react";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!window.electronAPI) return;
    const result = await window.electronAPI.listCategories();
    if (result.success && result.data) {
      setCategories(result.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const update = async (appName, category) => {
    if (!window.electronAPI) return;
    const result = await window.electronAPI.updateCategory(appName, category);
    if (result.success) {
      setCategories((prev) =>
        prev.map((c) => (c.app_name === appName ? { ...c, category } : c)),
      );
    }
  };

  const add = async (appName, category) => {
    if (!window.electronAPI) return;
    const result = await window.electronAPI.updateCategory(appName, category);
    if (result.success) {
      setCategories((prev) => [...prev, { app_name: appName, category }]);
    }
  };

  const remove = async (appName) => {
    if (!window.electronAPI) return;
    const result = await window.electronAPI.removeCategory(appName);
    if (result.success) {
      setCategories((prev) => prev.filter((c) => c.app_name !== appName));
    }
  };

  return { categories, loading, update, add, remove, refetch: fetch };
}
