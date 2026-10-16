# Deploying to a CloudPanel Node.js site (staging)

For a site created as CloudPanel's **Node.js Site** type (e.g. `sbx.swasthgram.org`), where CloudPanel
proxies the *whole* domain to one Node process on the assigned App Port. This one process serves both
the built frontend and the `/api/*` routes (see `backend/server.js`).

The repo has separate `frontend/` and `backend/` folders, but the **deployed** layout is flatter: the
frontend's build output (`frontend/dist/`) is placed at the deployed root's `dist/`, as a sibling of
`backend/` — `scripts/deploy-staging.ps1` handles this automatically.

## Quick redeploy (after the one-time setup below)

Once `backend/.env` exists on the server and your local SSH key is authorized there (one-time, see your
terminal history or ask for the command again), every future update is just:

```powershell
.\scripts\deploy-staging.ps1              # rebuild frontend + redeploy everything
.\scripts\deploy-staging.ps1 -BackendOnly # skip the frontend build, just push backend code changes
```

This builds (unless `-BackendOnly`), packages the needed files, uploads over `scp`, and on the server
runs `npm install` and restarts the app under PM2 (so it survives SSH disconnects). It never touches
`backend/.env` or `node_modules` on the server.

The steps below are the one-time manual setup this script assumes is already done (database, initial
`.env`, etc.) — not something you repeat on every deploy.

## 1. Build the frontend locally

```bash
npm run build   # produces frontend/dist/
```

## 2. Upload to the site's Root Directory

Upload these to `/home/<site-user>/htdocs/<domain>/` (e.g. `/home/swasthgram-sbx/htdocs/sbx.swasthgram.org/`),
keeping the same relative layout as in git:

```
<root>/
  package.json
  package-lock.json
  dist/            ← from step 1
  backend/
    server.js
    package.json
    package-lock.json
    schema.sql
    .env.example
```

Do **not** upload `node_modules/` from either side — CloudPanel runs `npm install` on deploy, which
(via the root `postinstall` script) also installs `backend/`'s own dependencies.

Do **not** commit or upload `backend/.env` through git — create it directly on the server (next step).

## 3. Create `backend/.env` directly on the server

Via File Manager or SFTP, create `backend/.env` on the server (copy `backend/.env.example` as a starting
point) with the **staging-specific** values:

```
PORT=3010
APP_URL=https://sbx.swasthgram.org

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=<created in step 4>
DB_PASSWORD=<created in step 4>
DB_NAME=<created in step 4>

STRIPE_PUBLISHABLE_KEY=<test key, not live>
STRIPE_SECRET_KEY=<test key, not live>
RAZORPAY_KEY_ID=<test key, not live>
RAZORPAY_KEY_SECRET=<test key, not live>

ZEPTOMAIL_USER=
ZEPTOMAIL_TOKEN=
ZEPTOMAIL_FROM_EMAIL=
ZEPTOMAIL_FROM_NAME=
ZEPTOMAIL_HOST=
PARTNER_NOTIFY_EMAILS=
```

## 4. Create the database

In the site's **Databases** tab: Add Database (name + user + password, your choice — keep a note of them
for step 3). Then use the phpMyAdmin/Adminer link next to it to **Import** `backend/schema.sql`.

## 5. Start / restart the app

CloudPanel should auto-run `npm install && npm start` on deploy. If there's a restart control in the
site's Node.js settings, use it to pick up the new `.env` or any re-uploaded files.

## 6. Verify

- `https://sbx.swasthgram.org/` → the React site should load.
- `https://sbx.swasthgram.org/api/health` → `{"status":"ok","db":"connected",...}` (if `db` says
  `"disconnected"`, double-check the `DB_*` values in `backend/.env`).
