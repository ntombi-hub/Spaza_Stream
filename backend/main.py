from fastapi import FastAPI
from backend.routes import router

app = FastAPI(
    title="SpazaStream AI",
    description="Voice-to-data supply chain agent for low-bandwidth multilingual township shops.",
    version="0.1.0",
)

app.include_router(router)
