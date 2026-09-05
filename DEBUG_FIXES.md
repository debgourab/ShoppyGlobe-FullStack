# Debug fixes applied

This version was revised to remove the POST/404 and cart synchronization problems.

- Canonical authentication routes are now `/api/auth/register`, `/api/auth/login`, and `/api/auth/me`.
- Legacy `/api/register`, `/api/login`, and `/api/me` routes are kept as aliases to avoid breaking old tests.
- Vite now proxies `/api` to the Express backend on port 5000, avoiding frontend CORS/connection mistakes.
- Fake Store product requests remain available through `/fakestoreapi` in the frontend and `/api/fakestore/products` in the backend.
- Fixed Fake Store numeric product synchronization: a missing numeric product now actually syncs into MongoDB instead of returning 404.
- Product POST accepts a normal product body without requiring a separate `thumbnail`; it defaults to `image`.
- Product POST also defaults stock to 10 when omitted.
- Product PUT validates only fields that are supplied.
- Cart quantity conversion is robust for numeric JSON input.
- CORS allows the normal Vite ports and requests from Thunder Client/Postman without an Origin header.
- API errors now include clearer status/messages.

See `docs/THUNDERCLIENT_TESTING.md` for exact request URLs, headers, bodies and expected status codes.
