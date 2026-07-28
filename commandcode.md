# SaaS Strategy & Feature Roadmap

> Generated from product review of Screen Time Tracker / ProcWatch

---

## 1. Current Product Snapshot

- **Product name(s):** Screen Time Tracker / ProcWatch
- **What it does:** Fully offline desktop app for Linux (X11) that tracks active window/app usage, stores data locally in SQLite, and visualizes it through a React dashboard.
- **Core value props:**
  - 100% offline, no accounts, no telemetry
  - Privacy-first screen-time tracking
  - Lightweight background tracker with system tray
  - Today / Weekly / Monthly dashboard views
  - App categorization, idle detection, data export
- **Tech stack:** Electron + React + Vite + Tailwind + Recharts + better-sqlite3 + active-win

---

## 2. Strategic Assessment

### The SaaS Tension

Your product is currently positioned as **anti-SaaS** — no cloud, no accounts, no data leaving the device. That is its key differentiator. To become a great SaaS, you must add **optional, user-controlled, privacy-preserving online value** rather than abandon the privacy promise.

### Two Paths Forward

| Path | Model | Pros | Cons |
|------|-------|------|------|
| **Premium Offline App** | One-time purchase / donation | True to privacy vision | Limited revenue, no recurring, single-device |
| **Privacy-First SaaS** | Freemium local core + paid encrypted cloud features | Recurring revenue, cross-device, team/AI expansion | Requires cloud infrastructure, security overhead |

**Recommended path:** Privacy-first SaaS. Keep the offline core free/open-source as trust leverage, then charge for encrypted sync, advanced insights, team features, and cross-platform clients.

---

## 3. Market Potential

### Strengths
- Strong niche in privacy-conscious productivity tracking
- Clear differentiation vs. RescueTime, Toggl, Clockify
- No account friction; users can try instantly
- Lightweight and fast compared to bloated alternatives

### Current Limitations
- Tiny addressable market: Linux X11 only
- Single device, no cross-device story
- No recurring revenue model
- No defensibility or network effects
- Competes with free/open-source alternatives (ActivityWatch, self-hosted tools)

### Biggest Opportunity
Become the **privacy-respecting RescueTime** for developers, freelancers, and remote teams.

**Target expansion:**
- **B2C:** Developers, freelancers, students, digital wellness users
- **B2B:** Privacy-conscious remote teams, agencies, consultancies

---

## 4. 10 Features That Would Make It Rock

### 1. Cross-Platform Tracking
Support Windows, macOS, and Wayland (via compositor-specific hooks). Expands total addressable market roughly 10x and makes the product viable as a real RescueTime competitor.

### 2. End-to-End Encrypted Cloud Sync
Optional sync across devices with user-held encryption keys. The server sees only encrypted blobs; the product keeps its "we can't see your data" promise while enabling multi-device usage.

### 3. Browser Extension
Per-tab and per-URL tracking inside Chrome, Firefox, Edge, and Safari. Categorize sites (e.g., YouTube, GitHub, Linear, docs) and break "Browser" into meaningful segments.

### 4. Focus Sessions + Distraction Blocking
Built-in Pomodoro/deep-work sessions. Optionally block distracting apps or sites during focus time. Bridges tracking with behavior change.

### 5. AI Productivity Insights
Local-first or privacy-preserving cloud analysis that surfaces patterns:
- "Your peak coding hours are 9am–11am"
- "Slack interrupts your focus 3x per day on average"
- "You spend 40% more time in meetings on Tuesdays"

### 6. Automatic Project / Client Tagging
Infer work context from:
- Window titles
- IDE project paths / Git repo names
- Browser tabs (Jira, Linear, GitHub issues)
- File paths

Enable automatic billable vs. non-billable classification and time-sheet export.

### 7. Calendar / Time-Blocking Integration
Connect to Google Calendar, Outlook, or CalDAV. Compare planned time blocks against actual usage. Surface calendar-vs-reality analytics.

### 8. Team Dashboards with Anonymized Aggregates
For remote teams: aggregate focus hours, app-category trends, meeting load, and burnout signals. No individual surveillance — only team-level patterns.

### 9. Goals, Streaks, and Weekly Reports
Personal productivity OKRs:
- "≤1 hour social media per day"
- "≥4 hours deep work per day"
- Weekly email / Slack summaries with streaks and progress

### 10. Public API + Integrations
Allow users to:
- Export time entries to Toggl, Clockify, Harvest
- Trigger Zapier / Make automations
- Build custom dashboards
- Connect to project management tools (Jira, Linear, Asana, GitHub)

---

## 5. Suggested Freemium / Pricing Tier

| Tier | Includes |
|------|----------|
| **Free** | Local tracking, today/weekly/monthly views, basic categories, CSV/JSON export |
| **Pro** | Encrypted cross-device sync, AI insights, focus sessions, goals & reports, project auto-tagging, API access |
| **Team** | Team dashboards, anonymized aggregates, shared goals, admin controls, SSO |

---

## 6. Brand Promise to Preserve

> *Your data is yours. We can't see it, we don't want it, and we design every feature so that remains true.*

Any SaaS move must reinforce this promise, not weaken it. Encrypted-by-default, zero-knowledge architecture, and open-source core are the trust moat.

---

## 7. Quick-Win Implementation Order

1. **Browser extension** — highest insight value, lowest infrastructure cost
2. **Goals + streaks** — improves retention without cloud
3. **Focus sessions / blocking** — moves from tracker to productivity tool
4. **Cross-platform (macOS/Windows)** — unlocks market expansion
5. **Encrypted sync** — enables Pro tier and recurring revenue
6. **AI insights** — premium differentiator once data volume exists
7. **Team features** — B2B expansion after individual product is solid

---

*Document version: 1.0*
