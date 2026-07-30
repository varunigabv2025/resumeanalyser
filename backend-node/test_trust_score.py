"""
Unit tests for the Trust Score module.
Tests all helper functions and the main calculate_trust_score function.
"""

import unittest
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.trust_score import (
    get_verified_skills,
    get_missing_skills,
    get_extra_github_skills,
    calculate_percentage,
    determine_status,
    is_matching_enabled,
    calculate_trust_score
)


class TestTrustScore(unittest.TestCase):
    """Test cases for trust score calculation."""

    def test_get_verified_skills_all_match(self):
        """Test get_verified_skills with all skills matching."""
        resume = ["Python", "React", "SQL"]
        github = ["Python", "React", "SQL"]
        result = get_verified_skills(resume, github)
        self.assertEqual(result, ["Python", "React", "SQL"])

    def test_get_verified_skills_partial_match(self):
        """Test get_verified_skills with partial skills matching."""
        resume = ["Python", "React", "SQL", "Docker"]
        github = ["Python", "React", "SQL"]
        result = get_verified_skills(resume, github)
        self.assertEqual(result, ["Python", "React", "SQL"])

    def test_get_verified_skills_no_match(self):
        """Test get_verified_skills with no skills matching."""
        resume = ["Python", "React"]
        github = ["Java", "Go"]
        result = get_verified_skills(resume, github)
        self.assertEqual(result, [])

    def test_get_verified_skills_case_insensitive(self):
        """Test get_verified_skills with case-insensitive matching."""
        resume = ["Python", "REACT", "sql"]
        github = ["python", "react", "SQL"]
        result = get_verified_skills(resume, github)
        self.assertEqual(result, ["Python", "REACT", "sql"])

    def test_get_missing_skills(self):
        """Test get_missing_skills with missing skills."""
        resume = ["Python", "React", "SQL", "Docker"]
        github = ["Python", "React", "SQL"]
        result = get_missing_skills(resume, github)
        self.assertEqual(result, ["Docker"])

    def test_get_missing_skills_all_verified(self):
        """Test get_missing_skills when all skills are verified."""
        resume = ["Python", "React", "SQL"]
        github = ["Python", "React", "SQL"]
        result = get_missing_skills(resume, github)
        self.assertEqual(result, [])

    def test_get_missing_skills_none_verified(self):
        """Test get_missing_skills when no skills are verified."""
        resume = ["Python", "React"]
        github = ["Java", "Go"]
        result = get_missing_skills(resume, github)
        self.assertEqual(result, ["Python", "React"])

    def test_get_extra_github_skills(self):
        """Test get_extra_github_skills with extra GitHub skills."""
        resume = ["Python", "React"]
        github = ["Python", "React", "SQL", "Docker"]
        result = get_extra_github_skills(resume, github)
        self.assertEqual(result, ["SQL", "Docker"])

    def test_get_extra_github_skills_no_extra(self):
        """Test get_extra_github_skills with no extra skills."""
        resume = ["Python", "React", "SQL"]
        github = ["Python", "React", "SQL"]
        result = get_extra_github_skills(resume, github)
        self.assertEqual(result, [])

    def test_calculate_percentage_100_percent(self):
        """Test calculate_percentage with 100% verification."""
        result = calculate_percentage(4, 4)
        self.assertEqual(result, 100)

    def test_calculate_percentage_75_percent(self):
        """Test calculate_percentage with 75% verification."""
        result = calculate_percentage(3, 4)
        self.assertEqual(result, 75)

    def test_calculate_percentage_50_percent(self):
        """Test calculate_percentage with 50% verification."""
        result = calculate_percentage(2, 4)
        self.assertEqual(result, 50)

    def test_calculate_percentage_25_percent(self):
        """Test calculate_percentage with 25% verification."""
        result = calculate_percentage(1, 4)
        self.assertEqual(result, 25)

    def test_calculate_percentage_0_percent(self):
        """Test calculate_percentage with 0% verification."""
        result = calculate_percentage(0, 4)
        self.assertEqual(result, 0)

    def test_calculate_percentage_empty_denominator(self):
        """Test calculate_percentage with empty denominator."""
        result = calculate_percentage(0, 0)
        self.assertEqual(result, 0)

    def test_determine_status_verified(self):
        """Test determine_status with high trust score."""
        self.assertEqual(determine_status(100), "Verified")
        self.assertEqual(determine_status(90), "Verified")
        self.assertEqual(determine_status(75), "Verified")
        self.assertEqual(determine_status(50), "Verified")

    def test_determine_status_needs_evidence(self):
        """Test determine_status with low trust score."""
        self.assertEqual(determine_status(49), "Needs More Public Evidence")
        self.assertEqual(determine_status(25), "Needs More Public Evidence")
        self.assertEqual(determine_status(0), "Needs More Public Evidence")

    def test_is_matching_enabled_true(self):
        """Test is_matching_enabled when score >= 50."""
        self.assertTrue(is_matching_enabled(50))
        self.assertTrue(is_matching_enabled(75))
        self.assertTrue(is_matching_enabled(100))

    def test_is_matching_enabled_false(self):
        """Test is_matching_enabled when score < 50."""
        self.assertFalse(is_matching_enabled(49))
        self.assertFalse(is_matching_enabled(25))
        self.assertFalse(is_matching_enabled(0))

    def test_calculate_trust_score_100_percent(self):
        """Test calculate_trust_score with 100% verification."""
        resume = ["Python", "React", "SQL"]
        github = ["Python", "React", "SQL"]
        result = calculate_trust_score(resume, github)
        
        self.assertEqual(result.trust_score, 100)
        self.assertEqual(result.verified_skills, ["Python", "React", "SQL"])
        self.assertEqual(result.missing_skills, [])
        self.assertEqual(result.extra_github_skills, [])
        self.assertTrue(result.matching_enabled)
        self.assertEqual(result.status, "Verified")

    def test_calculate_trust_score_75_percent(self):
        """Test calculate_trust_score with 75% verification."""
        resume = ["Python", "React", "SQL", "Docker"]
        github = ["Python", "React", "SQL"]
        result = calculate_trust_score(resume, github)
        
        self.assertEqual(result.trust_score, 75)
        self.assertEqual(result.verified_skills, ["Python", "React", "SQL"])
        self.assertEqual(result.missing_skills, ["Docker"])
        self.assertEqual(result.extra_github_skills, [])
        self.assertTrue(result.matching_enabled)
        self.assertEqual(result.status, "Verified")

    def test_calculate_trust_score_50_percent(self):
        """Test calculate_trust_score with 50% verification."""
        resume = ["Python", "React", "SQL", "Docker"]
        github = ["Python", "React"]
        result = calculate_trust_score(resume, github)
        
        self.assertEqual(result.trust_score, 50)
        self.assertEqual(result.verified_skills, ["Python", "React"])
        self.assertEqual(result.missing_skills, ["SQL", "Docker"])
        self.assertEqual(result.extra_github_skills, [])
        self.assertTrue(result.matching_enabled)
        self.assertEqual(result.status, "Verified")

    def test_calculate_trust_score_49_percent(self):
        """Test calculate_trust_score with 49% verification (borderline)."""
        resume = ["Python", "React", "SQL", "Docker", "Kubernetes"]
        github = ["Python", "React"]
        result = calculate_trust_score(resume, github)
        
        self.assertEqual(result.trust_score, 40)  # 2/5 = 40%
        self.assertEqual(result.verified_skills, ["Python", "React"])
        self.assertEqual(result.missing_skills, ["SQL", "Docker", "Kubernetes"])
        self.assertEqual(result.extra_github_skills, [])
        self.assertFalse(result.matching_enabled)
        self.assertEqual(result.status, "Needs More Public Evidence")

    def test_calculate_trust_score_25_percent(self):
        """Test calculate_trust_score with 25% verification."""
        resume = ["Python", "React", "SQL", "Docker"]
        github = ["Python"]
        result = calculate_trust_score(resume, github)
        
        self.assertEqual(result.trust_score, 25)
        self.assertEqual(result.verified_skills, ["Python"])
        self.assertEqual(result.missing_skills, ["React", "SQL", "Docker"])
        self.assertEqual(result.extra_github_skills, [])
        self.assertFalse(result.matching_enabled)
        self.assertEqual(result.status, "Needs More Public Evidence")

    def test_calculate_trust_score_0_percent(self):
        """Test calculate_trust_score with 0% verification."""
        resume = ["Python", "React", "SQL"]
        github = ["Java", "Go"]
        result = calculate_trust_score(resume, github)
        
        self.assertEqual(result.trust_score, 0)
        self.assertEqual(result.verified_skills, [])
        self.assertEqual(result.missing_skills, ["Python", "React", "SQL"])
        self.assertEqual(result.extra_github_skills, ["Java", "Go"])
        self.assertFalse(result.matching_enabled)
        self.assertEqual(result.status, "Needs More Public Evidence")

    def test_calculate_trust_score_empty_resume(self):
        """Test calculate_trust_score with empty resume."""
        resume = []
        github = ["Python", "React"]
        result = calculate_trust_score(resume, github)
        
        self.assertEqual(result.trust_score, 0)
        self.assertEqual(result.verified_skills, [])
        self.assertEqual(result.missing_skills, [])
        self.assertEqual(result.extra_github_skills, ["Python", "React"])
        self.assertFalse(result.matching_enabled)
        self.assertEqual(result.status, "Needs More Public Evidence")

    def test_calculate_trust_score_empty_github(self):
        """Test calculate_trust_score with empty GitHub."""
        resume = ["Python", "React", "SQL"]
        github = []
        result = calculate_trust_score(resume, github)
        
        self.assertEqual(result.trust_score, 0)
        self.assertEqual(result.verified_skills, [])
        self.assertEqual(result.missing_skills, ["Python", "React", "SQL"])
        self.assertEqual(result.extra_github_skills, [])
        self.assertFalse(result.matching_enabled)
        self.assertEqual(result.status, "Needs More Public Evidence")

    def test_calculate_trust_score_empty_both(self):
        """Test calculate_trust_score with both empty."""
        resume = []
        github = []
        result = calculate_trust_score(resume, github)
        
        self.assertEqual(result.trust_score, 0)
        self.assertEqual(result.verified_skills, [])
        self.assertEqual(result.missing_skills, [])
        self.assertEqual(result.extra_github_skills, [])
        self.assertFalse(result.matching_enabled)
        self.assertEqual(result.status, "Needs More Public Evidence")

    def test_calculate_trust_score_with_extra_github_skills(self):
        """Test calculate_trust_score with extra GitHub skills."""
        resume = ["Python", "React"]
        github = ["Python", "React", "SQL", "Docker", "Kubernetes"]
        result = calculate_trust_score(resume, github)
        
        self.assertEqual(result.trust_score, 100)
        self.assertEqual(result.verified_skills, ["Python", "React"])
        self.assertEqual(result.missing_skills, [])
        self.assertEqual(result.extra_github_skills, ["SQL", "Docker", "Kubernetes"])
        self.assertTrue(result.matching_enabled)
        self.assertEqual(result.status, "Verified")


if __name__ == "__main__":
    unittest.main()
