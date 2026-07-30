const profiles = require("./mockProfiles");

// Function to calculate trust score (Case-Insensitive)
function calculateTrustScore(resumeSkills = [], githubSkills = []) {
    const resumeSkillsArray = Array.isArray(resumeSkills) ? resumeSkills : [];
    const githubSkillsArray = Array.isArray(githubSkills) ? githubSkills : [];

    const githubSkillsLower = githubSkillsArray.map(skill => String(skill).toLowerCase());

    const verifiedSkills = resumeSkillsArray.filter(skill =>
        githubSkillsLower.includes(String(skill).toLowerCase())
    );

    const unverifiedSkills = resumeSkillsArray.filter(skill =>
        !githubSkillsLower.includes(String(skill).toLowerCase())
    );

    const score = resumeSkillsArray.length > 0
        ? Math.round((verifiedSkills.length / resumeSkillsArray.length) * 100)
        : 0;

    let category = 'Low';
    if (score >= 80) category = 'High';
    else if (score >= 60) category = 'Medium';
    else if (score >= 40) category = 'Borderline';

    return {
        score,
        verifiedSkills,
        unverifiedSkills,
        category,
        unlocked: score >= 50
    };
}

// Function to verify every profile
function verifyProfiles() {
    console.log("========== TRUST SCORE REPORT ==========\n");

    profiles.forEach(profile => {
        const name = profile.resumeAnalysis?.user?.name || 'Developer';
        const resumeSkills = profile.resumeAnalysis?.core_match?.matched_skills || [];
        const githubSkills = profile.githubAnalysis?.skills || [];

        const result = calculateTrustScore(resumeSkills, githubSkills);

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
    verifyProfiles
};

if (require.main === module) {
    verifyProfiles();
}
