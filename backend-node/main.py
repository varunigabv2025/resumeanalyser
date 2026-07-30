"""
Main FastAPI application for the Trust Score module.
"""

from fastapi import FastAPI
from routes.trust import router as trust_router

# Create FastAPI app
app = FastAPI(
    title="Trust Score API",
    description="API for calculating trust scores based on resume and GitHub skills",
    version="1.0.0"
)

# Include trust score routes
app.include_router(trust_router, tags=["Trust Score"])


@app.get("/")
async def root():
    """
    Root endpoint to verify API is running.
    """
    return {
        "message": "Trust Score API is running",
        "version": "1.0.0",
        "endpoints": {
            "trust_score": "/trust/{username}"
        }
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
