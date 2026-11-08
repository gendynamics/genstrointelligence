# Deliah Backend

The backend exposes a small HTTP API for the Deliah guide and keeps the Moonshot/Kimi API key off the browser.

## Run locally

```bash
npm run backend:start
```

With no `KIMI_API_KEY`, the endpoint uses the deterministic mock responder. To enable Kimi, export the values from `.env.example` in the server process:

```bash
export KIMI_API_KEY='your-key'
npm run backend:start
```

The frontend expects `http://localhost:4000/api/deliah` by default. Set `REACT_APP_DELIAH_API_URL` when the backend is hosted elsewhere.

## Endpoints

- `GET /health` returns server status and whether the provider is `mock` or `kimi`.
- `POST /api/deliah` accepts `{ "message": "...", "route": "/quantum" }`.

The server limits request bodies to 10 KB, messages to 500 characters, and browser origins to `ALLOWED_ORIGIN`.