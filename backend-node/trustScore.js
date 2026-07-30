const profiles = require("./mockProfiles");
function calculateTrustScore(resumeSkills, githubSkills) {

    const verified = resumeSkills.filter(skill =>
        githubSkills.includes(skill)
    );

    const score = Math.round(
        (verified.length / resumeSkills.length) * 100
    );

    return {
        score,
        verified
    };
}
