const profiles = require("./mockProfiles");

// Function to calculate multi-dimensional trust score
function calculateTrustScore(resumeSkills = [], githubSkills = [], options = {}) {
    const resumeSkillsArray = Array.isArray(resumeSkills) ? resumeSkills : [];
    const githubSkillsArray = Array.isArray(githubSkills) ? githubSkills : [];

    const githubSkillsLower = githubSkillsArray.map(skill => String(skill).toLowerCase());

    const verifiedSkills = resumeSkillsArray.filter(skill =>
        githubSkillsLower.includes(String(skill).toLowerCase())
    );

    const unverifiedSkills = resumeSkillsArray.filter(skill =>
        !githubSkillsLower.includes(String(skill).toLowerCase())
    );

    // 1. Verification Ratio (0-100)
    const verificationRatio = resumeSkillsArray.length > 0
        ? Math.round((verifiedSkills.length / resumeSkillsArray.length) * 100)
        : (githubSkillsArray.length > 0 ? 70 : 50);

    // 2. Repository Quality & Activity Bonus (0-100)
    let repoQualityScore = 50;
    if (options.githubAnalysis) {
        let bonus = 0;
        if (options.githubAnalysis.hasDocker) bonus += 25;
        if (options.githubAnalysis.hasCI) bonus += 25;
        if (options.githubAnalysis.repoCount >= 5) bonus += 25;
        if (options.githubAnalysis.lastCommitDate) bonus += 25;
        repoQualityScore = Math.min(100, bonus);
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
        const githubSkills = profile.githubAnalysis?.skills || [];

        const result = calculateTrustScore(resumeSkills, githubSkills, {
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
    verifyProfiles
};

module.exports.calculateTrustScore = calculateTrustScore;
module.exports.verifyProfiles = verifyProfiles;

if (require.main === module) {
    verifyProfiles();
}
