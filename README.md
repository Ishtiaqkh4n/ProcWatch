# Screen Time Tracker

A fully offline desktop app for Linux that tracks how much time you spend in each application. Built with Electron and React.

## Features

- Track active window time in real-time
- View daily, weekly, and monthly usage summaries
- Interactive charts and statistics per application
- Works completely offline — no data leaves your machine
- Lightweight SQLite database for local storage

## Tech Stack

- **Desktop shell:** Electron (main process in `backend/`)
- **Frontend:** React + Vite + Tailwind CSS + Recharts
- **Local database:** better-sqlite3
- **Window detection:** active-win

## Getting Started

### Prerequisites

- Node.js 18+
- Linux (x64)
- npm

### Install dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Development

```bash
npm run dev
```

This starts the Electron app with the frontend dev server.

### Build the frontend

```bash
npm run build
```

### Package the app

```bash
npm run pack    # Build into release/ without full installer
npm run dist    # Build AppImage and deb packages
```

## Project Structure

```
.
├── backend/           # Electron main process and tracker engine
│   └── src/
├── frontend/          # React user interface
│   └── src/
├── package.json       # Root workspace scripts and Electron Builder config
└── README.md
```

## License

This project is open source. Choose a license and add it to `LICENSE`.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## Privacy

All data is stored locally on your device. No telemetry or analytics are collected.
