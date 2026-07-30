/**
 * Data models for the Trust Score module.
 * Defines the structure for user data and trust score results.
 */

class User {
  constructor(name, resumeSkills, githubSkills) {
    this.name = name;
    this.resumeSkills = resumeSkills;
    this.githubSkills = githubSkills;
  }
}

class TrustScoreResult {
  constructor(trustScore, verifiedSkills, missingSkills, extraGithubSkills, matchingEnabled, status) {
    this.trustScore = trustScore;
    this.verifiedSkills = verifiedSkills;
    this.missingSkills = missingSkills;
    this.extraGithubSkills = extraGithubSkills;
    this.matchingEnabled = matchingEnabled;
    this.status = status;
  }
}

class TrustScoreResponse {
  constructor(name, trustScore, matchingEnabled, status, verifiedSkills, missingSkills, extraGithubSkills) {
    this.name = name;
    this.trustScore = trustScore;
    this.matchingEnabled = matchingEnabled;
    this.status = status;
    this.verifiedSkills = verifiedSkills;
    this.missingSkills = missingSkills;
    this.extraGithubSkills = extraGithubSkills;
  }
}

module.exports = {
  User,
  TrustScoreResult,
  TrustScoreResponse
};
