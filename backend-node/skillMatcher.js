const profiles = require("./mockProfiles");

// Helper function to find common skills
function getCommonSkills(strengths = [], gaps = []) {
    const strengthsLower = (strengths || []).map(s => String(s).toLowerCase());
    const gapsLower = (gaps || []).map(s => String(s).toLowerCase());
    return strengths.filter(skill => gapsLower.includes(String(skill).toLowerCase()));
}

// Function to find matches for a specific candidate profile
function findMatchesForCandidate(candidateSkills = [], candidateGaps = [], candidateName = 'Candidate') {
    const matches = [];
    const candidateSkillsLower = (candidateSkills || []).map(s => String(s).toLowerCase());
    const candidateGapsLower = (candidateGaps || []).map(s => String(s).toLowerCase());

    profiles.forEach((profile, index) => {
        const name = profile.resumeAnalysis?.user?.name || `Developer ${index + 1}`;
        const title = profile.resumeAnalysis?.user?.title || 'Software Engineer';
        
        const strengthsB = profile.resumeAnalysis?.core_match?.matched_skills || [];
        const gapsB = profile.resumeAnalysis?.core_match?.missing_skills || [];

        const gapsBLower = gapsB.map(s => String(s).toLowerCase());

        // What candidate can teach profile: candidate's strengths matching profile's gaps
        const candidateCanTeach = (candidateSkills || []).filter(s => gapsBLower.includes(String(s).toLowerCase()));
        
        // What profile can teach candidate: profile's strengths matching candidate's gaps
        const profileCanTeach = (strengthsB || []).filter(s => candidateGapsLower.includes(String(s).toLowerCase()));

        const compatibilityScore = Math.min(98, Math.max(45, (candidateCanTeach.length + profileCanTeach.length) * 22 + 35));

        if (candidateCanTeach.length > 0 || profileCanTeach.length > 0) {
            let reason = '';
            if (candidateCanTeach.length > 0 && profileCanTeach.length > 0) {
                reason = `You can mentor ${name} in ${candidateCanTeach.join(', ')}, while ${name} can help you master ${profileCanTeach.join(', ')}.`;
            } else if (candidateCanTeach.length > 0) {
                reason = `You can mentor ${name} in ${candidateCanTeach.join(', ')}.`;
            } else {
                reason = `${name} can mentor you in ${profileCanTeach.join(', ')}.`;
            }

            matches.push({
                matchId: `match-${index + 1}`,
                name,
                title,
                compatibilityScore,
                youCanTeach: candidateCanTeach,
                theyCanTeach: profileCanTeach,
                reason,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
            });
        }
    });

    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    return matches;
}

// Main static matching function for pair comparisons
function findMatches() {
    const matches = [];

    for (let i = 0; i < profiles.length; i++) {
        for (let j = i + 1; j < profiles.length; j++) {
            const personA = profiles[i];
            const personB = profiles[j];

            const strengthsA = personA.resumeAnalysis.core_match.matched_skills;
            const gapsA = personA.resumeAnalysis.core_match.missing_skills;

            const strengthsB = personB.resumeAnalysis.core_match.matched_skills;
            const gapsB = personB.resumeAnalysis.core_match.missing_skills;

            const aCanTeach = getCommonSkills(strengthsA, gapsB);
            const bCanTeach = getCommonSkills(strengthsB, gapsA);

            const score = aCanTeach.length + bCanTeach.length;

            if (score === 0) continue;

            let reason = "";
            if (aCanTeach.length > 0 && bCanTeach.length > 0) {
                reason = `${personA.resumeAnalysis.user.name} is strong in ${aCanTeach.join(", ")}, which ${personB.resumeAnalysis.user.name} wants to learn. ${personB.resumeAnalysis.user.name} is strong in ${bCanTeach.join(", ")}, which ${personA.resumeAnalysis.user.name} wants to learn.`;
            } else if (aCanTeach.length > 0) {
                reason = `${personA.resumeAnalysis.user.name} is strong in ${aCanTeach.join(", ")}, which is a skill gap for ${personB.resumeAnalysis.user.name}.`;
            } else {
                reason = `${personB.resumeAnalysis.user.name} is strong in ${bCanTeach.join(", ")}, which is a skill gap for ${personA.resumeAnalysis.user.name}.`;
            }

            matches.push({
                person1: personA.resumeAnalysis.user.name,
                person2: personB.resumeAnalysis.user.name,
                score,
                person1CanTeach: aCanTeach,
                person2CanTeach: bCanTeach,
                reason
            });
        }
    }

    matches.sort((a, b) => b.score - a.score);
    return matches;
}

module.exports = {
    findMatches,
    findMatchesForCandidate
};

if (require.main === module) {
    const topMatches = findMatches();
    console.log("========== TOP SKILLSWAP MATCHES ==========\n");
    topMatches.slice(0, 5).forEach((match, index) => {
        console.log(`Match ${index + 1}: ${match.person1} ↔ ${match.person2} (Score: ${match.score})`);
    });
}
