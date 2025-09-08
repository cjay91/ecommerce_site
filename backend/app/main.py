from fastapi import FastAPI
from .database import engine
from . import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ecommerce API", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Ecommerce API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
