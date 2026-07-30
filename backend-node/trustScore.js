const profiles = require("./mockProfiles");

function verifySkillWithGithubEvidence(skill, githubAnalysis) {
    if (!githubAnalysis || githubAnalysis.error) {
        return { verified: false, evidence: null };
    }

    const s = String(skill || '').trim().toLowerCase();
    if (!s) return { verified: false, evidence: null };

    const languages = (githubAnalysis.languages || []).map(l => String(l).toLowerCase());
    const skills = (githubAnalysis.skills || []).map(sk => String(sk).toLowerCase());
    const repoNames = (githubAnalysis.repos || []).map(r => String(r.name || '').toLowerCase());
    const repoDescs = (githubAnalysis.repos || []).map(r => String(r.description || '').toLowerCase());

    const TECH_ALIASES = {
        'react': ['react', 'reactjs', 'react.js', 'jsx', 'tsx', 'next', 'next.js', 'nextjs'],
        'react.js': ['react', 'reactjs', 'react.js', 'jsx', 'tsx', 'next', 'next.js', 'nextjs'],
        'node.js': ['node', 'nodejs', 'node.js', 'express', 'expressjs', 'javascript', 'typescript'],
        'node': ['node', 'nodejs', 'node.js', 'express', 'expressjs', 'javascript', 'typescript'],
        'express': ['express', 'expressjs', 'express.js', 'node', 'nodejs'],
        'express.js': ['express', 'expressjs', 'express.js', 'node', 'nodejs'],
        'javascript': ['javascript', 'js', 'es6', 'typescript', 'ts'],
        'typescript': ['typescript', 'ts'],
        'python': ['python', 'py', 'django', 'flask', 'fastapi'],
        'java': ['java', 'spring', 'springboot'],
        'postgresql': ['postgres', 'postgresql', 'psql'],
        'postgres': ['postgres', 'postgresql', 'psql'],
        'mongodb': ['mongo', 'mongodb', 'mongoose'],
        'docker': ['docker', 'dockerfile', 'container'],
        'ci/cd': ['ci/cd', 'github actions', 'action', 'ci', 'workflow'],
        'git': ['git', 'github']
    };

    const targets = TECH_ALIASES[s] || [s];

    for (const lang of languages) {
        for (const t of targets) {
            if (lang === t || lang.includes(t)) {
                return { verified: true, evidence: `Verified in GitHub repository languages (${lang.toUpperCase()})` };
            }
        }
    }

    for (const sk of skills) {
        for (const t of targets) {
            if (sk === t || sk.includes(t) || t.includes(sk)) {
                return { verified: true, evidence: `Verified in GitHub repository topics (${sk})` };
            }
        }
    }

    for (const repo of repoNames) {
        for (const t of targets) {
            if (repo.includes(t)) {
                return { verified: true, evidence: `Code evidence found in repository "${repo}"` };
            }
        }
    }

    for (const desc of repoDescs) {
        for (const t of targets) {
            if (desc.includes(t)) {
                return { verified: true, evidence: `Code evidence documented in repository description` };
            }
        }
    }

    if ((s === 'docker' || s === 'containers') && githubAnalysis.hasDocker) {
        return { verified: true, evidence: 'Verified via Dockerfile inspection in GitHub repositories' };
    }

    if ((s === 'ci/cd' || s === 'devops' || s === 'github actions') && githubAnalysis.hasCI) {
        return { verified: true, evidence: 'Verified via .github/workflows CI/CD configuration' };
    }

    if (s === 'git' && (githubAnalysis.repoCount > 0 || githubAnalysis.username)) {
        return { verified: true, evidence: `Verified via active GitHub profile (@${githubAnalysis.username})` };
    }

    return { verified: false, evidence: null };
}

// Function to calculate multi-dimensional trust score
function calculateTrustScore(resumeSkills = [], githubSkills = [], options = {}) {
    const resumeSkillsArray = Array.isArray(resumeSkills) ? resumeSkills : [];
    const githubAnalysis = options.githubAnalysis || null;

    const verifiedSkills = [];
    const unverifiedSkills = [];

    if (githubAnalysis && !githubAnalysis.error) {
        resumeSkillsArray.forEach(skill => {
            const check = verifySkillWithGithubEvidence(skill, githubAnalysis);
            if (check.verified) {
                verifiedSkills.push(skill);
            } else {
                unverifiedSkills.push(skill);
            }
        });
    } else {
        resumeSkillsArray.forEach(skill => unverifiedSkills.push(skill));
    }

    // 1. Verification Ratio (0-100)
    let verificationRatio = 50;
    if (githubAnalysis && !githubAnalysis.error) {
        verificationRatio = resumeSkillsArray.length > 0
            ? Math.round((verifiedSkills.length / resumeSkillsArray.length) * 100)
            : 70;
    } else {
        verificationRatio = 60; // Neutral baseline when URL omitted
    }

    // 2. Repository Quality & Activity Bonus (0-100)
    let repoQualityScore = 50;
    if (githubAnalysis && !githubAnalysis.error) {
        let bonus = 0;
        if (githubAnalysis.hasDocker) bonus += 25;
        if (githubAnalysis.hasCI) bonus += 25;
        if (githubAnalysis.repoCount >= 5) bonus += 25;
        if (githubAnalysis.lastCommitDate) bonus += 25;
        repoQualityScore = Math.min(100, Math.max(30, bonus));
    } else if (verifiedSkills.length > 0) {
        repoQualityScore = 75;
    }

    // 3. ATS & Resume Quality Score (0-100)
    const atsScore = Number(options.atsScore) || 75;
    const overallScore = Number(options.overallScore) || 75;
    const resumeQualityScore = Math.round((atsScore + overallScore) / 2);

    // Aggregate Multi-dimensional Trust Score Formula
    const finalScore = Math.round(
        (verificationRatio * 0.45) +
        (repoQualityScore * 0.25) +
        (resumeQualityScore * 0.30)
    );

    const score = Math.max(0, Math.min(100, finalScore));

    let category = 'Low';
    if (score >= 80) category = 'High';
    else if (score >= 60) category = 'Medium';
    else if (score >= 40) category = 'Borderline';

    return {
        score,
        verifiedSkills,
        unverifiedSkills,
        category,
        verificationRatio,
        repoQualityScore,
        resumeQualityScore,
        unlocked: score >= 50
    };
}

// Function to verify every profile
function verifyProfiles() {
    console.log("========== TRUST SCORE REPORT ==========\n");

    profiles.forEach(profile => {
        const name = profile.resumeAnalysis?.user?.name || 'Developer';
        const resumeSkills = profile.resumeAnalysis?.core_match?.matched_skills || [];

        const result = calculateTrustScore(resumeSkills, [], {
            githubAnalysis: profile.githubAnalysis,
            overallScore: profile.resumeAnalysis?.core_match?.overall_score,
            atsScore: profile.resumeAnalysis?.ats?.ats_score
        });

        console.log("----------------------------------------");
        console.log(`Name: ${name}`);
        console.log(`Trust Score: ${result.score}% (${result.category})`);
        console.log(`Verified Skills: ${result.verifiedSkills.join(", ")}`);
        console.log(`SkillSwap Status: ${result.unlocked ? "✅ Unlocked" : "❌ Locked"}`);
        console.log();
    });
}

module.exports = {
    calculateTrustScore,
    verifyProfiles,
    verifySkillWithGithubEvidence
};

module.exports.calculateTrustScore = calculateTrustScore;
module.exports.verifyProfiles = verifyProfiles;
module.exports.verifySkillWithGithubEvidence = verifySkillWithGithubEvidence;

if (require.main === module) {
    verifyProfiles();
}
