from collections import Counter
from datetime import datetime
from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Brew & Bloom Analytics", version="1.0.0")

class AnalyticsRequest(BaseModel):
    reservations: list[dict[str, Any]] = Field(default_factory=list)

@app.get("/health")
def health():
    return {"service": "python-analytics", "status": "ok"}

@app.post("/insights")
def insights(payload: AnalyticsRequest):
    rows = payload.reservations
    guests = Counter(r.get("guests", "unknown") for r in rows)
    times = Counter(r.get("time", "unknown") for r in rows)
    dates = Counter(r.get("date", "unknown") for r in rows)

    future_rows = []
    now = datetime.now().date()
    for row in rows:
        try:
            if datetime.fromisoformat(row.get("date", "")).date() >= now:
                future_rows.append(row)
        except (ValueError, TypeError):
            pass

    return {
        "total_reservations": len(rows),
        "future_reservations": len(future_rows),
        "top_guest_size": guests.most_common(1)[0][0] if guests else None,
        "popular_time": times.most_common(1)[0][0] if times else None,
        "most_requested_date": dates.most_common(1)[0][0] if dates else None,
        "guest_breakdown": dict(guests),
        "time_breakdown": dict(times),
        "generated_by": "python-fastapi"
    }
