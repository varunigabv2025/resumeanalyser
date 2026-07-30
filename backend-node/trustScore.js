function getVerifiedSkills(resumeSkills, githubSkills) {
    return resumeSkills.filter(skill =>
        githubSkills.some(g => g.toLowerCase() === skill.toLowerCase())
    );
}

function getMissingSkills(resumeSkills, githubSkills) {
    return resumeSkills.filter(skill =>
        !githubSkills.some(g => g.toLowerCase() === skill.toLowerCase())
    );
}

function getExtraSkills(resumeSkills, githubSkills) {
    return githubSkills.filter(skill =>
        !resumeSkills.some(r => r.toLowerCase() === skill.toLowerCase())
    );
}

function calculateTrustScore(resumeSkills, githubSkills) {
    const verified = getVerifiedSkills(resumeSkills, githubSkills);

    const score = resumeSkills.length === 0
        ? 0
        : Math.round((verified.length / resumeSkills.length) * 100);

    return score;
}

function getStatus(score) {
    if (score >= 50)
        return "Verified";

    return "Needs More Public Evidence";
}

function isMatchingEnabled(score) {
    return score >= 50;
}

function generateTrustReport(user) {

    const score = calculateTrustScore(
        user.resume_skills,
        user.github_skills
    );

    return {
        name: user.name,
        trust_score: score,
        verified_skills: getVerifiedSkills(
            user.resume_skills,
            user.github_skills
        ),
        missing_skills: getMissingSkills(
            user.resume_skills,
            user.github_skills
        ),
        extra_github_skills: getExtraSkills(
            user.resume_skills,
            user.github_skills
        ),
        status: getStatus(score),
        matching_enabled: isMatchingEnabled(score)
    };
}

module.exports = {
    generateTrustReport,
    calculateTrustScore
};
