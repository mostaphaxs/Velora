## Security Rules
* **Secrets:** Never hardcode credentials, API keys, or JWT secrets. Always read from `.env` or environment variables.
* **Input Validation:** Validate and sanitize all incoming parameters (Zod/Valibot for JS/TS, Requests for Laravel) at controller boundaries before database queries.
* **SQL Injection:** Always use parameterized queries or the ORM query builder. Never build raw SQL string concatenations.
* **XSS:** Use default framework escaping/sanitization for any untrusted HTML rendering.
* **Auth & Permissions:** Explicitly check RBAC (Role-Based Access Control) gates/policies on every sensitive endpoint. Do not skip middleware checks.
* **Data Leaks:** Ensure internal errors or stack traces are never returned directly in API JSON responses.