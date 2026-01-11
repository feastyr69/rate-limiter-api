# Rate Limiter (Token Bucket) ⚡️🔧

A small Express-based rate limiter service implementing a token-bucket algorithm using Redis and an atomic Lua script.

---

## Key info ✅

- **Endpoint:** `POST /v1/limit/check`
- **Algorithm:** Token Bucket (Lua script in `redis/scripts/tokenBucket.lua`)
- **Stack:** Node.js + Express + Redis

---

## Features ✨

- Atomic token checks using Redis + Lua
- Simple JSON API to check rate limits by key
- Configurable capacity and refill rate per request

---

## Prerequisites 💡

- Node.js (16+ recommended)
- Redis instance (local or remote)
- Git (optional)

You can run Redis locally via Docker:

```bash
docker run -p 6379:6379 redis:alpine
```

---

## Setup & Run 🔧

1. Clone and install

```bash
git clone <repo-url>
cd rate-limiter/src
npm install
```

2. Create a `.env` in `src/`:

```env
REDIS_URL=redis://localhost:6379
PORT=3000   # optional
```

3. Start the server:

```bash
npm start
# (uses nodemon - for production use `node app.js`)
```

Server listens by default on `http://localhost:3000`.

---

## API Usage 🔁

Endpoint: `POST /v1/limit/check`

Request body:

```json
{
  "key": "user:123",
  "rule": {
    "capacity": 5,
    "refillrate": 1
  }
}
```

- `key`: identifier for rate-limiting (e.g., user id, IP)
- `capacity`: max tokens in bucket
- `refillrate`: tokens added per second

Example curl:

```bash
curl -X POST http://localhost:3000/v1/limit/check \
  -H "Content-Type: application/json" \
  -d '{"key":"user:123","rule":{"capacity":5,"refillrate":1}}'
```

Example responses:

- Allowed:

```json
{ "allowed": true, "remaining": 4 }
```

- Rejected:

```json
{ "allowed": false, "remaining": 0 }
```

Note: `remaining` is the token count after the check (may be fractional depending on refill calculation).

---

## How it works — `tokenBucket.lua` 🧠

- KEYS[1] = bucket key (e.g., `ratelimit:user:123`)
- ARGV[1] = capacity
- ARGV[2] = refill rate (tokens/sec)
- ARGV[3] = current time (seconds)

Behavior:

- Refill tokens based on elapsed time: `delta * refillrate`
- Cap tokens at `capacity`
- Allow the request if `tokens >= 1` (then decrement by 1)
- Save tokens and lastRefill, set key TTL based on capacity/refillrate
- Returns `{allowed (0|1), tokens}`

---

## Notes & Tips 💬

- The Lua script ensures atomic updates and prevents race conditions.
- Tuning: set `capacity` and `refillrate` according to desired rate limits (per-user, per-route, etc.).
- Consider building middleware to integrate checks into existing route handlers.

---

## Development & Contributing 🤝

- Add tests for rate-limiting logic and Lua script behavior.
- Add metrics/monitoring (e.g., Prometheus) to track allowed/rejected counts.
- PRs welcome — keep changes small and documented.

---

## License

MIT
