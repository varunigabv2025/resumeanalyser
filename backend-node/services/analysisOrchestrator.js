const { extractResumeText } = require('../resumeParser');
const { analyzeGithubProfile } = require('../githubAnalyzer');
const { mergeProfile } = require('./profileMerger');
const { runAllAnalyses } = require('../aiAnalyzer');
const { calculateTrustScore } = require('../trustScore');
const { findMatchesForCandidate } = require('../skillMatcher');

function extractCandidateName(resumeText) {
  if (!resumeText) return 'Candidate';
  const lines = resumeText.split('\n');
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.length < 50 && !/\d/.test(firstLine)) {
      return firstLine;
    }
  }
  return 'Candidate';
}

function extractJobTitle(jobDescription) {
  if (!jobDescription) return 'Position';
  const lines = jobDescription.split('\n');
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (line && !/^we are|^we're|^about the|^job/i.test(line)) {
      if (line.length < 100) {
        return line;
      }
    }
  }
  return 'Position';
}

async function analyzeCandidate({ resumeBuffer, mimeType, jobDescription, githubUrl }) {
  const warnings = [];
  const errors = [];
  let status = 'SUCCESS';
  let confidence = 95;

  // 1. Resume Parsing
  const resumeText = await extractResumeText(resumeBuffer, mimeType);
  if (typeof resumeText !== 'string' || !resumeText.trim()) {
    throw new Error('Failed to extract readable text from resume.');
  }

  // 2. GitHub Analysis (Optional / Graceful Failover)
  let githubAnalysis = null;
  if (githubUrl && typeof githubUrl === 'string' && githubUrl.trim()) {
    const username = githubUrl.trim().split('/').filter(Boolean).pop();
    if (username) {
      try {
        const ghResult = await analyzeGithubProfile(username, []);
        if (ghResult.error) {
          warnings.push(`GitHub analysis notice: ${ghResult.error}`);
          githubAnalysis = { username, error: ghResult.error, skills: [], repos: [] };
        } else {
          githubAnalysis = ghResult;
        }
      } catch (ghErr) {
        warnings.push(`GitHub API error: ${ghErr.message}`);
        githubAnalysis = { username, error: ghErr.message, skills: [], repos: [] };
      }
    }
  }

  const candidateName = extractCandidateName(resumeText);
  const jobTitle = extractJobTitle(jobDescription);

  // 3. AI Analysis Suite
  const aiResults = await runAllAnalyses(resumeText, jobDescription, candidateName, githubAnalysis);

  const matchedSkills = aiResults.core_match?.matched_skills || [];
  const missingSkills = aiResults.core_match?.missing_skills || [];
  const githubSkills = githubAnalysis?.skills || [];

  // 4. Unified Profile Builder
  const candidateProfile = mergeProfile(aiResults, githubAnalysis);

  // 5. Trust Score Calculation (Single Source of Truth)
  const trustAnalysis = calculateTrustScore(matchedSkills, githubSkills, {
    githubAnalysis,
    overallScore: aiResults.core_match?.overall_score,
    atsScore: aiResults.ats?.ats_score
  });

  // 6. SkillSwap Engine (Single Source of Truth)
  const skillSwapMatches = findMatchesForCandidate(matchedSkills, missingSkills, candidateName);

  // Return ONE Unified Response Object
  return {
    candidateProfile,
    githubAnalysis,
    atsAnalysis: aiResults.ats || {},
    trustAnalysis,
    skillGap: aiResults.gaps || {},
    roadmap: aiResults.gaps || {},
    coverLetter: aiResults.cover_letter || {},
    interviewPrep: aiResults.interview_prep || {},
    skillSwap: {
      matches: skillSwapMatches,
      unlocked: trustAnalysis.unlocked,
      status: trustAnalysis.unlocked ? 'UNLOCKED' : 'LOCKED'
    },
    coreMatch: aiResults.core_match || {},
    rewrites: aiResults.rewrites || { rewrites: [] },
    recommendations: candidateProfile.resumeRecommendations || [],
    metadata: {
      status,
      confidence,
      createdAt: new Date().toISOString(),
      jobTitle,
      candidateName,
      warnings,
      errors
    }
  };
}

module.exports = {
  analyzeCandidate
};
