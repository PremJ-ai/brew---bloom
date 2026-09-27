# Brew & Bloom — React + Node.js + Python

A full-stack café website built with React + Vite, Node.js + Express, and FastAPI.

## Architecture

- `frontend/` — React + Vite. Component-driven UI with responsive design, scroll reveal, hover animations, parallax motion, menu tabs, and reservation submission.
- `backend/` — Node.js + Express. Provides menu data, reservations, validation, and an analytics proxy.
- `python-service/` — FastAPI analytics service for reservation insights.
- `docker-compose.yml` — optional local orchestration for Node and Python services.

## Run locally

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Node API
```bash
cd backend
npm install
npm start
```

### Python analytics
```bash
cd python-service
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Open the Vite URL, normally `http://localhost:5173`.

## API

- Node: `GET /health`
- Node: `GET /api/menu`
- Node: `GET /api/reservations`
- Node: `POST /api/reservations`
- Node: `GET /api/insights`
- Python: `GET /health`
- Python: `POST /insights`

Reservation data is stored in `backend/data/reservations.json` for this demo. For production, replace it with a real database and add authentication, rate limiting, strict CORS, validation, and secret management.

## Docker

From the repository root:
```bash
docker compose up
```
