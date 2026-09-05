# MERN Stack Application

A modern MERN application featuring React 18 + Vite + TailwindCSS on the frontend, Express.js with MongoDB on the backend, and Docker Compose orchestration configured to integrate with an existing **Traefik** reverse proxy on your VPS.

## Project Structure

```
├── client/                 # React (Vite, TailwindCSS, TypeScript)
│   ├── Dockerfile          # Multi-stage production build (Node 22 Alpine + Nginx)
│   ├── nginx.conf          # Custom Nginx SPA configuration
│   └── src/                # Frontend source code
├── server/                 # Express.js backend
│   ├── Dockerfile          # Production container (Node 22 Alpine)
│   └── src/                # API routes & database connections
├── docker-compose.yml      # Orchestration for Client, Server, and MongoDB
├── .env.example            # Environment variables template
└── DEPLOYMENT.md           # Step-by-step VPS deployment guide
```

## Quick Start (VPS Deployment with Existing Traefik)

Follow the complete step-by-step instructions in [DEPLOYMENT.md](./DEPLOYMENT.md):

1. Set your `DOMAIN`, `TRAEFIK_NETWORK`, and `TRAEFIK_CERTRESOLVER` in `.env`.
2. Run `docker compose up -d --build`.

## Local Development (Without Docker)

### Server
```bash
cd server
npm install
npm run dev
```

### Client
```bash
cd client
npm install
npm run dev
```
