# ⚽ African Strikers Football Club

Official website for African Strikers FC — a premier football club competing in the **Around Da Hours (ADH) Super League** in Brooklyn Park, Minnesota.

> **Where Unity Comes First** · Est. 2020

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS v4 + Motion
- **Backend**: Express.js + SQLite (better-sqlite3)
- **Email**: Nodemailer (SMTP)
- **Styling**: Glassmorphism dark theme with 3D tilt effects

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run in development (frontend + backend)
npm run dev:full

# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
```

## 📁 Project Structure

```
├── src/                    # React frontend
│   ├── pages/              # Page components
│   │   ├── Home.tsx         # Landing page
│   │   ├── About.tsx        # Club history
│   │   ├── Team.tsx         # Roster + leadership
│   │   ├── Fixtures.tsx     # Standings & schedule
│   │   ├── Gallery.tsx      # Photo gallery
│   │   ├── News.tsx         # Articles
│   │   ├── Contact.tsx      # Contact form
│   │   ├── Join.tsx         # Join application
│   │   └── Admin.tsx        # Admin dashboard
│   ├── layouts/             # Layout components
│   ├── components/          # Reusable components
│   └── lib/                 # Utilities
├── server/                 # Express backend
│   ├── server.ts            # Entry point
│   ├── db.ts                # SQLite schema + seeds
│   ├── email.ts             # Email templates
│   ├── middleware/           # Auth middleware
│   └── routes/              # API route modules
├── public/                 # Static assets
└── Dockerfile              # Container deployment
```

## 🔐 Admin Dashboard

Access the admin panel at `/admin`.

**Default credentials:**
- Username: `admin`
- Password: `strikers2026`

> ⚠️ Change the password after first login via Settings.

**Features:**
- Player management (CRUD)
- Fixture management
- News articles
- Contact form submissions
- Join applications (with welcome emails)
- Staff & leadership management

## 🌐 Deployment

### Railway (Recommended)

1. Push to GitHub
2. Connect repo to [Railway](https://railway.app)
3. Set environment variables (see `.env.example`)
4. Railway auto-detects the Dockerfile and deploys

### Environment Variables

See [`.env.example`](.env.example) for all available configuration.

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | Yes | Set to `production` |
| `SITE_URL` | Yes | Your domain URL |
| `CORS_ORIGIN` | Yes | Allowed CORS origins |
| `SMTP_HOST` | For email | SMTP server host |
| `SMTP_PORT` | For email | SMTP port |
| `SMTP_USER` | For email | SMTP username |
| `SMTP_PASS` | For email | SMTP password |
| `SMTP_FROM` | For email | Sender email address |
| `ADMIN_USER` | No | Initial admin username |
| `ADMIN_PASS` | No | Initial admin password |

## 📜 License

Apache-2.0
