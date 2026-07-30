const profiles = require("./mockProfiles");

// Function to calculate trust score (Case-Insensitive)
function calculateTrustScore(resumeSkills, githubSkills) {

    // Convert GitHub skills to lowercase once
    const githubSkillsLower = githubSkills.map(skill => skill.toLowerCase());

    // Compare skills without considering case
    const verifiedSkills = resumeSkills.filter(skill =>
        githubSkillsLower.includes(skill.toLowerCase())
    );

    const score = Math.round(
        (verifiedSkills.length / resumeSkills.length) * 100
    );

    return {
        score,
        verifiedSkills
    };
}

// Function to verify every profile
function verifyProfiles() {

    console.log("========== TRUST SCORE REPORT ==========\n");

    profiles.forEach(profile => {

        const name = profile.resumeAnalysis.user.name;

        const resumeSkills =
            profile.resumeAnalysis.core_match.matched_skills;

        const githubSkills =
            profile.githubAnalysis.skills;

        const result = calculateTrustScore(
            resumeSkills,
            githubSkills
        );

        const unlocked = result.score >= 50;

        console.log("----------------------------------------");
        console.log(`Name: ${name}`);
        console.log(`Trust Score: ${result.score}%`);
        console.log(`Verified Skills: ${result.verifiedSkills.join(", ")}`);

        if (unlocked) {
            console.log("SkillSwap: ✅ Unlocked");
        } else {
            console.log("SkillSwap: ❌ Locked");
            console.log(
                "Reason: Resume claims could not be sufficiently verified from GitHub."
            );
        }

        console.log();
    });

}

// Export the function for future integration
module.exports = verifyProfiles;

// Run when this file is executed directly
verifyProfiles();
