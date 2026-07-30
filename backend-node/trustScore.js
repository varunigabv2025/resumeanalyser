// Find verified skills
function getVerifiedSkills(resumeSkills, githubSkills) {
    return resumeSkills.filter(skill =>
        githubSkills.some(g =>
            g.toLowerCase() === skill.toLowerCase()
        )
    );
}

// Find missing skills
function getMissingSkills(resumeSkills, githubSkills) {
    return resumeSkills.filter(skill =>
        !githubSkills.some(g =>
            g.toLowerCase() === skill.toLowerCase()
        )
    );
}

// Find extra GitHub skills
function getExtraSkills(resumeSkills, githubSkills) {
    return githubSkills.filter(skill =>
        !resumeSkills.some(r =>
            r.toLowerCase() === skill.toLowerCase()
        )
    );
}

// Calculate trust score
function calculateTrustScore(resumeSkills, githubSkills) {

    const verified = getVerifiedSkills(resumeSkills, githubSkills);

    const score = resumeSkills.length === 0
        ? 0
        : Math.round((verified.length / resumeSkills.length) * 100);

    return score;
}

// Status
function getStatus(score) {

    if (score >= 90) return "Highly Verified";
    if (score >= 70) return "Verified";
    if (score >= 50) return "Needs Improvement";

    return "Needs More Public Evidence";
}

// Matching flag
function matchingEnabled(score) {
    return score >= 50;
}

// Generate full report
function generateReport(user) {

    const verified = getVerifiedSkills(
        user.resume_skills,
        user.github_skills
    );

    const missing = getMissingSkills(
        user.resume_skills,
        user.github_skills
    );

    const extra = getExtraSkills(
        user.resume_skills,
        user.github_skills
    );

    const score = calculateTrustScore(
        user.resume_skills,
        user.github_skills
    );

    return {
        name: user.name,
        trust_score: score,
        status: getStatus(score),
        matching_enabled: matchingEnabled(score),
        verified_skills: verified,
        missing_skills: missing,
        extra_github_skills: extra
    };
}

module.exports = {
    generateReport,
    calculateTrustScore,
    getVerifiedSkills,
    getMissingSkills,
    getExtraSkills
};
