# SaaS Frontend

React + TypeScript + Vite + Tailwind. Feature-based. Built step by step from
`saas_frontend_feature_based_workflow.md`.

## Run

```bash
npm install
npm run dev
```

`VITE_API_BASE_URL` lives in `.env*`. Only `src/config/env.ts` reads it.

## Build order

| Step | Feature | Status |
|------|---------|--------|
| 1 | Foundation: config, theme, API client, shared UI | done |
| 2 | Auth: register, verify OTP, login, forgot/reset, refresh, /me, route guards | done (needs API-shape check) |
| 3 | Dashboard, responsive app shell, organization setup + organization context | done (needs API-shape check) |
| 4 | Departments | next |
| 5 | Designations | |
| 6 | Permissions | |
| 7 | Roles (with permission picker) | |
| 8 | Employees (list, view, create) | |
| 9 | Employee invitations (+ public invitation page) | |
| 10 | Reward rules | |

## Rules
- Feature code calls only its own `api/` module, which uses `services/apiClient`.
- No operations for endpoints the spec does not list (e.g. employee update/delete stay disabled).
- Add shared UI (Select, Modal, Table...) when the first feature needs it.
