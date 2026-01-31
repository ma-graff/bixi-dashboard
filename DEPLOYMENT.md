# Deployment Guide

This guide explains how to deploy the BIXI Dashboard with the frontend on **GitHub Pages** and the backend on **Heroku**.

---

## Architecture Overview

```
┌─────────────────────┐         ┌─────────────────────┐
│   GitHub Pages      │  API    │      Heroku         │
│   (Frontend)        │ ──────► │      (Backend)      │
│   Static React App  │         │      FastAPI        │
└─────────────────────┘         └─────────────────────┘
        │                               │
        │                               ▼
        ▼                       ┌───────────────┐
    Users / Browsers            │  BIXI GBFS    │
                                │  (Public API) │
                                └───────────────┘
```

---

## Backend Deployment (Heroku)

### Prerequisites
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- Heroku account

### Steps

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create Heroku app**
   ```bash
   cd backend
   heroku create bixi-dashboard-api
   ```

3. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```
   
   Or use Heroku Git:
   ```bash
   heroku git:remote -a bixi-dashboard-api
   git push heroku main
   ```

4. **Verify deployment**
   ```bash
   heroku open
   # Visit /api/v1/health to check status
   ```

### Environment Variables (if needed)
```bash
heroku config:set ALLOWED_ORIGINS=https://username.github.io
```

### Logs
```bash
heroku logs --tail
```

---

## Frontend Deployment (GitHub Pages)

### Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys the frontend when changes are pushed to `main`.

1. **Enable GitHub Pages**
   - Go to repository **Settings** → **Pages**
   - Under "Build and deployment", select **GitHub Actions**

2. **Set API URL variable**
   - Go to repository **Settings** → **Secrets and variables** → **Actions**
   - Click **Variables** tab → **New repository variable**
   - Name: `VITE_API_URL`
   - Value: `https://bixi-dashboard-api.herokuapp.com` (your Heroku app URL)

3. **Push to main**
   ```bash
   git push origin main
   ```

4. **Access the site**
   ```
   https://[username].github.io/bixi-dashboard/
   ```

### Manual Deployment

If you prefer to deploy manually:

```bash
cd frontend

# Build with production API URL
VITE_API_URL=https://bixi-dashboard-api.herokuapp.com npm run build

# Deploy dist folder to gh-pages branch
npx gh-pages -d dist
```

---

## Configuration Reference

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://bixi-dashboard-api.herokuapp.com` |

### Backend Files

| File | Purpose |
|------|---------|
| `Procfile` | Tells Heroku how to run the app |
| `runtime.txt` | Specifies Python version |
| `requirements.txt` | Python dependencies |

---

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console, update the backend's CORS configuration in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://username.github.io"],  # Your GitHub Pages URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 404 on Page Refresh
GitHub Pages doesn't support client-side routing directly. The app is configured to work, but if you encounter issues, ensure the base path in `vite.config.ts` matches your repository name.

### API Connection Issues
1. Verify Heroku app is running: `heroku ps`
2. Check logs: `heroku logs --tail`
3. Confirm `VITE_API_URL` is set correctly in GitHub repository variables
