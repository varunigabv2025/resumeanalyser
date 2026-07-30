/**
 * Trust Score service module.
 * Contains functions to calculate trust scores based on resume and GitHub skills.
 */

const { TrustScoreResult } = require('../models');

/**
 * Get skills that are present in both resume and GitHub.
 * @param {string[]} resumeSkills - List of skills claimed in resume
 * @param {string[]} githubSkills - List of skills found in GitHub profile
 * @returns {string[]} List of verified skills (intersection of resume and GitHub)
 */
function getVerifiedSkills(resumeSkills, githubSkills) {
  // Normalize to lowercase for case-insensitive comparison
  const resumeLower = resumeSkills.map(skill => skill.toLowerCase());
  const githubLower = githubSkills.map(skill => skill.toLowerCase());
  
  // Find verified skills (case-insensitive)
  const verified = [];
  for (let i = 0; i < resumeSkills.length; i++) {
    if (resumeLower[i] in githubLower || githubLower.includes(resumeLower[i])) {
      verified.push(resumeSkills[i]);
    }
  }
  
  return verified;
}

/**
 * Get skills claimed in resume but not found in GitHub.
 * @param {string[]} resumeSkills - List of skills claimed in resume
 * @param {string[]} githubSkills - List of skills found in GitHub profile
 * @returns {string[]} List of missing skills (in resume but not in GitHub)
 */
function getMissingSkills(resumeSkills, githubSkills) {
  // Normalize to lowercase for case-insensitive comparison
  const resumeLower = resumeSkills.map(skill => skill.toLowerCase());
  const githubLower = githubSkills.map(skill => skill.toLowerCase());
  
  // Find missing skills
  const missing = [];
  for (let i = 0; i < resumeSkills.length; i++) {
    if (!githubLower.includes(resumeLower[i])) {
      missing.push(resumeSkills[i]);
    }
  }
  
  return missing;
}

/**
 * Get skills found in GitHub but not claimed in resume.
 * @param {string[]} resumeSkills - List of skills claimed in resume
 * @param {string[]} githubSkills - List of skills found in GitHub profile
 * @returns {string[]} List of extra GitHub skills (in GitHub but not in resume)
 */
function getExtraGithubSkills(resumeSkills, githubSkills) {
  // Normalize to lowercase for case-insensitive comparison
  const resumeLower = resumeSkills.map(skill => skill.toLowerCase());
  const githubLower = githubSkills.map(skill => skill.toLowerCase());
  
  // Find extra GitHub skills
  const extra = [];
  for (let i = 0; i < githubSkills.length; i++) {
    if (!resumeLower.includes(githubLower[i])) {
      extra.push(githubSkills[i]);
    }
  }
  
  return extra;
}

/**
 * Calculate percentage of verified skills.
 * @param {number} verifiedCount - Number of verified skills
 * @param {number} totalCount - Total number of skills to verify
 * @returns {number} Percentage as integer (0-100)
 */
function calculatePercentage(verifiedCount, totalCount) {
  if (totalCount === 0) {
    return 0;
  }
  return Math.floor((verifiedCount / totalCount) * 100);
}

/**
 * Determine status based on trust score.
 * @param {number} trustScore - Calculated trust score (0-100)
 * @returns {string} Status string based on trust score ranges
 */
function determineStatus(trustScore) {
  if (trustScore >= 50) {
    return "Verified";
  } else {
    return "Needs More Public Evidence";
  }
}

/**
 * Determine if matching should be enabled based on trust score.
 * @param {number} trustScore - Calculated trust score (0-100)
 * @returns {boolean} True if trust score >= 50, False otherwise
 */
function isMatchingEnabled(trustScore) {
  return trustScore >= 50;
}

/**
 * Calculate trust score based on resume and GitHub skills.
 * @param {string[]} resumeSkills - List of skills claimed in resume
 * @param {string[]} githubSkills - List of skills found in GitHub profile
 * @returns {TrustScoreResult} TrustScoreResult containing trust score and related information
 */
function calculateTrustScore(resumeSkills, githubSkills) {
  // Get verified, missing, and extra skills
  const verifiedSkills = getVerifiedSkills(resumeSkills, githubSkills);
  const missingSkills = getMissingSkills(resumeSkills, githubSkills);
  const extraGithubSkills = getExtraGithubSkills(resumeSkills, githubSkills);
  
  // Calculate trust score
  const totalResumeSkills = resumeSkills.length;
  const verifiedCount = verifiedSkills.length;
  const trustScore = calculatePercentage(verifiedCount, totalResumeSkills);
  
  // Determine status and matching enabled flag
  const status = determineStatus(trustScore);
  const matchingEnabled = isMatchingEnabled(trustScore);
  
  // Return result
  return new TrustScoreResult(
    trustScore,
    verifiedSkills,
    missingSkills,
    extraGithubSkills,
    matchingEnabled,
    status
  );
}

module.exports = {
  getVerifiedSkills,
  getMissingSkills,
  getExtraGithubSkills,
  calculatePercentage,
  determineStatus,
  isMatchingEnabled,
  calculateTrustScore
};
