"""
Trust Score service module.
Contains functions to calculate trust scores based on resume and GitHub skills.
"""

from typing import List, Dict, Any
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models import TrustScoreResult


def get_verified_skills(resume_skills: List[str], github_skills: List[str]) -> List[str]:
    """
    Get skills that are present in both resume and GitHub.
    
    Args:
        resume_skills: List of skills claimed in resume
        github_skills: List of skills found in GitHub profile
        
    Returns:
        List of verified skills (intersection of resume and GitHub)
    """
    # Normalize to lowercase for case-insensitive comparison
    resume_lower = [skill.lower() for skill in resume_skills]
    github_lower = [skill.lower() for skill in github_skills]
    
    # Find verified skills (case-insensitive)
    verified = []
    for i, resume_skill in enumerate(resume_skills):
        if resume_lower[i] in github_lower:
            verified.append(resume_skill)
    
    return verified


def get_missing_skills(resume_skills: List[str], github_skills: List[str]) -> List[str]:
    """
    Get skills claimed in resume but not found in GitHub.
    
    Args:
        resume_skills: List of skills claimed in resume
        github_skills: List of skills found in GitHub profile
        
    Returns:
        List of missing skills (in resume but not in GitHub)
    """
    # Normalize to lowercase for case-insensitive comparison
    resume_lower = [skill.lower() for skill in resume_skills]
    github_lower = [skill.lower() for skill in github_skills]
    
    # Find missing skills
    missing = []
    for i, resume_skill in enumerate(resume_skills):
        if resume_lower[i] not in github_lower:
            missing.append(resume_skill)
    
    return missing


def get_extra_github_skills(resume_skills: List[str], github_skills: List[str]) -> List[str]:
    """
    Get skills found in GitHub but not claimed in resume.
    
    Args:
        resume_skills: List of skills claimed in resume
        github_skills: List of skills found in GitHub profile
        
    Returns:
        List of extra GitHub skills (in GitHub but not in resume)
    """
    # Normalize to lowercase for case-insensitive comparison
    resume_lower = [skill.lower() for skill in resume_skills]
    github_lower = [skill.lower() for skill in github_skills]
    
    # Find extra GitHub skills
    extra = []
    for i, github_skill in enumerate(github_skills):
        if github_lower[i] not in resume_lower:
            extra.append(github_skill)
    
    return extra


def calculate_percentage(verified_count: int, total_count: int) -> int:
    """
    Calculate percentage of verified skills.
    
    Args:
        verified_count: Number of verified skills
        total_count: Total number of skills to verify
        
    Returns:
        Percentage as integer (0-100)
    """
    if total_count == 0:
        return 0
    return int((verified_count / total_count) * 100)


def determine_status(trust_score: int) -> str:
    """
    Determine status based on trust score.
    
    Args:
        trust_score: Calculated trust score (0-100)
        
    Returns:
        Status string based on trust score ranges
    """
    if trust_score >= 50:
        return "Verified"
    else:
        return "Needs More Public Evidence"


def is_matching_enabled(trust_score: int) -> bool:
    """
    Determine if matching should be enabled based on trust score.
    
    Args:
        trust_score: Calculated trust score (0-100)
        
    Returns:
        True if trust score >= 50, False otherwise
    """
    return trust_score >= 50


def calculate_trust_score(resume_skills: List[str], github_skills: List[str]) -> TrustScoreResult:
    """
    Calculate trust score based on resume and GitHub skills.
    
    Args:
        resume_skills: List of skills claimed in resume
        github_skills: List of skills found in GitHub profile
        
    Returns:
        TrustScoreResult containing trust score and related information
    """
    # Get verified, missing, and extra skills
    verified_skills = get_verified_skills(resume_skills, github_skills)
    missing_skills = get_missing_skills(resume_skills, github_skills)
    extra_github_skills = get_extra_github_skills(resume_skills, github_skills)
    
    # Calculate trust score
    total_resume_skills = len(resume_skills)
    verified_count = len(verified_skills)
    trust_score = calculate_percentage(verified_count, total_resume_skills)
    
    # Determine status and matching enabled flag
    status = determine_status(trust_score)
    matching_enabled = is_matching_enabled(trust_score)
    
    # Return result
    return TrustScoreResult(
        trust_score=trust_score,
        verified_skills=verified_skills,
        missing_skills=missing_skills,
        extra_github_skills=extra_github_skills,
        matching_enabled=matching_enabled,
        status=status
    )
