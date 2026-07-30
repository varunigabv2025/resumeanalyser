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
            if (sk === t || sk.includes(t)) {
                return { verified: true, evidence: `Verified in GitHub repository topics/skills (${sk})` };
            }
        }
    }

    for (const name of repoNames) {
        for (const t of targets) {
            if (t.length > 2 && (name.includes(t) || t.includes(name))) {
                return { verified: true, evidence: `Verified code evidence found in GitHub repository "${name}"` };
            }
        }
    }

    for (const desc of repoDescs) {
        for (const t of targets) {
            if (t.length > 2 && desc.includes(t)) {
                return { verified: true, evidence: `Verified code evidence documented in GitHub repository description` };
            }
        }
    }

    if (s === 'docker' && githubAnalysis.hasDocker) {
        return { verified: true, evidence: 'Verified via Dockerfile in GitHub repository root' };
    }

    if (s === 'ci/cd' && githubAnalysis.hasCI) {
        return { verified: true, evidence: 'Verified via .github/workflows CI/CD configuration' };
    }

    if (s === 'git' && (githubAnalysis.repoCount > 0 || githubAnalysis.username)) {
        return { verified: true, evidence: `Verified via active GitHub profile (@${githubAnalysis.username}) with ${githubAnalysis.repoCount || 0} repositories` };
    }

    return { verified: false, evidence: null };
}

function calculateTrustScore(resumeSkills = [], githubSkills = [], contextData = {}) {
    const { githubAnalysis, overallScore = 75, atsScore = 80 } = contextData;

    // Handle optional / missing GitHub profile cleanly
    if (!githubAnalysis || githubAnalysis.error || (!githubAnalysis.username && githubSkills.length === 0)) {
        const hasWork = resumeSkills.length > 0;
        const formattingScore = Math.min(100, Math.max(50, atsScore));

        const trustScore = Math.round((formattingScore * 0.6) + (overallScore * 0.4));
        const category = trustScore >= 80 ? "High" : trustScore >= 60 ? "Medium" : "Borderline";

        return {
            score: trustScore,
            category,
            verifiedSkills: [],
            unverifiedSkills: resumeSkills,
            unlocked: trustScore >= 50,
            summary: "Trust score derived from ATS formatting and resume completeness (No GitHub profile connected)."
        };
    }

    const verifiedSkills = [];
    const unverifiedSkills = [];

    (resumeSkills || []).forEach(skill => {
        const check = verifySkillWithGithubEvidence(skill, githubAnalysis);
        if (check.verified) {
            verifiedSkills.push(skill);
        } else {
            unverifiedSkills.push(skill);
        }
    });

    const totalClaims = resumeSkills.length;
    const verificationRatio = totalClaims > 0 ? (verifiedSkills.length / totalClaims) : 0;
    
    let baseScore = 50; 
    let verificationPoints = Math.round(verificationRatio * 35); 
    let repoActivityBonus = (githubAnalysis.repoCount || 0) > 0 ? 10 : 0;
    if (githubAnalysis.hasDocker) repoActivityBonus += 2;
    if (githubAnalysis.hasCI) repoActivityBonus += 3;

    let finalScore = Math.min(100, Math.max(20, baseScore + verificationPoints + Math.min(15, repoActivityBonus)));

    if (totalClaims > 0 && verifiedSkills.length === 0 && (githubAnalysis.repoCount || 0) > 0) {
        finalScore = Math.min(finalScore, 48);
    }

    let category = "Low";
    if (finalScore >= 80) category = "High";
    else if (finalScore >= 65) category = "Medium";
    else if (finalScore >= 50) category = "Borderline";

    const unlocked = finalScore >= 50;

    return {
        score: finalScore,
        category,
        verifiedSkills,
        unverifiedSkills,
        unlocked,
        summary: unlocked 
            ? `Verified ${verifiedSkills.length} of ${totalClaims} resume skill claims against GitHub code repositories.`
            : `Trust score is below 50% threshold. Only ${verifiedSkills.length} of ${totalClaims} resume skill claims were verified in code.`
    };
}

module.exports = {
    calculateTrustScore,
    verifySkillWithGithubEvidence
};
