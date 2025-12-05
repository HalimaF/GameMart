# 🎮 GameMart

GameMart is a browser-first gaming marketplace and mini-games hub built with React and Vite. It includes a storefront (buy/rent), user roles (buyer, seller, admin), an embeddable mini-games collection, a rewards/XP system, chat, and lightweight analytics.

This README has been refreshed to match the current codebase and developer scripts.

## Quick Overview
- Frontend: React + Vite + MUI
- Backend: Lightweight Express API in `server.js` (used for simple data sync)
- Data: Example JSON files in `src/data/` and localStorage for persistence

## Features
- Store: Browse, add to cart, checkout (demo flow)
- Rentals: Rent games for limited periods
- Mini-games: Embedded iframe games with a host allowlist and deep links
- Rewards: XP and coins earned while playing mini-games
- Roles: Buyer, Seller, Admin with respective dashboards and features
- Chat: Group chat (socket.io)

## Getting Started (Local Development)

Prerequisites
- Node.js (v16+ recommended)
- npm

Install dependencies
```
npm install
```

Start the frontend dev server (Vite)
```
npm run dev
```

Start the backend API (simple Express server)
```
npm run dev:server
```

Open the app in your browser: `http://localhost:5173`

Note: Run the frontend and backend in separate terminals. The frontend uses Vite (port 5173 by default) and the server exposes a small API (port as defined in `server.js`, default 5000).

## Available npm Scripts
- `npm run dev` — start Vite dev server
- `npm run dev:server` — run the local Express API (`server.js`)
- `npm run build` — build production bundle (Vite)
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## Backend API (examples used by the frontend)
- `GET /api/minigames` — list minigames
- `GET /api/users` — list users
- `POST /api/users` — replace users array (used by the app for simple sync)

The server is intentionally minimal and used for demo/admin sync. Most state is stored in localStorage for an offline-friendly demo experience.

## Project Structure (important files)
- `server.js` — small Express server used for demo API endpoints
- `src/data/` — seed JSON data used by the app (`games.json`, `minigames.json`, `users.json`, etc.)
- `src/pages/MiniGame.jsx` — page that embeds mini-games and syncs XP/coins
- `src/components/EmbeddedMiniGame.jsx` — iframe wrapper with sandbox and host allowlist

## Data & LocalStorage Keys
The app persists demo data to localStorage (keys you may see during development):
- `gm:cart`, `gm:orders`, `gm:rental`, `gm:rentals`, `gm:groupchat`, `gm:favorites`, `gm:recent`, `gm:users`, `gm:user`, `mg:favorites`, `gm:minigames`, `theme`, `seller:products`, `admin:products`

## Development Notes
- Mini-games are embedded via iframe and filtered by a host allowlist in `src/pages/MiniGame.jsx`.
- The app periodically polls the demo backend (`/api/minigames`) and will persist admin updates to `localStorage` when available.
- The XP/coins awarding flow is demonstrated in `MiniGame.jsx` (awards every 30s of play and POSTs updated users to `/api/users`).

## Contributing
- Fork the repo, create a branch, make changes, and open a pull request.

## Committing & Pushing (Windows `cmd.exe`)
Run these commands to commit and push the updated README:
```
git add README.md
git commit -m "docs: refresh README to match current codebase"
git push origin main
```

If you use a different default branch or want to create a feature branch, adapt the commands accordingly.

## License
This repository does not include a license file. Add one if you plan to publish or share the code.

---
If you want, I can also open a branch, run linting, or prepare a short contributing guide — tell me which next step you'd like.

