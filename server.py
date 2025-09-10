#!/usr/bin/env python3
import os
import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from src.api.auth import app as api_app

# Create main app
app = FastAPI()

# Mount the API routes
app.mount("/api", api_app)

# Serve static files from the public directory
app.mount("/static", StaticFiles(directory="src/public/static"), name="static")

# Serve other static files (robots.txt, manifest.json, etc.)
@app.get("/robots.txt")
async def robots():
    return FileResponse("src/public/robots.txt")

@app.get("/manifest.json")
async def manifest():
    return FileResponse("src/public/manifest.json")

@app.get("/sw.js")
async def service_worker():
    return FileResponse("src/public/sw.js")

@app.get("/humans.txt")
async def humans():
    return FileResponse("src/public/humans.txt")

@app.get("/sitemap.xml")
async def sitemap():
    return FileResponse("src/public/sitemap.xml")

# Serve the main index.html for all other routes
@app.get("/{path:path}")
async def serve_spa(path: str):
    return FileResponse("src/public/index.html")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)