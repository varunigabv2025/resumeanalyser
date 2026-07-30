const profiles = require("./mockProfiles");

// Helper function to find common skills
function getCommonSkills(strengths, gaps) {
    return strengths.filter(skill => gaps.includes(skill));
}

// Main matching function
function findMatches() {
    const matches = [];

    // Compare every pair of profiles
    for (let i = 0; i < profiles.length; i++) {
        for (let j = i + 1; j < profiles.length; j++) {

            const personA = profiles[i];
            const personB = profiles[j];

            // Future integration with Trust Score (C1)
            // if (personA.trustScore < 80 || personB.trustScore < 80) {
            //     continue;
            // }

            // Extract strengths and gaps
            const strengthsA = personA.resumeAnalysis.core_match.matched_skills;
            const gapsA = personA.resumeAnalysis.core_match.missing_skills;

            const strengthsB = personB.resumeAnalysis.core_match.matched_skills;
            const gapsB = personB.resumeAnalysis.core_match.missing_skills;

            // Find what each person can teach the other
            const aCanTeach = getCommonSkills(strengthsA, gapsB);
            const bCanTeach = getCommonSkills(strengthsB, gapsA);

            // Compatibility score
            const score = aCanTeach.length + bCanTeach.length;

            // Skip if there is no skill exchange
            if (score === 0) {
                continue;
            }

            // Generate explanation
            let reason = "";

            if (aCanTeach.length > 0 && bCanTeach.length > 0) {
                reason =
                    `${personA.resumeAnalysis.user.name} is strong in ${aCanTeach.join(", ")}, which ${personB.resumeAnalysis.user.name} wants to learn. ` +
                    `${personB.resumeAnalysis.user.name} is strong in ${bCanTeach.join(", ")}, which ${personA.resumeAnalysis.user.name} wants to learn.`;
            }
            else if (aCanTeach.length > 0) {
                reason =
                    `${personA.resumeAnalysis.user.name} is strong in ${aCanTeach.join(", ")}, which is a skill gap for ${personB.resumeAnalysis.user.name}.`;
            }
            else {
                reason =
                    `${personB.resumeAnalysis.user.name} is strong in ${bCanTeach.join(", ")}, which is a skill gap for ${personA.resumeAnalysis.user.name}.`;
            }

            // Store match
            matches.push({
                person1: personA.resumeAnalysis.user.name,
                person2: personB.resumeAnalysis.user.name,

                score: score,

                person1CanTeach: aCanTeach,
                person2CanTeach: bCanTeach,

                reason: reason
            });
        }
    }

    // Highest compatibility first
    matches.sort((a, b) => b.score - a.score);

    return matches;
}

// Export function
module.exports = findMatches;

// ----------------------------
// Test the matcher
// ----------------------------
const topMatches = findMatches();

console.log("========== TOP SKILLSWAP MATCHES ==========\n");

topMatches.slice(0, 10).forEach((match, index) => {

    console.log(`Match ${index + 1}`);
    console.log(`${match.person1} ↔ ${match.person2}`);
    console.log(`Compatibility Score: ${match.score}`);

    console.log(`\n${match.reason}`);

    console.log("\n------------------------------------------\n");
});
