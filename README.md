# TodoX — React Frontend

Tech stack: **React + Axios**, **React Router**, **TailwindCSS** (no MUI to keep it lean — can be swapped later).

## Quick start

```bash
# 1) install deps
npm i

# 2) run dev
npm run dev

# (optional) use yarn
# yarn && yarn dev
```

### Configure API base URL
Create `.env` at project root if your backend URL differs from default:

```
VITE_API_BASE_URL=http://localhost:8080
```

### API Endpoints used

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

Refresh-token flow is handled automatically by Axios interceptor.
