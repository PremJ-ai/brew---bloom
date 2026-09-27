# Brew & Bloom — React + Node.js + Python

Full-stack café website with an animated React frontend, Node.js API, and Python FastAPI analytics service.

## GitHub Pages

The React frontend is configured to deploy automatically from the `main` branch using GitHub Actions.

Expected frontend URL:

https://premj-ai.github.io/brew---bloom/

GitHub Pages hosts the React frontend only. The Node.js and Python services still need a separate server platform for public backend functionality.

## Local development

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
# macOS/Linux: source .venv/bin/activate
# Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

## API

Node:
- `GET /health`
- `GET /api/menu`
- `GET /api/reservations`
- `POST /api/reservations`
- `GET /api/insights`

Python:
- `GET /health`
- `POST /insights`

Reservation data is stored in `backend/data/reservations.json` for the demo.

## Docker

From the repository root:
```bash
docker compose up
```

For production deployment, use a real database and deploy Node/Python services to a server platform; add authentication, rate limiting, strict CORS, and secret management.
