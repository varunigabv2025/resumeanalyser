"""
Data models for the Trust Score module.
Defines the structure for user data and trust score results.
"""

from typing import List
from pydantic import BaseModel


class User(BaseModel):
    """User model containing resume and GitHub skills."""
    name: str
    resume_skills: List[str]
    github_skills: List[str]


class TrustScoreResult(BaseModel):
    """Result model for trust score calculation."""
    trust_score: int
    verified_skills: List[str]
    missing_skills: List[str]
    extra_github_skills: List[str]
    matching_enabled: bool
    status: str


class TrustScoreResponse(BaseModel):
    """API response model including user name and trust score details."""
    name: str
    trust_score: int
    matching_enabled: bool
    status: str
    verified_skills: List[str]
    missing_skills: List[str]
    extra_github_skills: List[str]
