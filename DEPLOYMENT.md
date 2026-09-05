# VPS Deployment Guide: MERN Stack with Existing Traefik

This guide explains how to deploy this MERN application (React + Express + MongoDB) to connect directly with your **existing Traefik reverse proxy** already running in Docker on your VPS.

---

## Architecture Overview

```
Internet (HTTP: 80 / HTTPS: 443)
              │
              ▼
   ┌──────────────────────┐
   │ Existing Traefik VPS │  (Handles SSL & Reverse Proxy)
   └──────────┬───────────┘
              │ (External Docker Network: e.g. traefik-network)
    ┌─────────┴─────────────────────────┐
    │ PathPrefix(`/api`)                 │ PathPrefix(`/`)
    ▼                                   ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│   mern-server (Express) │    │   mern-client (Nginx)   │
│   Port: 4500            │    │   Port: 80              │
│   (node:22-alpine)      │    │   (Built w/ Node 22)    │
└────────────┬────────────┘    └─────────────────────────┘
             │ (Internal Network: mern-internal)
             ▼
┌─────────────────────────┐
│   mern-mongo (MongoDB)  │
│   Internal Port: 27017  │
└─────────────────────────┘
```

- **Single Domain Routing**: Both frontend and backend share your domain. Traefik directs `/api/*` to the Express backend and everything else to the React/Nginx frontend.
- **Node 22 Alpine**: Frontend builder and Express backend run on Node 22 Alpine images.
- **Isolated Database**: MongoDB runs in a private bridge network (`mern-internal`) inaccessible to the public internet.

---

## 1. Check Your Existing Traefik Configuration

On your VPS, check the name of the Docker network your Traefik container is attached to:

```bash
docker network ls
# or inspect your Traefik container:
docker inspect <TRAEFIK_CONTAINER_NAME> --format '{{json .NetworkSettings.Networks}}'
```

Common network names:
- `traefik-network`
- `proxy`
- `web`
- `traefik_default`

Also check the name of your ACME certificate resolver defined in your Traefik configuration (e.g. `--certificatesresolvers.<NAME>.acme...`).
Common names:
- `myresolver`
- `letsencrypt`
- `le`
- `default`

---

## 2. Deploy the Project to Your VPS

### Step 1: Clone or Copy the Repository
```bash
git clone <YOUR_GIT_REPO_URL> /opt/mern-app
cd /opt/mern-app
```

### Step 2: Configure Environment Variables
Open the `.env` file:
```bash
nano .env
```

Set the values matching your VPS and existing Traefik setup:
```env
# Your domain (e.g. example.com or app.example.com)
# When testing locally or without a domain, keep as localhost or your VPS IP
DOMAIN=example.com

# The network name your existing Traefik uses
TRAEFIK_NETWORK=traefik-network

# The certresolver name configured in your existing Traefik
TRAEFIK_CERTRESOLVER=myresolver

# MongoDB URI (default points to internal container)
MONGODB_URI=mongodb://mongo:27017/mernapp
```

### Step 3: Build and Start Containers
```bash
docker compose up -d --build
```

### Step 4: Verify the Deployment
Check the running containers:
```bash
docker compose ps
```
You should see:
- `mern-client` (Up)
- `mern-server` (Up)
- `mern-mongo` (Up)

Check container logs:
```bash
docker compose logs -f server
docker compose logs -f client
```

Check your existing Traefik dashboard or logs:
```bash
docker logs <TRAEFIK_CONTAINER_NAME>
```
Traefik will detect the new Docker labels, automatically route your domain, and issue the SSL certificate for your routers.

---

## 3. Maintenance & Updates

### Deploy New Code
```bash
git pull origin main
docker compose up -d --build
```

### Restart Services
```bash
docker compose restart
```

### Stop Services
```bash
docker compose down
```
*(MongoDB data is safely preserved in the persistent `mongo-data` volume).*
