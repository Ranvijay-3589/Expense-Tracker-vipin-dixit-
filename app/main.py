from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routes.expenses import router as expenses_router
from app.routes.summary import router as summary_router

app = FastAPI(title="Expense Tracker API")

origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(expenses_router)
app.include_router(summary_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
