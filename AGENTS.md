# 🤖 AI Agent Operational Protocols: Unified D1 Database Ecosystem

> **CRITICAL INSTRUCTION FOR AI AGENTS & DEVELOPERS:**
> This repository connects to a **Shared Ecosystem Cloudflare D1 Database**. Multiple personal web services under Fatah's digital ecosystem share this single database instance to optimize Cloudflare Free Tier quotas.

---

## 🗄️ Database Identification
- **Database Name:** `gateway-d1`
- **Database ID:** `f71f7c73-a7b9-4166-bfd1-d4bcc84caef8`
- **Current App ID:** `gateway` (Portal Hub & Link Gateway - `link.fmr.web.id`)
- **Assigned Table Prefix:** `gw_`

---

## 🛑 Invariant Safety Rules (Strict Enforcement)

1. **NEVER Execute `DROP DATABASE` or Global Resets:**
   - This database holds live data for multiple websites.
   - Any destructive action will break other websites sharing this database.

2. **Strict Table Prefix Isolation:**
   - All tables created or used by **this project** (`gateway`) MUST start with `gw_`:
     - `gw_site_config`
     - `gw_links`
     - `gw_link_clicks`
   - **DO NOT TOUCH, MODIFY, OR DROP** tables with other prefixes (e.g., `blog_*`, `port_*`, etc.).

3. **Live Dynamic Schema Registry (`_README_SHARED_DATABASE`):**
   - The database contains a real-time dynamic view: `_README_SHARED_DATABASE`.
   - Run `SELECT * FROM _README_SHARED_DATABASE;` to inspect all registered apps and their active physical tables at any time.

4. **Protocol for Adding a New Website / Module to this D1 Database:**
   If you (or another AI agent) are tasked with connecting another website (e.g. `blog` or `portfolio`) to this D1 database:
   - **Step 1:** Choose an unused, unique prefix (e.g. `blog_`, `port_`).
   - **Step 2:** Register the new app into the registry:
     ```sql
     INSERT INTO _ecosystem_registry (app_id, app_name, table_prefix, domain, description)
     VALUES ('blog', 'Personal Tech Blog', 'blog_', 'blog.fatahmr.my.id', 'Articles & tech tutorials');
     ```
   - **Step 3:** Create your tables using the registered prefix (e.g. `blog_posts`, `blog_tags`).
   - The dynamic view `_README_SHARED_DATABASE` will automatically discover and display your new tables!

---

*Authored and maintained as part of Fatah's multi-app architecture.*
