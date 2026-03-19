# h-y-tale-server.top

Community platform for listing, voting, and managing Hytale game servers. Built with Elysia (Bun) on the backend and SolidJS on the frontend. Features Discord OAuth 2.0 login, a server vote system with in-game reward claiming, real-time server status tracking, and full i18n support (IT/EN).

---

## Stack

### Backend

| Package | Role |
|---|---|
| Elysia + Bun | Web framework and runtime |
| SQLite (bun:sqlite) | Embedded database, zero config |
| Drizzle ORM | Schema management and query builder |
| Typia | Runtime type validation |
| @elysiajs/cors | CORS middleware |

### Frontend

| Package | Role |
|---|---|
| SolidJS 1.9 | Reactive UI framework |
| @solidjs/router | Client-side routing with i18n path groups |
| @solidjs/meta | SEO meta tags and hreflang |
| Tailwind CSS 4 | Utility-first styling |
| Vite 7 | Build tool |
| marked + DOMPurify | Markdown rendering (safe) |

---

## Features

**Discord OAuth 2.0 with PKCE** — Login via Discord. State and code verifier are stored in memory, validated on callback, then exchanged for tokens. Session stored in a `sessions` table, delivered via HttpOnly cookie.

**Server listing and management** — Authenticated users can add, edit, and delete their Hytale servers. Each server has a `secret_key` used to authenticate in-game vote claim requests.

**Vote system** — Players vote for servers. Votes are stored per player name and can be claimed in-game via the `secret_key`. A `.jar` plugin and `.bat` helper scripts are included for server-side integration.

**Real-time server status** — Primary and secondary status endpoints ping registered servers and store online/offline state and player counts in `server_stats` and `server_secondary_status`.

**i18n** — Italian and English routing via `/` (IT) and `/en/` (EN) path groups. Lang context shared via `LangProvider` and `useLang` hook.

**SEO** — `hreflang` alternate links and Open Graph meta tags per page via `@solidjs/meta`.

---

## Project Structure

```
h-y-tale-server.top/
├── hytale-servers-api/          # Elysia backend
│   ├── index.ts                 # entry point, CORS, route registration
│   ├── src/
│   │   ├── storage.ts           # SQLite schema init
│   │   ├── controller/
│   │   │   ├── auth/DiscordAuthController.ts
│   │   │   ├── server/server.routes.ts
│   │   │   ├── server/server-crud.routes.ts
│   │   │   ├── server/server-status.routes.ts
│   │   │   └── vote/VoteController.ts
│   │   ├── repository/          # DB query layer
│   │   ├── helper/              # PKCE utils
│   │   └── types/types.ts
│
├── hytale-front-top/            # SolidJS frontend
│   ├── src/
│   │   ├── App.tsx              # router + i18n layout
│   │   ├── auth/AuthContext.tsx
│   │   ├── pages/               # route pages
│   │   ├── component/           # cards, modals, buttons, template
│   │   ├── services/            # API calls
│   │   ├── lang/l18n.tsx        # translations
│   │   └── tracker/             # server tracker page
│
├── claimVote.bat                # in-game vote claim helper
├── secondaryStatus.bat          # secondary server status ping
└── updaStatus.bat               # primary status update helper
```

---

## Database Schema

| Table | Description |
|---|---|
| `servers` | Registered game servers with IP, port, tags, banner, secret key |
| `votes` | Player votes per server, with claim status |
| `discord_users` | Discord user profiles (upserted on login) |
| `sessions` | HttpOnly session tokens with expiry |
| `server_stats` | Primary online/offline status and player count |
| `server_secondary_status` | Multi-instance secondary status tracking |
| `server_owners` | Many-to-many server ownership (owner role) |

---

## Getting Started

### Backend

```bash
cd hytale-servers-api
bun install
cp .env.example .env
bun run index.ts
```

`.env` variables:

```env
PRODUCTION=false
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://localhost:3000/auth/discord/callback
SCOPES=identify email
FRONTEND_URL=http://localhost:5173
```

Backend runs at: `http://localhost:3000`

### Frontend

```bash
cd hytale-front-top
bun install
bun run dev
```

Frontend runs at: `http://localhost:5173`

---

## API Endpoints

### Auth

| Method | Path | Description |
|---|---|---|
| GET | `/auth/discord/login` | Redirect to Discord OAuth |
| GET | `/auth/discord/callback` | Handle OAuth callback, set session cookie |
| GET | `/auth/me` | Get current authenticated user |
| POST | `/auth/logout` | Invalidate session cookie |

### Servers

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/servers` | List all servers | No |
| GET | `/servers/:id` | Get server details | No |
| POST | `/servers` | Add new server | Yes |
| PUT | `/servers/:id` | Edit server | Yes |
| DELETE | `/servers/:id` | Delete server | Yes |
| GET | `/servers/status` | Get server online status | No |

### Votes

| Method | Path | Description |
|---|---|---|
| POST | `/vote` | Cast a vote for a server |
| POST | `/vote/claim` | Claim vote reward in-game (via secret_key) |

---

## In-Game Integration

A `hytaletopvote.jar` plugin and helper `.bat` scripts are included for integrating the vote system server-side. The flow is:

1. Player votes on the website
2. Server pings `/vote/claim` with the `secret_key` and player name
3. API marks the vote as claimed and the server delivers the reward in-game

---

## License

MIT
