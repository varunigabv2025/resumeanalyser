/**
 * Frontend Profile Merger Utility (SkillBridge AI)
 * 
 * Re-exports profile merging logic for frontend consumption without violating Create React App's module boundary.
 */

export function deriveCareerDomains(resumeAnalysis, githubAnalysis) {
  return [];
}

export function createUnifiedProfile(data = {}) {
  return {
    user: {
      name: data.user?.name || 'Candidate',
      email: data.user?.email || '',
      title: data.user?.title || 'Software Developer'
    },
    resume: data.resume || null,
    github: data.github || null,
    verifiedSkills: data.verifiedSkills || [],
    unverifiedClaims: data.unverifiedClaims || [],
    resumeRecommendations: data.resumeRecommendations || [],
    strengths: data.strengths || [],
    weaknesses: data.weaknesses || [],
    careerDomains: data.careerDomains || [],
    metadata: {
      version: '1.0.0',
      createdAt: data.metadata?.createdAt || new Date().toISOString(),
      mergeVersion: 'v1',
      generatedBy: 'SkillBridge-ProfileMerger',
      mergeStatus: data.metadata?.mergeStatus || 'SUCCESS'
    }
  };
}

export function mergeProfile(resumeAnalysis = {}, githubAnalysis = {}) {
  const resumeSkills = resumeAnalysis?.core_match?.matched_skills || 
                       resumeAnalysis?.skills || 
                       [];

  const githubSkills = githubAnalysis?.skills || [];

  const normalize = (str) => String(str || '').trim().toLowerCase();

  const githubSkillMap = new Map();
  githubSkills.forEach(skill => {
    githubSkillMap.set(normalize(skill), skill);
  });

  const resumeSkillMap = new Map();
  resumeSkills.forEach(skill => {
    resumeSkillMap.set(normalize(skill), skill);
  });

  const verifiedSkills = [];
  const verifiedSkillSet = new Set();

  resumeSkills.forEach(skill => {
    const normalized = normalize(skill);
    if (githubSkillMap.has(normalized)) {
      verifiedSkills.push({
        skill: skill,
        evidence: 'Found in GitHub repositories'
      });
      verifiedSkillSet.add(normalized);
    }
  });

  const unverifiedClaims = resumeSkills.filter(
    skill => !verifiedSkillSet.has(normalize(skill))
  );

  const resumeRecommendations = githubSkills
    .filter(skill => !resumeSkillMap.has(normalize(skill)))
    .map(skill => `Add ${skill} to your resume.`);

  const strengths = [];
  if (verifiedSkills.length > 0) {
    const verifiedNames = verifiedSkills.map(v => v.skill).join(', ');
    strengths.push(`Practical code proof on GitHub for verified skills: ${verifiedNames}`);
  }
  const overallScore = resumeAnalysis?.core_match?.overall_score || resumeAnalysis?.overall_score;
  if (typeof overallScore === 'number' && overallScore >= 75) {
    strengths.push(`Strong resume alignment with an overall score of ${overallScore}%`);
  }

  const weaknesses = [];
  if (unverifiedClaims.length > 0) {
    weaknesses.push(`Unverified resume claims (lacking GitHub proof): ${unverifiedClaims.join(', ')}`);
  }
  const missingSkills = resumeAnalysis?.core_match?.missing_skills || [];
  if (missingSkills.length > 0) {
    weaknesses.push(`Target role skill gaps identified: ${missingSkills.join(', ')}`);
  }

  const careerDomains = deriveCareerDomains(resumeAnalysis, githubAnalysis);

  const user = {
    name: githubAnalysis?.name || resumeAnalysis?.candidate_name || 'Candidate',
    email: githubAnalysis?.email || resumeAnalysis?.user_email || '',
    title: resumeAnalysis?.job_title || 'Software Engineer'
  };

  const profileData = {
    user,
    resume: resumeAnalysis,
    github: githubAnalysis,
    verifiedSkills,
    unverifiedClaims,
    resumeRecommendations,
    strengths,
    weaknesses,
    careerDomains,
    metadata: {
      createdAt: new Date().toISOString(),
      mergeStatus: 'SUCCESS'
    }
  };

  return createUnifiedProfile(profileData);
}
