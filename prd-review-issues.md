# PRD Review Issues — Screen Time Tracker

**Reviewed:** July 11, 2026  
**PRD version:** 1.0

---

## Ship-Blockers (fix before writing code)

1. **`active-win` reliability unvalidated across Linux DEs** — The entire app depends on `active-win` returning consistent results on GNOME, KDE, and XFCE. This must be spiked before Milestone 1. If it's unreliable, the tracking architecture needs rethinking.

2. **Sleep/wake creates phantom duration** — If a session is open when the machine suspends, `end_time` is the last poll before sleep. On wake, a new session starts. The gap is silently lost. The PRD mentions `powerMonitor` suspend/resume events but never specifies that you must **close the current session on suspend** and **open a new one on resume**. Without this, sessions spanning sleep periods get inflated durations.

3. **`active-win` returning null not handled** — When no window is focused (e.g., user clicks the desktop), `active-win` can return `null`/`undefined`. The merge logic pseudocode doesn't handle this case — it would crash or create a session with `app_name: null`.

4. **No schema migration strategy** — The PRD has no mention of how to handle DB schema changes. When v1.1 adds a column, there's no migration runner. Need a `schema_version` table and migration system from day one.

5. **`start_minimized = 'true'` contradicts first-run onboarding** — Default settings say `start_minimized = 'true'`, but FR-14 says show onboarding on first launch. If the app starts minimized to tray on first run, the user never sees onboarding. Need a `first_run_complete` flag that overrides `start_minimized`.

---

## Development Bugs (will hit during build, plan for them)

6. **Idle sessions never get `end_time` updated** — The pseudocode says "extend on close" for idle sessions, but `end_time` is only set when a new session opens. If the app crashes during an idle period, that idle session row has a stale `end_time`. Must update `end_time` on every poll tick while idle, or accept crash = lost idle duration.

7. **No error shape in the IPC contract** — Every channel returns `{ success: boolean }` on failure with no error message or code. When `usage:getRange` fails, the renderer just knows `success: false` — useless for debugging or user-facing error messages. Add `error?: { code: string, message: string }`.

8. **No pagination on data queries** — `usage:getRange` for a year of data returns everything in one shot. Heavy users could produce 180K+ rows over IPC, freezing the renderer. Add `limit`/`offset` or aggregate on the main process side before sending.

9. **SQLite WAL mode not specified** — Default journal mode is `DELETE`, which is slower for concurrent reads. Since the renderer queries while the main process writes, enabling `PRAGMA journal_mode=WAL;` prevents read/write contention.

10. **Browser tab switching creates session explosion** — Switching tabs in Firefox every 10 seconds creates a new session row per tab (different `window_title`, same `app_name`). The "50 session-switches/day" storage estimate is wildly optimistic — 200-500/day is more realistic for browser-heavy users. Still small in absolute terms, but the estimate is misleading.

11. **Rapid window switching is invisible** — 5-second poll interval means any app usage under 5 seconds is completely missed. Alt-tabbing to check a notification and switching back in 3 seconds leaves no record. The PRD should be honest: this is sampling, not tracking.

12. **Reading/video watching marked as idle** — 90-second idle threshold means reading a long article, watching a video without mouse movement, or staring at code while thinking gets marked as idle. This is an unsolvable problem with input-based detection, but it should be documented as a known limitation.

13. **Screen lock vs. idle treated the same** — A locked screen with idle time under 90 seconds still shows as "active." Should listen for `powerMonitor` lock/unlock events explicitly rather than relying solely on idle time.

14. **"Today" view doesn't handle midnight rollover** — If the dashboard is open and it passes midnight, the "today" data becomes stale. Needs periodic refresh or a date-change listener. Not mentioned anywhere in the PRD.

15. **`electron-vite` + `better-sqlite3` native module config** — `electron-vite` with native modules requires specific config to exclude `better-sqlite3` from Vite bundling and load it via `require`. This is a common footgun that costs hours. Document the exact config needed.

16. **Export blocks the main process** — `data:export` reads the entire DB and writes to disk on the main process. For a large dataset, this blocks the event loop and pauses tracking during export. Either stream the export or use a worker thread.

17. **DST transition and daily aggregation** — A session spanning a DST fall-back (1:30 AM → 1:30 AM again) could be double-counted or misattributed. The aggregation query needs to handle the ambiguous local time window explicitly.

18. **`setInterval` drift accumulates error** — `setInterval` doesn't guarantee exact timing — it drifts under load. Over a day, 5-second intervals could drift by minutes. Duration calculations should use actual timestamps, not `interval * ticks`.

---

## Polish / Hardening (matters for production, not MVP-blocking)

19. **App name inconsistency across distros** — Default category mappings use `firefox`, `chromium`, `code` — but process names differ: `firefox-esr` on Debian, `google-chrome-stable` on Ubuntu, `codium` for VSCodium, `code-oss` for OSS builds. Consider matching by substring or a broader alias map.

20. **Wayland warning but no graceful degradation** — PRD says show a warning on Wayland but "still allow the app to run." Run doing what? If `active-win` can't get the active window, the tracker throws on every poll or returns nothing. Need a specific degradation mode: "idle detection still works, window tracking disabled."

21. **AppImage path instability breaks auto-start** — If the user moves or renames the AppImage, the `Exec=` path in `~/.config/autostart/` becomes stale and auto-start silently breaks. The `.deb` install is fine. Document this or handle it.

22. **DB file deleted while app is running** — If the user or a cleanup tool deletes `data.sqlite` while the app runs, `better-sqlite3` throws on the next write. PRD mentions corrupted DB handling but not deleted DB. Need to detect and either recreate or show an error.

23. **No log rotation** — Section 7.2 says log failures to `~/.config/screen-time-app/logs/` but no mention of rotation. Over months of running, this file grows unbounded. Add a size cap or rotation strategy.

24. **No confirmation safeguard on `data:clearAll` IPC** — The UI shows a confirmation dialog, but the IPC handler itself has no safeguard. Any renderer-side code (or devtools) could call `data:clearAll` directly. Add a confirmation token pattern or at least log the action.

25. **`close_to_tray` on Linux is DE-dependent** — Not all Linux desktop environments handle tray minimize the same way. Minimal WMs (i3, bspwm) don't have a system tray at all. App should detect this and fall back to standard minimize/quit behavior.

26. **Calendar heatmap with recharts** — Recharts doesn't have a built-in calendar heatmap component. The PRD lists it for the monthly view but you'll need to build a custom component or use a library like `react-calendar-heatmap`. This is non-trivial UI work not accounted for in the milestones.

---

## What the PRD Gets Right

- Offline-first, no telemetry — correct stance for a privacy tool
- Single DB writer in main process — avoids SQLite concurrency issues
- Session merge instead of storing every tick — keeps DB small
- `contextIsolation: true`, `nodeIntegration: false` — proper Electron security
- `app.requestSingleInstanceLock()` — prevents duplicate tracking processes
- Observation-only v1 — no blocking/enforcement keeps scope tight
- UTC storage with local display — correct timestamp approach
