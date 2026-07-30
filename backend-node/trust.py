"""
Trust score API routes.
Defines the endpoint for calculating and retrieving trust scores.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import json
import os
import sys

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import TrustScoreResponse
from services.trust_score import calculate_trust_score

# Create router
router = APIRouter()

# Path to fake users data
DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "fake_users.json")


def load_users() -> Dict[str, Any]:
    """
    Load users from fake_users.json file.
    
    Returns:
        Dictionary mapping usernames to user data
    """
    try:
        with open(DATA_FILE, 'r') as f:
            users = json.load(f)
        # Create a dictionary with username as key for easy lookup
        user_dict = {user['name'].lower(): user for user in users}
        return user_dict
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="User data file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid user data format")


@router.get("/trust/{username}", response_model=TrustScoreResponse)
async def get_trust_score(username: str) -> TrustScoreResponse:
    """
    Get trust score for a given username.
    
    Args:
        username: The username to look up
        
    Returns:
        TrustScoreResponse containing trust score details
        
    Raises:
        HTTPException: If user not found
    """
    # Load users from JSON file
    users = load_users()
    
    # Look up user (case-insensitive)
    username_lower = username.lower()
    if username_lower not in users:
        raise HTTPException(status_code=404, detail=f"User '{username}' not found")
    
    user = users[username_lower]
    
    # Calculate trust score
    result = calculate_trust_score(user['resume_skills'], user['github_skills'])
    
    # Return response
    return TrustScoreResponse(
        name=user['name'],
        trust_score=result.trust_score,
        matching_enabled=result.matching_enabled,
        status=result.status,
        verified_skills=result.verified_skills,
        missing_skills=result.missing_skills,
        extra_github_skills=result.extra_github_skills
    )
