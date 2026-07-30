/**
 * UnifiedProfile Schema Definition (SkillBridge AI)
 * 
 * Single source of truth schema for Person B's Unified Profile Layer.
 * Aggregates ResumeIQ analysis data and Person A's GitHub Analyzer output.
 * 
 * Schema Structure (10 Top-Level Keys):
 * - user: User identification and profile header details.
 * - resume: Complete original ResumeIQ analysis object.
 * - github: Complete original GitHub Analyzer object.
 * - verifiedSkills: Skills backed by GitHub code evidence [{ skill, evidence }].
 * - unverifiedClaims: Resume skills with no GitHub code evidence [string].
 * - resumeRecommendations: Actionable suggestions for missing skills in resume [string].
 * - strengths: Aggregated highlights from resume and GitHub activity [string].
 * - weaknesses: Aggregated skill gaps and unverified claims [string].
 * - careerDomains: Primary professional domains (stub for future AI inference) [string].
 * - metadata: Processing information (version, timestamps, status).
 */

const DEFAULT_UNIFIED_PROFILE_TEMPLATE = {
  user: {
    name: '',
    email: '',
    title: ''
  },
  resume: null,
  github: null,
  verifiedSkills: [],
  unverifiedClaims: [],
  resumeRecommendations: [],
  strengths: [],
  weaknesses: [],
  careerDomains: [],
  metadata: {
    version: '1.0.0',
    createdAt: null,
    mergeVersion: 'v1',
    generatedBy: 'SkillBridge-ProfileMerger',
    mergeStatus: 'PENDING'
  }
};

/**
 * Validates that an object conforms to the Unified Profile schema requirements.
 * @param {Object} profile - Object to validate.
 * @returns {boolean} True if all required 10 top-level keys exist.
 */
function validateUnifiedProfileSchema(profile) {
  if (!profile || typeof profile !== 'object') return false;

  const requiredKeys = [
    'user',
    'resume',
    'github',
    'verifiedSkills',
    'unverifiedClaims',
    'resumeRecommendations',
    'strengths',
    'weaknesses',
    'careerDomains',
    'metadata'
  ];

  return requiredKeys.every(key => Object.prototype.hasOwnProperty.call(profile, key));
}

module.exports = {
  DEFAULT_UNIFIED_PROFILE_TEMPLATE,
  validateUnifiedProfileSchema
};
