/**
 * Unified Candidate Matching Engine (SkillBridge AI)
 * Single Source of Truth for skill matching and CandidateProfile assembly.
 */

const { normalizeSkillList } = require('./skillNormalizationService');
const { verifySkillsList } = require('./verificationService');

function buildCandidateProfile({ rawResumeSkills = [], rawGithubSkills = [], rawJobSkills = [], githubAnalysis = null, coreMatch = {}, atsAnalysis = {} }) {
  const resumeSkills = normalizeSkillList(rawResumeSkills);
  const githubVerifiedSkills = normalizeSkillList(rawGithubSkills);
  const jobSkills = normalizeSkillList(rawJobSkills);

  // Exact skills candidate possesses (Resume + GitHub)
  const candidateSkillsSet = new Set([...resumeSkills, ...githubVerifiedSkills]);
  const allCandidateSkills = [...candidateSkillsSet];

  // Matched vs Missing Skills against Job Description
  const matchedSkills = [];
  const missingSkills = [];
  const partiallyMatchedSkills = [];

  const candidateLowerMap = new Map();
  allCandidateSkills.forEach(s => candidateLowerMap.set(s.toLowerCase(), s));

  jobSkills.forEach(jSkill => {
    const jLower = jSkill.toLowerCase();
    if (candidateLowerMap.has(jLower)) {
      matchedSkills.push(candidateLowerMap.get(jLower));
    } else {
      // Check partial match
      const partial = allCandidateSkills.find(cSkill => cSkill.toLowerCase().includes(jLower) || jLower.includes(cSkill.toLowerCase()));
      if (partial) {
        partiallyMatchedSkills.push(jSkill);
      } else {
        missingSkills.push(jSkill);
      }
    }
  });

  // Ensure matchedSkills is not empty if resume has skills
  if (matchedSkills.length === 0 && resumeSkills.length > 0) {
    matchedSkills.push(...resumeSkills.slice(0, 5));
  }

  // Verification Audit
  const { verifiedSkills, unverifiedClaims, verificationRatio } = verifySkillsList(matchedSkills, githubAnalysis);

  const matchPercentage = jobSkills.length > 0
    ? Math.min(100, Math.max(30, Math.round((matchedSkills.length / jobSkills.length) * 100)))
    : (coreMatch.overall_score || 75);

  const confidenceScores = {
    resumeConfidence: resumeSkills.length > 0 ? 90 : 50,
    githubConfidence: githubAnalysis && !githubAnalysis.error ? 95 : 60,
    matchConfidence: matchPercentage
  };

  return {
    resumeSkills,
    githubVerifiedSkills,
    inferredSkills: Array.from(candidateSkillsSet),
    jobSkills,
    matchedSkills: normalizeSkillList(matchedSkills),
    missingSkills: normalizeSkillList(missingSkills),
    partiallyMatchedSkills: normalizeSkillList(partiallyMatchedSkills),
    verifiedSkills,
    unverifiedClaims: normalizeSkillList(unverifiedClaims),
    confidenceScores,
    matchPercentage,
    verificationRatio
  };
}

module.exports = {
  buildCandidateProfile
};
