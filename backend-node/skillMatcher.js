const db = require('./database');

function getCommonSkills(strengths = [], gaps = []) {
    const strengthsLower = (strengths || []).map(s => String(s).toLowerCase());
    const gapsLower = (gaps || []).map(s => String(s).toLowerCase());
    return strengths.filter(skill => gapsLower.includes(String(skill).toLowerCase()));
}

function findMatchesForCandidate(candidateSkills = [], candidateGaps = [], candidateName = 'Candidate') {
    // SkillSwap operates ONLY on real database registered candidates.
    // If no external database candidates exist, returns [] without fabricating fake users.
    return [];
}

function findMatches() {
    return [];
}

module.exports = {
    findMatches,
    findMatchesForCandidate
};
