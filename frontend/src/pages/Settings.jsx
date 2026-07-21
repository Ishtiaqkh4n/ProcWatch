import { useState } from "react";
import { useSettings } from "../hooks/useSettings";
import { useCategories } from "../hooks/useCategories";
import { Slider } from "../components/ui/Slider";
import { Toggle } from "../components/ui/Toggle";
import { Plus, X } from "lucide-react";

export function Settings() {
  const { settings, update } = useSettings();
  const { categories, update: updateCategory, add, remove } = useCategories();
  const [editingApp, setEditingApp] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [newAppName, setNewAppName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [clearConfirm, setClearConfirm] = useState("");
  const [exportFormat, setExportFormat] = useState("json");

  if (!settings || Object.keys(settings).length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const handleExport = async () => {
    if (!window.electronAPI) return;
    await window.electronAPI.exportData(exportFormat);
  };

  const handleClear = async () => {
    if (clearConfirm !== "DELETE" || !window.electronAPI) return;
    await window.electronAPI.clearAllData();
    setClearConfirm("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      {/* Tracking */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Tracking</h2>
        <div className="space-y-6">
          <Slider
            label="Polling Interval"
            value={Number(settings.polling_interval_seconds ?? "5")}
            min={1}
            max={60}
            step={1}
            unit="s"
            onChange={(v) => update({ polling_interval_seconds: String(v) })}
          />

          <Slider
            label="Idle Threshold"
            value={Number(settings.idle_threshold_seconds ?? "90")}
            min={10}
            max={300}
            step={5}
            unit="s"
            onChange={(v) => update({ idle_threshold_seconds: String(v) })}
          />
        </div>
      </section>

      {/* General */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">General</h2>
        <div className="space-y-4">
          <Toggle
            label="Close to Tray"
            checked={settings.close_to_tray === "true"}
            onChange={(v) => update({ close_to_tray: String(v) })}
          />

          <Toggle
            label="Start Minimized"
            checked={settings.start_minimized === "true"}
            onChange={(v) => update({ start_minimized: String(v) })}
          />

          <Toggle
            label="Launch on Login"
            checked={settings.launch_on_login === "true"}
            onChange={async (v) => {
              await update({ launch_on_login: String(v) });
              if (window.electronAPI) {
                await window.electronAPI.setAutoStart(v);
              }
            }}
          />

          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Data Retention</span>
            <select
              value={settings.data_retention_days ?? "never"}
              onChange={(e) => update({ data_retention_days: e.target.value })}
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5"
            >
              <option value="never">Never</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
            </select>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.app_name}
              className="flex items-center justify-between py-1 group"
            >
              <span className="text-gray-300 text-sm">{cat.app_name}</span>
              <div className="flex items-center gap-2">
                {editingApp === cat.app_name ? (
                  <div className="flex gap-2">
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-2 py-1 w-32"
                      autoFocus
                    />

                    <button
                      onClick={async () => {
                        await updateCategory(cat.app_name, editValue);
                        setEditingApp(null);
                      }}
                      className="text-indigo-400 text-sm hover:text-indigo-300"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingApp(null)}
                      className="text-gray-500 text-sm hover:text-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingApp(cat.app_name);
                        setEditValue(cat.category);
                      }}
                      className="text-gray-400 text-sm hover:text-gray-200"
                    >
                      {cat.category}
                    </button>
                    <button
                      onClick={() => remove(cat.app_name)}
                      className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {/* Add new category */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-800 mt-3">
            <input
              value={newAppName}
              onChange={(e) => setNewAppName(e.target.value)}
              placeholder="App name"
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-2 py-1 flex-1"
            />

            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category"
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-2 py-1 flex-1"
            />

            <button
              onClick={async () => {
                if (newAppName.trim() && newCategory.trim()) {
                  await add(newAppName.trim(), newCategory.trim());
                  setNewAppName("");
                  setNewCategory("");
                }
              }}
              disabled={!newAppName.trim() || !newCategory.trim()}
              className="text-indigo-400 hover:text-indigo-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Data */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Data</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
            <button
              onClick={handleExport}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
            >
              Export Data
            </button>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <div className="text-red-400 text-sm font-medium mb-2">
              Danger Zone
            </div>
            <div className="flex items-center gap-3">
              <input
                value={clearConfirm}
                onChange={(e) => setClearConfirm(e.target.value)}
                placeholder='Type "DELETE" to confirm'
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 flex-1"
              />

              <button
                onClick={handleClear}
                disabled={clearConfirm !== "DELETE"}
                className="px-4 py-1.5 bg-red-600/20 text-red-400 text-sm rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-600/30"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
